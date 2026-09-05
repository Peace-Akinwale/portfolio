# decisions.md

Running log of goal, constraints, and decisions for the peaceakinwale.com redesign. Read this before planning any work in this repo. Append, do not rewrite history.

## Goal

Make peaceakinwale.com read as top-tier editorial craft (Godly / Siteinspire register) while keeping the stack, so that the site itself is proof of the taste a B2B SaaS content writer sells. Conversion (booking a call) is the second priority.

## Constraints

- Stack stays: Next.js 16 App Router, React 19, Tailwind CSS v4 (tokens in `@theme inline` in `app/globals.css`, no config file), TypeScript strict, Vercel with `next build --webpack` (see `vercel.json`).
- Content fetch layer stays: `lib/hashnode/client.ts` talks to the WordPress.com REST API. Misnamed, but untouched in this work.
- Fonts stay: Syne (display) and DM Sans (text) via `next/font/google`. Two families maximum.
- No new runtime dependency for motion. CSS only: transform, opacity, clip-path, scroll-driven animations with static fallbacks. `prefers-reduced-motion` shows final states.
- Out of scope: `app/projects/mylinks/(workspace)/**`, `app/career-pathway/**`, `app/admin/**`, `app/api/**`, `components/mylinks/**`, `components/career-pathway/**`.
- Real numbers only. No invented statistics anywhere on the site.
- Nothing is pushed, merged, or deployed until the user has reviewed the branch locally.
- Global rules that apply: `~/.claude/rules/architecture.md` (this file), `~/.claude/rules/design.md` (visual reference in `docs/design/visual-reference.md` governs colours, fonts, spacing, radii).

## Decisions (2026-09-05, agreed with Peace)

| # | Decision | Why |
|---|---|---|
| 1 | Craft first, conversion second | The site is the portfolio. Taste is the product being sold. |
| 2 | Whole marketing surface in scope: `/`, `/services`, `/case-studies`, `/case-studies/*`, `/portfolio`, `/testimonials`, `/about`, `/blog`, `/[slug]`, `/contact` | Primitives make the whole surface cheaper than two pages done twice. |
| 3 | Homepage form is chaptered editorial: type-only title page, chapter intertitles, a margin folio that tracks the chapter, hard cuts, no fixed pill nav on `/`, colophon close with the CTA as running text | A writer's asset is judgment. The page should feel read, not watched. |
| 4 | Aesthetic: editorial. No cards as page structure, no eyebrow above every heading, no em dashes in copy, no `01 / 06` counters except the folio, one radius scale | Restraint is the signal in this register. |
| 5 | Palette: keep olive `#64734f` and terracotta `#b55e3d`; replace the warm cream ground with cool paper and off-black ink; dark mode updated; theme toggle ships | Warm cream + clay is the default artisan look. Olive with brick on cool paper is not. |
| 6 | Positioning: writer first. MyLinks, ContentDB and this site appear as one proof chapter, not as a second service | Two offers dilute the headline. Tools prove he thinks in systems. |
| 7 | Signature moment: the redline. A real client paragraph is edited on scroll: strike-through, product mention slides in, margin note explains the judgment | The one thing a visitor tells a friend about. Demonstrates the method instead of describing it. |
| 8 | Assets: only what is in the repo. No generated imagery | Generated editorial imagery would be eight plausible, forgettable frames. |
| 9 | Steve Toth: sanitised case study drafted, held with `published: false` until Peace approves | Source log contains commercial terms that must not ship. |
| 10 | Cleanup approved: `app/services-v2`, `app/contentdb`, `app/test`, stale worktree, duplicate case-study images, starter SVGs, untracked public mockups, `graphql` + `graphql-request` | Dead code and 2 MB of duplicate assets. `services-v2` changes already shipped to `/services`. |
| 11 | scroll-craft skill not used; build is hand-rolled | Peace's call: "just show me what you can do." |
| 12 | Work on branch `redesign/editorial`, commit per phase | Local review before anything reaches production. |

## Structural changes log

- 2026-09-05: created `decisions.md` and `docs/design/visual-reference.md` (Phase 0).
- 2026-09-05: `components/ui/` primitives and `lib/content/` shared data added; `lib/cx.ts` helper. Header, Footer, AppChrome consume them. Homepage no longer receives the fixed Header (chaptered editorial carries its own masthead).
- 2026-09-05: removed `app/contentdb`, `app/test`, `app/services-v2`, starter SVGs, duplicate case-study images, `graphql` + `graphql-request`. ContentDB OG image now lives at `app/projects/contentdb/opengraph-image.tsx`.
- 2026-09-05: homepage rebuilt as `components/home/*` chapters (TitlePage, TheQuestion, Redline, TheRecord, TheSystems, InTheirWords, Colophon) composed by `app/page.tsx`; chapter CSS in `components/home/home.css`. The planned fixed-margin Folio primitive was dropped in favour of a sticky marker inside each chapter's grid, which tracks the chapter without overlapping content at narrower widths.
- 2026-09-05: `scripts/dev/shoot.mjs` added: Puppeteer screenshot strip (light/dark/mobile/reduced-motion) used for verification. The Browser pane's screenshots go blank after programmatic scroll, so this is the visual check.
- 2026-09-05: services split into `components/services/*`; shared `PageHeader`, `ClientRow`, `CtaBlock`. Case studies get `components/case-studies/CaseStudyShell.tsx` (breadcrumb, byline, figures, BreadcrumbList + Article JSON-LD); `app/case-studies/notebook-agency` added behind `published: false`. Blog and portfolio become indexes (`ArticleCard` is a list row; `PortfolioCard` and `BlogPageBackground` deleted). Article ground uses `data-surface="paper"` on the wrapper.
- 2026-09-05: radius decision revised. The Tailwind default radius tokens stay defined because the out-of-scope MyLinks workspace and career-pathway app use them 51 times; the marketing surface is held to sm / md / full by usage, not by retiring the tokens.
- 2026-09-05: `app/opengraph-image.tsx` (root social card), sitemap now lists case studies, testimonials, projects, tags; robots drops the deleted `/test` and hides admin and the MyLinks login/dashboard.
- Known dev-server gotcha: Turbopack's persistent cache under `.next/dev` served stale `globals.css` after the token rewrite. Fix was stop server, `rm -rf .next`, restart.

## Baseline (before, 2026-09-05, dev server, Lighthouse 12 desktop preset)

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| / | 95 | 95 | 100 | 100 | 1.5 s | 0 |

The redesign must not drop below these.

## After (2026-09-05, same method, branch `redesign/editorial`)

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| / | 96 | 96 | 100 | 100 | 1.4 s | 0 |
| /services | 97 | 100 | 100 | 100 | 1.3 s | 0 |

Also verified: `npm run build` (webpack) passes, `npm test` 58 tests pass, `tsc --noEmit` clean, screenshot strips of every in-scope route in light, dark, 390px and reduced motion, theme toggle persists across reloads, token contrast (ink 16.4:1, muted 6.2:1, olive 4.6:1, brick 5.2:1 on paper). Remaining ESLint errors are pre-existing in `components/TableOfContents.tsx`, `components/ImageLightbox.tsx` and comment code (setState in effects); untouched by this work.

Nothing pushed, no PR, no deploy. Peace reviews locally first.
