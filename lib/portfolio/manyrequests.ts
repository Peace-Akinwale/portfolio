import type { ParsedPortfolio, PortfolioProject } from '@/lib/hashnode/parsePortfolio';

// Counted from bylines on manyrequests.com on 2026-09-27 (all 236 posts in their sitemap).
// Recount there before changing it; every page that quotes the number reads it from here.
export const MANYREQUESTS_ARTICLE_COUNT = 51;
export const MANYREQUESTS_SINCE = '2024';

// Credited to Peace on manyrequests.com but missing from the WordPress portfolio page. Newest first.
export const NEW_MANYREQUESTS_ARTICLES: PortfolioProject[] = [
  { title: 'The Productized Marketing Agency Business Plan Template [2026]', link: 'https://www.manyrequests.com/blog/marketing-agency-business-plan-template' },
  { title: 'Client Request Management Software With Built-In Billing', link: 'https://www.manyrequests.com/blog/client-request-management-software' },
  { title: 'The Productized Service Guide: How to Build, Price, and Scale [2026]', link: 'https://www.manyrequests.com/blog/productized-service-guide' },
  { title: 'Best Client Management Software for Productized Agencies [2026]', link: 'https://www.manyrequests.com/blog/client-management-software' },
  { title: 'Agency Pricing Models: Which One Scales a Productized Agency [2026]', link: 'https://www.manyrequests.com/blog/agency-pricing-models' },
  { title: 'Best White Label Client Portal Software for Productized Agencies [2026]', link: 'https://www.manyrequests.com/blog/white-label-client-portal-software' },
  { title: 'Client Information Management: The Modern Creative Agency Playbook [2026]', link: 'https://www.manyrequests.com/blog/client-information-management' },
  { title: 'Wrike vs ClickUp: Which Tool Is Better for Agencies?', link: 'https://www.manyrequests.com/blog/wrike-vs-clickup' },
  { title: 'Agency Retainer Model: How to Price, Package, and Scale', link: 'https://www.manyrequests.com/blog/agency-retainer-model' },
  { title: '6 Best Project Management Software for Designers in 2026', link: 'https://www.manyrequests.com/blog/project-management-software-for-designers' },
  { title: 'I Reviewed 6 Zoho CRM Alternatives for Agency Owners in 2026', link: 'https://www.manyrequests.com/blog/zoho-crm-alternatives' },
  { title: 'Top 7 Employee Task List Templates for Creative Agencies [2026]', link: 'https://www.manyrequests.com/blog/employee-task-list-templates' },
  { title: '17Hats vs. Honeybook vs. ManyRequests: Which CRM is Right For You?', link: 'https://www.manyrequests.com/blog/17hats-vs-honeybook' },
  { title: 'How to Keep Track of Invoices Like a Pro [Creative Agency Guide]', link: 'https://www.manyrequests.com/blog/how-to-keep-track-of-invoices-and-payments' },
];

// Shown at the top of /portfolio's short ManyRequests list.
const FEATURED_PATHS = ['/blog/wrike-vs-clickup', '/blog/agency-retainer-model', '/blog/project-management-software-for-designers'];
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
]);

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
