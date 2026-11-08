# Route inventory, 25 October 2026 (before and after the rebuild)

"Before" is the branch `fix/audit-fixes` at `0c1453c` plus the live site's sitemap on 25 Oct 2026. "After" is filled in at the end of the rebuild (Task 9 of `docs/superpowers/plans/2026-10-25-site-rebuild.md`). The MyLinks workspace (`/projects/mylinks/(workspace)/**`) and every `/api/**` route are untouched by the rebuild and not listed one by one.

| Route | Before: what it renders, content source | After |
|---|---|---|
| `/` | Homepage; constants in the page | Seam homepage (`components/home/*`) |
| `/blog` | Post list from WordPress, client search | Merged index: WordPress posts + local articles |
| `/[slug]` (8 posts) | WordPress post page | Same slugs; new reading layout |
| `/[slug]` (WordPress pages: `about`, `portfolio`, `projects`, `mylinks`, `mystyleguide`, `linkedin-router`, `portfolio-project`, `editorial-style-guide`, `b2b-content-for-manyrequests`, `content-for-pangea`, `content-for-highervisibility`, `home`, `blog`) | Served by the catch-all as a page or grid | Unchanged behaviour |
| `/tag/[tag]` | Posts by tag | Unchanged; added to sitemap |
| `/about` | WordPress page `about` + photo | Same content, new shell |
| `/portfolio` | WordPress `portfolio` grid + Marker.io + Jabra | Dated work index + the same writing samples under `#writing` |
| `/portfolio/rss.xml` | 410 | Unchanged |
| `/rss.xml` | Blog RSS | Includes local articles |
| `/b2b-content-for-marker.io` | Marker.io samples | Unchanged content, new shell |
| `/projects` | 7 project cards | Same cards; links to case studies where one exists |
| `/projects/[slug]` (`linkedin-router`, `mystyleguide`, `portfolio-project`, `editorial-style-guide`) | WordPress page | Unchanged |
| `/projects/contentdb`, `/projects/mylinks` | Hard-coded landing pages | Unchanged; contentDB links to its case study |
| `/case-studies` | One card (ManyRequests) | Index of every case study |
| `/case-studies/manyrequests` | Hard-coded case study | Unchanged content, new shell |
| `/case-studies/[slug]` (new) | did not exist | One page per Notion draft |
| `/testimonials` | 7 testimonials | Same 7, plus Lateef's screenshot under Melissa |
| `/services` | Services, prices, FAQ | Brief's service copy and prices; FAQ kept |
| `/contact` | Form → Resend | Unchanged behaviour, new shell |
| `/career-pathway/**` | Assessment tool | Unchanged |
| `/admin/comments` | Moderation (password cookie) | Unchanged |
| `/contentdb` | Redirect → `/projects/contentdb` | Unchanged |
| `/sitemap.xml`, `/robots.txt` | Static routes + posts | Adds case studies, local articles, tags, Marker.io page |

Redirects in `next.config.ts` before: `/how-to-write-sales-enablement-content`, `/page/about`, `/page/portfolio`, `/tools`, `/tools/mylinks/*`, `/contentdb`, `/mylinks`, `/linkedin-router`, `/mystyleguide`, `/portfolio-project`, `/editorial-style-guide`. No URL moves are planned, so no redirects are added.

Published posts on WordPress on 25 Oct 2026 (8): `how-to-optimize-for-aeo`, `what-i-learned-vibe-coding-my-first-app-shutting-it-down`, `how-to-build-portfolio-website-claude-code`, `create-editorial-style-guide-with-claude`, `content-manager-roles`, `sales-enablement-content-strategy`, `linkedin-automation-and-social-selling`, `best-3-ai-search-engines-that-answer-queries-like-chat-gpt`.
