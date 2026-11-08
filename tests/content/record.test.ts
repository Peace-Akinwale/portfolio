import { describe, it, expect } from 'vitest';
import { buildRecord, months } from '@/lib/content/record';

describe('the dated record', () => {
  const entries = buildRecord();

  it('is sorted newest first with well-formed dates and months', () => {
    for (let i = 1; i < entries.length; i++) expect(entries[i - 1].date >= entries[i].date, `${entries[i - 1].id} before ${entries[i].id}`).toBe(true);
    for (const e of entries) {
      expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.month).toBe(e.date.slice(0, 7));
      expect(['built', 'wrote', 'said', 'decided']).toContain(e.kind);
      expect(e.id).toMatch(/^[a-z0-9-]+$/);
    }
    expect(new Set(entries.map((e) => e.id)).size).toBe(entries.length);
  });

  it('only links to the site or to https pages', () => {
    for (const e of entries) {
      for (const l of [...(e.href ? [{ href: e.href }] : []), ...e.links]) expect(l.href, e.id).toMatch(/^(\/|https:\/\/)/);
    }
  });

  it('derives the month rail from the entries', () => {
    const m = months(entries);
    expect(m.length).toBeGreaterThan(0);
    expect(m[0]).toBe(entries[0].month);
  });

  it('carries the passages that moved off the homepage, word for word', async () => {
    const { CONTENTDB, GARDE } = await import('@/lib/content/home-copy');
    const byId = new Map(entries.map((e) => [e.id, e]));
    expect(byId.get('contentdb')?.body).toEqual([CONTENTDB.p1, CONTENTDB.p2]);
    expect(byId.has('reading-app')).toBe(false);
    // Garde lives on About and in its own essay, not in the writing record (Peace, 3 Nov 2026).
    expect(byId.has('garde')).toBe(false);
    expect(GARDE.essay).toBe('/blog/what-i-learned-vibe-coding-my-first-app-shutting-it-down');
  });
});
