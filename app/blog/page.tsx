import type { Metadata } from 'next';
import '@/components/article/article.css';
import { loadAllPosts } from '@/lib/content/posts';
import { BlogClient } from './BlogClient';
import { SITE_URL } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles on writing for B2B SaaS companies, on AI search, and on what I learned building tools with AI coding agents.',
  alternates: { canonical: `${SITE_URL}/blog` },
};

export default async function BlogPage() {
  const { posts, wordpressDown } = await loadAllPosts();
  return <BlogClient initialPosts={posts} wordpressDown={wordpressDown} />;
}
