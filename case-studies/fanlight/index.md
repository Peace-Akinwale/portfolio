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

## 2026-11-26, capture on five assistants proven on recordings, an honest review, and an extension with no key

Written the same day, from the Fanlight repo's merged pull requests, its decision log, the test findings and the session's own runs. The day began as a request to move the database, test the extension on three client accounts and try the site check. It became a rebuild of how answers are captured, after the first live test showed most assistants were not captured properly.

### What shipped

- **Faster pages by moving the app, not the database.** The app and one sibling service moved to the hosting region beside the database. Query time on the health check fell from 89 to 18 ms.
- **Pull request 3: capture any prompt, on five assistants.**
  - No questions typed in first: the prompt as typed becomes the question.
  - Every reader was checked against hundreds of recorded sessions before use: ChatGPT, Claude, Perplexity and Google AI Mode 30 of 30 answers each, Gemini 47 of 47.
  - Each source now keeps its snippet, its rank in the assistant's own results, publish date, which search found it, the sentence it was cited for, and timings.
  - A live side panel fills in while the answer is written, and the toolbar icon pulses while a capture records.
- **Pull request 4: no connection key.** The extension works from the normal Fanlight sign-in. On the live site a capture saved with no key, and the open Runs page showed it 10 seconds after the prompt, without a reload.
- **Pull request 5:** the client picker names the client on the page, and the sidebar no longer squashes on a short window.
- **Checks:** 152 tests, a type check and a name check passed before the last merge, and CI passed on `main` at `141f1c2`.

### Decisions worth recording

- **Moved the app to the database, not the database to the app.** Peace's brief said move the database. Checking where the other services lived showed the cheaper fix ran the other way, and Peace chose it.
- **Stopped building to research.** Midway, Peace said the work was going too fast on too few facts. Building paused. The rebuild followed a written plan based on 1,802 recorded sessions, and Peace approved it before coding resumed.
- **Not every answer searches.** A run with zero searches is checked against its own stream before it is called a bug. One Claude answer showed zero searches, and its stream confirmed it never searched.
- **No key, with a guard.** Removing the key meant the browser's sign-in had to be enough. The app accepts that sign-in only from the extension or from itself. That stops other sites, including sibling subdomains that browsers treat as the same site. Old keys keep working until removed.

### Frictions and course corrections

- **A confident number was wrong.** The Gemini reader was reported as "47 of 47 recordings, 1,508 sources". A review found each recording held three prompts. The reader returned an earlier prompt's answer in 41 of them, and the 1,508 was merged and double-counted. The corrected reader gives the newest answer in 47 of 47 and 354 pages. The test harness was fixed to pass the prompt the way a live capture does.
- **Two absence claims were wrong.** "Claude sends no searches" and "Gemini shows sources only after a click" were both disproved by the recordings and reverted.
- **The review found 15 bugs before merge.** Three independent review passes found runs filed under the wrong question, old answers saved as new, and captures lost silently. All were fixed before the merge, and the pull request was held as a draft until then.
- **Gemini withdraws answers.** In the live test Gemini wrote a full answer, then replaced it with a refusal. Fanlight had saved the withdrawn answer. It now saves what the page ended up showing and counts the refusal as blocked.
- **Two assistants still lack a clean live run.** Gemini refuses scripted prompts and Perplexity's free plan hit its search limit. Both readers are proven on recordings only.

### Why this matters for the portfolio

- A reader that "works on 47 of 47 files" can still be wrong if each file holds three units. The proof has to check the right unit, called the way production calls it.
- Publishing the corrections is part of the work. The review that overturned a reported number happened before merge, and the pull request said so.

---

## 2026-11-27, a redesign thrown out for losing what worked, and a written spec another agent built seven batches from in one evening

Written the same day, from the session's notes, the spec file, the Fanlight repo's pull request list and its decision log. The brief was to improve how Fanlight looks and reads. The day's own work was a review and a spec. The build that followed was done by a separate agent session working from that spec, and is credited as such below.

### What shipped

- **A page-by-page review with Peace** of the live app and of a wireframe of every screen, recorded as he went: what to keep, what to change and why.
- **A spec of about 4,650 words:** 12 decisions, each page in turn, nine questions still open, and the work split into eight batches with one pull request each.
- **A handoff prompt** naming the files to read, in order, and the rules to work by. Peace gave it to an agent of his choosing.
- **A colour comparison** of five screens in the current look and a proposed light one, shown side by side at the same size.
- **What the spec led to, built by another agent session the same day:** eight pull requests (6 to 13) merged between 16:10 and 19:50 Lagos time, covering the first seven batches. The eighth batch was still in progress when this was written. Those pull requests are that session's work. This entry claims the review and the spec.

### Decisions worth recording

- **Keep the colours.** The first wireframe was grey. Peace called it worse and bland, so it was rebuilt in the current navy and gold. A light palette was then offered with measured contrast, and he declined that too. The lesson recorded in the spec: change the structure, keep what already works.
- **Not every wireframe page won.** Peace preferred the wireframe for Sources and the live app for Runs and Actions. The spec takes each page on its own evidence, not the redesign as a package.
- **Every diagram is on the page when it opens.** Drawing fan-out diagrams as the reader scrolls was proposed for speed. Peace refused: the reader should only scroll. The spec says to fix speed some other way if it is slow, and never to hide a diagram.
- **Advice needs quotes from both sides.** The goal is to never recommend something a client already did. So each recommendation must carry an exact quote from the client's page and from the page an assistant cited, code checks each quote appears in the fetched text, and "could not tell" stays a valid answer.
- **Paid steps need a yes first.** A crawling service and the model that reads pages were both written into the spec as needing an estimate and Peace's approval, with the estimates kept out of the app.

### Frictions and course corrections

- **The first redesign removed things Peace liked.** It dropped the per-assistant cards and the colour that told sources apart. It was thrown out and redone.
- **An instruction was read as a comment.** Peace wrote "a question (use prompts)". The first reply treated it as an aside. It was a naming decision, later confirmed and built.
- **A proposal was unclear.** The first explanation of how to show repeat answers did not land. A worked example did, and it became a toggle between the latest capture and all versions.
- **The spec's code notes went stale within hours.** They describe the app before the build. The spec now carries a status line saying so, and the handoff lists which open questions the build answered.
- **Not verified by this session:** the merged work was not re-tested here, and the live app was not opened after the merges. The cost figures in the spec are estimates from token counts, not measurements.

### Why this matters for the portfolio

- A redesign is judged by what it keeps as much as by what it adds. Showing the old and new side by side, per page, let the owner keep the good parts of both.
- A spec that states decisions, open questions and rules plainly can be handed to a different agent and built from the same day.

---
