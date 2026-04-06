import { NextResponse } from 'next/server';
import { canUseGoogleDocs, requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { buildBatchUpdateRequests, extractDocContent } from '@/lib/mylinks/google-docs';
import { refreshAccessToken } from '@/lib/mylinks/google-auth';
import { extractGoogleDocId } from '@/lib/mylinks/utils';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

async function getValidAccessToken(userId: string) {
  const serviceClient = await createServiceClient();
  const { data: tokenRow } = await serviceClient
    .from('google_tokens')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (!tokenRow) {
    throw new Error('Google account not connected');
  }

  if (new Date(tokenRow.expires_at).getTime() > Date.now() + 60_000) {
    return tokenRow.access_token;
  }

  const refreshed = await refreshAccessToken(tokenRow.refresh_token);
  const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  await serviceClient
    .from('google_tokens')
    .update({ access_token: refreshed.access_token, expires_at: newExpiry })
    .eq('user_id', userId);

  return refreshed.access_token;
}

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
  const { data: article } = await serviceClient.from('articles').select('*').eq('id', articleId).maybeSingle();
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
    return NextResponse.json({ error: 'Article has no Google Doc linked' }, { status: 400 });
  }

  const { data: suggestions } = await serviceClient
    .from('suggestions')
    .select('*')
    .eq('article_id', articleId)
    .eq('status', 'approved')
    .order('sort_order');

  if (!suggestions || suggestions.length === 0) {
    return NextResponse.json({ error: 'No approved suggestions to apply' }, { status: 400 });
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(user.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Auth error';
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const docId = extractGoogleDocId(article.google_doc_id);
  const documentResponse = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!documentResponse.ok) {
    return NextResponse.json({ error: `Failed to fetch Google Doc: ${documentResponse.status}` }, { status: 500 });
  }

  const documentJson = await documentResponse.json();
  const { charToDocIndex } = extractDocContent(documentJson);
  const patches = suggestions.map((suggestion) => ({
    char_start: suggestion.char_start,
    char_end: suggestion.char_end,
    url: suggestion.target_url,
  }));
  const requests = buildBatchUpdateRequests(patches, charToDocIndex);

  if (requests.length === 0) {
    return NextResponse.json({ error: 'Could not map suggestions to doc positions' }, { status: 400 });
  }

  const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    return NextResponse.json({ error: `Google Docs batchUpdate failed: ${errorText}` }, { status: 500 });
  }

  await serviceClient
    .from('suggestions')
    .update({ applied_at: new Date().toISOString() })
    .eq('article_id', articleId)
    .eq('status', 'approved');

  return NextResponse.json({ applied: requests.length });
}
