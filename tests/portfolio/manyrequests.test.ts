import { describe, expect, it } from 'vitest';
import {
  FEATURED_MANYREQUESTS_ARTICLES,
  isRetiredSample,
  withCurrentManyRequestsSamples,
} from '@/lib/portfolio/manyrequests';
import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';

const portfolio = (links: string[]): ParsedPortfolio => ({
  sections: [
    { heading: 'ManyRequests', clientName: 'ManyRequests', projects: links.map((link) => ({ title: link, link })) },
    { heading: 'Pangea', clientName: 'Pangea', projects: [{ title: 'Roadmap', link: 'https://pangea.ai/resources/technology-roadmap' }] },
  ],
});

describe('isRetiredSample', () => {
  it('matches retired ManyRequests paths regardless of www or trailing slash', () => {
    expect(isRetiredSample('https://manyrequests.com/blog/clickup-vs-notion/')).toBe(true);
    expect(isRetiredSample('https://www.manyrequests.com/blog/copilot-alternatives')).toBe(true);
    expect(isRetiredSample('https://www.manyrequests.com/blog/finance-tools')).toBe(true);
  });

  it('keeps live samples and other clients', () => {
    expect(isRetiredSample('https://www.manyrequests.com/blog/wrike-vs-clickup')).toBe(false);
    expect(isRetiredSample('https://example.com/blog/clickup-vs-notion')).toBe(false);
    expect(isRetiredSample(undefined)).toBe(false);
    expect(isRetiredSample('not a url')).toBe(false);
  });
});

describe('withCurrentManyRequestsSamples', () => {
  it('drops retired samples and leaves other sections alone', () => {
    const result = withCurrentManyRequestsSamples(
      portfolio(['https://www.manyrequests.com/blog/clickup-vs-notion', 'https://www.manyrequests.com/blog/workfront-alternatives']),
    );
    expect(result.sections[0].projects.map((p) => p.link)).toEqual(['https://www.manyrequests.com/blog/workfront-alternatives']);
    expect(result.sections[1].projects).toHaveLength(1);
  });

  it('prepends extra articles without duplicating ones already listed', () => {
    const result = withCurrentManyRequestsSamples(
      portfolio(['https://manyrequests.com/blog/wrike-vs-clickup/']),
      FEATURED_MANYREQUESTS_ARTICLES,
    );
    const links = result.sections[0].projects.map((p) => p.link);
    expect(links.filter((link) => link?.includes('wrike-vs-clickup'))).toHaveLength(1);
    expect(links).toHaveLength(3);
  });

  it('does not mutate the parsed input', () => {
    const input = portfolio(['https://www.manyrequests.com/blog/clickup-vs-notion']);
    withCurrentManyRequestsSamples(input, FEATURED_MANYREQUESTS_ARTICLES);
    expect(input.sections[0].projects).toHaveLength(1);
  });
});
