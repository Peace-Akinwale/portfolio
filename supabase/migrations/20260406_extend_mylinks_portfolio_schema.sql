create extension if not exists "uuid-ossp";

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'suggestions'
      and column_name = 'link_type'
  ) then
    alter table public.suggestions
      add column link_type text not null default 'internal'
      check (link_type in ('internal', 'external'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'suggestions'
      and column_name = 'destination_source'
  ) then
    alter table public.suggestions
      add column destination_source text not null default 'inventory'
      check (destination_source in ('inventory', 'client'));
  end if;
end
$$;

alter table public.suggestions
  add column if not exists reviewed_at timestamptz,
  add column if not exists applied_at timestamptz;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  found_via text,
  beta_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.google_access_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text,
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null
);

create table if not exists public.article_link_targets (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references public.articles(id) on delete cascade,
  label text,
  url text not null,
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.llm_usage_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  article_id uuid references public.articles(id) on delete set null,
  operation text not null,
  provider text not null,
  model text not null,
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  estimated_cost_usd numeric(10, 6),
  created_at timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1 from pg_proc where proname = 'update_updated_at'
  ) and not exists (
    select 1 from pg_trigger where tgname = 'profiles_updated_at'
  ) then
    create trigger profiles_updated_at
      before update on public.profiles
      for each row execute function update_updated_at();
  end if;
end
$$;

alter table public.profiles enable row level security;
alter table public.google_access_requests enable row level security;
alter table public.article_link_targets enable row level security;
alter table public.llm_usage_logs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users manage own profile'
  ) then
    create policy "Users manage own profile" on public.profiles
      for all
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'google_access_requests'
      and policyname = 'Users manage own google access requests'
  ) then
    create policy "Users manage own google access requests" on public.google_access_requests
      for all
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'article_link_targets'
      and policyname = 'Users manage own article link targets'
  ) then
    create policy "Users manage own article link targets" on public.article_link_targets
      for all
      using (
        article_id in (
          select a.id
          from public.articles a
          join public.projects p on p.id = a.project_id
          where p.owner_id = auth.uid()
        )
      )
      with check (
        article_id in (
          select a.id
          from public.articles a
          join public.projects p on p.id = a.project_id
          where p.owner_id = auth.uid()
        )
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'llm_usage_logs'
      and policyname = 'Users see own llm usage logs'
  ) then
    create policy "Users see own llm usage logs" on public.llm_usage_logs
      for all
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end
$$;

create index if not exists suggestions_link_type_idx on public.suggestions (article_id, link_type);
create index if not exists suggestions_destination_source_idx on public.suggestions (article_id, destination_source);
create index if not exists article_link_targets_article_id_idx on public.article_link_targets (article_id, sort_order);
create index if not exists google_access_requests_user_id_idx on public.google_access_requests (user_id);
create index if not exists llm_usage_logs_user_id_idx on public.llm_usage_logs (user_id, created_at desc);
