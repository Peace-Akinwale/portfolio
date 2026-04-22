-- Migration: switch page embeddings from Gemini (768 dims) to OpenAI text-embedding-3-small (1536 dims).
-- pgvector does not support in-place dimension changes, so we drop & recreate the column and index.
-- All existing embeddings are discarded; pages will be re-embedded via the existing backfill script
-- (`npm run backfill:page-embeddings`) or passively by the cron maintenance job.

drop index if exists pages_embedding_hnsw_idx;
alter table pages drop column if exists embedding;
alter table pages add column embedding vector(1536);

create index pages_embedding_hnsw_idx
  on pages
  using hnsw (embedding vector_cosine_ops);

drop function if exists match_pages(uuid, vector, integer, timestamptz);

create or replace function match_pages(
  p_project_id uuid,
  p_query_embedding vector(1536),
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
