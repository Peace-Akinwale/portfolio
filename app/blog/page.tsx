'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ArticleCard } from '@/components/ArticleCard';
import type { HashnodePost } from '@/lib/hashnode/types';

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<HashnodePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<HashnodePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts on mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setAllPosts(data.posts);
        setFilteredPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Filter posts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(allPosts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.brief.toLowerCase().includes(query) ||
        post.tags?.some((tag) => tag.name.toLowerCase().includes(query))
    );

    setFilteredPosts(filtered);
  }, [searchQuery, allPosts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-16">
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
          Blog
        </h1>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      )}

      {/* Articles Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {searchQuery
              ? `No articles found for "${searchQuery}"`
              : 'No articles yet. Check back soon!'}
          </p>
        </div>
      )}
    </div>
  );
}
