import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { buildAuthUrl } from '@/lib/mylinks/google-auth';
import { requestOrigin } from '@/lib/mylinks/routing';

export async function GET(request: Request) {
  await requireAuthenticatedUser();

  const state = randomBytes(16).toString('hex');
  const url = buildAuthUrl(state, requestOrigin(request));

  const response = NextResponse.redirect(url);
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
