import { describe, it, expect } from 'vitest';
import * as copy from '@/lib/content/home-copy';

const all = JSON.stringify(copy);

describe('homepage copy', () => {
  it('keeps the approved opening and drops the sentence Peace removed', () => {
    expect(copy.HERO.heading).toBe('Good work starts with good questions.');
    expect(copy.HERO.line).toBe(
      'I build AI products and I write. Most of the work is deciding what’s worth making and checking that it’s true.',
    );
    expect(all).not.toContain('The same three questions run through both');
    expect(all).not.toContain('under my own byline and ghostwritten');
  });

  it('uses the approved passages verbatim', () => {
    expect(copy.DOCS_WATCH.p1).toContain('AI Docs Watch checks API documentation for product changes across AI platforms such as OpenAI and Anthropic.');
    expect(copy.CONTENTDB.p1.startsWith('I built ContentDB to help writers use the expertise already sitting in a company’s content.')).toBe(true);
    expect(copy.AEO.heading).toBe('What AEO checklists leave out');
    expect(copy.FANOUT.p2).toContain('export the results as JSON for further analysis in Claude');
    expect(copy.HOW_I_WORK.p1.startsWith('I use AI to help me research articles and build tools')).toBe(true);
    expect(copy.OFFER.prices).toEqual([
      'Refresh an existing article, $400 (2,000 to 2,500 words)',
      'Write a new article, $600 (2,000 to 3,000 words)',
      'Five articles a month, $2,700',
    ]);
  });

  it('keeps the Garde paragraph with Garde, not Aloud', () => {
    expect(copy.GARDE.p1).toContain('I stopped paying for cloud resources and shut it down');
    expect(JSON.stringify(copy.ALOUD)).not.toContain('shut it down');
    expect(copy.GARDE.essay).toBe('/what-i-learned-vibe-coding-my-first-app-shutting-it-down');
  });

  it('names the tools the way Peace asked', () => {
    expect(all).not.toMatch(/Fanout Notebook|Notebook OKF/);
    expect(all).not.toContain('—');
  });

  it('points the reading app at the lessons article, not a case study', () => {
    expect(copy.READING_APP.article).toBe('/the-success-message-was-the-bug');
  });
});
