import '@/components/article/article.css';
import { loadAllPosts } from '@/lib/content/posts';
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
    title: `Articles about ${label}`,
    description: `Articles about ${label} by Peace Akinwale.`,
    alternates: {
      canonical: `https://peaceakinwale.com/tag/${tag}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const { posts } = await loadAllPosts();
  const filtered = posts.filter((p) =>
    p.tags?.some((t) => t.slug === tag)
  );
  const label = tag.replace(/-/g, ' ');

  return (
    <div className="gutter mx-auto max-w-[1100px] py-16">
      <div className="mb-12">
        <Link
          href="/blog"
          className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground transition mb-4 inline-block"
        >
          ← All articles
        </Link>
        <h1
          className="capitalize"
        >
          {label}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      {filtered.length > 0 ? (
        <ul className="posts">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">No articles found for this tag.</p>
      )}
    </div>
  );
}
