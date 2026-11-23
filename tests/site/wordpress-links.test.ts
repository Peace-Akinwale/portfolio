import { describe, expect, it } from 'vitest';
import { relativizeSiteLinks, unwrapBareToolLinks } from '@/lib/wordpress/client';
import robots from '@/app/robots';

describe('WordPress bare tool links', () => {
  it('unwraps autolinks to next.js, node.js and sanity.io', () => {
    const html = [
      'allows <a href="http://next.js">Next.js</a> to fetch',
      '<a target="_blank" rel="noopener noreferrer" href="http://node.js">Node.js</a>',
      '<a href="http://sanity.io">Sanity.io</a>',
      '<a href="https://www.sanity.io/headless-cms">headless content management system</a>',
    ].join(' ');
    const out = unwrapBareToolLinks(html);
    expect(out).toContain('allows Next.js to fetch');
    expect(out).toContain('Node.js');
    expect(out).toContain('Sanity.io');
    expect(out).not.toContain('http://next.js');
    expect(out).not.toContain('http://node.js');
    expect(out).not.toContain('href="http://sanity.io"');
    expect(out).toContain('https://www.sanity.io/headless-cms');
  });

  it('still rewrites absolute links to this site', () => {
    expect(relativizeSiteLinks('<a href="http://www.peaceakinwale.com/services">Services</a>')).toBe('<a href="/services">Services</a>');
  });
});

describe('MyLinks case-study links', () => {
  it('updates old case-study URLs while preserving app and external URLs', () => {
    for (const prefix of ['', 'https://peaceakinwale.com', 'http://www.peaceakinwale.com']) {
      expect(relativizeSiteLinks(`<a href="${prefix}/projects/mylinks/?ref=blog#examples">MyLinks</a>`))
        .toBe('<a href="/case-studies/mylinks?ref=blog#examples">MyLinks</a>');
    }
    for (const href of ['/projects/mylinks/dashboard', 'https://example.com/projects/mylinks', 'https://mylinks.peaceakinwale.com']) {
      const html = `<a href="${href}">Link</a>`;
      expect(relativizeSiteLinks(html)).toBe(html);
    }
  });
});

describe('robots and the MyLinks landing page', () => {
  it('allows the exact landing page that the sitemap lists, and blocks the app', () => {
    const rule = robots().rules;
    const rules = Array.isArray(rule) ? rule[0] : rule;
    const allow = [rules?.allow].flat();
    const disallow = [rules?.disallow].flat();
    expect(allow).toContain('/');
    expect(disallow).not.toContain('/case-studies');
    expect(disallow).not.toContain('/case-studies/mylinks');
    expect(disallow).toContain('/projects/mylinks/');
    expect(disallow).not.toContain('/projects/mylinks');
    expect(disallow).toContain('/career-pathway');
  });
});
