# Refreshing the case studies from Notion

The site's case studies and the two articles come from Peace's Notion collection
"peaceakinwale.com" (root page `403992da7a57818bbbc3f25d0514ca8e`). Two scripts
turn Notion into site content:

1. `notion-page-to-export.mjs` writes one Notion page into the export shape
   (`content/notion-export/<name>.md`, its images and a manifest).
2. `import-notion.mjs` turns the whole export into `content/case-studies/*.md`,
   `content/articles/*.md` and `public/case-studies/<slug>/*`. Informal drafts in
   `content/informal/` win over the export text (see "What the site shows").

The Notion MCP connection in the Claude desktop app is the only thing that can
read the pages and hand out image download links, and it is only callable from a
Claude session, not from Node. So the refresh is a session procedure. Done
carefully it takes under ten minutes for all twelve pages.

## Procedure (in a Claude Code session with the Notion connection on)

For each page you want to refresh (the page ids are in the table below):

1. Call the Notion `fetch` tool with the page id and `include_file_urls: true`.
   The result has the page text between `<content>` and `</content>`, a
   `page_last_edited_at`, and a `references` map from each
   `notion-file-block://…` image source to a signed S3 URL. **The URLs expire
   five minutes after the fetch**, so do steps 2 and 3 straight away.
2. Write two files in a scratch folder:
   - `<name>.content.txt`: the text between `<content>` and `</content>`,
     verbatim (keep the `<image …/>`, `<i>…</i>` and `<p>…</p>` tags).
   - `<name>.json`:
     ```json
     {"export_name": "<export file name without .md>",
      "notion_url": "https://app.notion.com/p/<id>",
      "title": "<page title>",
      "page_last_edited_at": "<from the fetch result>",
      "content_file": "<name>.content.txt",
      "references": { "<image source>": "<signed URL>", … }}
     ```
3. Run, from the repo root:
   ```bash
   node scripts/content/notion-page-to-export.mjs /path/to/<name>.json
   ```
   It writes the Markdown, downloads every image into
   `content/notion-export/images/<export_name>/<n>-<file>` and prints
   `<name>: N words, M images`. A line ending `NOT downloaded` means a URL had
   expired: fetch the page again and re-run (files already on disk are kept).
   Delete the page's old `images/<export_name>/` folder first if the set of
   images changed, otherwise stale files stay beside the new ones.
4. After the last page:
   ```bash
   node scripts/content/import-notion.mjs
   ```
   then `npm run build -- --webpack` and `npx vitest run`.

Fetching three or four pages in one go, then writing and converting them in one
command, stays inside the five-minute window comfortably.

## Pages

| export_name | Notion page id | On the site as |
|---|---|---|
| `ai-docs-watch` | `403992da7a57817c8a0ad5105de78b0e` | /case-studies/ai-docs-watch |
| `contentdb-collect-research-and-question-your-sources` | `403992da7a5781cfaff1de30c9c49f2f` | /case-studies/contentdb |
| `aloud-listen-to-saved-articles-and-return-to-useful-passages` | `403992da7a578174ba0dea8a39cb42fc` | /case-studies/aloud |
| `quality-rater-reviewing-pages-using-googles-quality-guidelines` | `403992da7a5781f583bef06d8253072c` | /case-studies/quality-rater |
| `fanout-query-analysis-tool` | `403992da7a578155bc78c7d8e436e561` | /case-studies/fanout-query-analysis-tool |
| `what-ai-search-apps-do-before-they-answer-a-public-reference` | `403992da7a5781549c62ef65f6569916` | /case-studies/what-ai-search-apps-do-before-they-answer |
| `building-an-okf-that-a-team-can-ask-for-guidance` | `403992da7a578116ae4ee9a53710f316` | /case-studies/okf |
| `a-reading-app-for-reviewing-posts-and-preparing-newsletter-notes` | `403992da7a578154a913e2c0f47463f7` | /case-studies/reading-app |
| `reach-hands-on-my-mac-for-ai-agents-that-cant-reach-it` | `403992da7a5781c28d08f130a8388772` | /case-studies/reach |
| `build-a-course-portal-around-the-instructors-workflow` | `403992da7a578152abc6e58249ea4db7` | /build-a-course-portal-around-the-instructors-workflow (title now "Building a platform around teaching and learning"; the slug stays) |
| `the-success-message-was-the-bug-five-lessons-from-building-an-ai-assisted-reading-tool` | `404992da7a5781ce8b6cd42fb274dc33` | /the-success-message-was-the-bug |
| `testimonials` | `403992da7a5781d48fdee1172e9baf66` | not rendered; reference only |

The export file name is the key of `PAGES` in `import-notion.mjs`. It never
changes when a Notion title changes; only the `title` in the export's front
matter does.

## What the site shows

- A case study's body comes from `content/informal/<slug>.md` when that file
  exists (all nine do, Peace's 26 Oct 2026 rewrite in her own voice). The export
  supplies the front matter, the summary and the images: each `[[img]]` marker
  in the draft takes the next image and caption from the export. When the counts
  differ, spare markers are dropped and spare images are appended at the end of
  the body, with a warning in the import output. Peace places them when she
  folds her Notion edits into the draft.
- An article's body comes from `content/informal/articles/<slug>.md` when it
  exists; the export supplies front matter only.
- Nothing here rewrites text. Changing what a case study says means editing the
  informal draft (or, for the summary, the Notion page) and re-importing.
