import { describe, it, expect } from 'vitest';
import { buildSitemap } from '@/app/sitemap';
import { listCaseStudies } from '@/lib/content/case-studies';
import { listLocalArticles } from '@/lib/content/articles';

describe('sitemap', () => {
  const posts = [
    ...listLocalArticles(),
    { slug: 'how-to-optimize-for-aeo', updatedAt: '2026-04-14T00:00:00.000Z', tags: [{ slug: 'aeo' }, { slug: 'b2b-marketing' }] },
    { slug: 'the-success-message-was-the-bug', updatedAt: '2025-01-01T00:00:00.000Z', tags: [] }, // a duplicate slug must not appear twice
  ];
  const entries = buildSitemap({ posts, caseStudies: listCaseStudies() });
  const urls = entries.map((e) => e.url);

  it('has no duplicate URLs', () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('lists every case study, local article, the tag pages and the fixed pages', () => {
    for (const cs of listCaseStudies()) expect(urls).toContain(`https://peaceakinwale.com/case-studies/${cs.slug}`);
    for (const a of listLocalArticles()) expect(urls).toContain(`https://peaceakinwale.com/${a.slug}`);
    expect(urls).toContain('https://peaceakinwale.com/tag/aeo');
    for (const p of ['', '/portfolio', '/case-studies', '/blog', '/services', '/about', '/contact', '/testimonials', '/case-studies/manyrequests', '/b2b-content-for-marker.io', '/projects']) {
      expect(urls).toContain(`https://peaceakinwale.com${p}`);
    }
  });
});
