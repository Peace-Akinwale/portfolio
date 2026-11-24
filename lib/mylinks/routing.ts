export const MYLINKS_HOST = 'mylinks.peaceakinwale.com';
export const MYLINKS_ORIGIN = `https://${MYLINKS_HOST}`;
export const MYLINKS_INTERNAL_PREFIX = '/projects/mylinks';
export const MYLINKS_API_HEADER = 'x-mylinks-api';

// Public workspace paths on the subdomain. The existing route files and
// legacy portfolio URLs remain intact, including old email callbacks.
export function isMylinksPublicPath(pathname: string): boolean {
  return /^\/(?:login|dashboard|onboarding|settings|notifications|articles)(?:\/|$)/.test(pathname)
    || /^\/projects\/[0-9a-f-]{36}(?:\/|$)/i.test(pathname)
    || pathname === '/admin/google-access'
    || pathname === '/auth/callback';
}

export function isMylinksWorkspacePath(pathname: string): boolean {
  return pathname.startsWith(`${MYLINKS_INTERNAL_PREFIX}/`) && pathname !== `${MYLINKS_INTERNAL_PREFIX}/`
    || isMylinksPublicPath(pathname);
}

// The public origin of the request. `new URL(request.url).origin` is the
// container's listen address under `next start` (https://localhost:8080 on
// Railway), so every redirect built from it sent people to a dead page. The
// Host header is what the browser asked for; only the app's own hosts are
// accepted, and anything else falls back to the MyLinks origin.
export function requestOrigin(request: Request): string {
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '').split(',')[0].trim().toLowerCase();
  const name = host.split(':')[0];
  if (name === MYLINKS_HOST) return MYLINKS_ORIGIN;
  if (name === 'peaceakinwale.com' || name === 'www.peaceakinwale.com') return 'https://peaceakinwale.com';
  if (process.env.NODE_ENV !== 'production' && (name === 'localhost' || name === '127.0.0.1')) return `http://${host}`;
  return MYLINKS_ORIGIN;
}
