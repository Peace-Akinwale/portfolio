# Google verification for Peace Akinwale apps

## Goal and scope

Peace requested verified Google sign-in across all personal apps, beginning with Fanlight, including MyLinks, ContentDB, Read Aloud and Draft Scorer's Docs permissions. Use Peace's accounts and branding only. Preserve existing app membership, invitation and spending rules. Do not overwrite work in other checkouts.

## Verified starting state — 25 November 2026

- Shared project `gen-lang-client-0992545711` is External / In production. Brand is `mylinks`; home, privacy and terms fields are empty. Clients: MyLinks web, Draft Scorer Mac, Fanlight production.
- Fanlight's dedicated client has the correct origin and callback. Real Google sign-in reached `/projects` as Peace in the Default workspace.
- MyLinks client includes the portfolio, MyLinks, Aloud and Read Aloud origins. Its redirect URIs are on owned domains and localhost. An old unused `mylinks-chi.vercel.app` authorized domain remains on the brand.
- Shared data access declares `documents` (sensitive, unverified) and `drive.file` (non-sensitive). MyLinks reads imported Docs and writes approved links. Draft Scorer currently requests the same scopes although its shipped feature only reads Docs.
- ContentDB uses its separate `contentdb-513309` project and a Supabase redirect flow. Its brand is unverified and its domain list includes Railway and Supabase hosts. It needs a working sign-in on its own origin before removing rollback URLs.
- Search Console now confirms domain-wide ownership of `peaceakinwale.com` via a DNS TXT record added at Namecheap. This covers subdomains; keep the verification record in place. Existing routing records were preserved.
- The live Fanlight privacy/terms pages cover Fanlight only. `/privacy` and `/terms` on the main website return 404.

## Implementation

1. Add public `/apps`, `/privacy` and `/terms` pages using the site's existing layout. Describe each personal app, distinguish basic sign-in from optional Docs permissions, disclose storage, model processing and revocation. Add modest footer links. No new UI framework or authentication dependency.
   - Live MyLinks settings incorrectly state that the project is still in Testing and invent a seven-day expiry from token age. Remove this countdown and the same article banner; preserve actual `reconnect_required` errors from Google. A stored token is not proof that it is currently usable.
2. Prepare ContentDB's Google Identity Services sign-in with nonce validation, its existing Supabase provider and existing profile/invite handling. Test failures, routing and cleanup. Retain the old callback temporarily for in-flight sign-ins and rollback.
3. Preserve Draft Scorer's full Docs permission. Peace clarified on 25 November that it will add a new tab containing new content to a selected Google Doc. The earlier read-only patch has been withdrawn. Include the new-tab workflow in review evidence when it is implemented; do not claim it already works. Preserve existing tokens and scopes.
4. Verify page rendering and local tests. Review exact changes before deployment where current repository instructions require it. Keep other agents' work untouched.
5. Once public pages are live, configure the shared brand as Peace Akinwale with `/apps`, `/privacy`, `/terms`; preserve required scopes. Verify domain ownership and remove only confirmed unused domains. Run Verify branding, then Publish branding after approval.
6. Complete real sign-in checks on each app. For sensitive scopes, demonstrate the actual consent and Docs features with non-private test data, supply a scope justification and unlisted video, then submit data-access review. Google approval remains pending until observed.

## Completion evidence

- Google shows the published verified brand, not merely a saved draft.
- Fanlight, MyLinks, ContentDB and Read Aloud each sign in successfully; existing membership and budgets remain intact.
- Draft Scorer imports a private test Doc after consent; MyLinks imports a test Doc and applies a selected link.
- Sensitive scopes show approved status or are explicitly reported as awaiting Google's review.

## References

- https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification
- https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification

Brand verification and sensitive-scope verification are different gates. In-production status does not remove the unverified sensitive-scope user cap. Separate clients in one project share the project brand; they do not have to share a secret.
