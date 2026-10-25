import { listCaseStudies } from './case-studies';
import { listLocalArticles } from './articles';
import { STATIC_ENTRIES } from './record-static';
import { CONTENTDB, READING_APP } from './home-copy';

// Entries whose homepage passage moved here (26 Oct 2026): Peace's approved wording replaces the index blurb.
const APPROVED_BODY: Record<string, string[]> = {
  contentdb: [CONTENTDB.p1],
  'reading-app': [READING_APP.p1],
};
const EXTRA_LINKS: Record<string, { label: string; href: string }[]> = {
  'reading-app': [{ label: 'Five lessons from building it', href: READING_APP.article }],
};

// The dated record on /portfolio: everything Peace built, wrote and decided,
// newest first, in one list. Built entries come from the case studies, article
// entries from the local articles, and the rest (writing samples with evidence,
// what clients said, dated decisions) from record-static.ts.

export type RecordKind = 'built' | 'wrote' | 'said' | 'decided';

export interface RecordEntry {
  id: string;
  kind: RecordKind;
  date: string; // YYYY-MM-DD, sorts the record
  dateLabel: string; // what the reader sees, e.g. "Aug to Oct 2026"
  month: string; // YYYY-MM, for the rail
  title: string;
  href?: string; // where the title goes (internal or https)
  context?: string; // e.g. "live, public" or "on my blog"
  body: string[]; // paragraphs
  figure?: { src: string; width: number; height: number; alt: string; caption?: string; narrow?: boolean };
  quote?: { text: string; by: string };
  facts?: { k: string; v: string }[];
  more?: { summary: string; body: string[] }; // opens in place
  links: { label: string; href: string }[];
}

export const KIND_LABEL: Record<RecordKind, string> = {
  built: 'Built',
  wrote: 'Wrote',
  said: 'A client said',
  decided: 'Decided',
};

export { monthLabel, monthShort, dayLabel } from './dates';
import { dayLabel } from './dates';

export function buildRecord(): RecordEntry[] {
  const fromStudies: RecordEntry[] = listCaseStudies().map((cs) => ({
    id: cs.slug,
    kind: cs.kind,
    date: cs.date,
    dateLabel: dayLabel(cs.date),
    month: cs.date.slice(0, 7),
    title: cs.name,
    href: `/case-studies/${cs.slug}`,
    context: cs.status,
    body: APPROVED_BODY[cs.slug] ?? [cs.blurb],
    figure: cs.cover ? { src: cs.cover.src, width: 1600, height: 1000, alt: cs.cover.alt } : undefined,
    links: [{ label: 'Read the case study', href: `/case-studies/${cs.slug}` }, ...(EXTRA_LINKS[cs.slug] ?? cs.links.slice(0, 1))],
  }));

  const fromArticles: RecordEntry[] = listLocalArticles().map((a) => ({
    id: a.slug,
    kind: 'wrote',
    date: a.publishedAt.slice(0, 10),
    dateLabel: dayLabel(a.publishedAt.slice(0, 10)),
    month: a.publishedAt.slice(0, 7),
    title: a.title,
    href: `/${a.slug}`,
    context: 'on my blog',
    body: [a.brief],
    links: [{ label: 'Read the article', href: `/${a.slug}` }],
  }));

  const ids = new Set([...fromStudies, ...fromArticles].map((e) => e.id));
  const statics = STATIC_ENTRIES.filter((e) => !ids.has(e.id));

  return [...fromStudies, ...fromArticles, ...statics].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id.localeCompare(b.id)));
}

export function months(entries: RecordEntry[]): string[] {
  return [...new Set(entries.map((e) => e.month))];
}
