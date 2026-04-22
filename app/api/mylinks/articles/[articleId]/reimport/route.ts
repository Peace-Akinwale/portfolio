import { NextResponse } from 'next/server';
import { canUseGoogleDocs, requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { fetchGoogleDocContent } from '@/lib/mylinks/google-docs';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const allowed = await canUseGoogleDocs(user.id, user.email);
  if (!allowed) {
    return NextResponse.json({ error: 'Google Docs access is not enabled for this account' }, { status: 403 });
  }

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

  if (!article.google_doc_id) {
    return NextResponse.json({ error: 'Article has no linked Google Doc to re-import' }, { status: 400 });
  }

  let fetched;
  try {
    fetched = await fetchGoogleDocContent(user.id, article.google_doc_id);
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    const message = error instanceof Error ? error.message : 'Failed to fetch Google Doc';
    if (name === 'GoogleRefreshRevokedError' || /invalid_grant/i.test(message)) {
      return NextResponse.json(
        { error: 'Google connection expired. Reconnect in Settings.', reconnect_required: true },
        { status: 401 }
      );
    }
    const status = /not connected/i.test(message) ? 401 : /Google Docs API error/i.test(message) ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }

  const { data: updated, error: updateError } = await serviceClient
    .from('articles')
    .update({
      content_text: fetched.text,
      content_html: fetched.html,
    })
    .eq('id', articleId)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ article: updated });
}
