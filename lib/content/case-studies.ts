import fs from 'node:fs';
import path from 'node:path';
import { parseFrontMatter, asString, asList } from './frontmatter';
import { renderMarkdown, imageRefs, readingMinutes } from './markdown';

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
    blurb: asString(data.blurb, asString(data.summary)),
    kind,
    status: asString(data.status),
    date: asString(data.date),
    summary: asString(data.summary),
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
export function firstImage(cs: Pick<CaseStudy, 'html'>): { src: string; alt: string } | null {
  const tag = cs.html.match(/<img\b[^>]*>/i)?.[0];
  if (!tag) return null;
  const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
  if (!src) return null;
  const alt = tag.match(/\balt="([^"]*)"/i)?.[1] ?? '';
  return { src, alt };
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const file = path.join(CASE_STUDY_DIR, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  return readCaseStudyFile(file);
}
