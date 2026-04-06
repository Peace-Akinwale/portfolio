import { NextResponse } from 'next/server';
import { getSuggestions, type InventoryPage } from '@/lib/mylinks/gemini';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

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

  const { data: pages } = await serviceClient
    .from('pages')
    .select('id, url, title, h1, page_type, priority, published_at')
    .eq('project_id', article.project_id)
    .or(`published_at.gte.${fourYearsAgo.toISOString()},published_at.is.null`)
    .order('priority', { ascending: false })
    .limit(250);

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
    const message = error instanceof Error ? error.message : 'Gemini call failed';
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
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    prompt_tokens: suggestionResult.usage.promptTokens,
    completion_tokens: suggestionResult.usage.completionTokens,
    total_tokens: suggestionResult.usage.totalTokens,
    estimated_cost_usd: suggestionResult.usage.estimatedCostUsd,
  });

  return NextResponse.json({ suggestions: inserted }, { status: 201 });
}
