// Client writing-sample pages. Their content still comes from the CMS under the
// old slugs, but since 8 Nov 2026 they are published under /writing/<client>
// (the old root addresses redirect there in next.config.ts).
export const CLIENT_PAGES: Record<string, string> = {
  manyrequests: 'b2b-content-for-manyrequests',
  highervisibility: 'content-for-highervisibility',
  pangea: 'content-for-pangea',
};

// The public path for a CMS slug: /writing/<client> for client pages, /<slug> otherwise.
export function publicPathForSlug(slug: string): string {
  const client = Object.entries(CLIENT_PAGES).find(([, s]) => s === slug)?.[0];
  return client ? `/writing/${client}` : `/${slug}`;
}

// Titles fixed here because the CMS copy is wrong. Pangea writes its name
// "Pangea.ai" (pangea.ai, checked 8 Nov 2026); the CMS title began "for pangea.ai".
export const TITLE_OVERRIDES: Record<string, string> = {
  'content-for-pangea': 'Content for Pangea.ai, a B2B SaaS business tool',
};

export function withTitleOverride<T extends { title: string }>(slug: string, page: T | null): T | null {
  const title = TITLE_OVERRIDES[slug];
  return page && title ? { ...page, title } : page;
}
