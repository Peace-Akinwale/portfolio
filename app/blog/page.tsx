import { getPosts } from '@/lib/hashnode/client';
import { BlogClient } from './BlogClient';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  // Fetch posts on the server
  const { posts } = await getPosts(50);

  return <BlogClient initialPosts={posts} />;
}
