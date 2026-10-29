import { describe, expect, it } from 'vitest';
import type { InventoryPage } from './ai';
import type { JevRequest, JevResult } from './jev';
import { getJevSuggestions, jevFallbackNotice } from './jev-suggest';

const draft = [
  'Agency Retainer Pricing',
  'Most agencies start with hourly billing because it feels safe and familiar to clients.',
  'A fixed monthly fee buys the client a set number of hours, and the invoice goes out on the first of the month.',
  'Intake forms keep request-based retainers from turning into an inbox nobody owns.',
].join('\n');

const inventory: InventoryPage[] = [
  {
    url: 'https://manyrequests.com/agency-billing-software',
    title: 'Agency Billing and Invoicing Software',
    h1: 'Billing built for agencies',
    page_type: 'landing',
    priority: 70,
    source: 'inventory',
  },
  {
    url: 'https://manyrequests.com/blog/service-intake-form',
    title: 'How to build a service intake form',
    h1: null,
    page_type: 'blog_post',
    priority: 80,
    source: 'inventory',
  },
];

// A fake embedding: one dimension per keyword, so similarity is just shared words.
const KEYWORDS = ['billing', 'invoice', 'invoicing', 'intake', 'forms', 'form', 'hourly'];
function embedFake(text: string): number[] {
  const lower = text.toLowerCase();
  return KEYWORDS.map((k) => (lower.includes(k) ? 1 : 0.01));
}

function fakeJev(scoreFor: (pageUrl: string, sentence: string) => number) {
  const calls: JevRequest[] = [];
  const jev = async (request: JevRequest): Promise<JevResult> => {
    calls.push(request);
    const state = request.state as { page: { url: string }; sentences?: Record<string, string>; sentence?: string };
    const answers: JevResult['answers'] = {};
    for (const [key, question] of Object.entries(request.questions)) {
      if (question.type === 'noul') {
        const sentence = state.sentences?.[key.replace(/^fit_/, '')] ?? '';
        answers[key] = { type: 'noul', noul: scoreFor(state.page.url, sentence) };
      } else {
        const options = Object.keys(question.criteria);
        // Pick the option with "monthly fee" when present, else the first.
        const choice = options.find((o) => /monthly fee/.test(o)) ?? options[0];
        answers[key] = { type: 'choice', choice, confidence: 0.6, probabilities: { [choice]: 0.6 } };
      }
    }
    return { model: 'typesafe/jev-1.14', answers, usage: { inputTokens: 300, outputTokens: 0, costUsd: 0.0000126 } };
  };
  return { jev, calls };
}

describe('getJevSuggestions', () => {
  it('turns high-probability pairs into suggestions anchored inside the draft', async () => {
    const { jev } = fakeJev((url, sentence) => {
      if (url.includes('billing') && /monthly fee/.test(sentence)) return 0.92;
      if (url.includes('intake') && /Intake forms/.test(sentence)) return 0.81;
      return 0.1;
    });

    const result = await getJevSuggestions(draft, inventory, [], {
      embed: async (texts) => texts.map(embedFake),
      jev,
    });

    expect(result.suggestions).toHaveLength(2);
    const billing = result.suggestions.find((s) => s.target_url.includes('billing'))!;
    expect(billing.anchor_text).toBe('fixed monthly fee');
    expect(draft.slice(billing.char_start, billing.char_end)).toBe('fixed monthly fee');
    expect(billing.relevance_score).toBe(0.92);
    expect(billing.confidence).toBe('high');
    expect(billing.paragraph_index).toBe(2);
    expect(billing.anchor_refinement).toBeNull();
    expect(billing.justification).toContain('0.92');
    expect(billing.justification).toContain('Agency Billing and Invoicing Software');

    const intake = result.suggestions.find((s) => s.target_url.includes('intake'))!;
    expect(intake.confidence).toBe('medium');
    expect(intake.anchor_text.split(' ').length).toBeGreaterThanOrEqual(3);
    expect(intake.anchor_text.split(' ').length).toBeLessThanOrEqual(5);
  });

  it('returns nothing when Jev says no to every pair', async () => {
    const { jev } = fakeJev(() => 0.2);
    const result = await getJevSuggestions(draft, inventory, [], {
      embed: async (texts) => texts.map(embedFake),
      jev,
    });
    expect(result.suggestions).toEqual([]);
  });

  it('asks Jev once per destination for fit, and once per kept pair for the anchor', async () => {
    const { jev, calls } = fakeJev((url, sentence) => (url.includes('billing') && /monthly fee/.test(sentence) ? 0.9 : 0.1));
    await getJevSuggestions(draft, inventory, [], {
      embed: async (texts) => texts.map(embedFake),
      jev,
    });
    const fitCalls = calls.filter((c) => Object.values(c.questions).every((q) => q.type === 'noul'));
    const anchorCalls = calls.filter((c) => Object.values(c.questions).some((q) => q.type === 'choice'));
    expect(fitCalls).toHaveLength(2);
    expect(anchorCalls).toHaveLength(1);
  });

  it('adds up Jev usage and cost across every call', async () => {
    const { jev, calls } = fakeJev((url, sentence) => (url.includes('billing') && /monthly fee/.test(sentence) ? 0.9 : 0.1));
    const result = await getJevSuggestions(draft, inventory, [], {
      embed: async (texts) => texts.map(embedFake),
      jev,
    });
    expect(result.usage.promptTokens).toBe(300 * calls.length);
    expect(result.usage.estimatedCostUsd).toBeCloseTo(0.0000126 * calls.length, 8);
    expect(result.usage.jevRequests).toBe(calls.length);
  });
});

describe('jevFallbackNotice', () => {
  it('names the older generator and says what to do, in both cases', () => {
    expect(jevFallbackNotice('missing_key')).toMatch(/older generator/);
    expect(jevFallbackNotice('missing_key')).toMatch(/OpenRouter key/);
    expect(jevFallbackNotice('error')).toMatch(/older generator/);
    expect(jevFallbackNotice('error')).toMatch(/Generate again/);
  });

  it('follows the copy rules: no adverbs, no em dashes, no three-item lists', () => {
    for (const text of [jevFallbackNotice('missing_key'), jevFallbackNotice('error')]) {
      expect(text).not.toMatch(/—|;/);
      expect(text).not.toMatch(/\b\w+ly\b/);
      expect(text.split(',').length).toBeLessThanOrEqual(2);
    }
  });
});
