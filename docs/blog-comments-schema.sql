create extension if not exists pgcrypto;

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  post_title text,
  parent_id uuid references public.blog_comments(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  author_url text,
  content text not null,
  status text not null default 'approved' check (status in ('approved', 'pending', 'spam')),
  created_at timestamptz not null default now()
);

create index if not exists blog_comments_post_slug_created_at_idx
  on public.blog_comments (post_slug, created_at);

create index if not exists blog_comments_parent_id_idx
  on public.blog_comments (parent_id);

alter table public.blog_comments enable row level security;
