-- Self sign-up with a lifetime AI budget (2026-10-31). The app adds anyone who
-- signs in to mylinks_allowlist with budget_usd = 2; rows Peace adds by hand
-- keep budget_usd null, meaning no cap. Spend is summed from llm_usage_logs.
alter table public.mylinks_allowlist add column if not exists budget_usd numeric;

-- The placeholder from an example query.
delete from public.mylinks_allowlist where email = 'them@example.com';
