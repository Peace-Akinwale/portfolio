import { NextResponse } from 'next/server';
import { canUseGoogleDocs, requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { extractDocContent, extractDocIdFromUrl } from '@/lib/mylinks/google-docs';
import { refreshAccessToken } from '@/lib/mylinks/google-auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

async function getValidAccessToken(userId: string) {
  const serviceClient = await createServiceClient();
  const { data: tokenRow } = await serviceClient
    .from('google_tokens')
    .select('*')
    .eq('user_id', userId)
    .order('expires_at', { ascending: false })
    .limit(1)
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const allowed = await canUseGoogleDocs(user.id, user.email);
  if (!allowed) {
    return NextResponse.json({ error: 'Google Docs access is not enabled for this account' }, { status: 403 });
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(user.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Auth error';
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const { docId: rawDocId } = await params;
  const docId = extractDocIdFromUrl(decodeURIComponent(rawDocId));
  const response = await fetch(`https://docs.googleapis.com/v1/documents/${docId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: `Google Docs API error: ${response.status}` }, { status: response.status });
  }

  const doc = await response.json();
  const { text, html } = extractDocContent(doc);
  return NextResponse.json({ text, html, docId });
}
