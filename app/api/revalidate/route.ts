import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { clearWordPressCache } from '@/lib/wordpress/client';

const digest = (value: string) => createHash('sha256').update(value).digest();

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret') ?? '';
  const expected = process.env.REVALIDATION_SECRET ?? '';

  // An unset or empty secret admits nobody, and the compare is constant-time.
  if (!expected || !secret || !timingSafeEqual(digest(secret), digest(expected))) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  clearWordPressCache();
  const path = request.nextUrl.searchParams.get('path');

  if (path) {
    if (!path.startsWith('/') || path.startsWith('//') || path.length > 300) {
      return NextResponse.json({ message: 'Invalid path' }, { status: 400 });
    }
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  }

  // Revalidate all blog-related pages
  revalidatePath('/blog');
  revalidatePath('/', 'layout');

  return NextResponse.json({ revalidated: true, path: 'all' });
}
