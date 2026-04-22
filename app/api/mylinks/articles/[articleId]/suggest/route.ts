import { NextResponse } from 'next/server';
import { embedText, formatVector, getSuggestions, type InventoryPage } from '@/lib/mylinks/ai';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

type InventoryPageRow = {
  id: string;
  url: string;
  title: string | null;
  h1: string | null;
  page_type: import('@/lib/mylinks/types/database').PageType;
  priority: number;
  published_at: string | null;
};

export const maxDuration = 120;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { articleId } = await params;
  const serviceClient = await createServiceClient();

  const { data: article } = await serviceClient
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .maybeSingle();

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const { data: project } = await serviceClient
    .from('projects')
    .select('id')
    .eq('id', article.project_id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const fourYearsAgo = new Date();
  fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);

  const MATCH_COUNT = 80;
  let pages: InventoryPageRow[] | null = null;

  try {
    const articleEmbedding = await embedText(article.content_text);
    const { data: matched, error: matchError } = await serviceClient.rpc('match_pages', {
      p_project_id: article.project_id,
      p_query_embedding: formatVector(articleEmbedding),
      p_match_count: MATCH_COUNT,
      p_published_after: fourYearsAgo.toISOString(),
    });
    if (matchError) {
      throw new Error(matchError.message);
    }
    pages = (matched ?? []).map((row) => ({
      id: row.id,
      url: row.url,
      title: row.title,
      h1: row.h1,
      page_type: row.page_type,
      priority: row.priority,
      published_at: row.published_at,
    }));
  } catch (rankingError) {
    console.error(
      'Semantic ranking unavailable, falling back to priority sort:',
      rankingError instanceof Error ? rankingError.message : rankingError
    );
    pages = null;
  }

  if (!pages || pages.length === 0) {
    const { data: fallback } = await serviceClient
      .from('pages')
      .select('id, url, title, h1, page_type, priority, published_at')
      .eq('project_id', article.project_id)
      .or(`published_at.gte.${fourYearsAgo.toISOString()},published_at.is.null`)
      .order('priority', { ascending: false })
      .limit(MATCH_COUNT);
    pages = fallback ?? [];
  }

  const { data: clientTargets } = await serviceClient
    .from('article_link_targets')
    .select('*')
    .eq('article_id', articleId)
    .order('sort_order');

  const inventory: InventoryPage[] = [
    ...(pages ?? []).map((pageRow) => ({
      url: pageRow.url,
      title: pageRow.title,
      h1: pageRow.h1,
      page_type: pageRow.page_type,
      priority: pageRow.priority,
      source: 'inventory' as const,
    })),
    ...(clientTargets ?? []).map((target) => ({
      url: target.url,
      title: target.label,
      h1: target.label,
      page_type: 'landing' as const,
      priority: 95,
      source: 'client' as const,
      label: target.label,
      notes: target.notes,
    })),
  ];

  if (inventory.length === 0) {
    return NextResponse.json({ error: 'No destination inventory available. Crawl first or add client URLs.' }, { status: 400 });
  }

  let suggestionResult;
  try {
    suggestionResult = await getSuggestions(article.content_text, inventory);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Suggestion generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const pageByUrl = new Map((pages ?? []).map((pageRow) => [pageRow.url, pageRow]));
  const clientTargetByUrl = new Map((clientTargets ?? []).map((target) => [target.url, target]));

  await serviceClient.from('suggestions').delete().eq('article_id', articleId).neq('link_type', 'external');

  const toInsert = suggestionResult.suggestions.map((suggestion, index) => {
    const pageRow = pageByUrl.get(suggestion.target_url);
    const clientTarget = clientTargetByUrl.get(suggestion.target_url);
    return {
      article_id: articleId,
      target_page_id: pageRow?.id ?? null,
      target_url: suggestion.target_url,
      anchor_text: suggestion.anchor_text,
      anchor_refinement: suggestion.anchor_refinement ?? null,
      page_type: pageRow?.page_type ?? 'landing',
      relevance_score: suggestion.relevance_score,
      confidence: suggestion.confidence,
      paragraph_index: suggestion.paragraph_index,
      sentence_index: suggestion.sentence_index,
      char_start: suggestion.char_start,
      char_end: suggestion.char_end,
      justification: suggestion.justification,
      duplicate_flag: false,
      over_optimization_flag: false,
      status: 'pending' as const,
      sort_order: index,
      link_type: 'internal' as const,
      destination_source: clientTarget ? 'client' as const : 'inventory' as const,
    };
  });

  const { data: inserted, error } = await serviceClient.from('suggestions').insert(toInsert).select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await serviceClient.from('llm_usage_logs').insert({
    user_id: user.id,
    project_id: article.project_id,
    article_id: articleId,
    operation: 'generate_internal_suggestions',
    provider: 'openai',
    model: 'gpt-4o-mini',
    prompt_tokens: suggestionResult.usage.promptTokens,
    completion_tokens: suggestionResult.usage.completionTokens,
    total_tokens: suggestionResult.usage.totalTokens,
    estimated_cost_usd: suggestionResult.usage.estimatedCostUsd,
  });

  return NextResponse.json({ suggestions: inserted }, { status: 201 });
}
