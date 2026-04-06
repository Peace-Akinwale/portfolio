import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai';
import { z } from 'zod';
import { isRangeInsideHeading } from '@/lib/mylinks/article-preview';
import type { DestinationSource, PageType } from '@/lib/mylinks/types/database';

const MODEL_NAME = 'gemini-2.5-flash';

function getGeminiClient() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!.trim());
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
Return 12-24 strong suggestions if the draft supports that many natural links. Suggest fewer only when the draft truly lacks natural anchors.

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
- justification should explain why this destination is valuable for the reader and the editorial outcome

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
  const model = getGeminiClient().getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema,
      temperature: 0.3,
    },
  });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const prompt = buildPrompt(draft, inventory);
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const rawPayload = JSON.parse(rawText);
      const parsed = z.object({ suggestions: z.array(SuggestionSchema) }).parse(rawPayload);

      const validated: Suggestion[] = [];
      const seenUrls = new Set<string>();

      for (const suggestion of parsed.suggestions) {
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
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw lastError ?? new Error('Gemini suggestion generation failed after 2 attempts');
}
