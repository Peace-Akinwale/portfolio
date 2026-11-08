import descriptions from '@/lib/content/page-descriptions.json';
import { withOg } from '@/lib/og';
import type { Metadata } from 'next';
import '@/components/article/article.css';
import { loadAllPosts } from '@/lib/content/posts';
import { BlogClient } from './BlogClient';
import { SITE_URL } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = withOg({
  title: 'Blog',
  description: descriptions.Blog,
  alternates: { canonical: `${SITE_URL}/blog` },
}, { key: 'blog', path: '/blog', alt: 'Writing about the work, by Peace Akinwale' });

export default async function BlogPage() {
  const { posts, wordpressDown } = await loadAllPosts();
  return <BlogClient initialPosts={posts} wordpressDown={wordpressDown} />;
}
