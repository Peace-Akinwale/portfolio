// Finds sentences with three or more listed items ("a, b and c" / "a, b, c"),
// and the word "quietly", in the site's own copy. Peace's rule of 28 Oct 2026:
// no rule of three in a sentence; keep the two that matter or split the list
// into its own sentence. Usage: node scripts/qa/triplets.mjs [--all]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FILES = [
  ...glob('content/informal', /\.md$/),
  ...glob('content/articles', /\.md$/),
  'lib/content/home-copy.ts', 'lib/content/record.ts', 'lib/content/record-static.ts', 'lib/site.ts',
  'scripts/content/import-notion.mjs',
  'app/page.tsx', 'app/about/page.tsx', 'app/services/page.tsx', 'app/contact/page.tsx', 'app/contact/ContactForm.tsx',
  'app/testimonials/page.tsx', 'app/projects/page.tsx', 'app/blog/BlogClient.tsx', 'app/blog/page.tsx', 'app/not-found.tsx',
  'app/case-studies/page.tsx', 'app/case-studies/manyrequests/page.tsx', 'app/case-studies/[slug]/page.tsx', 'app/portfolio/page.tsx',
  'app/[slug]/page.tsx', 'app/layout.tsx',
  'components/Footer.tsx', 'components/Header.tsx', 'components/ArticleEndCta.tsx', 'components/ArticleCard.tsx',
  ...glob('components/home', /\.tsx$/), ...glob('components/record', /\.tsx$/), ...glob('components/case-study', /\.tsx$/),
].filter((f) => fs.existsSync(path.join(ROOT, f)));

function glob(dir, re) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => re.test(f)).map((f) => path.join(dir, f));
}

// Pull human-readable text out of a file: markdown as is; code files keep
// string literals and JSX text only.
function textOf(file, src) {
  if (file.endsWith('.md')) return src.replace(/^---[\s\S]*?\n---\n/, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/<[^>]+>/g, ' ');
  const out = [];
  for (const m of src.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) if (/\s/.test(m[2]) && m[2].length > 20) out.push(m[2]);
  for (const m of src.matchAll(/>([^<>{}]{20,})</g)) out.push(m[1]);
  return out.join('\n');
}

const LIST = /(?:^|[^,])\b[^,.;!?\n]{1,80}?,\s[^,.;!?\n]{1,80}?(?:,\s[^,.;!?\n]{1,80}?)*,?\s(?:and|or|nor)\s[^,.;!?\n]{1,80}/i;
const TWO_COMMAS = /[^,.;!?\n]+,\s[^,.;!?\n]+,\s[^,.;!?\n]+/;

const ADVERBS = process.argv.includes('--adverbs');
const LY_OK = new Set(['only','early','daily','weekly','monthly','family','reply','supply','apply','likely','unlikely','friendly','lonely','lovely','ugly','holy','assembly','rely','fly','july','italy','belly','jelly','ally','rally','bully','silly','lily','emily','kelly','billy','sally','polly','molly','wholly','timely','costly','orderly','elderly','lively','deadly','ghostly','worldly','surly','burly','curly','wobbly','bubbly','comply','multiply','imply','supply','smelly','woolly','hilly','chilly','oily','jolly','manly','only','anomaly','monopoly','homily','melancholy','bodily','heavenly','yearly','hourly','nightly','quarterly','fatherly','motherly','brotherly','sisterly','scholarly','leisurely','gingerly','kindly','cowardly','miserly','unruly','seemly','comely','homely','measly','portly','sly','ply','sickly','goodly','gnarly','steely','sprightly','knightly','princely','queenly','kingly','beastly','ghastly','grisly','prickly','crinkly','sparkly','crumbly','grumbly','bristly','swirly','pearly','twirly','shapely','stately','lordly','lowly','mainly']);
const DEGREE = /\b(very|quite|pretty|just|almost|basically|truly|fairly|really|actually|simply|exactly|literally|definitely|absolutely|completely|totally|entirely|utterly|highly|extremely|incredibly|remarkably|particularly|especially|relatively|essentially|generally|usually|typically|normally|frequently|rarely|hardly|nearly|merely|purely|fully|largely|mostly|partly|somewhat|rather|too)\b/gi;
let total = 0;
for (const file of FILES) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const text = textOf(file, src);
  const sentences = text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const hits = [];
  for (const s of sentences) {
    if (ADVERBS) {
      const found = new Set();
      for (const m of s.matchAll(/\b([A-Za-z]+ly)\b/g)) if (!LY_OK.has(m[1].toLowerCase())) found.add(m[1]);
      for (const m of s.matchAll(DEGREE)) found.add(m[1]);
      if (found.size) hits.push([[...found].join(','), s]);
      continue;
    }
    if (/\bquietly\b/i.test(s)) hits.push(['quietly', s]);
    else if (LIST.test(s) || TWO_COMMAS.test(s)) hits.push(['list', s]);
  }
  if (!hits.length) continue;
  console.log(`\n== ${file} (${hits.length})`);
  for (const [k, s] of hits) console.log(`  [${k}] ${s.replace(/\s+/g, ' ').slice(0, 260)}`);
  total += hits.length;
}
console.log(`\n${total} candidates in ${FILES.length} files`);
