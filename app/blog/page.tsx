import { getPosts } from '@/lib/hashnode/client';
import { BlogClient } from './BlogClient';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Blog | Peace Akinwale',
  description: 'B2B SaaS content writing insights — articles on product-led content, content refreshes, SEO, and AI search optimization.',
  alternates: {
    canonical: 'https://peaceakinwale.com/blog',
  },
};

export default async function BlogPage() {
  // Fetch posts on the server
  const { posts } = await getPosts(50);

  return <BlogClient initialPosts={posts} />;
}
