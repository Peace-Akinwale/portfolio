// @vitest-environment node
import { expect, it } from 'vitest';
import { preparePageImages } from '@/lib/content/page-images';
import { load } from 'cheerio';

it('reserves space, uses responsive sources and preserves prose and original evidence', async () => {
  const src = '/images/home/peace-portrait.jpg';
  const html = `<p>Approved words &amp; punctuation.</p><figure><img src="${src}" alt="Library"></figure><img src="${src}" alt="Again">`;
  const $ = load(await preparePageImages(html));
  expect($('p').html()).toBe('Approved words &amp; punctuation.');
  expect($('img').first().attr('data-original-src')).toBe(src);
  expect(Number($('img').first().attr('width'))).toBeGreaterThan(0);
  expect($('img').first().attr('srcset')).toContain('/_next/image');
  expect($('img').last().attr('loading')).toBe('lazy');
});

it('serves app captures without lossy recompression and keeps the original for full-size viewing', async () => {
  const src = '/images/approved/contentdb/retina/02-keyword-search-retainer.png';
  const $ = load(await preparePageImages(`<figure><img src="${src}" alt="Library search"></figure>`));
  expect($('img').attr('src')).toBe(src);
  expect($('img').attr('srcset')).toBeUndefined();
  expect($('img').attr('data-original-src')).toBe(src);
  expect(Number($('img').attr('width'))).toBe(1650);
  expect($('figure').hasClass('product-screenshot')).toBe(true);
});
