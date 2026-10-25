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
  'ai-docs-watch': { slug: 'ai-docs-watch', name: 'AI Docs Watch', blurb: 'Publishes official platform documentation as it stood before and after each change, with the changed words marked.', type: 'case-study', kind: 'built', date: '2026-10-14', status: 'live, public', links: ['Open AI Docs Watch | https://docswatch.stevetoth.ai'], tags: ['monitoring', 'documentation'], related: ['what-ai-search-apps-do-before-they-answer', 'fanout-query-analysis-tool'] },
  'contentdb-collect-research-and-question-your-sources': { slug: 'contentdb', name: 'ContentDB', blurb: 'One library for articles, transcripts and documents, searchable from a chat or from a connected AI assistant.', type: 'case-study', kind: 'built', date: '2026-04-15', status: 'my own app, private beta', links: ['The ContentDB project page | /projects/contentdb'], tags: ['research', 'MCP'], related: ['aloud', 'okf'] },
  'aloud-listen-to-saved-articles-and-return-to-useful-passages': { slug: 'aloud', name: 'Aloud', blurb: 'A personal audio library for saved articles and documents, with a reading view and saved passages.', type: 'case-study', kind: 'built', date: '2026-09-28', status: 'my own app, invite-only', links: ['The public Aloud log on GitHub | https://github.com/Peace-Akinwale/portfolio/blob/master/case-studies/aloud/index.md'], tags: ['audio', 'reading'], related: ['contentdb', 'reading-app'] },
  'quality-rater-reviewing-pages-using-googles-quality-guidelines': { slug: 'quality-rater', name: 'Quality Rater', blurb: 'Flags pages for human review against Google’s quality guidelines and links each finding to its passage.', type: 'case-study', kind: 'built', date: '2026-10-13', status: 'in team use, accuracy not yet measured', links: [], tags: ['content audit'], related: ['ai-docs-watch', 'okf'] },
  'fanout-query-analysis-tool': { slug: 'fanout-query-analysis-tool', name: 'Fanout query analysis tool', blurb: 'Records the searches behind AI answers and separates the pages returned from the pages cited.', type: 'case-study', kind: 'built', date: '2026-10-01', status: 'in team use, private', links: [], tags: ['AI search', 'Chrome extension'], related: ['what-ai-search-apps-do-before-they-answer', 'ai-docs-watch'] },
  'what-ai-search-apps-do-before-they-answer-a-public-reference': { slug: 'what-ai-search-apps-do-before-they-answer', name: 'A public reference to AI search traffic', blurb: 'Explains the fields AI search apps send and receive, built from recorded conversations, with the evidence for each.', type: 'case-study', kind: 'built', date: '2026-10-02', status: 'published, public', links: [], tags: ['AI search', 'research'], related: ['fanout-query-analysis-tool', 'ai-docs-watch'] },
  'building-an-okf-that-a-team-can-ask-for-guidance': { slug: 'okf', video: { after: '### What an OKF is', id: 'esYAIA6lU-s', title: 'Build an OKF brain like mine! (Marie Haynes, YouTube)', caption: 'Marie Haynes walks through the OKF brain she built for her own SEO work: how a note is structured, how it differs from retrieval over whole documents, and approving an update plan before anything is added. 23 minutes, June 2026. The format itself is Google’s, and its <a href="https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md">specification is on GitHub</a>.' }, name: 'An OKF a team can ask', blurb: 'A founder’s notes turned into linked notes a team can question, with answers that cite the notes they came from.', type: 'case-study', kind: 'built', date: '2026-10-20', status: 'in team use, private', links: ['Google’s OKF specification on GitHub | https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md', 'Marie Haynes on building an OKF brain | https://www.youtube.com/watch?v=esYAIA6lU-s'], tags: ['knowledge', 'OKF'], related: ['contentdb', 'quality-rater'] },
  'a-reading-app-for-reviewing-posts-and-preparing-newsletter-notes': { slug: 'reading-app', name: 'A reading app for a content team', blurb: 'Gathers public posts into one review feed with audio digests; starred posts become newsletter notes.', type: 'case-study', kind: 'built', date: '2026-06-10', status: 'private to the client’s team', links: ['Five lessons from building it, an article | /the-success-message-was-the-bug'], tags: ['reading', 'newsletter'], related: ['aloud', 'ai-docs-watch'] },
  'reach-hands-on-my-mac-for-ai-agents-that-cant-reach-it': { slug: 'reach', name: 'Reach', blurb: 'Hands a task that needs my Mac’s screen from an AI coding session to a local one, and returns the result.', type: 'case-study', kind: 'built', date: '2026-09-27', status: 'personal tool, two Macs', links: [], tags: ['agents', 'automation'], related: ['aloud', 'contentdb'] },
  'build-a-course-portal-around-the-instructors-workflow': { slug: 'build-a-course-portal-around-the-instructors-workflow', type: 'article', date: '2026-10-25', standfirst: 'What I learned building a members’ portal for an eight-week course: which parts of the instructor’s process the software should leave alone.', tags: ['Building', 'Tools'] },
  'the-success-message-was-the-bug-five-lessons-from-building-an-ai-assisted-reading-tool': { slug: 'the-success-message-was-the-bug', type: 'article', date: '2026-10-25', standfirst: 'A notification said the post was in the feed and the roundup. It wasn’t. Five lessons from building an AI-assisted reading tool with coding agents, starting with that message.', tags: ['Building', 'AI'], review: 'Review before launch: “for about two weeks” in lesson 4 conflicts with the checked commit interval of roughly 8½ hours. Peace to confirm the wording.' },
};

// Export image file → a sanitized screenshot already in the repo (same screen).
const STAND_INS = {
  'ai-docs-watch/1-docswatch-02-change-page.png': 'public/images/home/docswatch-change.jpg',
  'ai-docs-watch/6-docswatch-01-hub.png': 'public/images/home/docswatch-hub-no-nav.jpg',
  'contentdb-collect-research-and-question-your-sources/1-contentdb-add-content-demo.png': 'public/images/contentdb/add-content.png',
};

const missing = [];
const written = [];

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
    const placed = placeImages(body, name, meta.slug, publicDir);
    const { summary, rest: body0 } = splitSummary(placed);
    const rest = meta.video ? insertVideo(body0, meta.video) : body0;
    const fm = `---\ntitle: ${q(head.title)}\nname: ${q(meta.name)}\nblurb: ${q(meta.blurb)}\nkind: ${meta.kind}\nstatus: ${q(meta.status)}\ndate: ${meta.date}\n${meta.for ? `for: ${q(meta.for)}\n` : ''}summary: ${q(summary)}\nnotion_url: ${head.notion_url}\nnotion_last_edited: ${head.notion_last_edited}\n${yamlList('links', meta.links)}${yamlList('tags', meta.tags)}${yamlList('related', meta.related)}---\n`;
    const file = path.join(ROOT, 'content', 'case-studies', `${meta.slug}.md`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, fm + '\n' + rest.trimEnd() + '\n');
    written.push(file);
  } else {
    const publicDir = path.join(ROOT, 'public', 'articles', meta.slug);
    const placed = placeImages(body, name, meta.slug, publicDir).replace(/^\*Peace Akinwale\*\s*\n+/, '');
    const fm = `---\ntitle: ${q(head.title)}\ndate: ${meta.date}\nstandfirst: ${q(meta.standfirst)}\nnotion_url: ${head.notion_url}\nnotion_last_edited: ${head.notion_last_edited}\n${yamlList('tags', meta.tags)}${meta.review ? `review: ${q(meta.review)}\n` : ''}---\n`;
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
