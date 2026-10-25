'use client';

import { useMemo, useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ArticleCard } from '@/components/ArticleCard';
import type { HashnodePost } from '@/lib/hashnode/types';

export function BlogClient({ initialPosts, wordpressDown }: { initialPosts: HashnodePost[]; wordpressDown: boolean }) {
  const [query, setQuery] = useState('');

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialPosts;
    return initialPosts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.brief.toLowerCase().includes(q) || p.tags?.some((t) => t.name.toLowerCase().includes(q)),
    );
  }, [query, initialPosts]);

  return (
    <div className="gutter mx-auto max-w-[1100px]">
      <header className="posts-head">
        <h1>Stuff I’ve <span className="hl">written</span>, about writing and about building.</h1>
        <p className="lead">How I write for B2B SaaS companies, what I’ve learned building tools with AI coding agents, and the odd essay in between. Newest first.</p>
        <SearchBar onSearch={setQuery} />
        {query && (
          <p className="mt-3 text-[14px] text-muted-foreground" aria-live="polite">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'} for “{query}”
          </p>
        )}
      </header>

      {wordpressDown && (
        <p className="review-note">Some of my posts live on WordPress and didn’t load just now. Here’s what did. Try again in a minute for the rest.</p>
      )}

      {posts.length > 0 ? (
        <ul className="posts">
          {posts.map((post) => <ArticleCard key={post.id} post={post} />)}
        </ul>
      ) : (
        <p className="posts-empty">{query ? `Nothing matches “${query}” yet. Try another word?` : 'Nothing here yet.'}</p>
      )}
    </div>
  );
}
