-- The MyLinks gate moves from the database to the app (2026-10-31).
--
-- This Supabase project is shared with Aloud. The trigger below refused every
-- new auth.users row not on the MyLinks list, which broke Aloud's sign-up, and
-- it never stopped an account that already existed from signing in to MyLinks.
-- The app now asks mylinks_signup_allowed() on every signed-in page and route
-- (lib/mylinks/auth.ts, requireAuthenticatedUser). The list tables and the
-- function stay.

drop trigger if exists mylinks_gate_new_user on auth.users;
drop function if exists public.mylinks_gate_new_user();
