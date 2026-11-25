# Fanlight, personal product: case study log

A running log of Fanlight, Peace's own tool for AI search answers. A Chrome extension relays what ChatGPT, Claude and Perplexity already sent to her browser, and the app reports the fan-out searches and sources behind each answer. Updated as deliverables land. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Peace Akinwale (own product).
- **Stack:** Next.js app and a Chrome extension in one npm workspace, Postgres on Supabase, hosted on Railway at `fanlight.peaceakinwale.com`, Google sign-in only.
- **Repo:** `Peace-Akinwale/fanlight` (private), branch `main`.

---

## 2026-11-25, first production deploy, and deploys gated so a red build or a bad variable can't ship

Written the same day, from the session's commands, the repo's git log and CI runs, and Railway's deployment list. The app was built before this session. This was the day it went live, with a pasted step-by-step setup guide as the brief.

### What shipped

- Fanlight live at `https://fanlight.peaceakinwale.com`: health check 200, a Let's Encrypt certificate, and the login page handing off to Google with the right callback.
- Build, start and health-check commands set on the Railway service itself, plus the repo connection, the custom domain and DNS (a CNAME and a verification TXT record).
- PR #1, merged as `a947762`:
  - a startup config check that runs before migrations and names a bad variable in one log line without printing its value (7 unit tests)
  - CI now creates the test database it was missing and runs typecheck and build
  - Railway's "Wait for CI" turned on
- Proof the gate works: the merge commit sat WAITING on Railway until CI passed on `main`, then deployed. CI on the two commits before it had failed.

### Decisions worth recording

- **Rejected one step of the brief.** The guide said to delete the main site's `*.peaceakinwale.com` domain to free the subdomain. That wildcard also serves `www` and another live app, and the hosting plan allows only two custom domains per service, so it couldn't be split up. Instead: remove it, add the new domain, and re-add it straight away.
- **Secrets stayed in Peace's hands.** Asked to paste a database password and API keys into the host, the agent declined and wrote small scripts instead. Peace ran them. They read the clipboard, test the database login first, and set the values without printing them.
- **"Never fail again" reframed honestly.** Peace asked that deploys never fail again. No one can promise that. What shipped instead: a failing commit can't deploy, a bad variable fails with a plain message, and a failed deploy leaves the live version running.
- **Checked before resetting a shared password.** The database is shared with two other apps. Before Peace reset the main database password, every service on the host was checked for which database user it logs in as. Only Fanlight used that one.

### Frictions and course corrections

- **Re-adding the wildcard changed its target.** The main site's `www` and one sub-app failed their certificate check for a few minutes until DNS was repointed. Sign-in to the DNS registrar had to wait on Peace.
- **The first deploy failed.** The pasted database URL still held the provider's `[YOUR-PASSWORD]` placeholder. The app crash-looped through 11 health checks over 5 minutes. An earlier clipboard check had looked for the placeholder text but not for brackets around it, so it missed this.
- **Red CI still deployed.** Another agent's commit went live with failing tests, because nothing tied deploys to CI yet.

### Why this matters for the portfolio

- A setup guide is a hypothesis. The one step that would have broken two live sites was caught by checking what depended on it before acting.
- Hardening means gates you can watch working, not a promise: a deploy held in WAITING, a config error in plain words, and the last good version still serving.

---

## 2026-11-25, one personal brand across Google sign-in, with permission review kept separate

Written from the same day's Google-verification handoff and deployed source commits. This continued the production setup above. The public policy pages and app endpoints were checked again while recording this entry; earlier browser sign-in evidence is identified as such.

### What shipped

- Public app, privacy and terms pages on peaceakinwale.com, deployed in portfolio commit `0885413`. All returned HTTP 200 in the closing check.
- Peace Akinwale branding verified and published for the shared Google project. Earlier fresh sign-ins reached the existing Fanlight, MyLinks and Read Aloud accounts.
- ContentDB's Google button moved onto its own domain, retaining the existing accounts and access rules. The rollout's fresh sign-in passed; its separate brand appeal remained under review.
- MyLinks' reconnect message no longer invents a weekly expiry or says its production Google app is in testing.

### Decisions worth recording

- **Brand verification is not permission verification.** Basic sign-in and sensitive document access have different review requirements. The docs explicitly keep the unfinished scope application open.
- **Preserve the intended write feature.** A proposed reduction to read-only document access was withdrawn when Peace clarified that Draft Scorer will add new content in a new document tab. That feature must work before it appears in the review demo.
- **Parked means parked.** Garde's broken sign-in was investigated, then left alone when Peace confirmed the product is parked.

### Frictions and course corrections

- Google's automated ContentDB check rejected the public homepage, so an appeal was submitted rather than calling the brand approved.
- ContentDB's first build failed in its existing font downloader. Bundling the same fonts locally removed that build dependency.
- Secret rotation remains a separate follow-up. No claim is made here that the replacement has passed a new sign-in or that the old secret has been retired.

### Why this matters for the portfolio

- Shipping authentication includes the consent screen, domain ownership, account continuity and clear review status. A working login is evidence for that login, not proof that every requested Google permission is approved.

---

## 2026-11-25, a separate sending key for Fanlight, with delivery verification left open

Written from the same day's Resend account check, Fanlight decisions and Railway deployment metadata. Invite sends had returned a domain-verification error even though the domain was verified in Peace's personal Resend account.

### What shipped

- Peace replaced Fanlight's reused email key with a dedicated key. The prepared configuration uses Sending access, restricted to peaceakinwale.com.
- The latest Fanlight deployment, commit `fe184f4`, reported success. Its homepage and health endpoint returned HTTP 200 in the closing check.

### Decisions worth recording

- **Separate the products' sending keys.** Fanlight's credential belongs with its verified domain and can be managed without changing the portfolio's or Read Aloud's key.
- **Keep new credentials private.** The agent prepared the form, then handed control to Peace before creation and entry. No replacement key appeared in agent output.

### Frictions and course corrections

- Domain verification was already complete, so no DNS change was needed. A key from another account or team was suspected; that diagnosis was not independently established.
- Deployment health is confirmed. A test invite arriving and the interactive Members list still need verification, so the email issue is not recorded as fixed.

### Why this matters for the portfolio

- Check the account and deployed credential context before changing working DNS. Record deployment health and actual email delivery as separate results.

---
