# MyLinks Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the Google Docs approval gate, add an in-app notification inbox, improve Slack notifications, and fix pasted-content formatting in the MyLinks workspace.

**Architecture:** Four coordinated changes inside the existing Next.js/Supabase portfolio app. Users connect Google Docs directly (no admin approval). When they do, a notification is written to a new `notifications` table and a Slack message fires. A new client-side paste sanitizer normalizes HTML inside the existing `RichTextEditor`. All other MyLinks behavior stays intact.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Supabase (Postgres + auth), Vitest (jsdom) for unit tests, Tailwind for UI, existing Slack webhook helper.

**Spec reference:** `docs/superpowers/specs/2026-04-20-mylinks-redesign.md`

---

## File Structure

### New files

| File | Responsibility |
|------|----------------|
| `supabase/migrations/20260420_add_notifications.sql` | Creates the `notifications` table + index. |
| `lib/mylinks/notifications.ts` | CRUD helpers for notifications (create, list, markRead, unreadCount). |
| `lib/mylinks/paste-sanitize.ts` | Pure function: dirty HTML → allowlisted clean HTML. |
| `lib/mylinks/paste-sanitize.test.ts` | Vitest unit tests for the sanitizer. |
| `app/api/mylinks/notifications/route.ts` | `GET` — list notifications for the current user. |
| `app/api/mylinks/notifications/[id]/read/route.ts` | `POST` — mark a notification read. |
| `app/projects/mylinks/(workspace)/notifications/page.tsx` | In-app notifications inbox page. |
| `components/mylinks/NotificationBell.tsx` | Nav-bar bell component with unread badge. |

### Modified files

| File | Change |
|------|--------|
| `lib/mylinks/auth.ts` | Simplify `canUseGoogleDocs`; remove `getGoogleAccessRequest` usage from the happy path. |
| `app/api/mylinks/auth/google/route.ts` | Drop the `canUseGoogleDocs` precondition. |
| `app/api/mylinks/auth/google/callback/route.ts` | Drop the precondition; add notification + Slack calls. |
| `app/projects/mylinks/(workspace)/settings/page.tsx` | Remove `GoogleAccessRequestCard`, always render the "Connect Google Docs" button. |
| `app/projects/mylinks/(workspace)/dashboard/page.tsx` | Mount `NotificationBell` in the nav. |
| `components/mylinks/RichTextEditor.tsx` | Wire the paste sanitizer into `onPaste` + `onBlur`. |

### Deleted files

| File | Reason |
|------|--------|
| `app/api/mylinks/google-access/request/route.ts` | Approval workflow removed. |
| `components/mylinks/GoogleAccessRequestCard.tsx` | Component no longer referenced. |

---

## Task 1: Create the `notifications` table migration

**Files:**
- Create: `supabase/migrations/20260420_add_notifications.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
create extension if not exists "uuid-ossp";

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  message text not null,
  metadata jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_recipient_created_idx
  on public.notifications (recipient_id, created_at desc);

create index if not exists notifications_recipient_unread_idx
  on public.notifications (recipient_id, created_at desc)
  where read_at is null;

alter table public.notifications enable row level security;

drop policy if exists "Users read their own notifications" on public.notifications;
create policy "Users read their own notifications"
  on public.notifications
  for select
  using (auth.uid() = recipient_id);

drop policy if exists "Users mark their own notifications read" on public.notifications;
create policy "Users mark their own notifications read"
  on public.notifications
  for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);
```

- [ ] **Step 2: Apply the migration to the Supabase project**

Run in the Supabase SQL editor (or via `supabase db push` if CLI is configured):

```bash
# If CLI is configured:
supabase db push

# Otherwise, paste the migration contents into the Supabase dashboard SQL editor.
```

Expected: query succeeds; `notifications` table visible in the Supabase table view.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260420_add_notifications.sql
git commit -m "feat(mylinks): add notifications table migration"
```

---

## Task 2: Build the `notifications` library module

**Files:**
- Create: `lib/mylinks/notifications.ts`

- [ ] **Step 1: Create the module**

```typescript
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export type NotificationType =
  | 'google_connected'
  | 'admin_user_connected_google'
  | 'suggestions_ready';

