-- MyLinks sign-in gate (2026-10-29, Peace's ask: Google sign-in for her and for
-- people on an allowlist, the way Radar does it; see Radar migrations 016, 074).
--
-- One rule, in the database, fail closed: an email may create an account when it
-- is on mylinks_allowlist, or its domain is on mylinks_allowed_domains. The
-- login page asks the same function before any auth call (check-allowlist
-- route), and the trigger on auth.users enforces it, so the two cannot drift.

create table if not exists public.mylinks_allowlist (
  email text primary key,
  role text not null default 'member' check (role in ('admin', 'member')),
  added_at timestamptz not null default now(),
  note text
);

create table if not exists public.mylinks_allowed_domains (
  domain text primary key,
  added_at timestamptz not null default now()
);

-- Service-role only. The anon and authenticated roles never read the list.
alter table public.mylinks_allowlist enable row level security;
alter table public.mylinks_allowed_domains enable row level security;
revoke all on public.mylinks_allowlist from anon, authenticated;
revoke all on public.mylinks_allowed_domains from anon, authenticated;

create or replace function public.mylinks_signup_allowed(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.mylinks_allowlist
    where email = lower(btrim(coalesce(p_email, '')))
  ) or exists (
    select 1 from public.mylinks_allowed_domains
    where domain = lower(split_part(btrim(coalesce(p_email, '')), '@', 2))
  );
$$;

revoke all on function public.mylinks_signup_allowed(text) from public, anon, authenticated;
grant execute on function public.mylinks_signup_allowed(text) to service_role;

-- Fail closed. Raised from an AFTER INSERT trigger, so the auth.users row rolls
-- back and the account is never created. errcode 42501 (insufficient_privilege).
create or replace function public.mylinks_gate_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.mylinks_signup_allowed(new.email) then
    raise exception 'signup_not_allowed'
      using errcode = '42501',
            hint = 'This email is not on the MyLinks list. Ask Peace to add you.';
  end if;
  return new;
end;
$$;

drop trigger if exists mylinks_gate_new_user on auth.users;
create trigger mylinks_gate_new_user
  after insert on auth.users
  for each row execute function public.mylinks_gate_new_user();

-- Peace is the first admin. Add people with:
--   insert into public.mylinks_allowlist (email, note) values ('someone@example.com', 'why');
insert into public.mylinks_allowlist (email, role, note)
values ('akindayopeaceakinwale@gmail.com', 'admin', 'owner')
on conflict (email) do nothing;
