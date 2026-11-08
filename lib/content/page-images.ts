import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { load } from 'cheerio';
import { getImageProps } from 'next/image';

// Keep approved prose intact; reserve image space and serve screen-sized files.
export async function preparePageImages(html: string): Promise<string> {
  const $ = load(html, null, false);
  const publicDir = path.join(process.cwd(), 'public');
  await Promise.all($('img').toArray().map(async (element, index) => {
    const img = $(element);
    const src = img.attr('src') ?? '';
    if (!src.startsWith('/') || src.startsWith('//')) return;
    const file = path.resolve(publicDir, '.' + src);
    if (!file.startsWith(publicDir + path.sep)) return;
    try {
      const metadata = await sharp(await fs.readFile(file)).metadata();
      if (!metadata.width || !metadata.height) return;
      const { props } = getImageProps({
        src, alt: img.attr('alt') ?? '', width: metadata.width, height: metadata.height,
        sizes: img.closest('.reviewer-attribution').length ? '56px' : '(max-width: 860px) calc(100vw - 36px), 820px',
        loading: index === 0 ? 'eager' : 'lazy',
        unoptimized: src.endsWith('.svg') || src.endsWith('.gif'),
      });
      img.attr('data-original-src', src);
      for (const key of ['src', 'srcSet', 'sizes', 'width', 'height', 'loading', 'decoding'] as const) {
        const value = props[key];
        if (value !== undefined) img.attr(key.toLowerCase(), String(value));
      }
    } catch {
      // Preserve the original reference; don't silently remove evidence.
    }
  }));
  return $.html();
}
