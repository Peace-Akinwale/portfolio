import { describe, it, expect } from 'vitest';
import { NAV_LINKS } from '@/lib/site';

describe('site navigation', () => {
  it('has the six section links, each internal and unique', () => {
    const hrefs = NAV_LINKS.map((l) => l.href);
    // Services first, then the two kinds of proof (decisions.md, 3 Nov 2026).
    expect(hrefs).toEqual(['/services', '/case-studies', '/portfolio', '/blog', '/about', '/contact']);
    expect(NAV_LINKS.map((l) => l.label)).toEqual(['Services', 'Case studies', 'Writing', 'Blog', 'About me', 'Say hi']);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const l of NAV_LINKS) {
      expect(l.href.startsWith('/')).toBe(true);
      expect(l.label.length).toBeGreaterThan(0);
    }
  });
});
