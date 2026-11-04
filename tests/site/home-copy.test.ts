import { describe, it, expect } from 'vitest';
import * as copy from '@/lib/content/home-copy';

const all = JSON.stringify(copy);

// The homepage was rebuilt on 4 Nov 2026 around the four abilities the site has
// to prove. These tests hold the approved passages from the 25 Oct brief in
// place and keep the lines Peace removed from coming back.
describe('homepage copy', () => {
  it('opens with what she does and for whom, and keeps the lines Peace removed out', () => {
    expect(copy.HERO.heading).toBe('I write for B2B SaaS companies and build AI workflows for content teams.');
    expect(JSON.stringify(copy.HERO)).not.toContain('BOFU');
    expect('proof' in copy.HERO).toBe(false);
    expect(all).not.toContain('Good work starts with good questions');
    expect(all).not.toContain('The same three questions run through both');
    expect(all).not.toContain('under my own byline and ghostwritten');
    expect(all).not.toContain('most of them for an AI-search agency');
  });

  it('uses the approved passages, as edited to the 28 Oct copy rules', () => {
    // The fanout and AI Docs Watch passages were cut to one paragraph each at Peace's request on 4 Nov 2026.
    expect(copy.AI_TOOLS.p1.startsWith('AI Docs Watch tracks documentation changes')).toBe(true);
    expect(copy.BUILDING.p1).toContain('export the results to analyse in Claude');
    expect(copy.CONTENTDB.p1.startsWith('I built ContentDB to help writers use the expertise already sitting in a company’s content.')).toBe(true);
    expect(copy.READING_APP.p1.startsWith('People can listen to a digest or star a useful post')).toBe(true);
    // Shortened at Peace's request, 4 Nov 2026; it still ends on the check.
    expect(copy.THINKING.how).toContain('The part I own is the check.');
    expect(copy.THINKING.how).not.toMatch(/^I use AI/);
    // Design guide, 4 Nov 2026: section labels in the reader's language, so BOFU is spelled out.
    expect(copy.OFFER.writing.startsWith('I write bottom-of-funnel content for B2B SaaS companies and agencies')).toBe(true);
    expect(JSON.stringify(copy)).not.toContain('BOFU');
    expect(copy.OFFER.prices).toEqual([
      'Refresh an existing article, $400 (2,000 to 2,500 words)',
      'Write a new article, $600 (2,000 to 3,000 words)',
      'Five articles a month, $2,700',
    ]);
  });

  it('names the tools the way Peace asked, and never with an em dash', () => {
    expect(all).not.toMatch(/Fanout Notebook|Notebook OKF/);
    expect(all).not.toContain('—');
    expect(all).not.toMatch(/\bquietly\b/i);
  });

  it('keeps the three questions, in her order, as the thinking block', () => {
    expect(copy.THINKING.questions.map((q) => q.q)).toEqual(['Is this true?', 'What’s worth making?', 'What does done mean?']);
  });

  it('points the reading app at the lessons article', () => {
    expect(copy.READING_APP.article).toBe('/the-success-message-was-the-bug');
    expect(copy.THINKING.links.some((l) => l.href === '/the-success-message-was-the-bug')).toBe(true);
  });

  it('every proof block links somewhere real on the site', () => {
    for (const block of [copy.WRITING, copy.BUILDING, copy.AI_TOOLS, copy.THINKING]) {
      expect(block.links.length).toBeGreaterThan(0);
      for (const l of block.links) expect(l.href.startsWith('/')).toBe(true);
      expect(block.shot.startsWith('/')).toBe(true);
      // Peace removed the writing and building captions on 4 Nov 2026; a caption, when present, says something.
      const caption = (block as { caption?: string }).caption;
      if (caption) expect(caption.length).toBeGreaterThan(20);
    }
  });
});
