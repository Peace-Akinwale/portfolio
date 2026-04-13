import { getStaticPage } from '@/lib/hashnode/client';
import { parsePortfolioHtml } from '@/lib/hashnode/parsePortfolio';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { fetchOgImagesForPortfolio } from '@/lib/fetchOgImages';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Peace Akinwale',
  description: 'Explore the portfolio of Peace Akinwale - featured B2B SaaS writing projects.',
  alternates: {
    canonical: 'https://peaceakinwale.com/portfolio',
  },
};

const NEW_MANYREQUESTS_ARTICLES = [
  {
    title: 'Wrike vs ClickUp: Which Tool Is Better for Agencies?',
    link: 'https://www.manyrequests.com/blog/wrike-vs-clickup',
  },
  {
    title: 'Agency Retainer Model: How to Price, Package, and Scale',
    link: 'https://www.manyrequests.com/blog/agency-retainer-model',
  },
  {
    title: '6 Best Project Management Software for Designers in 2026',
    link: 'https://www.manyrequests.com/blog/project-management-software-for-designers',
  },
];

const MARKERIO_SECTION = {
  heading: 'Ghostwritten content for Marker.io',
  clientName: 'Marker.io',
  projects: [
    {
      title: 'What is Regression Testing? A Practical Guide',
      link: 'https://marker.io/blog/regression-testing',
    },
    {
      title: 'How To Write Test Cases: A Step-By-Step Guide',
      link: 'https://marker.io/blog/how-to-write-test-cases',
    },
    {
      title: 'What is Black Box Testing? A Practical Guide',
      link: 'https://marker.io/blog/black-box-testing',
    },
  ],
  readMoreLink: '/b2b-content-for-marker.io',
};

const JABRA_SECTION = {
  heading: 'Ghostwritten content for Jabra',
  clientName: 'Jabra',
  projects: [
    {
      title: '7 Modern Meeting Room Designs & What You Need to Nail Them',
      link: 'https://www.jabra.com/discover/modern-meeting-room',
    },
    {
      title: 'How to Increase Employee Engagement (By Fixing What\'s Broken)',
      link: 'https://www.jabra.com/discover/increase-employee-engagement',
    },
  ],
};

export default async function PortfolioPage() {
  const page = await getStaticPage('portfolio');
  const parsed = page?.content?.html
    ? parsePortfolioHtml(page.content.html)
    : null;

  if (parsed && parsed.sections.length > 0) {
    parsed.sections[0].projects.unshift(...NEW_MANYREQUESTS_ARTICLES);
    parsed.sections.splice(1, 0, MARKERIO_SECTION);
    parsed.sections.splice(2, 0, JABRA_SECTION);
    const ogImages = await fetchOgImagesForPortfolio(parsed);
    return <PortfolioGrid parsed={parsed} pageTitle={page?.title || 'Portfolio'} ogImages={ogImages} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
        >
          {page?.title || 'Portfolio'}
        </h1>
      </div>
      <div className="space-y-6">
        <p className="text-xl leading-relaxed text-muted-foreground">
          A showcase of my B2B SaaS writing projects and work samples.
        </p>
      </div>
    </div>
  );
}
