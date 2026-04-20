# MyLinks Redesign — Access Flow, Formatting, Notifications

**Date:** 2026-04-20
**Status:** Design approved, ready for implementation planning
**Scope:** Fix four interconnected issues in MyLinks workspace

---

## Problem Statement

MyLinks currently has four UX/product issues blocking regular user adoption:

1. **Approval gate blocks Google Docs use.** Users must submit a "Request Access" form and wait for the admin (Peace) to manually approve them before they can connect Google Docs. This is unnecessary friction — users can authenticate with their own Google accounts without admin intervention.
2. **Slack notifications are admin-centric and vague.** The current Slack message says "Review in the integrated admin dashboard," but regular users have no dashboard to check status, and the admin message lacks specifics.
3. **Pasted content has broken formatting.** The `RichTextEditor` component stores raw `innerHTML` from a `contentEditable` div, which includes browser-specific artifacts, inline styles, and inconsistent wrapper tags. Pasted Google Docs content looks broken compared to the clean import path.
4. **No user-facing status visibility.** Regular users cannot see their own request status, their connection state, or any action history. The admin dashboard at `/projects/mylinks/admin/google-access` is gated by `isMylinksAdminEmail()`.

## Goals

- Remove the approval gate for Google Docs integration.
- Notify the admin via Slack when a user connects Google Docs (informational, not blocking).
- Normalize pasted content through an allowlist-based HTML cleanup pipeline.
- Give users an in-app notification inbox so they can see their own state.
- Keep the change scope focused — do not redesign every MyLinks surface.

## Non-Goals

- Rebuilding the suggestion generation pipeline (Gemini integration stays).
- Replacing the Supabase backend.
- Adding multi-tenancy or team features.
- Full rewrite of the article view (split-screen suggestion panel is a stretch goal, not required here).

---

## Design Overview

### 1. Remove the Google Docs Approval Gate

**Current:** `canUseGoogleDocs(userId, email)` checks `google_access_requests.status === 'approved'` before allowing the OAuth flow.

**New:** Remove the approval check entirely. Any authenticated MyLinks user can click "Connect Google Docs" and go through Google's OAuth flow directly. The presence of a token in `google_tokens` becomes the single source of truth for whether a user has Google Docs connected.

**Files affected:**
- `lib/mylinks/auth.ts` — simplify `canUseGoogleDocs` to check for token presence (returns true for admin, otherwise true if a row exists in `google_tokens` for the user). Remove `getGoogleAccessRequest` from the auth module.
- `app/api/mylinks/auth/google/route.ts` — remove the `canUseGoogleDocs` precondition.
- `app/api/mylinks/auth/google/callback/route.ts` — remove the `canUseGoogleDocs` precondition.
- `app/projects/mylinks/(workspace)/settings/page.tsx` — remove `GoogleAccessRequestCard`, always show "Connect Google Docs" button.

**Data migration:**
- Keep the `google_access_requests` table for historical record but stop writing to it.
- Existing "pending" and "rejected" requests become irrelevant — users can simply connect now.
- A follow-up cleanup can drop the table after verification.

### 2. Slack Notification on Google Docs Connection

**Current:** Slack fires when a user submits a "Request Access" form. Message says "Review in the integrated admin dashboard."

**New:** Slack fires when a user successfully completes Google OAuth and a token is saved. Message is specific and informational:

```
🔗 MyLinks: New Google Docs connection
*User:* jane@company.com
*Name:* Jane Smith
*Time:* 2026-04-20 14:32 UTC
*Scopes:* documents, drive.readonly
```

**Files affected:**
- `app/api/mylinks/auth/google/callback/route.ts` — add `sendMylinksSlackNotification` call after `google_tokens.upsert` succeeds.
- `app/api/mylinks/google-access/request/route.ts` — delete this route.
- `lib/mylinks/slack.ts` — no changes needed (already a thin wrapper).

### 3. Paste Cleanup in RichTextEditor

**Current:** `editorRef.current.innerHTML = value` stores whatever the browser pastes, including:
- Inline styles (`style="color: rgb(0,0,0); font-family: Arial"`)
- Google Docs–specific wrappers (`<b id="docs-internal-guid-…">`)
- Empty divs and `<span>` wrappers
- Browser-inserted `<font>` tags

**New:** Intercept the `paste` event, read `text/html` from the clipboard, run it through an allowlist cleaner, then insert the cleaned HTML. Also sanitize on change.

**Allowlist:**
- **Structural:** `p`, `h1`–`h6`, `ul`, `ol`, `li`, `blockquote`, `hr`, `br`
- **Inline:** `strong`, `em`, `u`, `s`, `a` (href only)
- **Strip:** all `style`, `class`, `id` attributes; all other tags (unwrap to children)

**Implementation approach:**
- Add `onPaste` handler that calls `event.preventDefault()`, grabs `clipboardData.getData('text/html')` (fallback to `'text/plain'`), runs through a sanitizer, and inserts via `document.execCommand('insertHTML', …)` or a DOM range.
- Sanitizer lives in new file `lib/mylinks/paste-sanitize.ts` — isolated, testable.
- On blur/change, re-sanitize the full editor contents to catch anything that slipped through (e.g., drag-and-drop).

**Files affected:**
- `components/mylinks/RichTextEditor.tsx` — add paste handler, call sanitizer.
- `lib/mylinks/paste-sanitize.ts` — new file: allowlist cleaner using DOMParser.
- `lib/mylinks/paste-sanitize.test.ts` — new file: unit tests for fixture HTML (Google Docs paste, Word paste, plain text).

