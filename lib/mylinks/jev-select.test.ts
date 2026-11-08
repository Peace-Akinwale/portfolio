import { describe, expect, it } from 'vitest';
import { confidenceFor, selectPairs, type ScoredPair } from './jev-select';

function pair(overrides: Partial<ScoredPair>): ScoredPair {
  return {
    destinationIndex: 0,
    sentenceIndex: 0,
    sentenceStart: 0,
    sentenceEnd: 10,
    probability: 0.9,
    pageType: 'blog_post',
    source: 'inventory',
    ...overrides,
  };
}

describe('selectPairs', () => {
  it('drops pairs under the threshold', () => {
    const kept = selectPairs([pair({ probability: 0.69 }), pair({ destinationIndex: 1, sentenceIndex: 1, sentenceStart: 20, sentenceEnd: 30, probability: 0.7 })]);
    expect(kept.map((p) => p.destinationIndex)).toEqual([1]);
  });

  it('keeps one pair per destination, the strongest', () => {
    const kept = selectPairs([
      pair({ sentenceIndex: 0, sentenceStart: 0, sentenceEnd: 10, probability: 0.8 }),
      pair({ sentenceIndex: 1, sentenceStart: 20, sentenceEnd: 30, probability: 0.95 }),
    ]);
    expect(kept).toHaveLength(1);
    expect(kept[0].sentenceIndex).toBe(1);
  });

  it('keeps one pair per sentence, the strongest', () => {
    const kept = selectPairs([
      pair({ destinationIndex: 0, probability: 0.8 }),
      pair({ destinationIndex: 1, probability: 0.9 }),
    ]);
    expect(kept).toHaveLength(1);
    expect(kept[0].destinationIndex).toBe(1);
  });

  it('lets a commercial page win a near tie against a blog post', () => {
    const kept = selectPairs([
      pair({ destinationIndex: 0, probability: 0.9, pageType: 'blog_post' }),
      pair({ destinationIndex: 1, probability: 0.87, pageType: 'service' }),
    ]);
    expect(kept[0].destinationIndex).toBe(1);
  });

  it('does not let a commercial page win a clear loss', () => {
    const kept = selectPairs([
      pair({ destinationIndex: 0, probability: 0.95, pageType: 'blog_post' }),
      pair({ destinationIndex: 1, probability: 0.75, pageType: 'service' }),
    ]);
    expect(kept[0].destinationIndex).toBe(0);
  });

  it('treats client-approved URLs as commercial', () => {
    const kept = selectPairs([
      pair({ destinationIndex: 0, probability: 0.9, pageType: 'blog_post' }),
      pair({ destinationIndex: 1, probability: 0.88, pageType: 'landing', source: 'client' }),
    ]);
    expect(kept[0].destinationIndex).toBe(1);
  });

  it('returns the kept pairs in draft order', () => {
    const kept = selectPairs([
      pair({ destinationIndex: 0, sentenceIndex: 2, sentenceStart: 200, sentenceEnd: 220, probability: 0.9 }),
      pair({ destinationIndex: 1, sentenceIndex: 0, sentenceStart: 0, sentenceEnd: 20, probability: 0.8 }),
    ]);
    expect(kept.map((p) => p.sentenceStart)).toEqual([0, 200]);
  });
});

describe('confidenceFor', () => {
  it('is high from 0.85 and medium below that', () => {
    expect(confidenceFor(0.85)).toBe('high');
    expect(confidenceFor(0.84)).toBe('medium');
    expect(confidenceFor(0.7)).toBe('medium');
  });
});
