// Turns the verbatim Notion export (content/notion-export/) into the site's
// content files, without rewording anything:
//   content/case-studies/<slug>.md   from the ten case-study drafts
//   content/articles/<slug>.md       from the two article drafts
//   public/case-studies/<slug>/*     the images, copied from the export
// Re-run after refreshing the export. Images the export did not manage to
// download are dropped from the page (with their caption) and listed in
// content/MISSING-IMAGES.md, unless STAND_INS below maps them to a sanitized
// screenshot the repo already has. Run: node scripts/content/import-notion.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EXPORT = path.join(ROOT, 'content', 'notion-export');

// export file → site slug, kind, dates and status. Dates are the record's sort
// dates (see decisions.md 2026-10-25): the day the piece went live or the
// change it describes landed. Articles get the date they first appear on the site.
const PAGES = {
  'ai-docs-watch': { slug: 'ai-docs-watch', name: 'AI Docs Watch', blurb: 'Shows you an AI platform’s docs as they were before and after each change, with the changed words marked.', type: 'case-study', kind: 'built', date: '2026-10-14', status: 'live, public', links: ['Open AI Docs Watch | https://docswatch.stevetoth.ai'], tags: ['monitoring', 'documentation'], related: ['what-ai-search-apps-do-before-they-answer', 'fanout-query-analysis-tool'] },
  'contentdb-collect-research-and-question-your-sources': { slug: 'contentdb', name: 'ContentDB', blurb: 'Your articles and transcripts in one library you can search from a chat or from your AI assistant.', type: 'case-study', kind: 'built', date: '2026-04-15', status: 'my own app, private beta', links: ['The ContentDB project page | /projects/contentdb'], tags: ['research', 'MCP'], related: ['aloud', 'okf'] },
  'aloud-listen-to-saved-articles-and-return-to-useful-passages': { slug: 'aloud', name: 'Aloud', blurb: 'My audio library for the articles I keep meaning to read, with a reading view and saved passages.', type: 'case-study', kind: 'built', date: '2026-09-28', status: 'my own app, invite-only', links: ['Try Aloud | https://aloud.peaceakinwale.com'], tags: ['audio', 'reading'], related: ['contentdb', 'reading-app'] },
  'quality-rater-reviewing-pages-using-googles-quality-guidelines': { slug: 'quality-rater', name: 'Quality Rater', blurb: 'Checks every page against Google’s quality guidelines and points at the exact passage behind each flag.', type: 'case-study', kind: 'built', date: '2026-10-13', status: 'in team use, first version', links: [], tags: ['content audit'], related: ['ai-docs-watch', 'okf'] },
  'fanout-query-analysis-tool': { slug: 'fanout-query-analysis-tool', name: 'Fanout query analysis tool', blurb: 'Records the searches behind AI answers, and tells the pages that came back apart from the ones that got cited.', type: 'case-study', kind: 'built', date: '2026-10-01', status: 'in team use, private', links: [], tags: ['AI search', 'Chrome extension'], related: ['what-ai-search-apps-do-before-they-answer', 'ai-docs-watch'] },
  'what-ai-search-apps-do-before-they-answer-a-public-reference': { slug: 'what-ai-search-apps-do-before-they-answer', name: 'A public reference to AI search traffic', blurb: 'What AI search apps send and receive while they answer you, explained field by field. Each explanation comes with the recording behind it.', type: 'case-study', kind: 'built', date: '2026-10-02', status: 'published, public', links: [], tags: ['AI search', 'research'], related: ['fanout-query-analysis-tool', 'ai-docs-watch'] },
  'building-an-okf-that-a-team-can-ask-for-guidance': { slug: 'okf', video: { after: '### What an OKF is', id: 'esYAIA6lU-s', title: 'Build an OKF brain like mine! (Marie Haynes, YouTube)', caption: 'Marie Haynes walks through the OKF brain she built for her own SEO work. She shows how a note is structured and how it differs from retrieval over whole documents. 23 minutes, June 2026. The format itself is Google’s, and its <a href="https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md">specification is on GitHub</a>.' }, name: 'An OKF a team can ask', blurb: 'A founder’s notes turned into linked notes the team can ask, and every answer cites where it came from.', type: 'case-study', kind: 'built', date: '2026-10-20', status: 'in team use, private', links: ['Google’s OKF specification on GitHub | https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md', 'Marie Haynes on building an OKF brain | https://www.youtube.com/watch?v=esYAIA6lU-s'], tags: ['knowledge', 'OKF'], related: ['contentdb', 'quality-rater'] },
  'a-reading-app-for-reviewing-posts-and-preparing-newsletter-notes': { slug: 'reading-app', title: 'An app an agency uses to follow SEO and AEO trends', name: 'An app an agency uses to follow SEO and AEO trends', blurb: 'Pulls the posts worth reading into one feed you can listen to, and starred posts turn into newsletter notes.', type: 'case-study', kind: 'built', date: '2026-06-10', status: 'private to the client’s team', links: ['Five lessons from building it, an article | /the-success-message-was-the-bug'], tags: ['reading', 'newsletter'], related: ['aloud', 'ai-docs-watch'] },
  'reach-hands-on-my-mac-for-ai-agents-that-cant-reach-it': { slug: 'reach', name: 'Reach', blurb: 'When an AI coding session needs my Mac’s screen, it hands the job to Reach and gets the result back.', type: 'case-study', kind: 'built', date: '2026-09-27', status: 'personal tool, two Macs', links: [], tags: ['agents', 'automation'], related: ['aloud', 'contentdb'] },
  'build-a-course-portal-around-the-instructors-workflow': { slug: 'build-a-course-portal-around-the-instructors-workflow', type: 'article', date: '2026-10-25', standfirst: 'Building a members’ portal for an eight-week course taught me which parts of the instructor’s process the software should leave alone.', tags: ['Building', 'Tools'] },
  'the-success-message-was-the-bug-five-lessons-from-building-an-ai-assisted-reading-tool': { slug: 'the-success-message-was-the-bug', title: 'The success message was a bug: five lessons from building an app an agency uses to follow SEO and AEO trends', type: 'article', date: '2026-10-25', standfirst: 'A notification said the post was in the feed and the roundup. It wasn’t. Five lessons from building an app an agency uses to follow SEO and AEO trends, starting with that message.', tags: ['Building', 'AI'], review: 'Review before launch: “for about two weeks” in lesson 4 conflicts with the checked commit interval of roughly 8½ hours. Peace to confirm the wording.' },
};

