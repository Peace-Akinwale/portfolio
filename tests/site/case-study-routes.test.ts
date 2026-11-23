import { describe, it, expect, vi } from 'vitest';
import { listCaseStudies, getCaseStudy } from '@/lib/content/case-studies';
import { generateMetadata, generateStaticParams } from '@/app/case-studies/[slug]/page';

import { metadata as mylinksMetadata } from '@/app/case-studies/mylinks/page';
import nextConfig from '../../next.config';
import { WORDPRESS_CASE_STUDY_SLUGS } from '@/lib/content/project-routes';

vi.mock('@/lib/wordpress/client', () => ({
  getStaticPage: vi.fn(async (slug: string) => ({ title: `Existing WordPress project article: ${slug}`, content: { html: '<p>Existing article content.</p>' } })),
}));

describe('case-study routes', () => {
  it('gives MyLinks its case-study canonical and social URL', () => {
    expect(mylinksMetadata.alternates?.canonical).toBe('https://peaceakinwale.com/case-studies/mylinks');
    expect(mylinksMetadata.openGraph?.url).toBe('https://peaceakinwale.com/case-studies/mylinks');
  });

  it('permanently redirects only the old MyLinks overview and aliases', async () => {
    const redirects = await nextConfig.redirects!();
    for (const source of ['/projects/mylinks', '/tools/mylinks', '/mylinks']) {
      expect(redirects.find((rule) => rule.source === source)).toMatchObject({
        destination: '/case-studies/mylinks', permanent: true,
      });
    }
    expect(redirects.filter((rule) => rule.source.startsWith('/projects/mylinks'))).toHaveLength(1);
  });

  it('includes every WordPress write-up and redirects both legacy URL forms', async () => {
    const params = generateStaticParams().map(({ slug }) => slug);
    const redirects = await nextConfig.redirects!();
    for (const slug of WORDPRESS_CASE_STUDY_SLUGS) {
      expect(params).toContain(slug);
      for (const source of [`/projects/${slug}`, `/${slug}`]) {
        expect(redirects.find((rule) => rule.source === source)).toMatchObject({
          destination: `/case-studies/${slug}`, permanent: true,
        });
      }
      const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(meta.openGraph?.url).toBe(`/case-studies/${slug}`);
    }
  });

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
