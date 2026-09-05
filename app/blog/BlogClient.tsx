'use client';

import { useMemo, useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ArticleCard, ArticleList } from '@/components/ArticleCard';
import { Container, PageHeader } from '@/components/ui';
import type { HashnodePost } from '@/lib/hashnode/types';

interface BlogClientProps {
  initialPosts: HashnodePost[];
}

export function BlogClient({ initialPosts }: BlogClientProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialPosts;
    return initialPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.brief.toLowerCase().includes(q) ||
        post.tags?.some((tag) => tag.name.toLowerCase().includes(q)),
    );
  }, [query, initialPosts]);

  return (
    <>
      <PageHeader
        label="Blog"
        title="Notes on product-led content"
        lede="What I have learned writing for B2B SaaS teams: content refreshes, AI search, editorial systems, and the judgment calls in between."
      >
        <SearchBar onSearch={setQuery} />
        <p className="tabular mt-4 text-sm text-muted-foreground" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          {query && ` for “${query}”`}
        </p>
      </PageHeader>

      <Container className="pb-24">
        {filtered.length > 0 ? (
          <ArticleList>
            {filtered.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </ArticleList>
        ) : (
          <p className="border-t border-border py-12 text-muted-foreground">
            {query ? `No articles found for “${query}”.` : 'No articles yet.'}
          </p>
        )}
      </Container>
    </>
  );
}