// Export image file → a sanitized screenshot already in the repo (same screen).
const STAND_INS = {
  'ai-docs-watch/1-docswatch-02-change-page.png': 'public/images/home/docswatch-change.jpg',
  'ai-docs-watch/6-docswatch-01-hub.png': 'public/images/home/docswatch-hub-no-nav.jpg',
  'contentdb-collect-research-and-question-your-sources/1-contentdb-add-content-demo.png': 'public/images/contentdb/add-content.png',
};

const missing = [];
const written = [];

// Informal drafts (content/informal/<slug>.md, Peace's request of 26 Oct 2026)
// replace a case study's text on the site. They mark each screenshot with
// [[img]]; the k-th marker gets the k-th image (and its caption) from the
// original export, so images and captions stay exactly where Peace put them.
// The original export is never changed.
const INFORMAL = path.join(ROOT, 'content', 'informal');
function imageBlocks(body) {
  const lines = body.split('\n');
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^!\[[^\]]*\]\(images\//.test(lines[i])) continue;
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    const hasCaption = j < lines.length && /^\*[^*].*\*$/.test(lines[j].trim());
    blocks.push(hasCaption ? `${lines[i]}\n\n${lines[j]}` : lines[i]);
  }
  return blocks;
}
// Captions in the export that were working notes, not reader copy.
const CAPTION_FIXES = {
  'Existing portfolio capture of the import screen with demonstration data; capture date unverified.': 'The import screen, with demonstration data.',
};
function withInformal(slug, originalBody) {
  const file = path.join(INFORMAL, `${slug}.md`);
  if (!fs.existsSync(file)) return { body: originalBody, informal: false };
  const draft = fs.readFileSync(file, 'utf8');
  const blocks = imageBlocks(originalBody);
  const markers = (draft.match(/\[\[img\]\]/g) || []).length;
  // The export can carry a different set of images than the draft was written
  // against (Peace re-cut the Notion pages on 30 and 31 Oct 2026). Markers take
  // the images in order; spare markers go; spare images are appended at the end
  // so nothing she added in Notion is lost. She places them when she folds the
  // Notion text into the draft.
  if (markers !== blocks.length) console.warn(`${slug}: informal draft has ${markers} image markers, export has ${blocks.length} images; ${markers > blocks.length ? 'dropping spare markers' : 'appending spare images at the end'}`);
  let k = 0;
  let body = draft.replace(/\[\[img\]\]/g, () => blocks[k++] ?? '');
  if (k < blocks.length) body = body.trimEnd() + '\n\n' + blocks.slice(k).join('\n\n') + '\n';
  for (const [from, to] of Object.entries(CAPTION_FIXES)) body = body.replace(from, to);
  return { body, informal: true };
}

function readExport(name) {
  const src = fs.readFileSync(path.join(EXPORT, `${name}.md`), 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const head = Object.fromEntries(m[1].split('\n').map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]; }));
  return { head, body: m[2].replace(/^\n+/, '') };
}

