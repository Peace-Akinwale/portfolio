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

// Map a CMS link to a client page (relative or absolute, with or without a
// trailing slash) to its /writing/<client> address; any other href is unchanged.
export function publicHref(href: string): string {
  const m = href.match(/^(?:https?:\/\/(?:www\.)?peaceakinwale\.com)?\/([^/?#]+)\/?([?#].*)?$/i);
  if (!m) return href;
  const client = Object.entries(CLIENT_PAGES).find(([, s]) => s === m[1].toLowerCase())?.[0];
  return client ? `/writing/${client}${m[2] ?? ''}` : href;
}

// Client names as the client writes them, where the CMS headings differ
// (parsePortfolio cuts names at the first dot and keeps the CMS casing).
export const CLIENT_NAME_OVERRIDES: Record<string, string> = {
  'content-for-pangea': 'Pangea.ai',
};

// One-line descriptions (Peace-approved /writing copy, 8 Nov 2026), used by
// /writing and as each client page's meta and share description.
export const CLIENT_PAGE_DESCRIPTIONS: Record<string, string> = {
  'b2b-content-for-manyrequests': 'Comparisons and guides that show agency owners how to manage client requests, approvals, retainers and billing. The product appears where it helps explain how to do the work.',
  'content-for-highervisibility': 'Ghostwritten articles that explain SEO, content strategy and lead generation through decisions a business needs to make.',
  'content-for-pangea': 'Articles that help readers understand software-development work and compare the tools available to them.',
};
