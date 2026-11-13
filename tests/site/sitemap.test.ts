import { describe, it, expect } from 'vitest';
import { buildSitemap } from '@/app/sitemap';
import { getCaseStudy, listCaseStudies, shownDate } from '@/lib/content/case-studies';
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

  it('lists every case study, local article, the fixed pages and the client sample pages', () => {
    for (const cs of listCaseStudies()) expect(urls).toContain(`https://peaceakinwale.com/case-studies/${cs.slug}`);
    for (const a of listLocalArticles()) expect(urls).toContain(`https://peaceakinwale.com/blog/${a.slug}`);
    for (const p of ['', '/writing', '/case-studies', '/blog', '/services', '/about', '/contact', '/testimonials', '/projects/mylinks', '/case-studies/manyrequests', '/writing/manyrequests', '/writing/highervisibility', '/writing/pangea']) {
      expect(urls).toContain(`https://peaceakinwale.com${p}`);
    }
  });

  it('uses the blog namespace for both local and existing posts, without legacy duplicates', () => {
    for (const post of posts) {
      expect(urls).toContain(`https://peaceakinwale.com/blog/${post.slug}`);
      expect(urls).not.toContain(`https://peaceakinwale.com/${post.slug}`);
    }
  });

  // 3 Nov 2026 SEO audit: thin tag pages, the redirected /projects tree, the old
  // career tool and the services mockup stay out of the sitemap.
  it('includes the MyLinks case study but leaves out workspace and retired pages', () => {
    expect(urls.some((u) => u.includes('/tag/') || (u.includes('/projects') && !u.endsWith('/projects/mylinks')) || u.includes('/career-pathway') || u.includes('/services-v2'))).toBe(false);
  });

  it('dates entries from their sources, not one build time for all', () => {
    const now = new Date('2026-11-03T00:00:00Z');
    const fixed = buildSitemap({ posts: [], caseStudies: [], modifiedAt: (src) => (src.includes('app/about/page.tsx') ? new Date('2026-10-01T00:00:00Z') : null), now });
    const about = fixed.find((e) => e.url === 'https://peaceakinwale.com/about');
    expect(about?.lastModified).toEqual(new Date('2026-10-01T00:00:00Z'));
    expect(fixed.every((e) => !e.lastModified || +new Date(e.lastModified) !== +now)).toBe(true);
    expect(fixed.every((e) => !('changeFrequency' in e) && !('priority' in e))).toBe(true);
  });

  it('dates each case study from its own date, the date the page shows', () => {
    const studies = listCaseStudies();
    const entries = buildSitemap({
      posts: [],
      caseStudies: studies,
      modifiedAt: () => new Date('2030-01-01T00:00:00Z'),
      now: new Date('2030-01-01T00:00:00Z'),
    });
    expect(new Set(studies.map((cs) => cs.date)).size).toBeGreaterThan(1);
    for (const cs of studies) {
      const entry = entries.find((e) => e.url === `https://peaceakinwale.com/case-studies/${cs.slug}`);
      expect(entry?.lastModified).toEqual(new Date(cs.date));
      expect(shownDate(cs)).toBe(cs.date);
    }
    const docs = getCaseStudy('ai-docs-watch');
    expect(docs?.published).toBe('2026-10-25');
    expect(shownDate(docs!)).toBe('2026-07-22');
  });
});
