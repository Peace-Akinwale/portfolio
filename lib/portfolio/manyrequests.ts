import type { ParsedPortfolio, PortfolioProject } from '@/lib/hashnode/parsePortfolio';

// The number of articles Peace wrote for ManyRequests (Peace, 3 Nov 2026: use 51).
// 51 were under her byline on 2026-09-27. On 2026-11-03 ManyRequests had re-credited
// six to other writers or "ManyRequests team" and merged one, so their site shows
// 44; those seven stay off the sample lists (RETIRED_SAMPLE_PATHS) because their
// pages no longer carry her name. Every page that quotes the number reads it from here.
export const MANYREQUESTS_ARTICLE_COUNT = 51;
export const MANYREQUESTS_SINCE = '2024';

// Credited to Peace on manyrequests.com but missing from the WordPress portfolio page. Newest first.
export const NEW_MANYREQUESTS_ARTICLES: PortfolioProject[] = [
  { title: 'The Productized Marketing Agency Business Plan Template [2026]', link: 'https://www.manyrequests.com/blog/marketing-agency-business-plan-template' },
  { title: 'Client Request Management Software With Built-In Billing', link: 'https://www.manyrequests.com/blog/client-request-management-software' },
  { title: 'The Productized Service Guide: How to Build, Price, and Scale [2026]', link: 'https://www.manyrequests.com/blog/productized-service-guide' },
  { title: 'Best Client Management Software for Productized Agencies [2026]', link: 'https://www.manyrequests.com/blog/client-management-software' },
  { title: 'Agency Pricing Models: Which One Scales a Productized Agency [2026]', link: 'https://www.manyrequests.com/blog/agency-pricing-models' },
  { title: 'Client Information Management: The Modern Creative Agency Playbook [2026]', link: 'https://www.manyrequests.com/blog/client-information-management' },
  { title: 'Wrike vs ClickUp: Which Tool Is Better for Agencies?', link: 'https://www.manyrequests.com/blog/wrike-vs-clickup' },
  { title: 'Agency Retainer Model: How to Price, Package, and Scale', link: 'https://www.manyrequests.com/blog/agency-retainer-model' },
  { title: 'I Reviewed 6 Zoho CRM Alternatives for Agency Owners in 2026', link: 'https://www.manyrequests.com/blog/zoho-crm-alternatives' },
  { title: 'Top 7 Employee Task List Templates for Creative Agencies [2026]', link: 'https://www.manyrequests.com/blog/employee-task-list-templates' },
  { title: '17Hats vs. Honeybook vs. ManyRequests: Which CRM is Right For You?', link: 'https://www.manyrequests.com/blog/17hats-vs-honeybook' },
  { title: 'How to Keep Track of Invoices Like a Pro [Creative Agency Guide]', link: 'https://www.manyrequests.com/blog/how-to-keep-track-of-invoices-and-payments' },
];

// Shown at the top of /portfolio's short ManyRequests list.
const FEATURED_PATHS = ['/blog/wrike-vs-clickup', '/blog/agency-retainer-model', '/blog/agency-pricing-models'];
export const FEATURED_MANYREQUESTS_ARTICLES = NEW_MANYREQUESTS_ARTICLES.filter((article) =>
  FEATURED_PATHS.some((path) => article.link?.endsWith(path)),
);

// Samples that ManyRequests has since removed, redirected, or re-credited to another writer
// (checked 2026-09-27). Matched by path so www/non-www and trailing slashes don't matter.
const RETIRED_SAMPLE_PATHS = new Set([
  '/blog/finance-tools',
  '/blog/10-tools-you-need-to-set-up-your-productized-service-business',
  '/blog/copilot-alternatives',
  '/blog/clickup-vs-notion',
  '/blog/productized-service-software',
  // Re-credited by ManyRequests or merged, found 2026-11-03.
  '/blog/project-management-software-for-designers',
  '/blog/best-monday-alternatives',
  '/blog/best-operations-management-software',
  '/blog/resource-planning-for-multiple-projects',
  '/blog/honeybook-alternatives',
  '/blog/white-label-client-portal-software',
  '/blog/project-management-software-with-client-portal',
]);

