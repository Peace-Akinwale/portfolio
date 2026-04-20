import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { buildAuthUrl } from '@/lib/mylinks/google-auth';

export async function GET(request: Request) {
  const user = await requireAuthenticatedUser();
  void user;

  const state = randomBytes(16).toString('hex');
  const url = buildAuthUrl(state, new URL(request.url).origin);

  const response = NextResponse.redirect(url);
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
  });

  return response;
}
