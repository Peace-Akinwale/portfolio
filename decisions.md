# Decisions — peaceakinwale.com

## Goal
A portfolio site that lets a B2B SaaS head of content or founder decide, in a few minutes, to book a call with Peace, and that does not read as AI-generated.

## Constraints
- Stack: Next.js 16 App Router, Tailwind 4, hosted on Vercel. Blog posts, About and Portfolio body copy come from WordPress.com (`peaceakinwale.wordpress.com`, public REST API, env `WORDPRESS_SITE`) since commit `22ad8a8`. The folder `lib/hashnode/` and the `Hashnode*` type names are leftovers from before that switch; Hashnode is not used. Editing that copy happens in WordPress, not here.
- Contact email goes through Resend (`app/api/contact/route.ts`). Booking goes through Calendly.
- Work stays local on a branch until Peace reviews it. No push, no deploy without her say-so.
- Facts (client numbers, article counts, job titles, prices) come from Peace or a live source, never invented.

## Key choices so far

### 2026-09-27 — Audit fix pass (branch `fix/audit-fixes`)
Source: the two audits of the live site run on 2026-09-27 in this repo's Claude session.

Facts Peace confirmed:
- Agency client "233% in 6 months, ~35k by January 2024" is correct; "14k → 48k in 8 months" is also correct. Both stay.
- Revision count (1 round vs 2 at the start): unsure. Copy left unchanged.
- Regine Garcia and Lily Ugbaja titles: leave as they are.
- "Monthly retainer" and "5-article bundle" are the same main offer. Both names stay for now.
- ManyRequests article count is out of date (Peace has written more) and some pieces were refreshed by ManyRequests. Count and links to be taken from manyrequests.com, and refreshed pieces removed everywhere they appear.

Dependency sweep before editing (blast-radius rule):
| Change | Everything that depends on it |
|---|---|
| `app/api/contact/route.ts` returns an error when Resend returns `{ error }` | Only caller: `app/contact/ContactForm.tsx` (already shows its error state on non-2xx) |
| `components/BlogPageBackground.tsx` stops forcing `#fff` in dark mode | Only used by `app/[slug]/page.tsx` (every blog post) |
| `components/Header.tsx` dropdown and phone menu keyboard fixes | Rendered by `components/AppChrome.tsx` on every page |
| Availability line becomes one constant `lib/site.ts` | `app/page.tsx` (2), `app/services/page.tsx` (2), `app/contact/ContactForm.tsx`, `app/testimonials/page.tsx`. `app/services-v2/` is untracked WIP and not routed live; left alone |
| Related posts exclude the job-hunting post | `app/[slug]/page.tsx` only |
| Delete `app/test/` | Nothing links to `/test` (grep: no hits) |
| Add `app/not-found.tsx` | Replaces Next's default 404 for every unknown route |
| Add `app/opengraph-image.tsx` | Every route; checked in built HTML for routes that export their own `openGraph` (`[slug]`, case study, project pages, career pathway) |
| `app/sitemap.ts` adds missing static routes | `robots.ts` points at the sitemap |
| `scroll-margin-top` on article headings | Blog post table of contents (`components/TableOfContents.tsx`) |

Deferred to the redesign (not bugs, they are layout/copy decisions): repeated testimonials, template section order, the unproven "cited in LLM search" stat, mobile hero order, tap-target sizes, nav breakpoint, contact-route consistency, and look-and-feel items A–H.

Needs a WordPress edit (the About and Portfolio pages are WordPress pages): About "email" link (`http://akindayopeaceakinwale@gmail.com/`), two different Google Form links on About and Portfolio, note-like portfolio titles.