export interface NotificationRow {
  id: string;
  recipient_id: string;
  type: NotificationType;
  message: string;
  metadata: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

export interface CreateNotificationInput {
  recipientId: string;
  type: NotificationType;
  message: string;
  metadata?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput) {
  const client = await createServiceClient();
  const { data, error } = await client
    .from('notifications')
    .insert({
      recipient_id: input.recipientId,
      type: input.type,
      message: input.message,
      metadata: input.metadata ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('[mylinks/notifications] insert failed:', error);
    return null;
  }

  return data as NotificationRow;
}

export async function listNotifications(recipientId: string, limit = 50) {
  const client = await createServiceClient();
  const { data, error } = await client
    .from('notifications')
    .select('*')
    .eq('recipient_id', recipientId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[mylinks/notifications] list failed:', error);
    return [];
  }

  return (data ?? []) as NotificationRow[];
}

export async function countUnread(recipientId: string) {
  const client = await createServiceClient();
  const { count, error } = await client
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', recipientId)
    .is('read_at', null);

  if (error) {
    console.error('[mylinks/notifications] count failed:', error);
    return 0;
  }

  return count ?? 0;
}

export async function markRead(recipientId: string, notificationId: string) {
  const client = await createServiceClient();
  const { error } = await client
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('recipient_id', recipientId);

  if (error) {
    console.error('[mylinks/notifications] markRead failed:', error);
    return false;
  }

  return true;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/mylinks/notifications.ts
git commit -m "feat(mylinks): add notifications library module"
```

---

## Task 3: Add the notifications API routes

**Files:**
- Create: `app/api/mylinks/notifications/route.ts`
- Create: `app/api/mylinks/notifications/[id]/read/route.ts`

- [ ] **Step 1: Create the list endpoint**

```typescript
// app/api/mylinks/notifications/route.ts
import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { countUnread, listNotifications } from '@/lib/mylinks/notifications';

export async function GET(request: Request) {
  const user = await requireAuthenticatedUser();
  const url = new URL(request.url);
  const countOnly = url.searchParams.get('count') === '1';

  if (countOnly) {
    const unread = await countUnread(user.id);
    return NextResponse.json({ unread });
  }

  const notifications = await listNotifications(user.id);
  return NextResponse.json({ notifications });
}
```

- [ ] **Step 2: Create the mark-read endpoint**

```typescript
// app/api/mylinks/notifications/[id]/read/route.ts
import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { markRead } from '@/lib/mylinks/notifications';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { id } = await params;
  const ok = await markRead(user.id, id);
  return NextResponse.json({ ok });
}
```

- [ ] **Step 3: Smoke test manually**

Run `npm run dev`, sign in to MyLinks, then:

```bash
curl -i http://localhost:3000/api/mylinks/notifications \
  -H "Cookie: <copy from browser>"
```

Expected: `{ "notifications": [] }` (empty list, no errors).

- [ ] **Step 4: Commit**

```bash
git add app/api/mylinks/notifications
git commit -m "feat(mylinks): add notifications API routes"
```

---

## Task 4: Simplify `canUseGoogleDocs`

**Files:**
- Modify: `lib/mylinks/auth.ts`

- [ ] **Step 1: Replace the approval-gated check with a token-presence check**

Replace the existing `canUseGoogleDocs` function with:

```typescript
export async function canUseGoogleDocs(userId: string, email?: string | null) {
  if (isMylinksAdminEmail(email)) {
    return true;
  }

  const serviceClient = await createServiceClient();
  const { data } = await serviceClient
    .from('google_tokens')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  return !!data;
}
```

Keep `getGoogleAccessRequest` exported (the admin page still reads it for historical records) but no other route will call it in the happy path.

- [ ] **Step 2: Type-check the file**

Run: `npx tsc --noEmit`

Expected: no new errors in `lib/mylinks/auth.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/mylinks/auth.ts
git commit -m "refactor(mylinks): canUseGoogleDocs checks token presence, not approval"
```

---

## Task 5: Remove the approval gate from the Google auth routes

**Files:**
- Modify: `app/api/mylinks/auth/google/route.ts`
- Modify: `app/api/mylinks/auth/google/callback/route.ts`

- [ ] **Step 1: Update the start route**

Replace the contents of `app/api/mylinks/auth/google/route.ts` with:

```typescript
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { buildAuthUrl } from '@/lib/mylinks/google-auth';

export async function GET(request: Request) {
  const user = await requireAuthenticatedUser();
  void user;

  const state = randomBytes(16).toString('hex');
  const url = buildAuthUrl(state, new URL(request.url).origin);

  const response = NextResponse.redirect(url);
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
  });

