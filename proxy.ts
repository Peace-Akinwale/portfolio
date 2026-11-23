import { NextRequest, NextResponse } from 'next/server';
import { isMylinksPublicPath, MYLINKS_HOST, MYLINKS_INTERNAL_PREFIX, MYLINKS_ORIGIN } from '@/lib/mylinks/routing';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0].toLowerCase();
  if (hostname !== MYLINKS_HOST) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path + search, MYLINKS_ORIGIN));

  if (pathname === '/') return redirectTo('/dashboard');
  if (pathname === '/robots.txt') {
    return new NextResponse('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain', 'X-Robots-Tag': 'noindex' },
    });
  }
  if (pathname.startsWith(`${MYLINKS_INTERNAL_PREFIX}/`) && pathname !== `${MYLINKS_INTERNAL_PREFIX}/`) {
    return redirectTo(pathname.slice(MYLINKS_INTERNAL_PREFIX.length));
  }
  if (isMylinksPublicPath(pathname)) {
    const destination = request.nextUrl.clone();
    destination.pathname = MYLINKS_INTERNAL_PREFIX + pathname;
    const response = NextResponse.rewrite(destination);
    response.headers.set('X-Robots-Tag', 'noindex');
    return response;
  }
  // APIs and static assets stay on this origin, so host-only session cookies
  // and Google OAuth state continue to work without cross-domain sharing.
  if (pathname.startsWith('/api/mylinks/') || pathname.startsWith('/_next/') || /\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL(pathname + search, 'https://peaceakinwale.com'));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
