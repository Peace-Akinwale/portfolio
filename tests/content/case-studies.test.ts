import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { listCaseStudies } from '@/lib/content/case-studies';
import { listLocalArticles } from '@/lib/content/articles';

const FORBIDDEN = [/Fanout Notebook/i, /Notebook OKF/i];

function stripQuotes(md: string): string {
  // Peace's own quotations and other people's words may hold any punctuation.
  return md.replace(/^>.*$/gm, '').replace(/[“"][^”"]*[”"]/g, '');
}

describe('local content', () => {
  const studies = listCaseStudies();
  const articles = listLocalArticles();

  it('every case study has the front matter the pages need', () => {
    for (const cs of studies) {
      expect(cs.title, cs.slug).not.toBe(cs.slug);
      expect(cs.date, cs.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(cs.summary.length, cs.slug).toBeGreaterThan(20);
      expect(['built', 'wrote']).toContain(cs.kind);
    }
  });

  it('every image a page references exists under public/', () => {
    for (const piece of [...studies, ...articles]) {
      const refs = [...piece.images, ...('cover' in piece && piece.cover ? [piece.cover.src] : []), ...('coverImage' in piece && piece.coverImage ? [piece.coverImage.url] : [])];
      for (const ref of refs) {
        const file = path.join(process.cwd(), 'public', ref);
        expect(fs.existsSync(file), `${piece.slug}: missing ${ref}`).toBe(true);
      }
    }
  });

  it('uses the agreed names and no em dashes outside quotations', () => {
    for (const piece of [...studies, ...articles]) {
      const md = 'body' in piece ? piece.body : piece.content.markdown;
      for (const re of FORBIDDEN) expect(md, piece.slug).not.toMatch(re);
      expect(stripQuotes(md), `${piece.slug} has an em dash`).not.toContain('—');
    }
  });

  it('related slugs point at real case studies', () => {
    const slugs = new Set(studies.map((s) => s.slug));
    for (const cs of studies) for (const r of cs.related) expect(slugs.has(r), `${cs.slug} → ${r}`).toBe(true);
  });
});