  return response;
}
```

- [ ] **Step 2: Update the callback route**

Replace the contents of `app/api/mylinks/auth/google/callback/route.ts` with:

```typescript
import { NextResponse, type NextRequest } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { exchangeCodeForTokens } from '@/lib/mylinks/google-auth';
import { createNotification } from '@/lib/mylinks/notifications';
import { sendMylinksSlackNotification } from '@/lib/mylinks/slack';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('google_oauth_state')?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(`${origin}/projects/mylinks/settings?error=google_auth_failed`);
  }

  const user = await requireAuthenticatedUser();

  let tokens;
  try {
    tokens = await exchangeCodeForTokens(code, origin);
  } catch {
    return NextResponse.redirect(`${origin}/projects/mylinks/settings?error=google_token_failed`);
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();
  const serviceClient = await createServiceClient();
  await serviceClient.from('google_tokens').upsert(
    {
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt,
      scope: tokens.scope,
    },
    { onConflict: 'user_id' }
  );

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  let adminUserId: string | null = null;
  if (adminEmail) {
    const { data: adminProfile } = await serviceClient
      .from('profiles')
      .select('user_id')
      .eq('email', adminEmail)
      .maybeSingle();
    adminUserId = adminProfile?.user_id ?? null;
  }

  await createNotification({
    recipientId: user.id,
    type: 'google_connected',
    message: 'Your Google Docs connection is active. Auto-apply is available on approved suggestions.',
    metadata: { scope: tokens.scope },
  });

  if (adminUserId && adminUserId !== user.id) {
    await createNotification({
      recipientId: adminUserId,
      type: 'admin_user_connected_google',
      message: `${user.email ?? 'A user'} connected Google Docs.`,
      metadata: { user_id: user.id, user_email: user.email, scope: tokens.scope },
    });
  }

  void sendMylinksSlackNotification('New Google Docs connection', [
    `*User:* ${user.email ?? user.id}`,
    `*Time:* ${new Date().toISOString()}`,
    `*Scopes:* ${tokens.scope}`,
  ]);

  const response = NextResponse.redirect(`${origin}/projects/mylinks/settings?google_connected=1`);
  response.cookies.delete('google_oauth_state');
  return response;
}
```

- [ ] **Step 3: Manual sanity check**

Run `npm run dev`. Sign in as a non-admin user. Visit `/projects/mylinks/settings`. Click "Connect Google Docs" (button rendering is fixed in Task 7). Expected after that task: OAuth consent screen → redirect back with `?google_connected=1`.

- [ ] **Step 4: Commit**

```bash
git add app/api/mylinks/auth/google/route.ts app/api/mylinks/auth/google/callback/route.ts
git commit -m "feat(mylinks): remove approval gate from Google OAuth flow"
```

---

## Task 6: Delete the Google access request route

**Files:**
- Delete: `app/api/mylinks/google-access/request/route.ts`

- [ ] **Step 1: Delete the file**

```bash
rm app/api/mylinks/google-access/request/route.ts
```

Remove the now-empty parent directories:

```bash
rmdir app/api/mylinks/google-access/request
rmdir app/api/mylinks/google-access
```

(If `rmdir` fails because the directory contains other files, leave them in place — other routes may still use `google-access/<id>` for the legacy admin view. Verify with `ls app/api/mylinks/google-access/` first.)

- [ ] **Step 2: Verify no code references it**

Run: `grep -r "google-access/request" app lib components --include="*.ts" --include="*.tsx"`

Expected: no results.

- [ ] **Step 3: Commit**

```bash
git add app/api/mylinks/google-access
git commit -m "feat(mylinks): remove Google Docs access request route"
```

---

## Task 7: Simplify the settings page

**Files:**
- Modify: `app/projects/mylinks/(workspace)/settings/page.tsx`
- Delete: `components/mylinks/GoogleAccessRequestCard.tsx`

- [ ] **Step 1: Rewrite the settings page**

Replace the file contents with:

```typescript
import Link from 'next/link';
import { requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser();
  const profile = await requireProfile(user.id);
  const serviceClient = await createServiceClient();
  const { data: token } = await serviceClient
    .from('google_tokens')
    .select('scope, expires_at')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <Link href="/projects/mylinks/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">Settings</span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Manage your profile, Google Docs connection, and account.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Profile
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Name</p>
          <p className="text-lg font-semibold text-foreground">{profile.full_name || user.email}</p>
          <p className="mt-4 text-sm text-muted-foreground">Found via</p>
          <p className="text-sm text-foreground">{profile.found_via || 'Not set'}</p>
          <p className="mt-4 text-sm text-muted-foreground">Email</p>
          <p className="text-sm text-foreground">{user.email}</p>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Google Docs connection
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Connect your Google account to import Docs and auto-apply approved links. You can disconnect at any time from your Google account settings.
          </p>
          {token ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Connected. Current token expires at {new Date(token.expires_at).toLocaleString()}.
            </p>
          ) : null}
          <a
            href="/api/mylinks/auth/google"
            className="mt-5 inline-flex rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            {token ? 'Reconnect Google Docs' : 'Connect Google Docs'}
          </a>
        </div>

        <div className="rounded-[1.5rem] border border-border bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Account
          </p>
          <form action="/api/mylinks/auth/signout" method="POST" className="mt-5">
            <button className="text-sm font-semibold text-red-600 transition-colors hover:text-red-700">
              Sign out
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Delete the unused component**

