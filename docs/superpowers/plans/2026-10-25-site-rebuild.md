# peaceakinwale.com rebuild (Seam homepage, Dated work index) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild peaceakinwale.com end to end in the existing Next.js project: Seam as the homepage, Dated as the /portfolio work index, real case-study pages from the Notion drafts, a redesigned blog, and every existing page and post preserved.

**Architecture:** Keep the stack (Next 16 App Router, Tailwind 4, WordPress.com for posts and legacy pages). Add a local content layer (`content/` Markdown + front matter, read by `lib/content/*`, rendered with the existing `marked` dependency) for case studies and the two new articles, merged with WordPress posts in the blog index. One design-token sheet in `app/globals.css`, three fonts, and a new shared chrome. Pages are server components; the only client code is the question nav, the month rail, the filter and the existing forms.

**Tech Stack:** Next 16.1, React 19, Tailwind 4, `marked` 17, `next/font/local` (Sprat, Newsreader), `next/font/google` (DM Sans), Vitest 4, puppeteer (QA scripts).

**Spec:** Peace's brief of 2026-10-25 (pasted in the session; copied to `docs/superpowers/specs/2026-10-25-site-rebuild-brief.md`). Design tokens: `docs/design-reference-2026-10.md`. Content: `content/notion-export/` (verbatim Notion export), `prototypes/2026-10-21-three-directions/content.md` (sourced facts).

## Global Constraints

- Copy rules: first person, "you", contractions, no em dashes, no colon-led sentences, no "fit/suit", no invented numbers, no stock AI contrasts or triples. Approved passages in the brief are used verbatim.
- Naming: "fanout query analysis tool" (never "Fanout Notebook"); "an OKF" (never "Notebook OKF"); also in captions and alt text.
- Every existing route keeps answering (inventory in Task 0). URLs do not change; any move gets a permanent redirect in `next.config.ts`.
- No secrets in the repo; `.vercel-env-audit` stays untracked. Fonts are self-hosted with their licence files.
- Work on branch `redesign/seam-dated`; no push, no deploy, no WordPress or DNS change.
- Radar article: Peace's text verbatim; the "about two weeks" vs 8½ hours item is flagged, not changed.
- Garde paragraph belongs to Garde (the shut-down essay), never to Aloud.

## Review Focus

1. Blog index with a WordPress outage: `getPosts` throws or returns none → the index still renders the local articles and no "dummy" cards. Test in Task 6.
2. A case-study Markdown file with a missing image path → the build fails loudly (test asserts every referenced image exists). Task 2.
3. `/[slug]` precedence: a local article slug that also exists on WordPress → local wins and nothing double-renders. Task 6.
4. Reduced motion and narrow phones on the homepage: no column widening, no sticky question nav overlap at 320px. Task 9 QA script.
5. Sitemap and canonical for new routes and no duplicates (`/case-studies/<slug>`, local article slugs). Task 8 test.

---

### Task 0: Route inventory before and the spec file
**Files:** Create `docs/superpowers/specs/2026-10-25-site-rebuild-brief.md` (the brief, verbatim); Create `docs/route-inventory-2026-10-25.md` (table of every route and WordPress slug from the inventory, with "after" column filled in Task 9).
- [ ] Write both files. Commit `docs: brief and route inventory for the rebuild`.

### Task 1: Tokens, fonts and shell
**Files:** Modify `app/layout.tsx` (fonts: Sprat + Newsreader via `next/font/local`, DM Sans; metadata rewritten for the two offers), `app/globals.css` (tokens per design reference; `.prose` on Newsreader; `.display`), `components/Header.tsx` (new top bar: name left, nav right: Work `/portfolio`, Case studies `/case-studies`, Blog `/blog`, Services `/services`, About `/about`, Contact `/contact`; phone menu; no dropdown), `components/Footer.tsx` (two columns: pages, elsewhere; writing-sample links), `components/AppChrome.tsx` (header is sticky, not fixed; main gets no top padding).
**Interfaces:** Produces CSS vars `--paper, --paper-2, --paper-ink, --paper-soft, --paper-rule, --paper-accent, --night, --night-2, --night-ink, --night-soft, --night-rule, --night-accent`, Tailwind colours `paper-*`/`night-*`, font vars `--font-display`, `--font-serif`, `--font-sans`; classes `.ground-paper`, `.ground-night` (set `--bg/--fg/--soft/--rule/--accent` for descendants).
- [ ] Test `tests/site/nav.test.ts`: `NAV_LINKS` (exported from `lib/site.ts`) contains the six hrefs above, each unique, each starting with `/`.
- [ ] Implement; `npm run build` passes; commit `feat(shell): tokens, Sprat and Newsreader, new header and footer`.

