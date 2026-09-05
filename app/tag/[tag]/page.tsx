import type { Metadata } from 'next';
import { getPosts } from '@/lib/hashnode/client';
import type { HashnodePost } from '@/lib/hashnode/types';
import { ArticleCard, ArticleList } from '@/components/ArticleCard';
import { Button, Container, PageHeader } from '@/components/ui';

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

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = tag.replace(/-/g, ' ');
  return {
    title: `${label} | Peace Akinwale`,
    description: `Articles about ${label} by Peace Akinwale, B2B SaaS content writer.`,
    alternates: {
      canonical: `https://peaceakinwale.com/tag/${tag}`,
    },
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = await getAllPosts();
  const filtered = posts.filter((p) => p.tags?.some((t) => t.slug === tag));
  const label = filtered[0]?.tags?.find((t) => t.slug === tag)?.name ?? tag.replace(/-/g, ' ');

  return (
    <>
      <PageHeader
        label="Tag"
        title={label}
        lede={`${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'}`}
      >
        <Button variant="text" href="/blog">
          All articles
        </Button>
      </PageHeader>
      <Container className="pb-24">
        {filtered.length > 0 ? (
          <ArticleList>
            {filtered.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </ArticleList>
        ) : (
          <p className="border-t border-border py-12 text-muted-foreground">No articles found for this tag.</p>
        )}
      </Container>
    </>
  );
}
