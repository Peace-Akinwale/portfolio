import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { normalizePlainTextContent, normalizeRichTextHtml } from '@/lib/mylinks/rich-text';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export async function POST(request: Request) {
  const user = await requireAuthenticatedUser();
  const serviceClient = await createServiceClient();
  const body = (await request.json()) as {
    project_id?: string;
    title?: string;
    source?: 'paste' | 'google_doc';
    content_text?: string;
    content_html?: string | null;
    google_doc_id?: string | null;
    client_targets?: Array<{ label?: string | null; url?: string; notes?: string | null }>;
  };

  const normalizedContent =
    body.content_html?.trim()
      ? normalizeRichTextHtml(body.content_html)
      : normalizePlainTextContent(body.content_text ?? '');

  if (!body.project_id || !body.title?.trim() || !normalizedContent.text.trim()) {
    return NextResponse.json(
      { error: 'project_id, title, and article content are required' },
      { status: 400 }
    );
  }

  const { data: project } = await serviceClient
    .from('projects')
    .select('id')
    .eq('id', body.project_id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const wordCount = normalizedContent.text.trim().split(/\s+/).filter(Boolean).length;
  const insertPayload = {
    project_id: body.project_id,
    title: body.title.trim(),
    source: body.source ?? 'paste',
    content_html: normalizedContent.html,
    content_text: normalizedContent.text,
    google_doc_id: body.google_doc_id ?? null,
    word_count: wordCount,
  };

  let { data: article, error } = await serviceClient
    .from('articles')
    .insert(insertPayload)
    .select()
    .single();

  if (error && /content_html/i.test(error.message)) {
    ({ data: article, error } = await serviceClient
      .from('articles')
      .insert({
        project_id: insertPayload.project_id,
        title: insertPayload.title,
        source: insertPayload.source,
        content_text: insertPayload.content_text,
        google_doc_id: insertPayload.google_doc_id,
        word_count: insertPayload.word_count,
      })
      .select()
      .single());
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!article) {
    return NextResponse.json({ error: 'Article creation failed' }, { status: 500 });
  }

  const clientTargets = (body.client_targets ?? []).filter((target) => target.url?.trim());
  if (clientTargets.length > 0) {
    await serviceClient.from('article_link_targets').insert(
      clientTargets.map((target, index) => ({
        article_id: article.id,
        label: target.label?.trim() || null,
        url: target.url!.trim(),
        notes: target.notes?.trim() || null,
        sort_order: index,
      }))
    );
  }

  return NextResponse.json(article, { status: 201 });
}
