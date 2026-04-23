import OpenAI from 'openai';
import { z } from 'zod';
import { rangeOverlaps } from '@/lib/mylinks/article-preview';
import type { DestinationSource, PageType } from '@/lib/mylinks/types/database';

export interface ExcludedRange {
  start: number;
  end: number;
  url?: string;
}

const SUGGESTION_MODEL = 'gpt-4o';
const EMBEDDING_MODEL = 'text-embedding-3-small';
export const EMBEDDING_DIMENSIONS = 1536;
const EMBEDDING_MAX_INPUT_CHARS = 7000;

function getClient(): OpenAI {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!.trim(),
    maxRetries: 3,
    timeout: 60_000,
  });
}

export function formatVector(values: number[]): string {
  return `[${values.join(',')}]`;
}

export interface PageEmbeddingInput {
  url: string;
  title?: string | null;
  h1?: string | null;
  meta_description?: string | null;
  h2s?: string[] | null;
}

export function buildPageEmbeddingText(page: PageEmbeddingInput): string {
  const parts = [page.title, page.h1, page.meta_description, page.h2s?.join(' '), page.url]
    .map((part) => (typeof part === 'string' ? part.trim() : null))
    .filter((part): part is string => Boolean(part));
  return parts.join('\n').slice(0, EMBEDDING_MAX_INPUT_CHARS);
}

function truncateForEmbedding(text: string): string {
  return text.slice(0, EMBEDDING_MAX_INPUT_CHARS);
}

export async function embedText(text: string): Promise<number[]> {
  const input = truncateForEmbedding(text);
  if (!input) {
    throw new Error('embedText called with empty input');
  }
  const response = await getClient().embeddings.create({
    model: EMBEDDING_MODEL,
    input,
  });
  return response.data[0].embedding;
}

export async function batchEmbedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }
  const inputs = texts.map((text) => truncateForEmbedding(text) || ' ');
  const response = await getClient().embeddings.create({
    model: EMBEDDING_MODEL,
    input: inputs,
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

export interface InventoryPage {
  url: string;
  title: string | null;
  h1: string | null;
  page_type: PageType;
  priority: number;
  source: DestinationSource;
  label?: string | null;
  notes?: string | null;
}

export const SuggestionSchema = z.object({
  target_url: z.string().url(),
  anchor_text: z.string().min(1).max(200),
  anchor_refinement: z.string().nullable().optional(),
  relevance_score: z.number().min(0).max(1),
  confidence: z.enum(['low', 'medium', 'high']),
  paragraph_index: z.number().int().min(0),
  sentence_index: z.number().int().min(0),
  char_start: z.number().int().min(0),
  char_end: z.number().int().min(0),
  justification: z.string().min(10),
});

export type Suggestion = z.infer<typeof SuggestionSchema>;

export interface SuggestionResult {
  suggestions: Suggestion[];
  usage: {
    promptTokens: number | null;
    completionTokens: number | null;
    totalTokens: number | null;
    estimatedCostUsd: number | null;
  };
}

const suggestionJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          target_url: { type: 'string' },
          anchor_text: { type: 'string' },
          anchor_refinement: { type: ['string', 'null'] },
          relevance_score: { type: 'number' },
          confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
          paragraph_index: { type: 'integer' },
          sentence_index: { type: 'integer' },
          char_start: { type: 'integer' },
          char_end: { type: 'integer' },
          justification: { type: 'string' },
        },
        required: [
          'target_url',
          'anchor_text',
          'anchor_refinement',
          'relevance_score',
          'confidence',
          'paragraph_index',
          'sentence_index',
          'char_start',
          'char_end',
          'justification',
        ],
      },
    },
  },
  required: ['suggestions'],
} as const;

function buildExcludedRangesSection(draft: string, ranges: ExcludedRange[]): string {
  if (ranges.length === 0) return '';
  const lines = ranges
    .slice(0, 60)
    .map((range) => {
      const snippet = draft.slice(range.start, range.end).replace(/\s+/g, ' ').trim();
      const urlNote = range.url ? ` (linked to ${range.url})` : '';
      return `- "${snippet}" [chars ${range.start}-${range.end}]${urlNote}`;
    })
    .join('\n');
  return `\n\n## ALREADY LINKED ANCHORS (do not suggest new links here)
The author has already hyperlinked these phrases in the source document. Do not propose any suggestion whose [char_start, char_end) overlaps any of these ranges. Pick different anchor text instead:
${lines}`;
}

