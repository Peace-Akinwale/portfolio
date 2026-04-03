import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  COMMENT_ADMIN_COOKIE,
  createCommentAdminSessionToken,
  validateCommentAdminPassword,
} from '@/lib/comments/admin';

export async function POST(request: Request) {
  try {
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
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin/session][POST]', error);
    return NextResponse.json({ message: 'Login failed.' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COMMENT_ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
