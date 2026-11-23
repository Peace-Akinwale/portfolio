# MyLinks subdomain

Use the existing portfolio Railway web service and Supabase database. Peace declined an additional service. Railway Hobby allows two custom domains per service; the current root and www entries fill both slots. Replace the www-only entry with a wildcard entry that covers www and mylinks. Preserve all existing explicit app DNS records.

## Routing

- mylinks.peaceakinwale.com opens the authenticated workspace.
- Clean workspace paths rewrite to the existing /projects/mylinks route files.
- Existing app links on the MyLinks host redirect to clean paths; legacy portfolio URLs continue working, including old login callbacks.
- The public case study remains at peaceakinwale.com/projects/mylinks.
- Session cookies stay host-only. The new origin requires signing in again.
- Add the precise new origin and callback to Google, and the precise email callback to Supabase. Preserve existing allowlist entries.
- Block indexing on the app host.

## Verification and rollback

Unit tests cover host isolation, path rewriting, query preservation, callbacks, overview links, and indexing. Verify the built login route and then live Google sign-in, project navigation, the existing saved article, www redirect, and the unaffected root/Read Aloud/ContentDB hosts.

Before changing the Railway domain, save the old www entry and its DNS target. If wildcard verification fails, recreate www and restore its DNS records. Do not change MX, mail-related TXT records, the root ALIAS, or other app CNAME records.

## Infrastructure verified

- Replaced the www-only Railway domain with `*.peaceakinwale.com` on the same web service.
- Namecheap: wildcard CNAME and www CNAME point to `4wm4z5i5.up.railway.app`; `_acme-challenge` points to `4wm4z5i5.authorize.railwaydns.net`.
- Existing root ownership TXT also verifies the wildcard. Railway reports both DNS records propagated and the certificate valid.
- HTTPS checks: root 200; www 308 to the root; Read Aloud 307 to its login; ContentDB 200; MyLinks login 200.
- Google OAuth: added `https://mylinks.peaceakinwale.com` and its `/api/mylinks/auth/google/callback` redirect. Existing origins and redirects preserved. Console confirmed saved.
- Supabase: added the two exact new-origin callback URLs (`/projects/mylinks/auth/callback` and `/auth/callback`), retaining the existing localhost and portfolio callbacks and the shared Site URL. Read back four saved entries. No test email sent.
- Google sign-in completed successfully on the new host; existing projects loaded and navigation opened a clean `/projects/<id>` URL.
- The saved AEO article opened at `/articles/<id>` with the same eight suggestions, four approved and four pending. No app data changed during verification. Its pre-existing Google Docs connection-expiry notice remains; no document writes or reconnection were attempted.
