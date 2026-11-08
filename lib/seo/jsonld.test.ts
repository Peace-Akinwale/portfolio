import { describe, it, expect } from 'vitest';
import {
  breadcrumbList,
  articleJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
  serializeJsonLd,
  absoluteUrl,
} from '@/lib/seo/jsonld';

const SITE = 'https://peaceakinwale.com';

describe('absoluteUrl', () => {
  it('prefixes root-relative paths with the site URL and leaves absolute URLs alone', () => {
    expect(absoluteUrl('/services')).toBe(`${SITE}/services`);
    expect(absoluteUrl('services')).toBe(`${SITE}/services`);
    expect(absoluteUrl('https://example.com/x')).toBe('https://example.com/x');
  });
});

describe('breadcrumbList', () => {
  it('numbers items from 1 and makes every item URL absolute', () => {
    const out = breadcrumbList([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: 'A post', url: `${SITE}/a-post` },
    ]);
    expect(out['@type']).toBe('BreadcrumbList');
    const items = out.itemListElement as { position: number; name: string; item: string }[];
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(items.map((i) => i.item)).toEqual([`${SITE}/`, `${SITE}/blog`, `${SITE}/a-post`]);
    expect(items[2].name).toBe('A post');
  });
});

describe('articleJsonLd', () => {
  const base = {
    title: 'The success message was the bug',
    description: 'A standfirst.',
    url: '/the-success-message-was-the-bug',
    datePublished: '2026-10-25T09:00:00.000Z',
    dateModified: '2026-11-03T18:04:15.000Z',
  };

  it('is a BlogPosting by Peace Akinwale, published by the site', () => {
    const out = articleJsonLd({ ...base, image: '/og/article.png' });
    expect(out['@type']).toBe('BlogPosting');
    expect(out.headline).toBe(base.title);
    expect(out.url).toBe(`${SITE}/the-success-message-was-the-bug`);
    expect(out.datePublished).toBe(base.datePublished);
    expect(out.dateModified).toBe(base.dateModified);
    expect(out.image).toEqual([`${SITE}/og/article.png`]);
    expect(out.author).toMatchObject({ '@type': 'Person', name: 'Peace Akinwale', url: SITE });
    expect(out.publisher).toMatchObject({ name: 'Peace Akinwale' });
    expect(out.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': `${SITE}/the-success-message-was-the-bug` });
  });

  it('leaves image out when none is given and accepts a list', () => {
    expect('image' in articleJsonLd(base)).toBe(false);
    const out = articleJsonLd({ ...base, image: ['https://cdn.example/a.png', '/b.png'] });
    expect(out.image).toEqual(['https://cdn.example/a.png', `${SITE}/b.png`]);
  });
});

describe('serviceJsonLd', () => {
  it('lists every offer with a price string and ISO currency', () => {
    const out = serviceJsonLd({
      name: 'B2B SaaS content writing',
      description: 'Articles and refreshes.',
      url: '/services',
      offers: [
        { name: 'Refresh one article', price: 400, currency: 'USD' },
        { name: 'New article', price: '600', currency: 'USD' },
      ],
    });
    expect(out['@type']).toBe('Service');
    expect(out.provider).toMatchObject({ '@type': 'Person', name: 'Peace Akinwale' });
    expect(out.offers).toEqual([
      { '@type': 'Offer', name: 'Refresh one article', price: '400', priceCurrency: 'USD', url: `${SITE}/services` },
      { '@type': 'Offer', name: 'New article', price: '600', priceCurrency: 'USD', url: `${SITE}/services` },
    ]);
  });
});

describe('faqPageJsonLd', () => {
  it('maps q/a pairs to Question and Answer', () => {
    const out = faqPageJsonLd([{ q: 'Can I cancel?', a: 'Yes, any time.' }]);
    expect(out['@type']).toBe('FAQPage');
    expect(out.mainEntity).toEqual([
      { '@type': 'Question', name: 'Can I cancel?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, any time.' } },
    ]);
  });
});

describe('softwareApplicationJsonLd', () => {
  it('defaults to a free web app with Peace as author', () => {
    const out = softwareApplicationJsonLd({
      name: 'contentDB',
      description: 'Research in one place.',
      url: '/case-studies/contentdb',
      applicationCategory: 'BusinessApplication',
    });
    expect(out['@type']).toBe('SoftwareApplication');
    expect(out.url).toBe(`${SITE}/case-studies/contentdb`);
    expect(out.applicationCategory).toBe('BusinessApplication');
    expect(out.operatingSystem).toBe('Web');
    expect(out.offers).toEqual({ '@type': 'Offer', price: '0', priceCurrency: 'USD' });
    expect(out.author).toMatchObject({ name: 'Peace Akinwale' });
  });
});

describe('serializeJsonLd', () => {
  it('escapes < so a </script> in content cannot close the tag', () => {
    const s = serializeJsonLd(faqPageJsonLd([{ q: 'x', a: '</script><b>' }]));
    expect(s).not.toContain('</script>');
    expect(JSON.parse(s)).toMatchObject({ '@type': 'FAQPage' });
  });
});