### 4. In-App User Notification Inbox

**Current:** Users have no way to see their own state. Only Slack (admin only) receives updates.

**New:** A `notifications` table backs an in-app inbox. Users see their own notifications (Google connected, suggestions ready, article created). Admin sees admin-directed notifications (user connected Google Docs).

**Schema:**

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX notifications_recipient_unread_idx
  ON notifications (recipient_id, created_at DESC)
  WHERE read_at IS NULL;
```

**Notification types (initial):**
- `google_connected` — recipient is the user, fires on OAuth callback.
- `admin_user_connected_google` — recipient is admin, fires on OAuth callback.
- `suggestions_ready` — recipient is the user, fires after Gemini call completes.

**UI surfaces:**
- Bell icon in `/projects/mylinks/dashboard` nav, badge for unread count.
- `/projects/mylinks/notifications` page — list view, mark-as-read on click.

**Files affected:**
- `supabase/migrations/20260420_add_notifications.sql` — new migration.
- `lib/mylinks/notifications.ts` — new file: `createNotification`, `listForUser`, `markRead`.
- `app/api/mylinks/notifications/route.ts` — new GET endpoint.
- `app/api/mylinks/notifications/[id]/read/route.ts` — new POST endpoint.
- `components/mylinks/NotificationBell.tsx` — new client component.
- `app/projects/mylinks/(workspace)/notifications/page.tsx` — new page.
- `app/projects/mylinks/(workspace)/dashboard/page.tsx` — mount `NotificationBell` in nav.
- `app/api/mylinks/auth/google/callback/route.ts` — call `createNotification` on success (two notifications: one for user, one for admin).

---

## Components & Boundaries

Each unit has one clear purpose, a defined interface, and can be tested in isolation.

| Unit | Purpose | Depends on |
|------|---------|-----------|
| `canUseGoogleDocs` | True/false: does the user have Google Docs access? | `google_tokens` table |
| `paste-sanitize.ts` | Pure function: dirty HTML in, clean HTML out | DOMParser (browser) |
| `RichTextEditor` | Contentful div that normalizes input | `paste-sanitize` |
| `notifications.ts` (lib) | CRUD for the notifications table | Supabase service client |
| `NotificationBell` | Client component: fetches unread count, renders badge | `/api/mylinks/notifications` |
| `sendMylinksSlackNotification` | Fire-and-forget webhook POST | env var `MYLINKS_SLACK_WEBHOOK` |

Every unit is consumable through its interface without reading internals. `paste-sanitize` is the most testable — pure input/output.

---

## Data Flow

**Connecting Google Docs (new flow):**

```
User clicks "Connect Google Docs"
  → GET /api/mylinks/auth/google
  → redirect to Google OAuth consent
  → user authorizes
  → GET /api/mylinks/auth/google/callback
  → exchange code for tokens
  → upsert into google_tokens
  → createNotification({ recipient_id: user.id, type: 'google_connected' })
  → createNotification({ recipient_id: adminId, type: 'admin_user_connected_google' })
  → sendMylinksSlackNotification(…)
  → redirect to /projects/mylinks/settings?google_connected=1
```

**Pasting content (new flow):**

```
User pastes into RichTextEditor
  → onPaste handler fires, preventDefault()
  → read clipboard.getData('text/html')
  → sanitize(html) → allowlist-filtered HTML
  → insert into editor at cursor position
  → onChange fires with cleaned HTML
  → saved to articles.content_html when form submits
```

**Viewing notifications:**

```
User visits /projects/mylinks/dashboard
  → NotificationBell renders, calls GET /api/mylinks/notifications?unread=1
  → badge shows unread count
  → user clicks bell → navigates to /projects/mylinks/notifications
  → list renders, clicking a notification marks it read
```

---

## Error Handling

- **Google OAuth failure:** redirect to `/settings?error=google_auth_failed` (unchanged).
- **Token exchange failure:** redirect with `error=google_token_failed` (unchanged).
- **Slack webhook failure:** log and continue. Never block the OAuth callback on Slack.
- **Notification insert failure:** log and continue. Never block OAuth on notifications.
- **Paste sanitizer failure (e.g., malformed HTML):** fall back to plain text from clipboard.
- **Notifications API failure on dashboard:** bell shows no badge, no error toast (graceful degradation).

---

## Testing

- **Paste sanitizer** (`lib/mylinks/paste-sanitize.test.ts`): fixtures for Google Docs paste, Word paste, plain text, malicious input (scripts, iframes, event handlers).
- **Google callback route:** integration test — mock token exchange, verify token saved, notifications created, Slack called.
- **Notifications API:** integration test — creates a notification, lists for user, marks read, verifies unread count changes.
- **Settings page:** snapshot/visual test — verify no "Request access" button when approval flow is removed.

---

## Migration & Rollout

1. Apply the `notifications` table migration.
2. Deploy code changes in one release (feature is small enough).
3. Monitor Slack for first real user connection to verify notification fires.
4. Follow-up PR (separate): drop `google_access_requests` table after one week of no writes.

No feature flag needed — the change is strictly an improvement and the old approval workflow was blocking users.

---

## Out of Scope (Future Work)

- Split-screen article view with persistent suggestion sidebar.
- Onboarding wizard (3-step: project → article → Google).
- Notification preferences (email, digest modes).
- Admin view aggregating all user activity.