### Task 2: Content layer
**Files:** Create `lib/content/frontmatter.ts` (`parseFrontMatter(src): { data: Record<string,string|string[]>, body: string }`, supports `key: value` and `key:` + `- item` lists), `lib/content/markdown.ts` (`renderMarkdown(md, { imageBase }): string` via `marked`, rewriting relative image paths to `/case-studies/<slug>/...`), `lib/content/case-studies.ts` (`listCaseStudies(): CaseStudy[]`, `getCaseStudy(slug)`; `CaseStudy = { slug, title, kind: 'built'|'wrote', status, date, summary, cover?, links: {label, href}[], tags, html, images[] }`), `lib/content/articles.ts` (`listLocalArticles(): LocalArticle[]`, `getLocalArticle(slug)`; shape mirrors `HashnodePost` so the blog can merge), `content/case-studies/*.md`, `content/articles/*.md`, `public/case-studies/<slug>/*` (images copied from the export).
- [ ] Tests `tests/content/frontmatter.test.ts` (lists, quotes, body untouched), `tests/content/case-studies.test.ts` (every file parses; every image referenced exists under `public/`; no forbidden names "Fanout Notebook"/"Notebook OKF"; no em dashes outside quotations).
- [ ] Write the Markdown files from `content/notion-export/` (prose verbatim; front matter added; images moved). Commit `feat(content): case studies and articles from the Notion export`.

### Task 3: Homepage (Seam)
**Files:** Create `components/home/Split.tsx` (two-ground section, `<Split id question>` with `paper` and `night` slots), `components/home/QuestionNav.tsx` (client; sticky under header on desktop; `aria-current`), `components/home/Hero.tsx`, `components/home/HowIWork.tsx`, `components/home/Offer.tsx`; Modify `app/page.tsx` (sections: hero; nav; Q1 Is this true? paper = ManyRequests article + Regine quote, night = AI Docs Watch (brief passages) + ContentDB (brief passage); Q2 What's worth making? paper = AEO teaser (brief heading + summary), night = fanout (brief passages) + Garde (brief paragraph, link to the essay); Q3 What does done mean? paper = Melissa's comment (image) + Nathan quote + regression-testing line, night = Aloud (log facts) + the reading app (brief passage, link to the Radar lessons article); How I work (brief paragraph); Offer (service copy + prices + tool CTA)). Every section links to the matching case study.
- [ ] Test `tests/site/home-copy.test.tsx` (renders `app/page.tsx` to string; asserts the opening line, the absence of "The same three questions run through both", the AI Docs Watch and ContentDB passages, "fanout query analysis tool", and that the Garde paragraph sits inside the Garde block not the Aloud block).
- [ ] Implement; commit `feat(home): the Seam homepage`.

### Task 4: /portfolio (Dated record) and writing samples
**Files:** Create `components/record/Record.tsx` (server: entries list), `components/record/RecordFilters.tsx` (client: Everything/Building/Writing, month rail, current month, URL hash for open details), `lib/content/record.ts` (`buildRecord(): RecordEntry[]` from case studies + local articles + `lib/portfolio/manyrequests.ts` featured + testimonial "a client said" entries; `RecordEntry = { id, kind: 'built'|'wrote'|'said'|'decided', date, month, title, href, body, figure?, quote?, links }`), `components/record/WritingSamples.tsx` (the WordPress portfolio sections + Marker.io + Jabra via existing `parsePortfolioHtml`/`withCurrentManyRequestsSamples`); Modify `app/portfolio/page.tsx`.
- [ ] Test `tests/content/record.test.ts`: entries sorted newest first; months derived; every `href` is internal or https; kinds limited to the four.
- [ ] Implement; commit `feat(portfolio): the dated work index with writing samples`.

