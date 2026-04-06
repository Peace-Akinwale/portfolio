import { NextResponse } from 'next/server';
import { getGoogleAccessRequest, requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { sendMylinksSlackNotification } from '@/lib/mylinks/slack';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export async function POST() {
  const user = await requireAuthenticatedUser();
  const existing = await getGoogleAccessRequest(user.id);
  if (existing?.status === 'pending') {
    return NextResponse.json({ ok: true });
  }

  const serviceClient = await createServiceClient();
  const { data, error } = await serviceClient
    .from('google_access_requests')
    .upsert(
      {
        user_id: user.id,
        status: 'pending',
        notes: 'User requested Google Docs auto-apply access.',
        requested_at: new Date().toISOString(),
        reviewed_at: null,
        reviewed_by: null,
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  void sendMylinksSlackNotification('Google access request', [
    `*User:* ${user.email || user.id}`,
    `*Request ID:* ${data.id}`,
    'Review in the integrated admin dashboard.',
  ]);

  return NextResponse.json({ ok: true, request: data });
}
