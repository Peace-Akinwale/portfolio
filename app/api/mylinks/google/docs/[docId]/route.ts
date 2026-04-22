import { NextResponse } from 'next/server';
import { canUseGoogleDocs, requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { fetchGoogleDocContent } from '@/lib/mylinks/google-docs';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const allowed = await canUseGoogleDocs(user.id, user.email);
  if (!allowed) {
    return NextResponse.json({ error: 'Google Docs access is not enabled for this account' }, { status: 403 });
  }

  const { docId: rawDocId } = await params;

  try {
    const { text, html, docId } = await fetchGoogleDocContent(user.id, decodeURIComponent(rawDocId));
    return NextResponse.json({ text, html, docId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch Google Doc';
    const status = /not connected/i.test(message) ? 401 : /Google Docs API error/i.test(message) ? 502 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
