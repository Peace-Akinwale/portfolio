import { afterEach, describe, expect, it, vi } from 'vitest';
import { JevError, isJevConfigured, jevSystemOne } from './jev';

type FetchLike = typeof fetch;

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const okBody = {
  model: 'typesafe/jev-1.14',
  answers: {
    fit_s1: { type: 'noul', noul: 0.91 },
    anchor: { type: 'choice', choice: 'fixed monthly fee', confidence: 0.62, probabilities: { 'fixed monthly fee': 0.7, 'set number': 0.3 } },
  },
  usage: { input_tokens: 412, output_tokens: 0, cost: 0.0000173 },
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('isJevConfigured', () => {
  it('is false without an OpenRouter key', () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    expect(isJevConfigured()).toBe(false);
  });

  it('is true when the key is set', () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'sk-or-test');
    expect(isJevConfigured()).toBe(true);
  });
});

describe('jevSystemOne', () => {
  it('posts to the systemone endpoint with the bearer key and the pinned model', async () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'sk-or-test');
    vi.stubEnv('JEV_BASE_URL', '');
    vi.stubEnv('JEV_MODEL', '');
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fakeFetch: FetchLike = async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return jsonResponse(200, okBody);
    };

    const result = await jevSystemOne(
      { state: { page: 'x' }, questions: { fit_s1: { type: 'noul', instructions: 'Fits?' } } },
      { fetch: fakeFetch }
    );

    expect(calls[0].url).toBe('https://openrouter.ai/api/v1/systemone');
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer sk-or-test');
    const body = JSON.parse(String(calls[0].init.body));
    expect(body.model).toBe('typesafe/jev-1.14');
    expect(body.state).toEqual({ page: 'x' });
    expect(result.answers.fit_s1).toEqual({ type: 'noul', noul: 0.91 });
    expect(result.usage).toEqual({ inputTokens: 412, outputTokens: 0, costUsd: 0.0000173 });
  });

  it('retries a 429 and then returns the good answer', async () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'sk-or-test');
    let attempts = 0;
    const fakeFetch: FetchLike = async () => {
      attempts += 1;
      return attempts === 1 ? jsonResponse(429, { error: 'slow down' }) : jsonResponse(200, okBody);
    };
    const result = await jevSystemOne(
      { state: 's', questions: { fit_s1: { type: 'noul', instructions: 'Fits?' } } },
      { fetch: fakeFetch, retryDelayMs: 1 }
    );
    expect(attempts).toBe(2);
    expect(result.answers.fit_s1.type).toBe('noul');
  });

  it('does not retry a 400 and throws with the status', async () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'sk-or-test');
    let attempts = 0;
    const fakeFetch: FetchLike = async () => {
      attempts += 1;
      return jsonResponse(400, { detail: 'max_tokens_exceeded' });
    };
    await expect(
      jevSystemOne({ state: 's', questions: { q: { type: 'noul', instructions: 'x' } } }, { fetch: fakeFetch, retryDelayMs: 1 })
    ).rejects.toMatchObject({ name: 'JevError', status: 400 });
    expect(attempts).toBe(1);
  });

  it('gives up after the retries run out', async () => {
    vi.stubEnv('OPENROUTER_API_KEY', 'sk-or-test');
    let attempts = 0;
    const fakeFetch: FetchLike = async () => {
      attempts += 1;
      return jsonResponse(529, { error: 'overloaded' });
    };
    await expect(
      jevSystemOne({ state: 's', questions: { q: { type: 'noul', instructions: 'x' } } }, { fetch: fakeFetch, retryDelayMs: 1, maxAttempts: 3 })
    ).rejects.toBeInstanceOf(JevError);
    expect(attempts).toBe(3);
  });

  it('throws before calling anything when the key is missing', async () => {
    vi.stubEnv('OPENROUTER_API_KEY', '');
    let attempts = 0;
    const fakeFetch: FetchLike = async () => {
      attempts += 1;
      return jsonResponse(200, okBody);
    };
    await expect(
      jevSystemOne({ state: 's', questions: { q: { type: 'noul', instructions: 'x' } } }, { fetch: fakeFetch })
    ).rejects.toBeInstanceOf(JevError);
    expect(attempts).toBe(0);
  });
});
