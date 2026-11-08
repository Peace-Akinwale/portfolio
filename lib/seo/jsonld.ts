import { SITE_URL } from '@/lib/site';

// Pure JSON-LD builders. Each returns a plain object for a
// <script type="application/ld+json"> tag; the pages decide where to put it.
// Shapes follow schema.org and Google's structured-data guides (read 3 Nov 2026):
//   BreadcrumbList: ListItem needs position, name, item (item optional on the last one)
//   BlogPosting: headline, image, datePublished, dateModified, author (name, url)
//   SoftwareApplication: name, applicationCategory, offers (price 0 for free)
//   FAQPage: still valid schema.org markup, but Google stopped showing the FAQ
//   rich result in May 2026, so it is for completeness, not for a rich result.

const CONTEXT = 'https://schema.org' as const;

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const AUTHOR = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Peace Akinwale',
  url: SITE_URL,
} as const;

export const PUBLISHER = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Peace Akinwale',
  url: SITE_URL,
} as const;

export type JsonLd = Record<string, unknown>;

export function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export function breadcrumbList(items: { name: string; url: string }[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string | string[];
}): JsonLd {
  const url = absoluteUrl(input.url);
  const images = input.image === undefined ? [] : (Array.isArray(input.image) ? input.image : [input.image]).map(absoluteUrl);
  return {
    '@context': CONTEXT,
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: input.title,
    description: input.description,
    url,
    ...(images.length ? { image: images } : {}),
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: AUTHOR,
    publisher: PUBLISHER,
    isPartOf: { '@type': 'WebSite', '@id': WEBSITE_ID, name: 'Peace Akinwale', url: SITE_URL },
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  offers: { name: string; price: number | string; currency: string }[];
}): JsonLd {
  const url = absoluteUrl(input.url);
  return {
    '@context': CONTEXT,
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url,
    serviceType: input.name,
    provider: AUTHOR,
    areaServed: 'Worldwide',
    offers: input.offers.map((offer) => ({
      '@type': 'Offer',
      name: offer.name,
      price: String(offer.price),
      priceCurrency: offer.currency,
      url,
    })),
  };
}

export function faqPageJsonLd(qa: { q: string; a: string }[]): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

export function softwareApplicationJsonLd(input: {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  price?: number | string;
  currency?: string;
}): JsonLd {
  return {
    '@context': CONTEXT,
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    applicationCategory: input.applicationCategory,
    operatingSystem: input.operatingSystem ?? 'Web',
    author: AUTHOR,
    offers: {
      '@type': 'Offer',
      price: String(input.price ?? 0),
      priceCurrency: input.currency ?? 'USD',
    },
  };
}

// For dangerouslySetInnerHTML: `</script>` inside a string must not close the tag.
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
