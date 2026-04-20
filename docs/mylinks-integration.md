# MyLinks into Portfolio

Date checked: 2026-04-06

## Current state

- `C:\AKINWALE\portfolio` and `C:\AKINWALE\mylinks` are separate Next.js apps.
- They currently point to different Supabase projects.
- `portfolio` already has public routes like `/projects`, while `mylinks` also uses `/projects`, `/dashboard`, `/settings`, and `/login`.
- Because of those collisions, the integrated app now lives under `/projects/mylinks`.

## What was added in this repo

- [`supabase/migrations/20260406_add_mylinks_schema.sql`](C:\AKINWALE\portfolio\supabase\migrations\20260406_add_mylinks_schema.sql) adds the MyLinks tables, enums, indexes, trigger, and RLS policies to the portfolio Supabase project.
- [`supabase/migrations/20260406_extend_mylinks_portfolio_schema.sql`](C:\AKINWALE\portfolio\supabase\migrations\20260406_extend_mylinks_portfolio_schema.sql) adds the rebuild-specific tables and columns: `profiles`, `google_access_requests`, `article_link_targets`, `llm_usage_logs`, and the new `suggestions` metadata used by the integrated app.
- [`scripts/migrate-mylinks-data.ts`](C:\AKINWALE\portfolio\scripts\migrate-mylinks-data.ts) copies MyLinks data from the old Supabase project into the portfolio Supabase project and remaps auth-linked rows by email.
- [`package.json`](C:\AKINWALE\portfolio\package.json) now exposes `npm run migrate:mylinks-data`.

## Recommended merge order

1. Back up the old MyLinks database.
2. Apply [`supabase/migrations/20260406_add_mylinks_schema.sql`](C:\AKINWALE\portfolio\supabase\migrations\20260406_add_mylinks_schema.sql) to the portfolio Supabase project.
3. Apply [`supabase/migrations/20260406_extend_mylinks_portfolio_schema.sql`](C:\AKINWALE\portfolio\supabase\migrations\20260406_extend_mylinks_portfolio_schema.sql) to the portfolio Supabase project.
4. Run the data migration in dry-run mode first.
5. If the target auth project is missing MyLinks users, rerun with `--seed-missing-users`.
6. Run the real data migration.
7. After the data is in one database, use the integrated app under `/projects/mylinks`.

## Environment variables

Add these to `portfolio/.env.local` before running the migration:

```env
SUPABASE_URL=https://your-portfolio-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-portfolio-service-role-key
MYLINKS_SOURCE_SUPABASE_URL=https://your-old-mylinks-project.supabase.co
MYLINKS_SOURCE_SUPABASE_SERVICE_ROLE_KEY=your-old-mylinks-service-role-key
```

If you later fold the MyLinks UI into the portfolio app, you will also need:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-portfolio-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-portfolio-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Running the migration

Dry run:

```bash
npm run migrate:mylinks-data -- --dry-run
```

Dry run plus auth seeding when the target project is missing old MyLinks users:

```bash
npm run migrate:mylinks-data -- --dry-run --seed-missing-users
```

Real run:

```bash
npm run migrate:mylinks-data
```

The script migrates these tables in dependency order:

- `projects`
- `pages`
- `articles`
- `suggestions`
- `google_tokens`
- `crawl_logs`

## Important constraint

The script maps user-owned rows by email. It can now seed missing target auth users with `--seed-missing-users`, but the integrated app still requires the second schema migration before `suggestions`, Google access workflow rows, and usage logs can be imported cleanly.

## UI merge recommendation

Do not drop the MyLinks routes into the root of `portfolio`. Use the live prefix:

- `/projects/mylinks/login`
- `/projects/mylinks/dashboard`
- `/projects/mylinks/projects/[projectId]`
- `/projects/mylinks/settings`

That keeps the portfolio site intact while letting both experiences share one Next app and one Supabase project.

## 2026-04-20 update

- The "Request access" approval workflow is removed. Any authenticated MyLinks user can click "Connect Google Docs" in settings and authorize their own Google account directly.
- Every new Google Docs connection fires a Slack notification (`MYLINKS_SLACK_WEBHOOK`) and writes two rows into the new `notifications` table: one for the connecting user (`google_connected`), one for the admin identified by `ADMIN_EMAIL` (`admin_user_connected_google`).
- Pasted draft content is now sanitized against an allowlist (`p`, `h1`–`h6`, `ul`, `ol`, `li`, `blockquote`, `hr`, `br`, `strong`, `em`, `u`, `s`, `a`). Inline styles and non-allowed tags are stripped on paste and again on blur. `javascript:` and `data:` hrefs are blocked.
- The in-app notifications inbox is at `/projects/mylinks/notifications`. A bell icon in the dashboard nav shows the unread count, polling every 60 seconds.
- The `google_access_requests` table remains in the database for historical records but is no longer written to. It can be dropped in a later cleanup migration.
- Apply `supabase/migrations/20260420_add_notifications.sql` to your Supabase project before deploying (via dashboard SQL editor or `supabase db push`).
