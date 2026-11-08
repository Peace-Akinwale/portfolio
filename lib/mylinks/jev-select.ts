import type { DestinationSource, PageType } from '@/lib/mylinks/types/database';

/** Pure selection rules for Jev-scored (sentence, destination) pairs. */

export interface ScoredPair {
  destinationIndex: number;
  sentenceIndex: number;
  sentenceStart: number;
  sentenceEnd: number;
  probability: number;
  pageType: PageType;
  source: DestinationSource;
}

export const JEV_ACCEPT_THRESHOLD = 0.7;
export const JEV_HIGH_CONFIDENCE = 0.85;
const COMMERCIAL_TIE_WINDOW = 0.05;
const COMMERCIAL_TYPES = new Set<PageType>(['product', 'service', 'landing', 'homepage']);

export function isCommercial(pair: Pick<ScoredPair, 'pageType' | 'source'>): boolean {
  return pair.source === 'client' || COMMERCIAL_TYPES.has(pair.pageType);
}

/** Probability plus a small bump for commercial pages, used only for ordering. */
function rank(pair: ScoredPair): number {
  return pair.probability + (isCommercial(pair) ? COMMERCIAL_TIE_WINDOW : 0);
}

export function selectPairs(pairs: ScoredPair[], threshold = JEV_ACCEPT_THRESHOLD): ScoredPair[] {
  const ordered = pairs
    .filter((pair) => pair.probability >= threshold)
    .sort((a, b) => rank(b) - rank(a) || b.probability - a.probability);

  const usedDestinations = new Set<number>();
  const usedSentences = new Set<number>();
  const kept: ScoredPair[] = [];
  for (const pair of ordered) {
    if (usedDestinations.has(pair.destinationIndex) || usedSentences.has(pair.sentenceIndex)) continue;
    usedDestinations.add(pair.destinationIndex);
    usedSentences.add(pair.sentenceIndex);
    kept.push(pair);
  }

  return kept.sort((a, b) => a.sentenceStart - b.sentenceStart);
}

export function confidenceFor(probability: number): 'high' | 'medium' | 'low' {
  if (probability >= JEV_HIGH_CONFIDENCE) return 'high';
  if (probability >= JEV_ACCEPT_THRESHOLD) return 'medium';
  return 'low';
}
