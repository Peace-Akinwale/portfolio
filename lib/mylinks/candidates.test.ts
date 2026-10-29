import { describe, expect, it } from 'vitest';
import { anchorSpans, splitSentences } from './candidates';

const draft = [
  'Agency Retainer Pricing: How to Choose the Right Model',
  'If you have ever wrapped up a retainer structure and wondered whether you priced it right, this is the article for you. Most agencies start with hourly billing because it feels safe.',
  'Five Types of Agency Retainers',
  'Short line here.',
  'A fixed monthly fee buys the client a set number of hours, and ManyRequests tracks the hours as they are used.',
].join('\n');

describe('splitSentences', () => {
  it('returns body sentences with offsets that point back into the draft', () => {
    const sentences = splitSentences(draft);
    for (const s of sentences) {
      expect(draft.slice(s.start, s.end)).toBe(s.text);
    }
    expect(sentences.map((s) => s.text)).toEqual([
      'If you have ever wrapped up a retainer structure and wondered whether you priced it right, this is the article for you.',
      'Most agencies start with hourly billing because it feels safe.',
      'A fixed monthly fee buys the client a set number of hours, and ManyRequests tracks the hours as they are used.',
    ]);
  });

  it('numbers paragraphs and sentences the way the review UI expects', () => {
    const sentences = splitSentences(draft);
    expect(sentences.map((s) => [s.paragraphIndex, s.sentenceIndex])).toEqual([
      [1, 0],
      [1, 1],
      [4, 0],
    ]);
  });

  it('skips heading-like lines and sentences under six words', () => {
    const texts = splitSentences(draft).map((s) => s.text);
    expect(texts).not.toContain('Agency Retainer Pricing: How to Choose the Right Model');
    expect(texts).not.toContain('Five Types of Agency Retainers');
    expect(texts).not.toContain('Short line here.');
  });

  it('skips sentences that overlap an excluded range such as an existing link', () => {
    const start = draft.indexOf('Most agencies');
    const sentences = splitSentences(draft, [{ start, end: start + 4 }]);
    expect(sentences.map((s) => s.text)).not.toContain(
      'Most agencies start with hourly billing because it feels safe.'
    );
    expect(sentences).toHaveLength(2);
  });
});

describe('anchorSpans', () => {
  const sentence =
    'A fixed monthly fee buys the client a set number of hours, and ManyRequests tracks the hours as they are used.';

  it('only returns spans of three to five words', () => {
    const spans = anchorSpans(sentence, ['agency', 'billing', 'software']);
    expect(spans.length).toBeGreaterThan(0);
    for (const span of spans) {
      const words = span.split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(3);
      expect(words).toBeLessThanOrEqual(5);
      expect(sentence).toContain(span);
    }
  });

  it('never crosses a comma and never starts or ends on a stop word', () => {
    const spans = anchorSpans(sentence, []);
    for (const span of spans) {
      expect(span).not.toMatch(/,/);
      expect(span).not.toMatch(/^(a|the|and|of|as|they|are)\b/i);
      expect(span).not.toMatch(/\b(a|the|and|of|as|they|are)$/i);
    }
  });

  it('never starts or ends on a filler verb, preposition or contraction', () => {
    const real =
      "It’s easier with ManyRequests as clients can see a list of your service in a single portal, each with their pricing (hourly or per request).";
    const spans = anchorSpans(real, ['manyrequests', 'pricing']);
    expect(spans.length).toBeGreaterThan(0);
    for (const span of spans) {
      expect(span).not.toMatch(/^(it’s|it's|its|can|see|each|per|or|with|use)\b/i);
      expect(span).not.toMatch(/\b(it’s|it's|its|can|see|each|per|or|with|use)$/i);
    }
  });

  it('puts the span that shares most words with the destination first', () => {
    const spans = anchorSpans(sentence, ['monthly', 'fee', 'invoicing']);
    expect(spans[0]).toBe('fixed monthly fee');
  });

  it('caps the list so a Jev choice never gets more than sixty options', () => {
    const long = Array.from({ length: 80 }, (_, i) => `word${i}`).join(' ') + '.';
    expect(anchorSpans(long, []).length).toBeLessThanOrEqual(60);
  });
});