```bash
rm components/mylinks/GoogleAccessRequestCard.tsx
```

- [ ] **Step 3: Verify no other code imports the deleted component**

Run: `grep -r "GoogleAccessRequestCard" app lib components --include="*.ts" --include="*.tsx"`

Expected: no results.

- [ ] **Step 4: Manual UI check**

Run `npm run dev`, sign in, visit `/projects/mylinks/settings`. Expected:
- No "Request access" button anywhere.
- A "Connect Google Docs" button always renders.
- After connecting, the button becomes "Reconnect Google Docs" and the expiry line appears.

- [ ] **Step 5: Commit**

```bash
git add app/projects/mylinks/"(workspace)"/settings/page.tsx components/mylinks/GoogleAccessRequestCard.tsx
git commit -m "feat(mylinks): drop approval card, connect Google directly from settings"
```

---

## Task 8: Build the paste sanitizer with unit tests

**Files:**
- Create: `lib/mylinks/paste-sanitize.ts`
- Create: `lib/mylinks/paste-sanitize.test.ts`

- [ ] **Step 1: Write the failing test file first**

```typescript
// lib/mylinks/paste-sanitize.test.ts
import { describe, expect, it } from 'vitest';
import { sanitizePastedHtml } from './paste-sanitize';

describe('sanitizePastedHtml', () => {
  it('keeps structural tags and strips inline styles', () => {
    const dirty = '<p style="color: red; font-family: Arial">Hello <strong style="font-weight: bold">world</strong></p>';
    expect(sanitizePastedHtml(dirty)).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('unwraps non-allowlisted tags but keeps their text', () => {
    const dirty = '<div><span>Plain <font color="red">text</font></span></div>';
    expect(sanitizePastedHtml(dirty)).toBe('Plain text');
  });

  it('drops script and iframe tags entirely', () => {
    const dirty = '<p>Safe</p><script>alert(1)</script><iframe src="x"></iframe>';
    expect(sanitizePastedHtml(dirty)).toBe('<p>Safe</p>');
  });

  it('removes event handlers on allowed tags', () => {
    const dirty = '<a href="https://example.com" onclick="steal()">link</a>';
    expect(sanitizePastedHtml(dirty)).toBe('<a href="https://example.com">link</a>');
  });

  it('keeps lists and list items', () => {
    const dirty = '<ul><li style="margin: 0">one</li><li>two</li></ul>';
    expect(sanitizePastedHtml(dirty)).toBe('<ul><li>one</li><li>two</li></ul>');
  });

  it('promotes Google Docs internal wrappers to plain paragraphs', () => {
    const dirty = '<b id="docs-internal-guid-123"><p class="x">Hello</p></b>';
    expect(sanitizePastedHtml(dirty)).toBe('<p>Hello</p>');
  });

  it('keeps headings 1 through 6', () => {
    const dirty = '<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4><h5>E</h5><h6>F</h6>';
    expect(sanitizePastedHtml(dirty)).toBe('<h1>A</h1><h2>B</h2><h3>C</h3><h4>D</h4><h5>E</h5><h6>F</h6>');
  });

  it('falls back to empty string on empty input', () => {
    expect(sanitizePastedHtml('')).toBe('');
  });

  it('keeps anchor hrefs but drops all other anchor attributes', () => {
    const dirty = '<a href="https://example.com" target="_blank" rel="noopener" data-x="y">link</a>';
    expect(sanitizePastedHtml(dirty)).toBe('<a href="https://example.com">link</a>');
  });
});
```