### Task 5: Case-study pages and index
**Files:** Create `app/case-studies/[slug]/page.tsx` (`generateStaticParams` from `listCaseStudies`; layout: title (Sprat), status line, summary, links, prose (Newsreader) with figures and captions; "Next" links to two related entries; back to `/portfolio`), `components/case-study/CaseStudyLayout.tsx`; Modify `app/case-studies/page.tsx` (index of all case studies: built and wrote, including the existing ManyRequests page as a card), `app/projects/page.tsx` (cards link to the new case-study pages where one exists; copy unchanged otherwise).
- [ ] Test `tests/site/case-study-routes.test.ts`: every case-study slug renders metadata with a canonical `https://peaceakinwale.com/case-studies/<slug>`; `manyrequests` stays reserved for the existing page.
- [ ] Implement; commit `feat(case-studies): individual pages and a complete index`.

### Task 6: Blog index, article page, local articles
**Files:** Modify `app/blog/page.tsx` + `app/blog/BlogClient.tsx` (merge `getPosts` with `listLocalArticles`, newest first; WordPress failure → local only; list layout: date, title (Sprat), standfirst, read time; search kept), `app/[slug]/page.tsx` (local article checked first; article layout: 66ch Newsreader, TOC, progress, share, comments, related; new `ArticleEndCta` copy with real destinations), `components/ArticleEndCta.tsx`, `components/ArticleCard.tsx`, `app/rss.xml/route.ts` (include local articles), `app/tag/[tag]/page.tsx` (unchanged behaviour).
- [ ] Tests `tests/site/blog-merge.test.ts` (merge order; outage path; local precedence for a duplicate slug).
- [ ] Implement; commit `feat(blog): merged index, reading page, Radar and coaching-portal articles`.

### Task 7: Services, testimonials, about, contact, 404
**Files:** Modify `app/services/page.tsx` (service copy from the brief, three prices as bullets, existing add-ons and FAQ kept, tool-building CTA copy; no invented tool prices), `app/testimonials/page.tsx` (Melissa's testimonial with Lateef's research-depth screenshot beneath it; other testimonials kept), `app/about/page.tsx`, `app/contact/page.tsx`+`ContactForm.tsx` (restyle only), `app/not-found.tsx`, `app/b2b-content-for-marker.io/page.tsx` (restyle only). Images: `public/images/testimonials/lateef-research-depth.png` from the export (verify pixels show the 21 Sep research-depth message).
- [ ] Test `tests/site/services-copy.test.tsx`: the three prices and the tool CTA sentence present; no "$" figure other than 400, 600, 2,700, 20, 700.
- [ ] Implement; commit `feat(pages): services, testimonials, about, contact in the new shell`.

### Task 8: SEO and plumbing
**Files:** Modify `app/sitemap.ts` (add case studies, local articles, `/b2b-content-for-marker.io`, tag pages), `app/layout.tsx` structured data (Person with both lines of work; WebSite), `next.config.ts` (no new redirects unless a URL moved; record the map in `docs/route-inventory-2026-10-25.md`), each page's `metadata` (title, description, canonical).
- [ ] Test `tests/site/sitemap.test.ts`: no duplicate URLs; every case-study and local-article slug present.
- [ ] Commit `feat(seo): sitemap, metadata and structured data for the new routes`.

### Task 9: Verification
- [ ] `npm run lint`, `npm test`, `npm run build` after the last change.
- [ ] QA script `scripts/qa/site-qa.mjs` (puppeteer, headless shell): every route in the inventory at 1440/390/320: no console errors, no horizontal scroll, h1 count 1, no em dashes outside `<blockquote>`/`<q>`; anchors land below the sticky header; reduced-motion run of `/`.
- [ ] Fill the "after" column of the route inventory; write `decisions.md` entry; preview at `npm run dev` for Peace.
