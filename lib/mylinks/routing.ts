export const MYLINKS_HOST = 'mylinks.peaceakinwale.com';
export const MYLINKS_ORIGIN = `https://${MYLINKS_HOST}`;
export const MYLINKS_INTERNAL_PREFIX = '/projects/mylinks';

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
