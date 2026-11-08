import type { ExcludedRange, InventoryPage, Suggestion } from '@/lib/mylinks/ai';
import { anchorSpans, cosine, destinationTokens, splitSentences, type Sentence } from '@/lib/mylinks/candidates';
import { jevSystemOne, mapWithConcurrency, type ChoiceQuestion, type JevRequest, type JevResult, type NoulQuestion } from '@/lib/mylinks/jev';
import { confidenceFor, selectPairs, type ScoredPair } from '@/lib/mylinks/jev-select';

/**
 * Jev-scored internal link suggestions.
 *
 * Code proposes: sentences from the draft, destinations from the inventory,
 * pairs by embedding similarity, anchor spans of three to five words.
 * Jev judges: one yes/no per (sentence, page) pair, one choice per anchor.
 * No text is written by a model in this path.
 */

const SENTENCES_PER_DESTINATION = 4;
const MAX_SENTENCES = 400;
const MAX_DESTINATIONS = 100;
const JEV_CONCURRENCY = 6;

/** Copy the review page shows when the gpt-4o path ran instead of Jev. */
export function jevFallbackNotice(reason: 'missing_key' | 'error'): string {
  if (reason === 'missing_key') {
    return 'Jev is not set up on this deployment, so these suggestions came from the older generator. Add the OpenRouter key to switch.';
  }
  return 'Jev did not answer this time, so these suggestions came from the older generator. Generate again to retry Jev.';
}

export interface JevSuggestionResult {
  suggestions: Suggestion[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    estimatedCostUsd: number;
    jevRequests: number;
  };
  model: string | null;
}

export interface JevSuggestDeps {
  embed: (texts: string[]) => Promise<number[][]>;
  jev?: (request: JevRequest) => Promise<JevResult>;
}

function pageState(page: InventoryPage) {
  return {
    url: page.url,
    title: page.title ?? page.label ?? null,
    heading: page.h1 ?? null,
    description: page.meta_description ?? page.notes ?? null,
    subheadings: page.h2s?.slice(0, 12) ?? [],
    kind: page.source === 'client' ? 'client-approved destination' : page.page_type,
  };
}

function pageText(page: InventoryPage): string {
  return [page.title, page.label, page.h1, page.meta_description, page.notes, page.h2s?.join(' '), page.url]
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join('\n')
    .slice(0, 2000);
}

const FIT_QUESTION = (id: string): NoulQuestion => ({
  type: 'noul',
  instructions: `A reader of sentence ${id} would be served by a link from that sentence to the page.`,
  criteria: {
    true: 'The page covers what the sentence is about, and a reader who wanted more on that point would find it there.',
    false: 'The page is on a different subject, or only shares a few words with the sentence, or the reader gains nothing by opening it.',
  },
});

function anchorQuestion(spans: string[]): ChoiceQuestion {
  const criteria: Record<string, string> = {};
  for (const span of spans) criteria[span] = span;
  return {
    type: 'choice',
    instructions: 'Which phrase from the sentence is the best anchor text for a link to the page? The best anchor names what the page is about.',
    criteria,
  };
}

