import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';

// The crawler fetches addresses that users, robots.txt files and sitemaps supply.
// Every one, and every redirect hop, has to be a public http(s) address on a
// standard port, and the body is read up to a cap. Without this a project's
// sitemap could point the server at its own private network (24 Nov 2026).
//
// Limit: the name is resolved here and again by fetch, so a DNS answer that
// changes between the two is not caught.

const MAX_REDIRECTS = 5;

function isPrivateV4(ip: string): boolean {
  const [a, b] = ip.split('.').map(Number);
  return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 192 && b === 0) || (a === 198 && (b === 18 || b === 19)) || a >= 224;
}

export function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 4) return isPrivateV4(ip);
  const v6 = ip.toLowerCase();
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPrivateV4(mapped[1]);
  return v6 === '::' || v6 === '::1' || v6.startsWith('fc') || v6.startsWith('fd') || /^fe[89ab]/.test(v6) || v6.startsWith('ff') || v6.startsWith('::ffff:');
}

export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error('Not a valid URL'); }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Only http and https addresses can be crawled');
  if (url.port && url.port !== '80' && url.port !== '443') throw new Error('Only standard web ports can be crawled');
  if (url.username || url.password) throw new Error('Addresses with credentials cannot be crawled');
  const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.internal') || host.endsWith('.local')) {
    throw new Error('Private addresses cannot be crawled');
  }
  const addresses = isIP(host) ? [host] : (await lookup(host, { all: true })).map((entry) => entry.address);
  if (addresses.length === 0 || addresses.some(isPrivateAddress)) throw new Error('Private addresses cannot be crawled');
  return url;
}

export interface SafeResponse { status: number; ok: boolean; contentType: string; text: string; truncated: boolean }

export async function safeFetchText(
  raw: string,
  options: { timeoutMs?: number; maxBytes?: number } = {}
): Promise<SafeResponse> {
  const { timeoutMs = 10000, maxBytes = 5 * 1024 * 1024 } = options;
  const signal = AbortSignal.timeout(timeoutMs);
  let current = raw;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const url = await assertPublicUrl(current);
    const res = await fetch(url, { headers: { 'User-Agent': 'MyLinksBot/1.0' }, redirect: 'manual', signal });
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      current = new URL(res.headers.get('location')!, url).href;
      await res.body?.cancel().catch(() => {});
      continue;
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (!res.ok || !res.body) {
      await res.body?.cancel().catch(() => {});
      return { status: res.status, ok: res.ok, contentType, text: '', truncated: false };
    }
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    let truncated = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (size + value.byteLength > maxBytes) {
        chunks.push(value.subarray(0, maxBytes - size));
        truncated = true;
        await reader.cancel().catch(() => {});
        break;
      }
      size += value.byteLength;
      chunks.push(value);
    }
    return { status: res.status, ok: true, contentType, text: Buffer.concat(chunks).toString('utf8'), truncated };
  }
  throw new Error('Too many redirects');
}
