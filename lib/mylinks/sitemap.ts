import { parseStringPromise } from "xml2js";
import { safeFetchText } from "./safe-fetch";

// Bounds on one discovery, so a hostile or broken sitemap index cannot fan out
// without end or fill memory (24 Nov 2026).
const MAX_SITEMAPS = 200;
const MAX_DEPTH = 3;
export const MAX_SITEMAP_URLS = 20000;

/** Parse a single XML sitemap URL, recursing into sitemap indexes. */
export async function parseSitemap(url: string): Promise<string[]> {
  const urls: string[] = [];
  await fetchSitemap(url, urls, new Set());
  return urls;
}

/**
 * Auto-discover the sitemap for a domain and return all page URLs.
 * Strategy:
 *   1. User-supplied override URL (if any)
 *   2. Sitemap directives found in robots.txt
 *   3. Common well-known sitemap paths
 * Returns the URLs found and which sitemap URL worked.
 */
export async function discoverAndParseSitemap(
  domain: string,
  storedSitemapUrl?: string | null
): Promise<{ urls: string[]; foundAt: string | null }> {
  const candidates: string[] = [];

  // 1. User-specified URL takes priority
  if (storedSitemapUrl) candidates.push(storedSitemapUrl);

  // 2. Discover from robots.txt
  const robotsSitemaps = await getSitemapUrlsFromRobots(domain);
  for (const u of robotsSitemaps) {
    if (!candidates.includes(u)) candidates.push(u);
  }

  // 3. Well-known fallback paths (with and without www)
  const bases = [`https://${domain}`, `https://www.${domain}`];
  const paths = [
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/wp-sitemap.xml",       // WordPress native
    "/sitemap/xml",          // Some custom setups
    "/news-sitemap.xml",
  ];
  for (const base of bases) {
    for (const path of paths) {
      const url = `${base}${path}`;
      if (!candidates.includes(url)) candidates.push(url);
    }
  }

  // Try each candidate in order, stop on first success
  for (const candidate of candidates) {
    const urls = await parseSitemap(candidate);
    if (urls.length > 0) return { urls, foundAt: candidate };
  }

  return { urls: [], foundAt: null };
}

/** Extract Sitemap: directives from robots.txt */
async function getSitemapUrlsFromRobots(domain: string): Promise<string[]> {
  const found: string[] = [];
  for (const base of [`https://${domain}`, `https://www.${domain}`]) {
    try {
      const res = await safeFetchText(`${base}/robots.txt`, { timeoutMs: 5000, maxBytes: 512 * 1024 });
      if (!res.ok) continue;
      const text = res.text;
      const matches = text.match(/^Sitemap:\s*(.+)$/gim) ?? [];
      for (const line of matches) {
        const url = line.replace(/^Sitemap:\s*/i, "").trim();
        if (url && !found.includes(url)) found.push(url);
      }
      if (found.length > 0) break; // Got sitemaps from first robots.txt, stop
    } catch {
      // unreachable host — try next
    }
  }
  return found;
}

async function fetchSitemap(
  url: string,
  collected: string[],
  visited: Set<string>,
  depth = 0
): Promise<void> {
  if (visited.has(url) || visited.size >= MAX_SITEMAPS || depth > MAX_DEPTH || collected.length >= MAX_SITEMAP_URLS) return;
  visited.add(url);

  let text: string;
  try {
    const res = await safeFetchText(url, { timeoutMs: 10000, maxBytes: 10 * 1024 * 1024 });
    if (!res.ok || res.truncated) return;
    // Skip HTML pages — they are human-readable sitemaps, not XML
    if (res.contentType.includes("text/html")) return;
    text = res.text;
    // Guard against HTML responses without a proper content-type header
    const trimmed = text.trimStart();
    if (trimmed.startsWith("<!") || trimmed.toLowerCase().startsWith("<html")) return;
  } catch {
    return;
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = await parseStringPromise(text, { explicitArray: true });
  } catch {
    return;
  }

  // Sitemap index — recurse into child sitemaps
  if (parsed.sitemapindex) {
    const index = parsed.sitemapindex as {
      sitemap?: Array<{ loc?: string[] }>;
    };
    const childUrls = (index.sitemap ?? [])
      .map((s) => s.loc?.[0])
      .filter((u): u is string => !!u);

    for (let i = 0; i < childUrls.length; i += 5) {
      await Promise.all(
        childUrls.slice(i, i + 5).map((childUrl) => fetchSitemap(childUrl, collected, visited, depth + 1))
      );
    }
    return;
  }

  // Standard urlset
  if (parsed.urlset) {
    const urlset = parsed.urlset as { url?: Array<{ loc?: string[] }> };
    const pageUrls = (urlset.url ?? [])
      .map((u) => u.loc?.[0])
      .filter((u): u is string => !!u);
    for (const pageUrl of pageUrls) {
      if (collected.length >= MAX_SITEMAP_URLS) break;
      collected.push(pageUrl);
    }
  }
}
