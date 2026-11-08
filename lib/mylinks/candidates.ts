import { computeHeadingRanges, rangeOverlaps } from '@/lib/mylinks/article-preview';

/**
 * Candidate generation for Jev-scored suggestions. Code proposes, Jev judges.
 * Everything here is deterministic and runs without a model.
 */

export interface Sentence {
  text: string;
  start: number;
  end: number;
  paragraphIndex: number;
  sentenceIndex: number;
}

const MIN_SENTENCE_WORDS = 6;
const MIN_SPAN_WORDS = 3;
const MAX_SPAN_WORDS = 5;
const MAX_SPANS = 60;

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'by',
  'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'it', 'its', 'this', 'that', 'these',
  'those', 'they', 'them', 'their', 'you', 'your', 'we', 'our', 'he', 'she', 'his', 'her', 'i',
  'my', 'me', 'if', 'then', 'than', 'so', 'not', 'no', 'do', 'does', 'did', 'has', 'have', 'had',
  'can', 'will', 'would', 'should', 'could', 'into', 'onto', 'up', 'out', 'about', 'when', 'what',
  'which', 'who', 'how', 'why', 'where', 'there', 'here', 'also', 'just', 'very', 'more', 'most',
  // Filler verbs and small words that make a weak anchor edge.
  'per', 'via', 'any', 'many', 'much', 'such', 'each', 'every', 'some', 'all', 'other', 'own',
  'like', 'even', 'only', 'use', 'used', 'using', 'see', 'show', 'get', 'got', 'make', 'made',
  'need', 'needs', 'want', 'let', 'lets', 'go', 'goes', 'keep', 'keeps', 'take', 'takes', 'put',
  'one', 'two', 'way', 'well', 'still', 'often', 'while', 'because', 'before', 'after', 'over',
  'under', 'off', 'down', 'again', 'yet', 'both', 'either', 'neither', 'whether', 'until', 'am',
]);

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Split a draft into body sentences, skipping headings and excluded ranges. */
export function splitSentences(
  draft: string,
  excludedRanges: Array<{ start: number; end: number }> = []
): Sentence[] {
  const skip = [...computeHeadingRanges(draft), ...excludedRanges];
  const sentences: Sentence[] = [];
  let cursor = 0;
  let paragraphIndex = 0;

  for (const line of draft.split('\n')) {
    const lineStart = cursor;
    cursor += line.length + 1;
    if (!line.trim()) {
      paragraphIndex += 1;
      continue;
    }

    let sentenceIndex = 0;
    const pattern = /[^.!?]+(?:[.!?]+["')\]]*|$)/g;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(line)) !== null) {
      const raw = match[0];
      if (!raw.trim()) continue;
      const leading = raw.length - raw.trimStart().length;
      const trailing = raw.length - raw.trimEnd().length;
      const start = lineStart + match.index + leading;
      const end = lineStart + match.index + raw.length - trailing;
      const text = draft.slice(start, end);
      if (countWords(text) < MIN_SENTENCE_WORDS) continue;
      if (rangeOverlaps(start, end, skip)) continue;
      sentences.push({ text, start, end, paragraphIndex, sentenceIndex });
      sentenceIndex += 1;
    }
    paragraphIndex += 1;
  }

  return sentences;
}

function normalizeToken(word: string): string {
  // Drop apostrophes so "it’s" and "agency's" compare as "its" and "agencys",
  // then trim punctuation from both ends.
  return word
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
}

/**
 * Anchor candidates for one sentence: spans of three to five words that stay
 * inside one clause (no commas, colons or brackets) and do not start or end on a
 * stop word. Ordered by how many words they share with the destination, so a
 * model that leans to the first option leans the right way.
 */
export function anchorSpans(sentence: string, destinationTokens: string[]): string[] {
  const wanted = new Set(destinationTokens.map(normalizeToken).filter(Boolean));
  const clauses = sentence.split(/[,;:()\[\]"“”—]+|\s[-–]\s/);
  const seen = new Set<string>();
  const scored: Array<{ span: string; score: number; order: number }> = [];

  for (const clause of clauses) {
    const words = clause.split(/\s+/).filter(Boolean);
    for (let size = MIN_SPAN_WORDS; size <= MAX_SPAN_WORDS; size += 1) {
      for (let i = 0; i + size <= words.length; i += 1) {
        const slice = words.slice(i, i + size);
        const first = normalizeToken(slice[0]);
        const last = normalizeToken(slice[slice.length - 1]);
        if (!first || !last || STOP_WORDS.has(first) || STOP_WORDS.has(last)) continue;
        const span = slice.join(' ').replace(/[.!?]+$/, '');
        if (!sentence.includes(span) || seen.has(span.toLowerCase())) continue;
        seen.add(span.toLowerCase());
        const overlap = slice.filter((w) => wanted.has(normalizeToken(w))).length;
        // Favour overlap, then shorter spans, then earlier position.
        scored.push({ span, score: overlap * 10 - size, order: scored.length });
      }
    }
  }

  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.slice(0, MAX_SPANS).map((s) => s.span);
}

/** Tokens that describe a destination page, for span ordering. */
export function destinationTokens(parts: Array<string | null | undefined>, url?: string): string[] {
  const tokens: string[] = [];
  for (const part of parts) {
    if (part) tokens.push(...part.split(/\s+/));
  }
  if (url) {
    try {
      tokens.push(...new URL(url).pathname.split(/[\/\-_]+/));
    } catch {
      // ignore malformed URLs
    }
  }
  return tokens.map(normalizeToken).filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

export function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length && i < b.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
