import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/hashnode/client';
import type { HashnodePost } from '@/lib/hashnode/types';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://peaceakinwale.com';

  const validPosts = await getAllPosts();

  // Generate article URLs
  const articleUrls = validPosts.map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
  ];

  // Pages that change rarely; listed so search engines find them without relying on internal links.
  const secondaryPaths = [
    '/case-studies',
    '/case-studies/manyrequests',
    '/testimonials',
    '/projects',
    '/projects/contentdb',
    '/projects/mylinks',
    '/projects/linkedin-router',
    '/projects/mystyleguide',
    '/projects/portfolio-project',
    '/projects/editorial-style-guide',
    '/career-pathway',
  ];
  const secondaryPages = secondaryPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...secondaryPages, ...articleUrls];
}
