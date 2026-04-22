import { GoogleGenerativeAI, SchemaType, type GenerateContentResult, type Schema } from '@google/generative-ai';
import { z } from 'zod';
import { isRangeInsideHeading } from '@/lib/mylinks/article-preview';
import type { DestinationSource, PageType } from '@/lib/mylinks/types/database';

const MODEL_FALLBACK_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
] as const;
const EMBEDDING_MODEL_NAME = 'embedding-001';
export const EMBEDDING_DIMENSIONS = 768;
const EMBEDDING_MAX_INPUT_CHARS = 7000;

function getGeminiClient() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!.trim());
}

function isTransientGeminiError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('503') ||
    message.includes('502') ||
    message.includes('500') ||
    message.includes('429') ||
    message.includes('unavailable') ||
    message.includes('overload') ||
    message.includes('rate limit') ||
    message.includes('timeout') ||
    message.includes('deadline')
  );
}

async function withGeminiRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const MAX_ATTEMPTS = 5;
  const BASE_DELAY_MS = 1000;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const isLastAttempt = attempt === MAX_ATTEMPTS - 1;
      if (!isTransientGeminiError(lastError) || isLastAttempt) {
        break;
      }
      const delayMs = BASE_DELAY_MS * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError ?? new Error(`${label} failed after 5 attempts`);
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
  const model = getGeminiClient().getGenerativeModel({ model: EMBEDDING_MODEL_NAME });
  return withGeminiRetry('embedText', async () => {
    const result = await model.embedContent(input);
    return result.embedding.values;
  });
}

export async function batchEmbedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }
  const model = getGeminiClient().getGenerativeModel({ model: EMBEDDING_MODEL_NAME });
  const prepared = texts.map((text) => truncateForEmbedding(text));
  return withGeminiRetry('batchEmbedTexts', async () => {
    const result = await model.batchEmbedContents({
      requests: prepared.map((text) => ({
        content: { role: 'user', parts: [{ text: text || ' ' }] },
      })),
    });
    return result.embeddings.map((embedding) => embedding.values);
  });
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

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    suggestions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          target_url: { type: SchemaType.STRING },
          anchor_text: { type: SchemaType.STRING },
          anchor_refinement: { type: SchemaType.STRING },
          relevance_score: { type: SchemaType.NUMBER },
          confidence: { type: SchemaType.STRING },
          paragraph_index: { type: SchemaType.NUMBER },
          sentence_index: { type: SchemaType.NUMBER },
          char_start: { type: SchemaType.NUMBER },
          char_end: { type: SchemaType.NUMBER },
          justification: { type: SchemaType.STRING },
        },
        required: [
          'target_url',
          'anchor_text',
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
};

function buildPrompt(draft: string, inventory: InventoryPage[]): string {
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

## ARTICLE DRAFT
${draft}

## DESTINATION INVENTORY (${inventory.length} choices)
${inventoryLines}

## OBJECTIVE
Return every link that is genuinely useful — do not cap the count. Your goal is maximum coverage of contextually relevant destinations. Include a suggestion whenever the anchor text appears naturally in the draft AND the destination clearly serves the reader AND relevance_score is at least 0.6. If the draft supports 40+ strong links, return 40+. If it only supports 3, return 3. Returning zero suggestions is correct when no destination clearly fits — do not invent weak matches to hit a number.

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
- anchor_refinement is optional
- justification should explain why this destination is valuable for the reader — keep it to one concise sentence

## SAFETY RULES
- Never suggest the same URL twice.
- Never suggest the article's own URL.
- Never place anchors in H2, H3, headings, title-like lines, numbered section titles, or standalone short section labels.
- Prefer exact topical fit over blog bias.
- If a product or service page is a better destination than a blog post, choose it.

Return JSON matching the schema.`;
}

function estimateCostUsd(promptTokens: number | null, completionTokens: number | null) {
  if (promptTokens == null && completionTokens == null) {
    return null;
  }

  const inputCost = ((promptTokens ?? 0) / 1_000_000) * 0.3;
  const outputCost = ((completionTokens ?? 0) / 1_000_000) * 2.5;
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

function resolveAnchorRange(text: string, suggestion: Suggestion) {
  const exactSlice = text.slice(suggestion.char_start, suggestion.char_end);
  if (
    exactSlice === suggestion.anchor_text &&
    !isRangeInsideHeading(text, suggestion.char_start, suggestion.char_end)
  ) {
    return {
      start: suggestion.char_start,
      end: suggestion.char_end,
    };
  }

  let searchFrom = 0;
  while (searchFrom < text.length) {
    const index = text.indexOf(suggestion.anchor_text, searchFrom);
    if (index === -1) {
      return null;
    }
    const end = index + suggestion.anchor_text.length;
    if (!isRangeInsideHeading(text, index, end)) {
      return { start: index, end };
    }
    searchFrom = end;
  }

  return null;
}

export async function getSuggestions(
  draft: string,
  inventory: InventoryPage[]
): Promise<SuggestionResult> {
  const prompt = buildPrompt(draft, inventory);
  const generationConfig = {
    responseMimeType: 'application/json',
    responseSchema,
    temperature: 0.3,
    maxOutputTokens: 32768,
  } as const;

  let result: GenerateContentResult | null = null;
  let lastError: Error | null = null;
  for (const modelName of MODEL_FALLBACK_CHAIN) {
    const model = getGeminiClient().getGenerativeModel({ model: modelName, generationConfig });
    try {
      result = await withGeminiRetry(`getSuggestions(${modelName})`, () => model.generateContent(prompt));
      break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[gemini] model ${modelName} failed after retries; trying next fallback: ${lastError.message}`);
    }
  }
  if (!result) {
    throw lastError ?? new Error('getSuggestions failed across all fallback models');
  }
  const rawText = result.response.text();
  const finishReason = result.response.candidates?.[0]?.finishReason ?? null;
  if (finishReason && finishReason !== 'STOP') {
    console.warn(
      `[gemini] suggestion generation finished with reason=${finishReason} (rawLength=${rawText.length})`
    );
  }
  let salvageUsed = false;
  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(rawText);
  } catch (err) {
    salvageUsed = true;
    console.warn(
      `[gemini] JSON parse failed (${err instanceof Error ? err.message : err}); salvaging truncated response (finishReason=${finishReason ?? 'unknown'})`
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
      `[gemini] suggestion parse summary: raw=${envelope.suggestions.length} valid=${validSuggestions.length} dropped=${droppedSuggestions} salvage=${salvageUsed}`
    );
  }

  const validated: Suggestion[] = [];
  const seenUrls = new Set<string>();

  for (const suggestion of validSuggestions) {
    if (seenUrls.has(suggestion.target_url)) {
      continue;
    }

    const range = resolveAnchorRange(draft, suggestion);
    if (!range) {
      continue;
    }

    seenUrls.add(suggestion.target_url);
    validated.push({
      ...suggestion,
      char_start: range.start,
      char_end: range.end,
    });
  }

  const usageMetadata = result.response.usageMetadata;
  const promptTokens = usageMetadata?.promptTokenCount ?? null;
  const completionTokens = usageMetadata?.candidatesTokenCount ?? null;
  const totalTokens = usageMetadata?.totalTokenCount ?? null;

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