export async function getJevSuggestions(
  draft: string,
  inventory: InventoryPage[],
  excludedRanges: ExcludedRange[] = [],
  deps: JevSuggestDeps
): Promise<JevSuggestionResult> {
  const jev = deps.jev ?? jevSystemOne;
  const usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0, jevRequests: 0 };
  let model: string | null = null;
  function record(result: JevResult) {
    usage.promptTokens += result.usage.inputTokens;
    usage.completionTokens += result.usage.outputTokens;
    usage.totalTokens += result.usage.inputTokens + result.usage.outputTokens;
    usage.estimatedCostUsd += result.usage.costUsd ?? 0;
    usage.jevRequests += 1;
    model = result.model;
  }

  const sentences: Sentence[] = splitSentences(draft, excludedRanges).slice(0, MAX_SENTENCES);
  const destinations = inventory.slice(0, MAX_DESTINATIONS);
  if (sentences.length === 0 || destinations.length === 0) {
    return { suggestions: [], usage, model };
  }

  // One embedding batch: every sentence, then every destination.
  const vectors = await deps.embed([...sentences.map((s) => s.text), ...destinations.map(pageText)]);
  const sentenceVectors = vectors.slice(0, sentences.length);
  const destinationVectors = vectors.slice(sentences.length);

  // Pair each destination with its closest sentences.
  const pairsByDestination = destinations.map((_, destinationIndex) => {
    const vector = destinationVectors[destinationIndex];
    return sentences
      .map((sentence, sentenceIndex) => ({ sentenceIndex, similarity: cosine(vector, sentenceVectors[sentenceIndex]) }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, SENTENCES_PER_DESTINATION);
  });

  // Jev: one request per destination, one fit question per paired sentence.
  const scored: ScoredPair[] = [];
  await mapWithConcurrency(destinations, JEV_CONCURRENCY, async (page, destinationIndex) => {
    const paired = pairsByDestination[destinationIndex];
    if (paired.length === 0) return;
    const sentenceState: Record<string, string> = {};
    const questions: Record<string, NoulQuestion> = {};
    paired.forEach((p, i) => {
      const id = `s${i + 1}`;
      sentenceState[id] = sentences[p.sentenceIndex].text;
      questions[`fit_${id}`] = FIT_QUESTION(id);
    });
    const result = await jev({ state: { page: pageState(page), sentences: sentenceState }, questions });
    record(result);
    paired.forEach((p, i) => {
      const answer = result.answers[`fit_s${i + 1}`];
      if (!answer || answer.type !== 'noul') return;
      const sentence = sentences[p.sentenceIndex];
      scored.push({
        destinationIndex,
        sentenceIndex: p.sentenceIndex,
        sentenceStart: sentence.start,
        sentenceEnd: sentence.end,
        probability: answer.noul,
        pageType: page.page_type,
        source: page.source,
      });
    });
  });

  const kept = selectPairs(scored);

  // Jev: one choice per kept pair for the anchor phrase.
  const suggestions = await mapWithConcurrency(kept, JEV_CONCURRENCY, async (pair): Promise<Suggestion | null> => {
    const page = destinations[pair.destinationIndex];
    const sentence = sentences[pair.sentenceIndex];
    const spans = anchorSpans(sentence.text, destinationTokens([page.title, page.label, page.h1], page.url));
    if (spans.length === 0) return null;

    let anchor = spans[0];
    if (spans.length > 1) {
      const result = await jev({
        state: { page: pageState(page), sentence: sentence.text },
        questions: { anchor: anchorQuestion(spans) },
      });
      record(result);
      const answer = result.answers.anchor;
      if (answer && answer.type === 'choice' && spans.includes(answer.choice)) {
        anchor = answer.choice;
      }
    }

    const offset = sentence.text.indexOf(anchor);
    if (offset === -1) return null;
    const charStart = sentence.start + offset;
    const charEnd = charStart + anchor.length;
    const probability = Number(pair.probability.toFixed(2));
    const title = page.title ?? page.label ?? page.h1 ?? page.url;

    return {
      target_url: page.url,
      anchor_text: anchor,
      anchor_refinement: null,
      relevance_score: probability,
      confidence: confidenceFor(pair.probability),
      paragraph_index: sentence.paragraphIndex,
      sentence_index: sentence.sentenceIndex,
      char_start: charStart,
      char_end: charEnd,
      justification: `Jev scored this sentence against "${title}" at ${probability.toFixed(2)}.`,
    };
  });

  usage.estimatedCostUsd = Number(usage.estimatedCostUsd.toFixed(8));
  return {
    suggestions: suggestions.filter((s): s is Suggestion => s !== null),
    usage,
    model,
  };
}
