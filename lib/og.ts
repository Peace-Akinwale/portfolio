import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

// Per-page social images, designed in Canva and exported to public/og/<key>.png
// at 1200x630. A page whose image is not there yet keeps the site-wide default
// (app/opengraph-image.tsx), so nothing ever points at a missing file.

export function ogImagePath(key: string): string | null {
  const file = path.join(process.cwd(), 'public', 'og', `${key}.png`);
  return fs.existsSync(file) ? `/og/${key}.png` : null;
}

// The page's own image, or the site-wide generated one (app/opengraph-image.tsx).
// Pages that set openGraph lose the file-convention default, so it is named here.
export const DEFAULT_OG = '/opengraph-image';
export function ogImageFor(key: string): string {
  return ogImagePath(key) ?? DEFAULT_OG;
}

// Full Open Graph and Twitter blocks for a page. Next replaces (not merges) the
// layout's openGraph object, so title, description and URL are set here too.
export function withOg(
  meta: Metadata & { title: string; description: string },
  opts: { key: string; path: string; alt: string; type?: 'website' | 'article' },
): Metadata {
  const image = ogImageFor(opts.key);
  const url = `${SITE_URL}${opts.path}`;
  const images = [{ url: image, width: 1200, height: 630, alt: opts.alt }];
  // The document title template adds "| Peace Akinwale". Social titles do not
  // use that template, so add the name once when the page title left it off.
  const socialTitle = /peace akinwale/i.test(meta.title) ? meta.title : `${meta.title} | Peace Akinwale`;
  return {
    ...meta,
    openGraph: { title: socialTitle, description: meta.description, url, siteName: 'Peace Akinwale', locale: 'en_US', type: opts.type ?? 'website', images },
    twitter: { card: 'summary_large_image', title: socialTitle, description: meta.description, images: [image] },
  };
}
