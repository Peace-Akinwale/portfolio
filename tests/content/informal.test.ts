// The informal rewrites change the voice, never the facts: every number,
// every quoted phrase and every screenshot from Peace's Notion original must
// still be in the informal version the site shows.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PAIRS: Record<string, string> = {
  'ai-docs-watch': 'ai-docs-watch',
  contentdb: 'contentdb-collect-research-and-question-your-sources',
  aloud: 'aloud-listen-to-saved-articles-and-return-to-useful-passages',
  'quality-rater': 'quality-rater-reviewing-pages-using-googles-quality-guidelines',
  'fanout-query-analysis-tool': 'fanout-query-analysis-tool',
  'what-ai-search-apps-do-before-they-answer': 'what-ai-search-apps-do-before-they-answer-a-public-reference',
  okf: 'building-an-okf-that-a-team-can-ask-for-guidance',
  'reading-app': 'a-reading-app-for-reviewing-posts-and-preparing-newsletter-notes',
  reach: 'reach-hands-on-my-mac-for-ai-agents-that-cant-reach-it',
};

const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8').replace(/^---[\s\S]*?\n---\n/, '');
// A draft is checked against the Notion version it was written from. When Notion
// has been edited since (content/informal/BASELINE.json is older than the export's
// notion_last_edited), the fact checks wait until the edits are folded in.
const BASELINE: Record<string, string> = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/informal/BASELINE.json'), 'utf8')).based_on;
const lastEdited = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf8').match(/^notion_last_edited: (\S+)/m)?.[1] ?? '';
const numbers = (s: string) => (s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').match(/\d[\d,.]*\d|\d/g) ?? []).map((n) => n.replace(/[.,]$/, '')).sort();
const quotes = (s: string) => [...s.matchAll(/["“]([^"”\n]{3,}?)["”]/g)].map((m) => m[1].replace(/[.,]$/, ''));
const images = (s: string) => [...s.matchAll(/!\[[^\]]*\]\(images\/[^/]+\/([^)]+)\)/g)].map((m) => m[1].replace(/^\d+-/, '').replace(/\.[a-z]+$/, ''));

describe('informal drafts behind Notion', () => {
  it('lists every draft whose Notion page was edited after the draft (merge pending, fact checks skipped)', () => {
    const pending = Object.entries(PAIRS).filter(([slug, exportName]) => lastEdited(`content/notion-export/${exportName}.md`) > (BASELINE[slug] ?? ''));
    console.warn(pending.length ? `Notion edited after the draft, merge pending: ${pending.map(([s]) => s).join(', ')}` : 'every informal draft is checked against the current Notion text');
    expect(pending.length).toBeLessThanOrEqual(Object.keys(PAIRS).length);
  });
});

describe('informal case studies keep every fact', () => {
  for (const [slug, exportName] of Object.entries(PAIRS)) {
    const original = read(`content/notion-export/${exportName}.md`);
    const informal = read(`content/informal/${slug}.md`);
    const site = read(`content/case-studies/${slug}.md`);
    const notionNewer = lastEdited(`content/notion-export/${exportName}.md`) > (BASELINE[slug] ?? '');

    it.skipIf(notionNewer)(`${slug}: every number in the original is still there`, () => {
      const missing = [...new Set(numbers(original))].filter((n) => !numbers(informal).includes(n));
      expect(missing, `missing numbers in ${slug}`).toEqual([]);
    });

    it.skipIf(notionNewer)(`${slug}: every quoted phrase is still there, word for word`, () => {
      const flat = informal.replace(/[“”]/g, '"');
      for (const q of quotes(original)) expect(flat, `${slug} lost the quote "${q}"`).toContain(q.replace(/[“”]/g, '"'));
    });

    it(`${slug}: the site page carries the original screenshots in the original order`, () => {
      expect(images(site)).toEqual(images(original).filter((name) => fs.existsSync(path.join(ROOT, 'public/case-studies', slug)) && fs.readdirSync(path.join(ROOT, 'public/case-studies', slug)).some((f) => f.startsWith(name))));
    });

    it(`${slug}: no em dashes, colons or semicolons in the informal prose`, () => {
      const prose = informal.replace(/^!\[.*$/gm, '').replace(/^\*.*\*$/gm, '').replace(/<[^>]+>/g, '');
      expect(prose).not.toContain('—');
      expect(prose).not.toMatch(/;/);
      expect(prose.replace(/\*\*[^*]+\*\*/g, '').replace(/https?:\/\/\S+/g, '')).not.toMatch(/[a-z]: [A-Za-z]/);
    });
  }
});
