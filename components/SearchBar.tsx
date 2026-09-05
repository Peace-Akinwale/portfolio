'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search articles' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query);
      }}
      className="w-full max-w-xl"
    >
      <label className="relative block">
        <span className="sr-only">Search articles</span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-5 text-[15px] text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
        />
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </label>
    </form>
  );
}
