import { NextResponse, type NextRequest } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { exchangeCodeForTokens } from '@/lib/mylinks/google-auth';
import { createNotification } from '@/lib/mylinks/notifications';
import { sendMylinksSlackNotification } from '@/lib/mylinks/slack';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('google_oauth_state')?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(`${origin}/projects/mylinks/settings?error=google_auth_failed`);
  }

  const user = await requireAuthenticatedUser();

  let tokens;
  try {
    tokens = await exchangeCodeForTokens(code, origin);
  } catch {
    return NextResponse.redirect(`${origin}/projects/mylinks/settings?error=google_token_failed`);
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  const serviceClient = await createServiceClient();
  const { error: upsertError } = await serviceClient.from('google_tokens').upsert(
    {
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      scope: tokens.scope,
    },
    { onConflict: 'user_id' }
  );
  if (upsertError) {
    console.error('[mylinks/google/callback] token upsert failed:', upsertError);
    return NextResponse.redirect(`${origin}/projects/mylinks/settings?error=google_token_failed`);
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  let adminUserId: string | null = null;
  if (adminEmail) {
    const { data: adminProfile } = await serviceClient
      .from('profiles')
      .select('user_id')
      .eq('email', adminEmail)
      .maybeSingle();
    adminUserId = adminProfile?.user_id ?? null;
  }

  await createNotification({
    recipientId: user.id,
    type: 'google_connected',
    message: 'Your Google Docs connection is active. Auto-apply is available on approved suggestions.',
    metadata: { scope: tokens.scope },
  });

  if (adminUserId && adminUserId !== user.id) {
    await createNotification({
      recipientId: adminUserId,
      type: 'admin_user_connected_google',
      message: `${user.email ?? 'A user'} connected Google Docs.`,
      metadata: { user_id: user.id, user_email: user.email ?? null, scope: tokens.scope },
    });
  }

  void sendMylinksSlackNotification('New Google Docs connection', [
    `*User:* ${user.email ?? user.id}`,
    `*Time:* ${new Date().toISOString()}`,
    `*Scopes:* ${tokens.scope}`,
  ]);

  const response = NextResponse.redirect(`${origin}/projects/mylinks/settings?google_connected=1`);
  response.cookies.delete('google_oauth_state');
  return response;
}
