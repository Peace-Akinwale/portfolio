import { MetadataRoute } from 'next';
import { loadAllPosts } from '@/lib/content/posts';
import { listCaseStudies } from '@/lib/content/case-studies';
import { SITE_URL } from '@/lib/site';

// Every public route: the fixed pages, the case studies, every post (WordPress
// and local), the tag pages those posts use, and the older project pages.
export function buildSitemap(input: {
  posts: { slug: string; updatedAt: string; tags?: { slug: string }[] }[];
  caseStudies: { slug: string; date: string }[];
}): MetadataRoute.Sitemap {
  const now = new Date();
  const fixed: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/case-studies`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/testimonials`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/case-studies/manyrequests`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/b2b-content-for-marker.io`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...['/projects/contentdb', '/projects/mylinks', '/projects/linkedin-router', '/projects/mystyleguide', '/projects/portfolio-project', '/projects/editorial-style-guide', '/career-pathway'].map((path) => ({
      url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5,
    })),
  ];
  const studies: MetadataRoute.Sitemap = input.caseStudies.map((cs) => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`, lastModified: new Date(cs.date), changeFrequency: 'monthly', priority: 0.7,
  }));
  const posts: MetadataRoute.Sitemap = input.posts.map((post) => ({
    url: `${SITE_URL}/${post.slug}`, lastModified: new Date(post.updatedAt), changeFrequency: 'monthly', priority: 0.7,
  }));
  const tagSlugs = [...new Set(input.posts.flatMap((p) => p.tags?.map((t) => t.slug) ?? []))].filter(Boolean);
  const tags: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({
    url: `${SITE_URL}/tag/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.3,
  }));
  const seen = new Set<string>();
  return [...fixed, ...studies, ...posts, ...tags].filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await loadAllPosts();
  return buildSitemap({ posts, caseStudies: listCaseStudies() });
}
