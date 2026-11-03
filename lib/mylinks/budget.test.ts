import { describe, expect, it } from 'vitest';
import { estimateEmbeddingCostUsd, withinBudget } from './budget';

describe('withinBudget', () => {
  it('has no cap when the budget is null', () => {
    expect(withinBudget(null, 50)).toBe(true);
    expect(withinBudget(undefined, 50)).toBe(true);
  });

  it('allows spend below the budget and stops at it', () => {
    expect(withinBudget(2, 1.99)).toBe(true);
    expect(withinBudget(2, 2)).toBe(false);
    expect(withinBudget(2, 2.4)).toBe(false);
  });
});

describe('estimateEmbeddingCostUsd', () => {
  it('prices about 4 characters a token at $0.02 per 1M tokens', () => {
    expect(estimateEmbeddingCostUsd(['a'.repeat(4_000_000)])).toBeCloseTo(0.02, 6);
    expect(estimateEmbeddingCostUsd([])).toBe(0);
  });
});
