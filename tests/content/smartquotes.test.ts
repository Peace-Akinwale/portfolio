import { describe, it, expect } from 'vitest';
import { renderMarkdown, smartQuotes } from '@/lib/content/markdown';

// Design guide pass, 4 Nov 2026: prose uses real quotation marks; code stays literal.
describe('smart quotes', () => {
  it('curls apostrophes and quotes in prose', () => {
    expect(smartQuotes(`AI platforms' docs, "how it works" and don't`)).toBe('AI platforms’ docs, “how it works” and don’t');
  });
  it('closes a quote that follows a link or bold text (bug hunt, 4 Nov 2026)', () => {
    const html = renderMarkdown(`[ContentDB](https://example.com)'s library and **"bold"** and "plain"`, { imageBase: '/x' });
    expect(html).toContain('</a>’s library');
    expect(html).toContain('<strong>“bold”</strong>');
    expect(html).toContain('“plain”');
  });
  it('leaves code and attributes alone', () => {
    const html = renderMarkdown(`He said "go" and ran \`a = 'x'\`.\n\n[link](https://example.com/?q="a")`, { imageBase: '/x' });
    expect(html).toContain('“go”');
    expect(html).toContain("<code>a = 'x'</code>".replace("'x'", '&#39;x&#39;'));
    expect(html).toContain('href="https://example.com/?q=%22a%22"');
  });
});
