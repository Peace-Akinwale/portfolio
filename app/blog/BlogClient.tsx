'use client';

import { useMemo, useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ArticleCard } from '@/components/ArticleCard';
import type { WordPressPost } from '@/lib/wordpress/types';

export function BlogClient({ initialPosts, wordpressDown }: { initialPosts: WordPressPost[]; wordpressDown: boolean }) {
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
        <h1>Notes on content and AI workflows</h1>
        <p className="lead">I write about the decisions behind my content and AI workflows: how I check research before using it in an article, decide what to automate, and test whether a tool finishes the job.</p>
        <SearchBar onSearch={setQuery} />
        {query && (
          <p className="mt-3 text-[14px] text-muted-foreground" aria-live="polite">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'} for “{query}”
          </p>
        )}
      </header>

      {wordpressDown && (
        <p className="review-note">Some of my posts live on WordPress and didn’t load. Here’s what did. Try again in a minute for the rest.</p>
      )}

      {posts.length > 0 ? (
        <ul className="posts">
          {posts.map((post) => <ArticleCard key={post.id} post={post} />)}
        </ul>
      ) : (
        <p className="posts-empty">{query ? `No articles match that search. Try another word.` : 'Nothing here yet.'}</p>
      )}
    </div>
  );
}
