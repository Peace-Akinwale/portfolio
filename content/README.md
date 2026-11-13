# Site content that lives in this repo

Blog posts, the About page and the ManyRequests sample lists still come from WordPress.com (`lib/wordpress/client.ts`, env `WORDPRESS_SITE`). Everything below is edited here and deploys with the site. Hosting is Railway. Hashnode is not used.

| Folder | What | Shown at |
|---|---|---|
| `content/case-studies/<slug>.md` | One case study per tool. Front matter: `title`, `kind` (`built` or `wrote`), `status`, `date` (the record sorts by it), `for` (optional), `summary`, `links` (list of `Label | URL`), `tags`, `related` (slugs). Body is Markdown. | `/case-studies/<slug>`, the `/case-studies` index, the `/portfolio` record |
| `public/case-studies/<slug>/` | That case study's images. Refer to them in the Markdown as `images/<slug>/<file>`; an italic line right under an image becomes its caption. | the case-study page |
| `content/articles/<slug>.md` | Articles written here rather than on WordPress. Front matter: `title`, `date`, `standfirst`, `tags`, optional `cover`, optional `review` (a note shown only in development). | `/<slug>`, `/blog`, RSS, the record |
| `public/articles/<slug>/` | That article's images. | the article page |
| `lib/content/home-copy.ts` | The homepage's words, including the passages Peace approved verbatim. | `/`, `/services` |
| `lib/content/record-static.ts` | Record entries that are not a case study or an article: writing samples with evidence, what clients said, dated decisions. | `/portfolio` |
| `content/notion-export/` | The verbatim export of the Notion collection the case studies came from (`scripts/content/import-notion.mjs` turns it into the files above). Keep it; re-export and re-run to update. | nothing directly |

Rules the tests enforce (`npm test`): every image a page refers to exists under `public/`; no em dashes outside quotations; "fanout query analysis tool" and "an OKF", never the agency-branded names; `related` slugs are real; the homepage keeps the approved opening and the Garde paragraph stays with Garde.

Missing images are listed in `content/MISSING-IMAGES.md`.
