/**
 * Jev (TypeSafe's decision model) through OpenRouter's System One endpoint.
 *
 * Verified against docs.typesafe.ai/api/system-one and
 * openrouter.ai/docs/guides/community/jev on 29 Oct 2026:
 *   POST {JEV_BASE_URL}/systemone, Authorization: Bearer <OPENROUTER_API_KEY>,
 *   body { model, state, questions }, response { model, answers, usage }.
 *   Retry 429 and 529 with backoff. Never retry 400, 401, 413, 422.
 *
 * One fetch call, no SDK, so no new dependency.
 */

export const JEV_DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';
export const JEV_DEFAULT_MODEL = 'typesafe/jev-1.14';

type Instructions = string | Record<string, unknown> | unknown[];

export interface NoulQuestion {
  type: 'noul';
  instructions: Instructions;
  criteria?: { true: string; false: string };
}

export interface ChoiceQuestion {
  type: 'choice';
  instructions: Instructions;
  criteria: Record<string, string>;
}

export type JevQuestion = NoulQuestion | ChoiceQuestion;

export interface NoulAnswer {
  type: 'noul';
  noul: number;
}

export interface ChoiceAnswer {
  type: 'choice';
  choice: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export type JevAnswer = NoulAnswer | ChoiceAnswer;

export interface JevRequest {
  state: string | Record<string, unknown> | unknown[];
  questions: Record<string, JevQuestion>;
}

export interface JevResult {
  model: string;
  answers: Record<string, JevAnswer>;
  usage: { inputTokens: number; outputTokens: number; costUsd: number | null };
}

export interface JevCallOptions {
  fetch?: typeof fetch;
  timeoutMs?: number;
  maxAttempts?: number;
  retryDelayMs?: number;
}

export class JevError extends Error {
  status: number | null;
  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = 'JevError';
    this.status = status;
  }
}

export function jevConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim() || '';
  const baseUrl = (process.env.JEV_BASE_URL?.trim() || JEV_DEFAULT_BASE_URL).replace(/\/+$/, '');
  const model = process.env.JEV_MODEL?.trim() || JEV_DEFAULT_MODEL;
  return { apiKey, baseUrl, model };
}

export function isJevConfigured(): boolean {
  return jevConfig().apiKey.length > 0;
}

const RETRY_STATUSES = new Set([429, 529, 500, 502, 503, 504]);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function jevSystemOne(request: JevRequest, options: JevCallOptions = {}): Promise<JevResult> {
  const { apiKey, baseUrl, model } = jevConfig();
  if (!apiKey) {
    throw new JevError('OPENROUTER_API_KEY is not set');
  }
  const doFetch = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? 20_000;
  const maxAttempts = options.maxAttempts ?? 3;
  const retryDelayMs = options.retryDelayMs ?? 400;

  const body = JSON.stringify({ model, state: request.state, questions: request.questions });
  let lastError: JevError | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let response: Response;
    try {
      response = await doFetch(`${baseUrl}/systemone`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body,
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      lastError = new JevError(error instanceof Error ? error.message : 'Jev request failed');
      if (attempt < maxAttempts) await sleep(retryDelayMs * 2 ** (attempt - 1));
      continue;
    }

    if (response.ok) {
      const payload = (await response.json()) as {
        model?: string;
        answers?: Record<string, JevAnswer>;
        usage?: { input_tokens?: number; output_tokens?: number; cost?: number };
      };
      if (!payload.answers) {
        throw new JevError('Jev response had no answers', response.status);
      }
      return {
        model: payload.model ?? model,
        answers: payload.answers,
        usage: {
          inputTokens: payload.usage?.input_tokens ?? 0,
          outputTokens: payload.usage?.output_tokens ?? 0,
          costUsd: typeof payload.usage?.cost === 'number' ? payload.usage.cost : null,
        },
      };
    }

    const text = await response.text().catch(() => '');
    lastError = new JevError(`Jev returned ${response.status}${text ? `: ${text.slice(0, 200)}` : ''}`, response.status);
    if (!RETRY_STATUSES.has(response.status)) {
      throw lastError;
    }
    if (attempt < maxAttempts) await sleep(retryDelayMs * 2 ** (attempt - 1));
  }

  throw lastError ?? new JevError('Jev request failed');
}

/** Run tasks with at most `limit` in flight. Order of results matches input. */
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}