function buildPrompt(
  draft: string,
  inventory: InventoryPage[],
  excludedRanges: ExcludedRange[] = []
): string {
  const inventoryLines = inventory
    .map((page, index) =>
      [
        `${index + 1}. URL: ${page.url}`,
        `   Destination source: ${page.source}`,
        `   Title: ${page.title ?? page.label ?? 'N/A'}`,
        `   H1: ${page.h1 ?? 'N/A'}`,
        `   Type: ${page.page_type} (priority ${page.priority})`,
        page.notes ? `   Notes: ${page.notes}` : null,
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n\n');

  return `You are an expert internal linking editor helping a content strategist insert as many genuinely useful links as fit naturally in a draft.

## DESTINATION INVENTORY (${inventory.length} choices)
${inventoryLines}

## ARTICLE DRAFT
${draft}

## OBJECTIVE
Read the entire article draft above before generating any suggestions — do not stop after the opening paragraphs. Scan every section from start to finish, then return every link that is genuinely useful.

Your goal is maximum coverage of contextually relevant destinations across the whole article. Include a suggestion whenever the anchor text appears naturally in the draft AND the destination clearly serves the reader AND relevance_score is at least 0.6.

If the inventory is rich enough to support 15 or more suggestions, aim for at least 15 and spread them across early, middle, and late sections of the article. If the draft supports 40+ strong links, return 40+. If the inventory is sparse or the article is niche and only 3 links genuinely fit, return 3. Returning zero is correct when no destination clearly fits — do not invent weak matches to hit a number.

## CRITICAL PRIORITIES
1. Use only URLs from the provided inventory.
2. Consider commercial destinations intentionally: product, service, feature, landing, pricing, and solution pages should be recommended whenever they are the best fit.
3. If a destination source is "client", treat it as client-approved and use it whenever it is clearly relevant.
4. Never use headings or section titles as anchor text.
5. The anchor text must appear verbatim in the draft body.

## OUTPUT RULES
For each suggestion:
- provide target_url
- provide anchor_text exactly as it appears in the draft
- provide exact 0-indexed char_start and char_end for that anchor
- provide paragraph_index and sentence_index
- relevance_score must be at least 0.6
- confidence should be high, medium, or low
- anchor_refinement is optional — set to null if you have no better alternative
- justification should explain why this destination is valuable for the reader — keep it to one concise sentence

## SAFETY RULES
- Never suggest the same URL twice.
- Never suggest the article's own URL.
- Never place anchors in H2, H3, headings, title-like lines, numbered section titles, or standalone short section labels.
- Never place anchors on phrases the author already hyperlinked (see the ALREADY LINKED ANCHORS section if present).
- Prefer exact topical fit over blog bias.
- If a product or service page is a better destination than a blog post, choose it.

Return JSON matching the schema.${buildExcludedRangesSection(draft, excludedRanges)}`;
}

function estimateCostUsd(promptTokens: number | null, completionTokens: number | null) {
  if (promptTokens == null && completionTokens == null) {
    return null;
  }
  const inputCost = ((promptTokens ?? 0) / 1_000_000) * 2.5;
  const outputCost = ((completionTokens ?? 0) / 1_000_000) * 10.0;
  return Number((inputCost + outputCost).toFixed(6));
}

function salvageTruncatedSuggestions(rawText: string): unknown {
  const arrayStart = rawText.indexOf('[');
  if (arrayStart === -1) {
    return { suggestions: [] };
  }

  const objects: string[] = [];
  let depth = 0;
  let inString = false;
  let escape = false;
  let objectStart = -1;

  for (let i = arrayStart + 1; i < rawText.length; i += 1) {
    const ch = rawText[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (ch === '\\') {
        escape = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        objects.push(rawText.slice(objectStart, i + 1));
        objectStart = -1;
      }
    }
  }

  return { suggestions: objects.map((raw) => JSON.parse(raw)) };
}

function resolveAnchorRange(
  text: string,
  suggestion: Suggestion,
  excludedRanges: ExcludedRange[] = []
) {
  const isExcluded = (start: number, end: number) =>
    excludedRanges.length > 0 && rangeOverlaps(start, end, excludedRanges);

  // Pass 1: exact match
  const exactSlice = text.slice(suggestion.char_start, suggestion.char_end);
  if (exactSlice === suggestion.anchor_text && !isExcluded(suggestion.char_start, suggestion.char_end)) {
    return { start: suggestion.char_start, end: suggestion.char_end };
  }

  let searchFrom = 0;
  while (searchFrom < text.length) {
    const index = text.indexOf(suggestion.anchor_text, searchFrom);
    if (index === -1) break;
    const end = index + suggestion.anchor_text.length;
    if (!isExcluded(index, end)) return { start: index, end };
    searchFrom = end;
  }

  // Pass 2: case-insensitive fallback (positions stay valid since length is unchanged)
  const lowerText = text.toLowerCase();
  const lowerAnchor = suggestion.anchor_text.toLowerCase();
  searchFrom = 0;
  while (searchFrom < lowerText.length) {
    const index = lowerText.indexOf(lowerAnchor, searchFrom);
    if (index === -1) break;
    const end = index + lowerAnchor.length;
    if (!isExcluded(index, end)) return { start: index, end };
    searchFrom = end;
  }

  return null;
}

async function getSuggestionsForText(
  draft: string,
  inventory: InventoryPage[],
  excludedRanges: ExcludedRange[] = []
): Promise<SuggestionResult> {
  const prompt = buildPrompt(draft, inventory, excludedRanges);
  const client = getClient();

  const completion = await client.chat.completions.create({
    model: SUGGESTION_MODEL,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'link_suggestions',
        schema: suggestionJsonSchema,
        strict: true,
      },
    },
  });

  const rawText = completion.choices[0]?.message?.content ?? '';
  const finishReason = completion.choices[0]?.finish_reason ?? null;
  if (finishReason && finishReason !== 'stop') {
    console.warn(
      `[openai] suggestion generation finished with reason=${finishReason} (rawLength=${rawText.length})`
    );
  }

  let salvageUsed = false;
  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(rawText);
  } catch (err) {
    salvageUsed = true;
    console.warn(
      `[openai] JSON parse failed (${err instanceof Error ? err.message : err}); salvaging truncated response (finishReason=${finishReason ?? 'unknown'})`
    );
    rawPayload = salvageTruncatedSuggestions(rawText);
  }

  const envelope = z.object({ suggestions: z.array(z.unknown()) }).parse(rawPayload);
  const validSuggestions: Suggestion[] = [];
  let droppedSuggestions = 0;
  for (const item of envelope.suggestions) {
    const parsedItem = SuggestionSchema.safeParse(item);
    if (parsedItem.success) {
      validSuggestions.push(parsedItem.data);
    } else {
      droppedSuggestions += 1;
    }
  }
  if (salvageUsed || droppedSuggestions > 0) {
    console.warn(
      `[openai] suggestion parse summary: raw=${envelope.suggestions.length} valid=${validSuggestions.length} dropped=${droppedSuggestions} salvage=${salvageUsed}`
    );
  }

  const validated: Suggestion[] = [];
  const seenUrls = new Set<string>();
  let droppedDupe = 0;
  let droppedAnchor = 0;
  let resolvedExact = 0;
  let resolvedFuzzy = 0;

  for (const suggestion of validSuggestions) {
    if (seenUrls.has(suggestion.target_url)) {
      droppedDupe += 1;
      continue;
    }
    const range = resolveAnchorRange(draft, suggestion, excludedRanges);
    if (!range) {
      droppedAnchor += 1;
      continue;
    }
    // Use the actual text from the article so the display code can match it exactly
    const actualAnchorText = draft.slice(range.start, range.end);
    // Skip image placeholders and other non-prose artifacts
    if (/^\[.*\]$/.test(actualAnchorText.trim())) {
      droppedAnchor += 1;
      continue;
    }
    const wasExact = actualAnchorText === suggestion.anchor_text;
    if (wasExact) {
      resolvedExact += 1;
    } else {
      resolvedFuzzy += 1;
    }
    seenUrls.add(suggestion.target_url);
    validated.push({
      ...suggestion,
      anchor_text: actualAnchorText,
      char_start: range.start,
      char_end: range.end,
    });
  }

  console.log(
    `[suggestions] ai=${validSuggestions.length} dupes=${droppedDupe} exact=${resolvedExact} fuzzy=${resolvedFuzzy} anchor_miss=${droppedAnchor} final=${validated.length}`
  );

  const usage = completion.usage;
  const promptTokens = usage?.prompt_tokens ?? null;
  const completionTokens = usage?.completion_tokens ?? null;
  const totalTokens = usage?.total_tokens ?? null;

  return {
    suggestions: validated,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCostUsd: estimateCostUsd(promptTokens, completionTokens),
    },
  };
}

