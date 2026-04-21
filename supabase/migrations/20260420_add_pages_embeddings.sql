create extension if not exists vector;

alter table pages add column if not exists embedding vector(768);

create index if not exists pages_embedding_hnsw_idx
  on pages
  using hnsw (embedding vector_cosine_ops);

create or replace function match_pages(
  p_project_id uuid,
  p_query_embedding vector(768),
  p_match_count integer default 80,
  p_published_after timestamptz default null
)
returns table (
  id uuid,
  project_id uuid,
  url text,
  title text,
  meta_description text,
  h1 text,
  h2s text[],
  page_type page_type,
  priority integer,
  word_count integer,
  status_code integer,
  last_crawled_at timestamptz,
  published_at timestamptz,
  similarity double precision
)
language sql
stable
as $$
  select
    p.id,
    p.project_id,
    p.url,
    p.title,
    p.meta_description,
    p.h1,
    p.h2s,
    p.page_type,
    p.priority,
    p.word_count,
    p.status_code,
    p.last_crawled_at,
    p.published_at,
    (1 - (p.embedding <=> p_query_embedding))::double precision as similarity
  from pages p
  where p.project_id = p_project_id
    and p.embedding is not null
    and (
      p_published_after is null
      or p.published_at is null
      or p.published_at >= p_published_after
    )
  order by p.embedding <=> p_query_embedding
  limit p_match_count;
$$;
