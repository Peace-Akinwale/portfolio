import fs from 'node:fs';
import path from 'node:path';
import { parseFrontMatter, asString, asList } from './frontmatter';
import { smartQuotes, renderMarkdown, imageRefs, readingMinutes } from './markdown';

// Case studies live in content/case-studies/<slug>.md with their images in
// public/case-studies/<slug>/. Front matter:
//   title, kind (built|wrote), status (one line, e.g. "live", "private beta"),
//   date (YYYY-MM-DD, the date the record sorts by), summary (one or two
//   sentences for indexes), cover (file name in the slug's image folder),
//   for (who it was for, optional), links: a list of "Label | https://…",
//   tags: a list, related: a list of slugs.

export type CaseStudyKind = 'built' | 'wrote';

export interface CaseStudy {
  slug: string;
  title: string;
  name: string; // short name for indexes
  blurb: string; // one line for indexes
  kind: CaseStudyKind;
  status: string;
  date: string;
  built?: string; // the label the strip shows when a build spans months, e.g. "Aug to Sep 2026"
  summary: string;
  cover?: { src: string; alt: string };
  for?: string;
  links: { label: string; href: string }[];
  tags: string[];
  related: string[];
  body: string; // markdown
  html: string;
  images: string[]; // public paths referenced by the body
  readingMinutes: number;
}

export const CASE_STUDY_DIR = path.join(process.cwd(), 'content', 'case-studies');
export const CASE_STUDY_PUBLIC = (slug: string) => `/case-studies/${slug}`;

function parseLinks(items: string[]): { label: string; href: string }[] {
  return items
    .map((item) => {
      const [label, href] = item.split('|').map((s) => s.trim());
      return label && href ? { label, href } : null;
    })
    .filter((l): l is { label: string; href: string } => !!l);
}

export function readCaseStudyFile(file: string): CaseStudy {
  const slug = path.basename(file, '.md');
  const src = fs.readFileSync(file, 'utf8');
  const { data, body } = parseFrontMatter(src);
  const kind = (asString(data.kind, 'built') as CaseStudyKind) === 'wrote' ? 'wrote' : 'built';
  const imageBase = CASE_STUDY_PUBLIC(slug);
  const cover = data.cover ? asString(data.cover) : '';
  return {
    slug,
    title: asString(data.title, slug),
    name: asString(data.name, asString(data.title, slug)),
    blurb: smartQuotes(asString(data.blurb, asString(data.summary))),
    kind,
    status: asString(data.status),
    date: asString(data.date),
    built: data.built ? asString(data.built) : undefined,
    summary: smartQuotes(asString(data.summary)),
    cover: cover ? { src: `${imageBase}/${cover}`, alt: asString(data.cover_alt, asString(data.title, slug)) } : undefined,
    for: data.for ? asString(data.for) : undefined,
    links: parseLinks(asList(data.links)),
    tags: asList(data.tags),
    related: asList(data.related),
    body,
    html: renderMarkdown(body, { imageBase }),
    images: imageRefs(body).map((p) => `${imageBase}/${p.replace(/^(\.\/)?images\/[^/]+\//, '').replace(/^\.\//, '')}`),
    readingMinutes: readingMinutes(body),
  };
}

export function listCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(CASE_STUDY_DIR)) return [];
  return fs
    .readdirSync(CASE_STUDY_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => readCaseStudyFile(path.join(CASE_STUDY_DIR, f)))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

// The first screenshot in a case study's rendered HTML, for an index thumbnail.
// Null when the study has no image, so the index leaves the slot out.
export function firstImage(cs: Pick<CaseStudy, 'html'>): { src: string; alt: string; portrait: boolean } | null {
  const tag = cs.html.match(/<img\b[^>]*>/i)?.[0];
  if (!tag) return null;
  const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
  if (!src) return null;
  const alt = tag.match(/\balt="([^"]*)"/i)?.[1] ?? '';
  const size = imageSize(path.join(process.cwd(), 'public', src.replace(/^\//, '')));
  return { src, alt, portrait: !!size && size.height > size.width * 1.15 };
}

// Width and height from a PNG, JPEG or GIF header, without decoding the file.
// A phone screenshot (tall) is shown differently from a desktop screenshot (wide).
export function imageSize(file: string): { width: number; height: number } | null {
  let fd: number | null = null;
  try {
    if (!fs.existsSync(file)) return null;
    const buf = Buffer.alloc(64 * 1024);
    fd = fs.openSync(file, 'r');
    const n = fs.readSync(fd, buf, 0, buf.length, 0);
    const b = buf.subarray(0, n);
    if (b[0] === 0x89 && b[1] === 0x50 && n >= 24) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
    if (b[0] === 0x47 && b[1] === 0x49 && n >= 10) return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
    if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i + 9 < n) {
        if (b[i] !== 0xff) { i++; continue; }
        const marker = b[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    if (fd !== null) fs.closeSync(fd);
  }
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const file = path.join(CASE_STUDY_DIR, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  return readCaseStudyFile(file);
}
