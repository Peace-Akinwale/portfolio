import { describe, it, expect } from 'vitest';
import { parseFrontMatter, asList } from '@/lib/content/frontmatter';
import { renderMarkdown, imageRefs } from '@/lib/content/markdown';
import { mergePosts } from '@/lib/content/articles';
import type { HashnodePost } from '@/lib/hashnode/types';

describe('front matter', () => {
  it('reads scalars, quoted values and lists, and leaves the body untouched', () => {
    const src = `---\ntitle: "Aloud: listen"\nkind: built\ndate: 2026-09-28\nlinks:\n  - Open Aloud | https://aloud.peaceakinwale.com\n  - "The log | https://github.com/x"\ntags:\n  - audio\n---\n# Body\n\nKeep  this   spacing.\n`;
    const { data, body } = parseFrontMatter(src);
    expect(data.title).toBe('Aloud: listen');
    expect(data.kind).toBe('built');
    expect(asList(data.links)).toEqual(['Open Aloud | https://aloud.peaceakinwale.com', 'The log | https://github.com/x']);
    expect(asList(data.tags)).toEqual(['audio']);
    expect(body).toBe('# Body\n\nKeep  this   spacing.\n');
  });

  it('returns the whole text as body when there is no front matter', () => {
    expect(parseFrontMatter('plain').body).toBe('plain');
  });
});

describe('markdown rendering', () => {
  it('rewrites relative image paths to the public folder and turns image + italic into a figure', () => {
    const html = renderMarkdown('Before.\n\n![Search results](images/contentdb/1-search.png)\n\n*A search in my workspace.*\n\nAfter.', { imageBase: '/case-studies/contentdb' });
    expect(html).toContain('src="/case-studies/contentdb/1-search.png"');
    expect(html).toContain('<figure><img');
    expect(html).toContain('<figcaption>A search in my workspace.</figcaption>');
    expect(html).not.toContain('<p><em>A search');
  });

  it('lists the images a body references', () => {
    expect(imageRefs('![a](images/x/1.png) and ![b](images/x/2.jpg "t")')).toEqual(['images/x/1.png', 'images/x/2.jpg']);
  });
});

describe('merging local articles with WordPress posts', () => {
  const wp = (slug: string, publishedAt: string) => ({ slug, publishedAt, title: slug } as HashnodePost);
  it('sorts newest first and lets a local slug win over a WordPress duplicate', () => {
    const local = [{ ...wp('the-success-message-was-the-bug', '2026-10-24T09:00:00.000Z'), local: true as const, images: [] }];
    const merged = mergePosts([wp('older', '2026-01-01T00:00:00.000Z'), wp('the-success-message-was-the-bug', '2025-01-01T00:00:00.000Z'), wp('newest', '2026-11-01T00:00:00.000Z')], local);
    expect(merged.map((p) => p.slug)).toEqual(['newest', 'the-success-message-was-the-bug', 'older']);
    expect(merged.filter((p) => p.slug === 'the-success-message-was-the-bug')).toHaveLength(1);
  });
});

import { splitChapters } from '@/lib/content/markdown';
describe('chapters', () => {
  it('splits at each h3, keeps the intro, and gives each chapter a unique id', () => {
    const { intro, chapters } = splitChapters('<p>Intro</p><h3>Before &amp; after</h3><p>A</p><h3>Before &amp; after</h3><p>B</p>');
    expect(intro).toBe('<p>Intro</p>');
    expect(chapters.map((c) => c.id)).toEqual(['before-after', 'before-after-2']);
    expect(chapters[1].html).toBe('<p>B</p>');
    expect(splitChapters("<h3>The founder&#39;s notes</h3><p>x</p>").chapters[0].title).toBe("The founder's notes");
  });
});
