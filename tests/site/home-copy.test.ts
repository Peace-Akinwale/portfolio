import { describe, it, expect } from 'vitest';
import * as copy from '@/lib/content/home-copy';

describe('approved homepage copy', () => {
  it('preserves the exact headline and ampersand', () => {
    expect(copy.HERO.heading).toBe('I write BOFU content for B2B SaaS companies & build AI marketing workflows.');
  });
  it('uses the selected ManyRequests title and client result', () => {
    expect(copy.WRITING.heading).toBe('How I wrote 51 product-led articles for ManyRequests and made the product useful inside the piece');
    expect(copy.WRITING.p2).toContain('led to more traffic and demo requests');
  });
  it('keeps withdrawn projects out of the homepage', () => {
    const text = JSON.stringify(copy);
    expect(text).not.toContain('reading-app');
    expect(text).not.toContain('the-success-message-was-the-bug');
    expect(text).not.toContain('Three questions before anything gets made');
  });
});
