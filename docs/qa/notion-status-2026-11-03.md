# Notion pages vs the site, 3 Nov 2026

Read through the Notion connection on 3 Nov. "Export" = the 25 Oct text the site was built from. The site renders `content/informal/<slug>.md` (the 26 Oct informal rewrite of that export), so none of the Notion edits below are on the site yet.

| Page | Last edited in Notion | Change since export | Images on the page now |
|---|---|---|---|
| Building a platform around teaching and learning (was "Build a course portal…") | 30 Oct 22:48 | rewritten, 675 → 575 words, new title | 0 |
| ContentDB | 31 Oct 09:35 | rewritten, 689 → 652 words; two new informal paragraphs | 2 (one new `image.png`) |
| Aloud | 30 Oct 23:39 | rewritten, 741 → 600 words | 1 |
| Quality Rater | 30 Oct 23:39 | rewritten, 422 → 430 words | 2 (was 3) |
| Fanout query analysis tool | 30 Oct 23:40 | rewritten, 657 → 622 words | 3 (was 7) |
| What AI search apps do before they answer | 30 Oct 23:39 | rewritten, 674 → 628 words | 2 |
| AI Docs Watch | 31 Oct 08:47 | rewritten, 691 → 713 words; two new screenshots dated 30 and 31 Oct; ends "Sign up to AI Docs Watch." | 5 (was 6) |
| Building an OKF | 30 Oct 23:40 | rewritten, 696 → 609 words | 3 (was 5) |
| A reading app… | 30 Oct 23:42 | rewritten, 720 → 588 words | 1 (was 3) |
| Reach | 30 Oct 23:42 | rewritten, 702 → 523 words | 2 (was 4), different shots |
| The success message was the bug (article) | 30 Oct 23:42 | one closing sentence differs; otherwise the export text | 0 |
| Testimonials | 24 Oct | untouched | 2 |

Every case study now opens with a "Portfolio summary" section followed by the case study. The 30 Oct 23:39 to 23:42 pages were saved within three minutes of each other, which suggests one pass that replaced the bodies, so each needs Peace's own read before it is called finished.

Observed, for Peace to judge: the new bodies are shorter on every page and several concrete details from the export are gone from the body (the reading app's 714 saved items and the founder's quotes; the OKF's 1.23 million words now appears only in the summary; Reach's 15-minute idle rule). Peace's stated reason for the rewrite was the opposite problem, that the first drafts lacked detail from the projects' own CLAUDE.md files, so this is worth a look.

**Images now download.** The Notion connection returns signed file URLs (5-minute expiry) for every image block, and a test download of `qr-02-run.png` succeeded. The 25 Oct export could not fetch any image; this removes that blocker. Note the pages now carry fewer images than the export listed, so `content/MISSING-IMAGES.md` is out of date.

## What has to happen before the case studies can go live with this text

1. Peace finishes the Notion pages (text and the remaining screenshots).
2. Replace the browser export with an import that reads each page through the Notion connection and downloads its images.
3. Decide whether Notion is now the single source of the body text. If yes, retire `content/informal/*.md`; if no, carry the Notion changes into each informal file by hand.
4. Re-run the QA route script (copy rules, em dashes, overflow, dark mode) on the imported pages.