function placeImages(body, exportSlug, siteSlug, publicDir) {
  fs.mkdirSync(publicDir, { recursive: true });
  const lines = body.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^!\[([^\]]*)\]\(images\/([^/]+)\/([^)]+)\)\s*$/);
    if (!m) { out.push(line); continue; }
    const [, alt, folder, file] = m;
    const key = `${folder}/${file}`;
    const exported = path.join(EXPORT, 'images', folder, file);
    const standIn = STAND_INS[key] ? path.join(ROOT, STAND_INS[key]) : null;
    const source = fs.existsSync(exported) ? exported : standIn && fs.existsSync(standIn) ? standIn : null;
    // the caption is the next non-empty line when it is a lone italic
    let caption = null; let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    if (j < lines.length && /^\*[^*].*\*$/.test(lines[j].trim())) { caption = lines[j].trim(); }
    if (!source) {
      missing.push({ page: siteSlug, file: key, alt, caption });
      if (caption) i = j; // drop the caption with the image
      continue;
    }
    const ext = path.extname(source);
    const target = file.replace(/^\d+-/, '').replace(/\.[a-z0-9]+$/i, '') + ext;
    fs.copyFileSync(source, path.join(publicDir, target));
    out.push(`![${alt.replace(/[-_]/g, ' ')}](images/${siteSlug}/${target})`);
  }
  return out.join('\n');
}

function splitSummary(body) {
  const m = body.match(/^## Portfolio summary\s*\n([\s\S]*?)\n## Case study\s*\n([\s\S]*)$/);
  if (!m) return { summary: '', rest: body };
  return { summary: m[1].trim().replace(/\s+/g, ' '), rest: m[2].replace(/^\n+/, '') };
}

// A YouTube video placed after a given heading's first paragraph block, as a
// privacy-enhanced, lazily loaded embed with a caption.
function insertVideo(md, v) {
  const lines = md.split('\n');
  const at = lines.findIndex((l) => l.trim() === v.after);
  if (at === -1) throw new Error(`video anchor not found: ${v.after}`);
  let i = at + 1;
  while (i < lines.length && lines[i].trim() === '') i++;
  while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('#')) i++;
  const html = `<figure class="video"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}" title="${v.title.replace(/"/g, '&quot;')}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><figcaption>${v.caption}</figcaption></figure>`;
  lines.splice(i, 0, '', html, '');
  return lines.join('\n');
}

const yamlList = (key, items) => (items && items.length ? `${key}:\n${items.map((i) => `  - "${i.replace(/"/g, '\\"')}"`).join('\n')}\n` : '');
const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;

for (const [name, meta] of Object.entries(PAGES)) {
  const { head, body } = readExport(name);
  if (meta.type === 'case-study') {
    const publicDir = path.join(ROOT, 'public', 'case-studies', meta.slug);
    const chosen = withInformal(meta.slug, body);
    const placed = placeImages(chosen.body, name, meta.slug, publicDir);
    const { summary, rest: body0 } = splitSummary(placed);
    const rest = meta.video ? insertVideo(body0, meta.video) : body0;
    const fm = `---\ntitle: ${q(meta.title ?? head.title)}\nname: ${q(meta.name)}\nblurb: ${q(meta.blurb)}\nkind: ${meta.kind}\nstatus: ${q(meta.status)}\ndate: ${meta.date}\n${meta.for ? `for: ${q(meta.for)}\n` : ''}summary: ${q(summary)}\nvoice: ${chosen.informal ? 'informal' : 'original'}\nnotion_url: ${head.notion_url}\nnotion_last_edited: ${head.notion_last_edited}\n${yamlList('links', meta.links)}${yamlList('tags', meta.tags)}${yamlList('related', meta.related)}---\n`;
    const file = path.join(ROOT, 'content', 'case-studies', `${meta.slug}.md`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, fm + '\n' + rest.trimEnd() + '\n');
    written.push(file);
  } else {
    const publicDir = path.join(ROOT, 'public', 'articles', meta.slug);
    // Peace's edited article bodies (28 Oct 2026 copy rules) live in
    // content/informal/articles/<slug>.md and win over the export, so a
    // re-import refreshes the front matter without wiping the edits.
    const edited = path.join(INFORMAL, 'articles', `${meta.slug}.md`);
    const placed = fs.existsSync(edited)
      ? fs.readFileSync(edited, 'utf8')
      : placeImages(body, name, meta.slug, publicDir).replace(/^\*Peace Akinwale\*\s*\n+/, '');
    const fm = `---\ntitle: ${q(meta.title ?? head.title)}\ndate: ${meta.date}\nstandfirst: ${q(meta.standfirst)}\nnotion_url: ${head.notion_url}\nnotion_last_edited: ${head.notion_last_edited}\n${yamlList('tags', meta.tags)}${meta.review ? `review: ${q(meta.review)}\n` : ''}---\n`;
    const file = path.join(ROOT, 'content', 'articles', `${meta.slug}.md`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, fm + '\n' + placed.trimEnd() + '\n');
    written.push(file);
  }
}

const report = ['# Images the Notion export could not download', '', 'Generated by `scripts/content/import-notion.mjs`. Each line is an image the page refers to in Notion that is not on this Mac. Drop the file into `content/notion-export/images/<page>/<file>` (or export the Notion page with files) and re-run the script; the image and its caption return to the page.', ''];
for (const m of missing) report.push(`- **${m.page}**: \`${m.file}\` ${m.caption ? `(caption ${m.caption})` : ''}`);
fs.writeFileSync(path.join(ROOT, 'content', 'MISSING-IMAGES.md'), report.join('\n') + '\n');
console.log(`wrote ${written.length} files; ${missing.length} images missing (content/MISSING-IMAGES.md)`);
