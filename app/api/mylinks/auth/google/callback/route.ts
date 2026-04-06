import { NextResponse, type NextRequest } from 'next/server';
import { canUseGoogleDocs, requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { exchangeCodeForTokens } from '@/lib/mylinks/google-auth';
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
  const allowed = await canUseGoogleDocs(user.id, user.email);
  if (!allowed) {
    return NextResponse.redirect(`${origin}/projects/mylinks/settings?error=google_access_required`);
  }

  let tokens;
  try {
    tokens = await exchangeCodeForTokens(code, origin);
  } catch {
    return NextResponse.redirect(`${origin}/projects/mylinks/settings?error=google_token_failed`);
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  const serviceClient = await createServiceClient();
  await serviceClient.from('google_tokens').upsert(
    {
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      scope: tokens.scope,
    },
    { onConflict: 'user_id' }
  );

  const response = NextResponse.redirect(`${origin}/projects/mylinks/settings?google_connected=1`);
  response.cookies.delete('google_oauth_state');
  return response;
}

