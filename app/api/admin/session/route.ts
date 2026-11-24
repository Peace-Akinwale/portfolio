import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  COMMENT_ADMIN_COOKIE,
  COMMENT_ADMIN_SESSION_SECONDS,
  createCommentAdminSessionToken,
  revokeCommentAdminSession,
  validateCommentAdminPassword,
} from '@/lib/comments/admin';
import { allow, clientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Ten tries per address per 15 minutes, and 100 an hour overall, so the
    // password cannot be guessed at speed from one address or from many.
    if (!allow(`admin-login:${clientIp(request)}`, 10, 15 * 60 * 1000) || !allow('admin-login:all', 100, 60 * 60 * 1000)) {
      return NextResponse.json({ message: 'Too many attempts. Try again in a few minutes.' }, { status: 429 });
    }
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim() || '';

    if (!validateCommentAdminPassword(password)) {
      return NextResponse.json({ message: 'Invalid password.' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(COMMENT_ADMIN_COOKIE, createCommentAdminSessionToken(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: COMMENT_ADMIN_SESSION_SECONDS,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin/session][POST]', error);
    return NextResponse.json({ message: 'Login failed.' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  revokeCommentAdminSession(cookieStore.get(COMMENT_ADMIN_COOKIE)?.value);
  cookieStore.delete(COMMENT_ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