Results (verified locally on 2026-09-27: `npm run build` passes, 56/56 tests, checked in the side browser at 375px and 1440px, dark and light):
- ManyRequests: 51 articles credited to Peace on manyrequests.com (all 236 posts in their sitemap checked by byline). 11 were missing from the portfolio and are now added via `lib/portfolio/manyrequests.ts`. 5 linked pieces were removed everywhere: `finance-tools` (404), `10-tools-you-need-…` and `productized-service-software` (now William Nzewi), `copilot-alternatives` (redirects to Assembly alternatives by Adetola Rachael Iyanuoluwa), `clickup-vs-notion` (now William Nzewi). The case study no longer cites the ClickUp vs Notion ranking. `harvest-alternatives` has no byline; not counted until Peace confirms.
- Counts now read from one constant (`MANYREQUESTS_ARTICLE_COUNT`). "20 months" became "since 2024" (20 months before the April 2026 case study). "88% BOFU" was dropped because it was measured on 43 articles and can't be re-verified for 51.
- `NEW_MANYREQUESTS_ARTICLES` was duplicated in `app/portfolio/page.tsx` and `app/[slug]/page.tsx`; both now import it from `lib/portfolio/manyrequests.ts`.
- On phones the contact page links to Calendly instead of embedding it; tablets and desktops keep the embed.
- Pre-existing lint errors left as they were: `prefer-const` ×2 in `app/[slug]/page.tsx`, `set-state-in-effect` in `components/Header.tsx`.
- `.vercel-env-audit` (untracked, contains env var names/values) is not committed; consider deleting it or adding it to `.gitignore`.

### 2026-09-27 — Palette and homepage (same branch)
Peace asked for new colours ("something that is not AI slop", no preference) and a shorter homepage ("I don't know what to cut"), and delegated both decisions, to review afterwards. This overrides the design rule "no new colours" for this project; the new reference is `docs/design-reference.md`.

- Palette "adire" (Yoruba indigo cloth): cotton #F7F7F3, indigo ink #15183A, accent #2E3A87; dark mode night indigo #11142B with #9FB0FF accent. Replaces cream + terracotta + sage, a look common on AI-generated sites. All text pairs checked at 6.5:1 contrast or better.
- Buttons on the accent now use `--accent-foreground` everywhere (the old dark-mode sage accent carried white text at poor contrast).
- Homepage cut from 8 sections to 4: intro, recent work (six real article titles; the one bold element), an editor's unedited Docs comment, prices + next step. Removed: logo strip, stats row (including the unproven "cited in LLM search" claim), three offer cards, three testimonial cards, about snippet, blog cards, duplicated Regine quote. Each still lives on its own page.
- Result: 3,083px at 1440 wide (was 4,405), 6.0 phone screens (was 9.5), 287 words (was 663). The homepage no longer fetches blog posts.
- Header and footer labels are sentence case; full menu shows from 768px (was 1024px); footer is two columns on phones; reduced-motion respected globally.

Not changed yet (next pass): services, testimonials, case study and portfolio layouts still use the old template structure (eyebrow labels, three-card rows, persona emoji cards, repeated testimonials). Fonts unchanged (Syne, DM Sans, Georgia).

### 2026-10-07 — Positioning widens to two offers (pending redesign)
Peace wants the site to show both sides of her work: content writing/editing and AI content operations (building and running AI products with Claude Code). This supersedes the Goal line's single buyer ("B2B SaaS head of content or founder") once the redesign starts; the Goal will be rewritten in that pass. Case studies and posts never name clients or products. Plan and evidence: the private repo `Peace-Akinwale/thought-leadership`. Design approach (including whether scroll-craft is used, and where) not yet decided.

### 2026-10-21 — Three new design directions (prototypes only, not reviewed)
Peace rejected the earlier Codex prototypes (`prototypes/2026-10-design-directions/`) for lifeless design and label-like copy. New studies live in `prototypes/2026-10-21-three-directions/`: Dated (the homepage is the dated record), Seam (writing on paper, building on indigo, one question per section) and Up close (annotated real screens). Same content pool for all three (`content.md`, every fact sourced). Scroll Craft read and not used. The design rule "no new colours or fonts" is superseded for these isolated studies by Peace's explicit brief. Reviewed in the browser at 1440, 390 and 320 and critiqued by a reviewer agent on 2026-10-22; fixes applied, see that folder's README and QA.md. Recommendation: Seam, with Up close close behind; Peace to decide by using them. Still no deploy, push, WordPress or DNS change.

### 2026-10-23 — Fourth direction from a teardown of thejasminejade.com
Peace asked for a "reverse engineer anything" (REA) pass on Jade's site. REA is a binary-analysis tool and isn't installed, so the teardown was done by hand in Chrome (DOM, computed styles, section order, libraries) and written to `prototypes/2026-10-21-three-directions/jade-teardown.md`. `story.html` rebuilds Jade's eight-act narrative mechanics in Peace's own world (Syne, DM Sans, bone and deep green, one orange, native scroll, a chart of the public log drawn in full). The three earlier directions are unchanged. Still local only, no deploy or push.
