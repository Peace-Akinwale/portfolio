import { describe, it, expect } from 'vitest';
import { OFFER } from '@/lib/content/home-copy';
const { writing: SERVICE_COPY, building: TOOL_CTA, prices: PRICES } = OFFER;
import fs from 'node:fs';
import path from 'node:path';

describe('services copy', () => {
  it('uses the approved service sentence (edited to the 28 Oct copy rules), prices and tool CTA', () => {
    expect(SERVICE_COPY).toBe('I write BOFU content for B2B SaaS companies and agencies, and conduct enough product research to explain what someone can do with your product.');
    expect(PRICES).toEqual([
      'Refresh an existing article, $400 (2,000 to 2,500 words)',
      'Write a new article, $600 (2,000 to 3,000 words)',
      'Five articles a month, $2,700',
    ]);
    expect(TOOL_CTA).toBe('Tell me about the work your team repeats every week. I’ll tell you whether a tool would take it off their plate, then build it around how the team works.');
  });

  it('invents no tool prices: the only dollar figures on the page are the known ones', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'app/services/page.tsx'), 'utf8');
    const figures = [...src.matchAll(/\$([\d,]+)/g)].map((m) => m[1]);
    expect(new Set(figures)).toEqual(new Set(['20', '700']));
  });
});
