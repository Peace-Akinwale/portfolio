import { NextRequest, NextResponse } from 'next/server';
import { isMylinksPublicPath, MYLINKS_API_HEADER, MYLINKS_HOST, MYLINKS_INTERNAL_PREFIX, MYLINKS_ORIGIN } from '@/lib/mylinks/routing';

// Marks MyLinks API calls so the auth gate can answer them with a JSON 401
// instead of a redirect to the login page. The sign-in routes under
// /api/mylinks/auth/ are browser navigations and keep the redirect. A header a
// client sends itself is dropped first.
function pass(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete(MYLINKS_API_HEADER);
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/mylinks/') && !pathname.startsWith('/api/mylinks/auth/')) headers.set(MYLINKS_API_HEADER, '1');
  return NextResponse.next({ request: { headers } });
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host')?.split(':')[0].toLowerCase();
  if (hostname !== MYLINKS_HOST) {
    // The wildcard should not create indexable copies on unused subdomains.
    if (hostname?.endsWith('.peaceakinwale.com') && hostname !== 'www.peaceakinwale.com') {
      return NextResponse.redirect(new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://peaceakinwale.com'));
    }
    return pass(request);
  }

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
    return pass(request);
  }
  const portfolioPath = pathname === MYLINKS_INTERNAL_PREFIX || pathname === `${MYLINKS_INTERNAL_PREFIX}/`
    ? '/case-studies/mylinks' : pathname;
  return NextResponse.redirect(new URL(portfolioPath + search, 'https://peaceakinwale.com'));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