// Google page-one results on 7 Nov 2026 (Chrome, signed in, gl=us, hl=en, pws=0;
// organic positions only). Full table: docs/case-studies/manyrequests-rankings-2026-11-07.md.
// Left out of this list: the branded query "manyrequests alternatives".
export const MANYREQUESTS_RANKINGS: { query: string; position: number; title: string; url: string; shot: string }[] = [
  { query: 'marketing agency business plan template', position: 1, title: 'The Productized Marketing Agency Business Plan Template', url: 'https://www.manyrequests.com/blog/marketing-agency-business-plan-template', shot: '/images/case-studies/manyrequests/serp-2026-11-07/marketing-agency-business-plan-template-annotated.png' },
  { query: 'business to start with 5k', position: 2, title: '25 Businesses You Can Start With $5K or Less', url: 'https://www.manyrequests.com/blog/business-to-start-with-5k', shot: '/images/case-studies/manyrequests/serp-2026-11-07/business-to-start-with-5k-annotated.png' },
  { query: 'how to get retainer clients', position: 5, title: 'How to Get Retainer Clients', url: 'https://www.manyrequests.com/blog/how-to-get-retainer-clients', shot: '/images/case-studies/manyrequests/serp-2026-11-07/how-to-get-retainer-clients-annotated.png' },
  { query: 'retainer management software', position: 4, title: 'Top 6 Retainer Management Software for Creative Agencies', url: 'https://www.manyrequests.com/blog/retainer-management-software', shot: '/images/case-studies/manyrequests/serp-2026-11-07/retainer-management-software-annotated.png' },
  { query: 'agency pricing models', position: 8, title: 'Agency Pricing Models: Which One Scales a Productized Agency', url: 'https://www.manyrequests.com/blog/agency-pricing-models', shot: '/images/case-studies/manyrequests/serp-2026-11-07/agency-pricing-models-annotated.png' },
  { query: '17hats vs honeybook', position: 6, title: '17Hats vs. Honeybook vs. ManyRequests', url: 'https://www.manyrequests.com/blog/17hats-vs-honeybook', shot: '/images/case-studies/manyrequests/serp-2026-11-07/17hats-vs-honeybook-annotated.png' },
  { query: 'bloom alternatives', position: 8, title: '6 Bloom Alternatives Worth Considering if You Run an Agency', url: 'https://www.manyrequests.com/blog/bloom-alternatives', shot: '/images/case-studies/manyrequests/serp-2026-11-07/bloom-alternatives-annotated.png' },
];

function samplePath(link?: string): string | null {
  if (!link) return null;
  try {
    const url = new URL(link);
    if (!url.hostname.replace(/^www\./, '').endsWith('manyrequests.com')) return null;
    return url.pathname.replace(/\/+$/, '').toLowerCase();
  } catch {
    return null;
  }
}

export function isRetiredSample(link?: string): boolean {
  const path = samplePath(link);
  return path !== null && RETIRED_SAMPLE_PATHS.has(path);
}

/**
 * Drop retired samples from every section and prepend extra articles to the first section,
 * skipping any the WordPress page already lists.
 */
export function withCurrentManyRequestsSamples(parsed: ParsedPortfolio, extra: PortfolioProject[] = []): ParsedPortfolio {
  const sections = parsed.sections.map((section) => ({
    ...section,
    projects: section.projects.filter((project) => !isRetiredSample(project.link)),
  }));

  if (extra.length > 0 && sections.length > 0) {
    const listed = new Set(sections[0].projects.map((project) => samplePath(project.link) ?? project.link));
    const additions = extra.filter((project) => !listed.has(samplePath(project.link) ?? project.link));
    sections[0] = { ...sections[0], projects: [...additions, ...sections[0].projects] };
  }

  return { ...parsed, sections };
}