// ---------------------------------------------------------------------------
// Chunked orchestrator — splits long articles so the model reads every section
// ---------------------------------------------------------------------------

const CHUNK_WORD_THRESHOLD = 1500;
const CHUNK_TARGET_WORDS = 1200;

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function splitIntoChunks(
  text: string,
  targetWords: number
): Array<{ text: string; start: number }> {
  // Split on paragraph boundaries so we never cut mid-sentence
  const segments: Array<{ text: string; start: number }> = [];
  let cursor = 0;
  for (const part of text.split(/(\n+)/)) {
    if (/^\n+$/.test(part)) {
      cursor += part.length;
    } else {
      segments.push({ text: part, start: cursor });
      cursor += part.length;
    }
  }

  const chunks: Array<{ text: string; start: number }> = [];
  let group: typeof segments = [];
  let wordCount = 0;

  for (const seg of segments) {
    if (wordCount >= targetWords && group.length > 0) {
      const first = group[0];
      const last = group[group.length - 1];
      chunks.push({ start: first.start, text: text.slice(first.start, last.start + last.text.length) });
      group = [];
      wordCount = 0;
    }
    group.push(seg);
    wordCount += countWords(seg.text);
  }
  if (group.length > 0) {
    const first = group[0];
    const last = group[group.length - 1];
    chunks.push({ start: first.start, text: text.slice(first.start, last.start + last.text.length) });
  }

  return chunks;
}

