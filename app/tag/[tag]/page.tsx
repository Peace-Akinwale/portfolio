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
import { ArticleCard } from '@/components/ArticleCard';
import Link from 'next/link';
import type { Metadata } from 'next';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = tag.replace(/-/g, ' ');
  return {
    title: `${label} | Peace Akinwale`,
    description: `Articles about ${label} by Peace Akinwale — B2B SaaS content writer.`,
    alternates: {
      canonical: `https://peaceakinwale.com/tag/${tag}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getAllPosts();
  const filtered = posts.filter((p) =>
    p.tags?.some((t) => t.slug === tag)
  );
  const label = tag.replace(/-/g, ' ');

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 sm:py-28">
      <div className="mb-12">
        <Link
          href="/blog"
          className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground transition mb-4 inline-block"
        >
          ← All articles
        </Link>
        <h1
          className="text-3xl sm:text-4xl font-extrabold text-foreground capitalize"
          style={{ letterSpacing: '-0.03em' }}
        >
          {label}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No articles found for this tag.</p>
      )}
    </div>
  );
}
