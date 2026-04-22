import { describe, it, expect } from 'vitest';
import { extractExistingLinkRanges, rangeOverlaps } from './article-preview';

describe('extractExistingLinkRanges', () => {
  it('returns [] when html is null or empty', () => {
    expect(extractExistingLinkRanges(null, 'anything')).toEqual([]);
    expect(extractExistingLinkRanges('', 'anything')).toEqual([]);
    expect(extractExistingLinkRanges('   ', 'anything')).toEqual([]);
  });

  it('extracts a single link at the start of a paragraph', () => {
    const html = '<p><a href="https://example.com">Example</a> is a site.</p>';
    const text = 'Example is a site.';
    const ranges = extractExistingLinkRanges(html, text);
    expect(ranges).toHaveLength(1);
    expect(ranges[0]).toMatchObject({
      start: 0,
      end: 7,
      url: 'https://example.com',
      anchor_text: 'Example',
    });
    expect(text.slice(ranges[0].start, ranges[0].end)).toBe('Example');
  });

  it('extracts a link mid-sentence', () => {
    const html = '<p>Check out <a href="https://ex.com">this tool</a> today.</p>';
    const text = 'Check out this tool today.';
    const ranges = extractExistingLinkRanges(html, text);
    expect(ranges).toHaveLength(1);
    expect(text.slice(ranges[0].start, ranges[0].end)).toBe('this tool');
    expect(ranges[0].url).toBe('https://ex.com');
  });

  it('extracts multiple links across paragraphs', () => {
    const html =
      '<p>See <a href="https://a.com">alpha</a> for details.</p>' +
      '<p>Then <a href="https://b.com">beta</a> follows.</p>';
    const text = 'See alpha for details.\nThen beta follows.';
    const ranges = extractExistingLinkRanges(html, text);
    expect(ranges).toHaveLength(2);
    expect(text.slice(ranges[0].start, ranges[0].end)).toBe('alpha');
    expect(text.slice(ranges[1].start, ranges[1].end)).toBe('beta');
  });

  it('merges adjacent ranges split by inline formatting', () => {
    const html =
      '<p><a href="https://x.com">strong <strong>bold</strong> tail</a> end.</p>';
    const text = 'strong bold tail end.';
    const ranges = extractExistingLinkRanges(html, text);
    expect(ranges).toHaveLength(1);
    expect(text.slice(ranges[0].start, ranges[0].end)).toBe('strong bold tail');
    expect(ranges[0].url).toBe('https://x.com');
  });

  it('ignores non-link text', () => {
    const html = '<p>No links here.</p><p>Still none.</p>';
    const text = 'No links here.\nStill none.';
    expect(extractExistingLinkRanges(html, text)).toEqual([]);
  });
});

describe('rangeOverlaps', () => {
  const ranges = [
    { start: 10, end: 20 },
    { start: 30, end: 40 },
  ];
  it('detects overlap', () => {
    expect(rangeOverlaps(15, 18, ranges)).toBe(true);
    expect(rangeOverlaps(5, 11, ranges)).toBe(true);
    expect(rangeOverlaps(35, 50, ranges)).toBe(true);
  });
  it('rejects non-overlap', () => {
    expect(rangeOverlaps(0, 10, ranges)).toBe(false);
    expect(rangeOverlaps(20, 30, ranges)).toBe(false);
    expect(rangeOverlaps(40, 50, ranges)).toBe(false);
  });
});
