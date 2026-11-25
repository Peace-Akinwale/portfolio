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