function adjustRangesForChunk(
  ranges: ExcludedRange[],
  chunkStart: number,
  chunkLength: number
): ExcludedRange[] {
  const chunkEnd = chunkStart + chunkLength;
  return ranges
    .filter(r => r.start < chunkEnd && r.end > chunkStart)
    .map(r => ({
      ...r,
      start: Math.max(0, r.start - chunkStart),
      end: Math.min(chunkLength, r.end - chunkStart),
    }));
}

export async function getSuggestions(
  draft: string,
  inventory: InventoryPage[],
  excludedRanges: ExcludedRange[] = []
): Promise<SuggestionResult> {
  const wordCount = countWords(draft);

  if (wordCount <= CHUNK_WORD_THRESHOLD) {
    return getSuggestionsForText(draft, inventory, excludedRanges);
  }

  const chunks = splitIntoChunks(draft, CHUNK_TARGET_WORDS);
  console.log(
    `[suggestions] chunking ${wordCount}-word article into ${chunks.length} chunks (${chunks.map(c => countWords(c.text)).join('+' )} words)`
  );

  const chunkResults = await Promise.all(
    chunks.map(chunk =>
      getSuggestionsForText(
        chunk.text,
        inventory,
        adjustRangesForChunk(excludedRanges, chunk.start, chunk.text.length)
      )
    )
  );

  // Merge: deduplicate by URL, re-resolve positions against full article
  const seenUrls = new Set<string>();
  const merged: Suggestion[] = [];
  let promptTokens = 0;
  let completionTokens = 0;
  let totalTokens = 0;
  let totalCost = 0;

  for (const result of chunkResults) {
    for (const suggestion of result.suggestions) {
      if (seenUrls.has(suggestion.target_url)) continue;
      const range = resolveAnchorRange(draft, suggestion, excludedRanges);
      if (!range) continue;
      const actualAnchorText = draft.slice(range.start, range.end);
      if (/^\[.*\]$/.test(actualAnchorText.trim())) continue;
      seenUrls.add(suggestion.target_url);
      merged.push({ ...suggestion, anchor_text: actualAnchorText, char_start: range.start, char_end: range.end });
    }
    promptTokens += result.usage.promptTokens ?? 0;
    completionTokens += result.usage.completionTokens ?? 0;
    totalTokens += result.usage.totalTokens ?? 0;
    totalCost += result.usage.estimatedCostUsd ?? 0;
  }

  merged.sort((a, b) => a.char_start - b.char_start);
  console.log(`[suggestions] merged final=${merged.length}`);

  return {
    suggestions: merged,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCostUsd: Number(totalCost.toFixed(6)),
    },
  };
}
