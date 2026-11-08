import { describe, it, expect } from 'vitest';
import { listCaseStudies, getCaseStudy } from '@/lib/content/case-studies';
import { generateMetadata, generateStaticParams } from '@/app/case-studies/[slug]/page';

describe('case-study routes', () => {
  it('keeps manyrequests for the existing hand-built page', () => {
    expect(listCaseStudies().map((s) => s.slug)).not.toContain('manyrequests');
    expect(getCaseStudy('manyrequests')).toBeNull();
  });

  it('renders metadata with a canonical URL for every case study', async () => {
    const params = generateStaticParams();
    expect(params.length).toBeGreaterThan(0);
    for (const { slug } of params) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(meta.alternates?.canonical).toBe(`https://peaceakinwale.com/case-studies/${slug}`);
      expect(String(meta.title).length).toBeGreaterThan(3);
      expect(String(meta.description).length).toBeGreaterThan(40);
    }
  });

  it('excludes withdrawn studies from listings and direct lookup', () => {
    const listed = generateStaticParams().map(({ slug }) => slug);
    for (const slug of ['reading-app', 'quality-rater', 'what-ai-search-apps-do-before-they-answer', 'reach']) {
      expect(listed).not.toContain(slug);
      expect(getCaseStudy(slug)).toBeNull();
    }
  });

  it('refuses slugs that are not files', () => {
    expect(getCaseStudy('../package')).toBeNull();
    expect(getCaseStudy('nope')).toBeNull();
  });
});
