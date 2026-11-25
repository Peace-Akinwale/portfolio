# Google verification submission preparation

Status: prepared, not submitted. Neither Google project has verified/published Peace Akinwale branding yet. Domain ownership is verified. Website changes remain local.

## Brand configuration

Shared project: `gen-lang-client-0992545711` (currently named `mylinks`). Proposed public brand: **Peace Akinwale**. Support/developer contact: the existing Peace account. Homepage: `https://peaceakinwale.com/apps`; privacy: `https://peaceakinwale.com/privacy`; terms: `https://peaceakinwale.com/terms`. Publish and check these pages first. No logo is required for the initial name/domain verification; do not invent a logo.

Keep separate OAuth clients for MyLinks web, Fanlight production and Draft Scorer Mac. Read Aloud uses the MyLinks web client. Each app retains its own account-access rules. Remove the old `mylinks-chi.vercel.app` authorized brand domain only after confirming no current OAuth client or policy URL uses it.

ContentDB remains in `contentdb-513309`, using its existing client/provider. Proposed brand: **Peace Akinwale — ContentDB**, with the shared public apps homepage and policy/terms pages, which link to ContentDB's existing app-specific policy. Verify/publish this project separately after its own-origin sign-in works. Do not remove provider callback URLs before that test.

## Saved scope declarations — 25 November

- Both projects now declare `openid`, `userinfo.email` and `userinfo.profile`, matching their basic sign-in behavior. Google showed “Data access changes saved” for both.
- Shared project retains `documents` (sensitive, unverified) and `drive.file` (non-sensitive). No scope removed. No `documents.readonly` scope added.
- ContentDB declares no Docs, Drive, sensitive or restricted scopes.
- Adding declarations did not grant a new user authorization or change any client secret.

## Scope justification draft (review before submission)

MyLinks imports an existing Google Doc selected by its URL, reads the text to suggest internal links, and writes only links the user approves. Read-only Docs access cannot apply approved links. The by-URL workflow supports documents the connected account can access without a prior Picker grant, so drive.file alone cannot cover those existing documents. Draft Scorer also imports a user-selected Doc by URL. Its planned write-back feature adds user-approved content in a new tab of that Doc; record this feature only once implemented. Basic identity scopes identify the signed-in account. The existing drive.file permission is retained while its account-identification use is reviewed. Neither app automatically imports an account's entire document collection.

Do not submit a future feature as working. Before submitting, remove the future-tense sentence if the new-tab workflow is still unavailable and resolve the review scope with Peace. MyLinks already requires write access; that does not substitute for evidence of Draft Scorer's own workflow.

## Video and live acceptance evidence

Use an ordinary test document written for the demo, with no client/private content. Google requests a YouTube video showing every OAuth client in the project, the consent screen, the app/domain/client identity and the actual requested-permission features.

1. Show public apps/privacy/terms pages and the verified, published brand.
2. Show Fanlight sign-in and arrival at the correct account/workspace. It requests only basic identity.
3. Show MyLinks sign-in, its separate Google Docs connect step, import of the test Doc, review of suggested links, and an explicitly approved link write visible in Google Docs.
4. Show Read Aloud's sign-in using the shared web client and the existing account library. Do not play/generate audio or change usage limits merely for this demo.
5. Show Draft Scorer's Desktop-client consent, import of the test Doc and, once available, adding approved new content in a new tab. Confirm the original tab remains intact.
6. Record ContentDB sign-in separately for its own project; confirm the correct existing account/workspace and invitation behavior. No Docs permission belongs in that project's consent.

Any consent action that newly grants access to private Docs needs Peace's action-time confirmation. Do not revoke shared-project access to force a video, since it can invalidate other clients' tokens. Do not bypass a browser security interstitial. No unlisted video has been uploaded or submitted yet.

## Deployment preparation and validation

- Portfolio worktree: `/Users/akinwale/AKINWALE/portfolio-google-verification`, branch `codex/google-brand-verification`, based on live `48c8c6b`. Adds public pages/footer links and removes MyLinks' false Testing-mode expiry messages. TypeScript passed; 200 tests passed, 18 skipped; production build passed on retry. The installed Next.js 16.4.4 emitted a security upgrade advisory; no framework upgrade was performed.
- ContentDB worktree: `/Users/akinwale/AKINWALE/contentdb-google-verification`, branch `codex/google-brand-signin`, based on live `e1cbbe2`. Reuses the existing Google client and Supabase provider with nonce-checked Google Identity Services. All 54 web tests passed, build passed, and the local Google button rendered. The local build uses placeholder Supabase configuration and is not proof of a live login.
- Set ContentDB's public build-time `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to the existing ContentDB client ID. Configure its real origin on that client. Deploy only the web service; API, migrations and other services are outside this change. Keep old provider callbacks during rollout.
- Draft Scorer worktree: `/Users/akinwale/AKINWALE/draft-scorer-google-verification`. Code is unchanged from its base after Peace clarified the future write-back feature. Only the verification plan remains. Do not restart/merge into the concurrently used checkout.
- ContentDB `CLAUDE.md` says “No deploys from a session.” Peace explicitly approved “Deploy both prepared changes” on 25 November after reviewing the local previews. This grants the exception for these portfolio and ContentDB web changes. Deployment and live checks are now authorized.
- Before deployment, portfolio upstream advanced to `57fec0b`, adding only a Fanlight case-study log. Incorporate that commit so this release does not roll it back. ContentDB upstream remains `e1cbbe2`.

## Remaining inventory

Fanlight has a successful fresh Google sign-in in this session. MyLinks and Read Aloud currently have existing signed-in sessions; those are not fresh-flow tests. ContentDB awaits deployment. Draft Scorer's real consent/import and future write-back remain untested here. Garde also contains Google sign-in code in an older checkout; its current deployment/project ownership has not been verified. Other inspected personal app source trees did not expose a Google sign-in implementation in the targeted search; this is not proof that all deployments have been inventoried.

## References

- https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification
- https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification
- https://supabase.com/docs/guides/auth/social-sign-in/auth-google
