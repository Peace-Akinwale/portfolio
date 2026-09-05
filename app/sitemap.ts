import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/hashnode/client';
import type { HashnodePost } from '@/lib/hashnode/types';
import { PUBLISHED_CASE_STUDIES } from '@/lib/content/case-studies';

async function getAllPosts(): Promise<HashnodePost[]> {
  const all: HashnodePost[] = [];
  let hasNextPage = true;
  let after: string | undefined;
  while (hasNextPage) {
    const { posts, hasNextPage: more, endCursor } = await getPosts(50, after);
    all.push(...posts);
    hasNextPage = more;
    after = endCursor;
  }
  return all;
}

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

const STATIC_PAGES: { path: string; changeFrequency: Freq; priority: number }[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/case-studies', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.9 },
  { path: '/portfolio', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/testimonials', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/projects', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/projects/contentdb', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/projects/mylinks', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/career-pathway', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/b2b-content-for-marker.io', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://peaceakinwale.com';
  const now = new Date();

  const posts = await getAllPosts();
  const articleUrls = posts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const tagSlugs = new Set<string>();
  for (const post of posts) for (const tag of post.tags ?? []) tagSlugs.add(tag.slug);
  const tagUrls = Array.from(tagSlugs).map((slug) => ({
    url: `${baseUrl}/tag/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.4,
  }));

  const caseStudyUrls = PUBLISHED_CASE_STUDIES.map((cs) => ({
    url: `${baseUrl}/case-studies/${cs.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticUrls = STATIC_PAGES.map((p) => ({
    url: `${baseUrl}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  return [...staticUrls, ...caseStudyUrls, ...articleUrls, ...tagUrls];
}