- [ ] **Step 2: Run the test to see it fail**

Run: `npm test -- lib/mylinks/paste-sanitize.test.ts`

Expected: the whole file fails to resolve `./paste-sanitize` (module not found).

- [ ] **Step 3: Implement the sanitizer**

```typescript
// lib/mylinks/paste-sanitize.ts
const BLOCK_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'HR', 'BR']);
const INLINE_TAGS = new Set(['STRONG', 'EM', 'U', 'S', 'A']);
const ALLOWED_TAGS = new Set([...BLOCK_TAGS, ...INLINE_TAGS]);
const DROP_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'NOSCRIPT']);

export function sanitizePastedHtml(html: string): string {
  if (!html) {
    return '';
  }

  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const body = doc.body;
  cleanNode(body);
  return body.innerHTML.trim();
}

function cleanNode(node: Node) {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) {
      child.parentNode?.removeChild(child);
      continue;
    }

    const el = child as Element;
    const tag = el.tagName.toUpperCase();

    if (DROP_TAGS.has(tag)) {
      el.parentNode?.removeChild(el);
      continue;
    }

    cleanNode(el);

    if (!ALLOWED_TAGS.has(tag)) {
      unwrap(el);
      continue;
    }

    stripAttributes(el, tag);
  }
}

function unwrap(el: Element) {
  const parent = el.parentNode;
  if (!parent) {
    return;
  }
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function stripAttributes(el: Element, tag: string) {
  const attributes = Array.from(el.attributes);
  for (const attribute of attributes) {
    if (tag === 'A' && attribute.name === 'href') {
      continue;
    }
    el.removeAttribute(attribute.name);
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- lib/mylinks/paste-sanitize.test.ts`

Expected: all 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/mylinks/paste-sanitize.ts lib/mylinks/paste-sanitize.test.ts
git commit -m "feat(mylinks): add paste HTML sanitizer with allowlist"
```

---

## Task 9: Wire the sanitizer into `RichTextEditor`

**Files:**
- Modify: `components/mylinks/RichTextEditor.tsx`

- [ ] **Step 1: Update the component**

Replace the file contents with:

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { sanitizePastedHtml } from '@/lib/mylinks/paste-sanitize';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Paste the article draft here...',
  className = '',
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function emitChange() {
    onChange(editorRef.current?.innerHTML ?? '');
  }

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const html = event.clipboardData.getData('text/html');
    const text = event.clipboardData.getData('text/plain');
    const clean = html ? sanitizePastedHtml(html) : escapePlainText(text);

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const template = document.createElement('template');
    template.innerHTML = clean;
    const fragment = template.content;
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);

    if (lastNode) {
      const newRange = document.createRange();
      newRange.setStartAfter(lastNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    emitChange();
  }

  function handleBlur() {
    setFocused(false);
    if (editorRef.current) {
      const cleaned = sanitizePastedHtml(editorRef.current.innerHTML);
      if (cleaned !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = cleaned;
      }
    }
    emitChange();
  }

  const isEmpty = !value || value === '<br>' || value === '<div><br></div>' || value === '<p><br></p>';

  return (
    <div className="relative">
      {isEmpty && !focused ? (
        <div className="pointer-events-none absolute inset-x-4 top-3 text-sm text-muted-foreground">
          {placeholder}
        </div>
      ) : null}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onPaste={handlePaste}
        onBlur={handleBlur}
        onFocus={() => setFocused(true)}
        className={`min-h-72 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 outline-none transition-colors focus:border-accent ${className}`}
      />
    </div>
  );
}

function escapePlainText(text: string) {
  if (!text) {
    return '';
  }
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p>${line}</p>`)
    .join('');
}
```

- [ ] **Step 2: Manual paste check**

Run `npm run dev`, go to `/projects/mylinks/projects/<any>/articles/new`. Paste a sample from Google Docs (bold, italic, heading, bullet list, link). Expected: the editor shows cleanly formatted text with no inline styles, no stray `<span>` wrappers, and no color changes.

- [ ] **Step 3: Commit**

```bash
git add components/mylinks/RichTextEditor.tsx
git commit -m "feat(mylinks): sanitize pasted content in RichTextEditor"
```

---

## Task 10: Build the `NotificationBell` component

**Files:**
- Create: `components/mylinks/NotificationBell.tsx`

- [ ] **Step 1: Create the component**

```typescript
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch('/api/mylinks/notifications?count=1');
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { unread?: number };
        if (!cancelled) {
          setUnread(data.unread ?? 0);
        }
      } catch {
        // Silent — bell is non-critical UI.
      }
    }

    load();
    const interval = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <Link
      href="/projects/mylinks/notifications"
      className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
      aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
    >
      <span aria-hidden="true">🔔</span>
      <span>Inbox</span>
      {unread > 0 ? (
        <span
          className="ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
          style={{ background: 'var(--accent)' }}
        >
          {unread > 99 ? '99+' : unread}
        </span>
      ) : null}
    </Link>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/mylinks/NotificationBell.tsx
