-- Tracks when the current refresh_token was issued (i.e. when the user last
-- connected or reconnected Google). Used to show a proactive "reconnect
-- before 7 days" banner while the OAuth app is in Google's Testing mode.
alter table public.google_tokens
  add column if not exists refresh_issued_at timestamptz not null default now();
