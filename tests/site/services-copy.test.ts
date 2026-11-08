import { describe, it, expect } from 'vitest';
import { readPage } from '@/lib/content/pages';

describe('selected services copy', () => {
  const { html } = readPage('services');
  it('retains approved pricing and payment terms', () => {
    const figures = [...html.matchAll(/\$([\d,]+)/g)].map((m) => m[1]);
    expect(new Set(figures)).toEqual(new Set(['400', '600', '20', '700']));
    expect(html).toContain('50% is due upfront and 50% on completion');
    expect(html).toContain('American Banks');
    expect(html).not.toContain('net-15');
    expect(html).not.toContain('Prices in US dollars');
  });
  it('shows the approved client logos and consultation terms', () => {
    expect((html.match(/class="client-logo[ "]/g) ?? []).length).toBe(8);
    expect(html).toContain('The first call is free');
    expect(html).toContain('You own the code');
    expect(html).toContain('build and review period');
  });
});
