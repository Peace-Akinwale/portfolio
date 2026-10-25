import { describe, it, expect } from 'vitest';
import { NAV_LINKS } from '@/lib/site';

describe('site navigation', () => {
  it('has the six section links, each internal and unique', () => {
    const hrefs = NAV_LINKS.map((l) => l.href);
    expect(hrefs).toEqual(['/portfolio', '/case-studies', '/blog', '/services', '/about', '/contact']);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const l of NAV_LINKS) {
      expect(l.href.startsWith('/')).toBe(true);
      expect(l.label.length).toBeGreaterThan(0);
    }
  });
});
