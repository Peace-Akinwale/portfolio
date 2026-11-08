# peaceakinwale.com, personal product: case study log

A running log of Peace's own portfolio site: the pages buyers read before they book a call. Updated as deliverables land. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Peace Akinwale (own product).
- **Stack:** Next.js 16 App Router, Tailwind v4, Fraunces and DM Sans, content from WordPress and local Markdown. Railway deploys `master` of `Peace-Akinwale/portfolio`.
- **Method:** a decisions log in the repo root, a test suite (157 passing at the time of this entry), and a review council of buyer personas that scores pages before they ship.

---

## 2026-11-08, a redesign goes live after a council review, before-and-after approvals, and a pre-launch audit that found its own regressions

Written the same day, from the repo's git log (88 commits merged as 9a82167), `decisions.md`, the council verdict in `docs/qa/council/2026-11-08-home.md`, Railway's deployment record and checks run in the session.

### What shipped

- **The compact homepage with client logos, live.** Railway reported the deploy successful about three minutes after the push. On the live domain the homepage, `/writing` and the three client pages return 200, and every retired address reaches its new page in one redirect.
- **One address scheme for the writing.** `/portfolio` became `/writing`, and the client pages moved from the site root to `/writing/manyrequests`, `/writing/highervisibility` and `/writing/pangea`. The old addresses redirect permanently, the canonical tags and sitemap name only the new ones, and the share tags on the client pages stopped pointing at the homepage.
- **Copy the owner approved line by line,** including a closing line in their own words, consistent "Read the case study" links, a second testimonial about needing only one round of edits, and the live About opening restored where a redesign had left a paragraph starting "That's why" with nothing before it.
- **A full menu down to 840px wide** instead of 1024px, so a narrower desktop window keeps the navigation, and a new browser icon drawn as vector shapes from the site's own typeface.
- **Checks before the push:** a production build and the full suite (157 passed, 18 skipped) on the merged commit, built in a separate worktree so the running dev server was not disturbed.

### Decisions worth recording

- **Show the change before making it.** Every copy and design proposal went into one page of real screenshots, current beside proposed, at desktop and phone width, with edits applied only in the browser. The owner approved some, rejected one (a dated ranking caption), rewrote one in their own words, and asked for new rounds where a design did not land.
- **A buyer council, then restraint.** Five personas scored the homepage 6 to 7, three of five would book. Every buyer seat asked for more words; a seat argued the other side because the owner had chosen this page for being short. The agreed changes added about 40 words, mostly inside lines that already existed.
- **Leave one address alone.** A side app stays at `/projects/mylinks` because its Google sign-in callback is registered to that path; moving it for consistency would have broken login.

### Frictions and course corrections

- **The pre-launch audit found a regression introduced the same week.** Three independent agents audited the build. The site had moved to a light default that ignores the OS setting, but the side app still switched its own colours on the OS setting, so visitors in OS dark mode got pale text on a pale page: contrast 1.06 on the login heading. Keying the app's colours to the site's theme brought it to 13.6.
- **The wrong host, assumed from a file.** The deploy plan named the previous host because its config file is still in the repo; the decisions log and the live server header both said Railway. Caught before anything was pushed.
- **A feed moved that should have stayed.** The retired feed under `/portfolio` was moved with the page and redirected; it had been deliberately retired months earlier. It went back to its old address, still answering "gone".
- **A misread pronoun.** A testimonial was flagged as misgendering the owner from a stale note; the owner's own About page settled it, and the flag was withdrawn.

### Why this matters for the portfolio

- Approval works best on the real thing: screenshots of the live page beside the proposal, not a description of the change.
- A launch check earns its cost when it is independent and reproduced: the worst bug of the week came from a change made days earlier, and only a check of the running page in the conditions real visitors have found it.
- Moving URLs is a contract change. Redirects, canonicals, sitemap, share tags and every internal link moved together, and one address was deliberately left where it was.

---