git commit -m "feat(mylinks): add NotificationBell nav component"
```

---

## Task 11: Build the notifications inbox page

**Files:**
- Create: `app/projects/mylinks/(workspace)/notifications/page.tsx`

- [ ] **Step 1: Create the server page**

```typescript
import Link from 'next/link';
import { requireAuthenticatedUser, requireProfile } from '@/lib/mylinks/auth';
import { listNotifications } from '@/lib/mylinks/notifications';
import { NotificationsList } from './NotificationsList';

export default async function NotificationsPage() {
  const user = await requireAuthenticatedUser();
  await requireProfile(user.id);
  const notifications = await listNotifications(user.id);

  return (
    <div className="min-h-screen bg-[var(--muted)]/45">
      <nav className="border-b border-border bg-background px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <Link href="/projects/mylinks/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium text-foreground">Notifications</span>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Updates about your Google Docs connection, generated suggestions, and other workspace events.
          </p>
        </div>

        <NotificationsList initialNotifications={notifications} />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create the client list component**

Create `app/projects/mylinks/(workspace)/notifications/NotificationsList.tsx`:

```typescript
'use client';

import { useState } from 'react';
import type { NotificationRow } from '@/lib/mylinks/notifications';

interface Props {
  initialNotifications: NotificationRow[];
}

export function NotificationsList({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);

  async function handleMarkRead(id: string) {
    const response = await fetch(`/api/mylinks/notifications/${id}/read`, {
      method: 'POST',
    });
    if (!response.ok) {
      return;
    }
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read_at: new Date().toISOString() }
          : notification
      )
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-border bg-background p-10 text-center">
        <p className="text-sm text-muted-foreground">No notifications yet.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {notifications.map((notification) => {
        const isRead = !!notification.read_at;
        return (
          <li
            key={notification.id}
            className={`rounded-[1.25rem] border border-border p-5 transition-colors ${
              isRead ? 'bg-[var(--muted)]/40' : 'bg-background'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{notification.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              {!isRead ? (
                <button
                  type="button"
                  onClick={() => handleMarkRead(notification.id)}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mark read
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 3: Manual UI check**

Run `npm run dev`. Connect Google Docs through the settings page (after Task 7). Visit `/projects/mylinks/notifications`. Expected: one notification titled "Your Google Docs connection is active." Click "Mark read". Expected: the notification tint changes and the button disappears.

- [ ] **Step 4: Commit**

```bash
git add app/projects/mylinks/"(workspace)"/notifications
git commit -m "feat(mylinks): add notifications inbox page"
```

---

## Task 12: Mount `NotificationBell` in the dashboard nav

**Files:**
- Modify: `app/projects/mylinks/(workspace)/dashboard/page.tsx`

- [ ] **Step 1: Insert the bell into the nav**

Find this block (around lines 28-39):

```typescript
          <div className="flex items-center gap-4">
            {isMylinksAdminEmail(user.email) ? (
              <Link
                href="/projects/mylinks/admin/google-access"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Google approvals
              </Link>
            ) : null}
            <UserMenu email={user.email} />
          </div>
```

Replace with:

```typescript
          <div className="flex items-center gap-4">
            <NotificationBell />
            {isMylinksAdminEmail(user.email) ? (
              <Link
                href="/projects/mylinks/admin/google-access"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Google approvals
              </Link>
            ) : null}
            <UserMenu email={user.email} />
          </div>
```

Add the import at the top of the file (after the other component imports):

```typescript
import { NotificationBell } from '@/components/mylinks/NotificationBell';
```

- [ ] **Step 2: Manual UI check**

Run `npm run dev`, visit `/projects/mylinks/dashboard`. Expected: "🔔 Inbox" appears in the nav. If you've connected Google Docs since Task 5, the badge shows "1" until you mark the notification read on the notifications page.

- [ ] **Step 3: Commit**

```bash
git add app/projects/mylinks/"(workspace)"/dashboard/page.tsx
git commit -m "feat(mylinks): mount NotificationBell in workspace dashboard"
```

---

## Task 13: End-to-end smoke test and README note

**Files:**
- Modify: `docs/mylinks-integration.md`

- [ ] **Step 1: Run the full flow manually**

1. `npm run dev`
2. Sign in as a non-admin test user.
3. Visit `/projects/mylinks/settings`. Expected: "Connect Google Docs" button (no "Request access").
4. Click it. Go through the Google OAuth consent flow using a Google account that isn't in the Google Cloud test users list (or confirm this works for your configured test users). Expected: redirect back with `?google_connected=1`.
5. Admin Slack channel: expected to receive a "New Google Docs connection" message with the user's email, timestamp, and scopes.
6. User dashboard: expected "🔔 Inbox (1)" badge.
7. Visit `/projects/mylinks/notifications`. Expected: one entry, "Your Google Docs connection is active." Mark it read. Badge clears on next dashboard load (within 60 seconds).
8. Admin user dashboard: expected "Inbox (1)" showing `<email> connected Google Docs.`
9. Go to a new article page, paste from Google Docs, and verify the pasted content no longer has inline colors, odd wrappers, or extra spans.

- [ ] **Step 2: Update the integration docs**

Append to `docs/mylinks-integration.md`:

```markdown
## 2026-04-20 update

- The "Request access" approval workflow is removed.
- Any authenticated MyLinks user can click "Connect Google Docs" in settings and authorize their own Google account.
- Every new connection fires a Slack notification (`MYLINKS_SLACK_WEBHOOK`) and writes two rows into the new `notifications` table: one for the connecting user, one for the admin identified by `ADMIN_EMAIL`.
- Pasted draft content is now sanitized against an allowlist (`p`, `h1`–`h6`, `ul`, `ol`, `li`, `blockquote`, `hr`, `br`, `strong`, `em`, `u`, `s`, `a`). Inline styles and non-allowed tags are stripped on paste and again on blur.
- The `google_access_requests` table is still in the database for historical records but is no longer written to. It can be dropped in a later cleanup migration.
```

- [ ] **Step 3: Commit**

```bash
git add docs/mylinks-integration.md
git commit -m "docs(mylinks): record 2026-04-20 redesign changes"
```

---

## Self-Review Results

**Spec coverage:**
- Remove approval gate → Tasks 4, 5, 6, 7
- Slack notification on connect → Task 5
- Paste cleanup → Tasks 8, 9
- In-app notification inbox → Tasks 1, 2, 3, 10, 11, 12
- Documentation + end-to-end verification → Task 13

Every spec requirement maps to at least one task. No gaps.

**Placeholder scan:** All code blocks are complete. No "TODO", "TBD", or "handle edge cases" stubs. Commit messages are concrete.

**Type consistency:** `NotificationRow`, `NotificationType`, and `CreateNotificationInput` are defined in Task 2 and used consistently by Tasks 3, 11. `sanitizePastedHtml` has a single signature (`string → string`) used in Tasks 8 and 9. `createNotification` argument shape matches across Tasks 2 and 5.

**Out-of-scope guardrails:** No split-screen article view, no onboarding wizard, no notification preferences. These are explicitly deferred in the spec.
