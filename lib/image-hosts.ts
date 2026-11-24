// The only outside hosts the image optimizer (/_next/image) will fetch from.
// Until 24 Nov 2026 the config allowed every https host, so anyone could have
// this server download and resize images from any site.
export const IMAGE_HOSTS = [
  'peaceakinwale.wordpress.com',
  '**.files.wordpress.com',
  '**.wp.com',
  'res.cloudinary.com',
  'cdn.hashnode.com',
] as const;

// True when next/image should NOT optimize this source: a remote image on a host
// outside the list is served as-is, so new content from an unlisted host still
// shows instead of breaking the page.
export function skipOptimizer(src: string): boolean {
  if (!/^https?:\/\//i.test(src)) return false;
  let host: string;
  try { host = new URL(src).hostname.toLowerCase(); } catch { return true; }
  return !IMAGE_HOSTS.some((pattern) =>
    pattern.startsWith('**.') ? host.endsWith(pattern.slice(2)) && host.length > pattern.length - 2 : host === pattern
  );
}
