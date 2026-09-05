import { PortfolioGrid } from '@/components/PortfolioGrid';
import { fetchOgImagesForPortfolio } from '@/lib/fetchOgImages';
import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content for Marker.io | Peace Akinwale',
  alternates: {
    canonical: 'https://peaceakinwale.com/b2b-content-for-marker.io',
  },
  description: 'B2B writing samples for Marker.io — QA testing and software testing guides.',
};

const markerioPortfolio: ParsedPortfolio = {
  sections: [
    {
      heading: 'Content for Marker.io',
      clientName: 'Marker.io',
      introHtml: `<p><a href="https://marker.io" target="_blank" rel="noopener noreferrer">Marker.io</a> is a visual bug reporting tool that helps product and QA teams capture feedback and report bugs directly on their website or app. Their head of content reached out to collaborate, and I've been writing in-depth QA and software testing guides for their blog. All articles were ghostwritten.</p><p>Published articles include:</p>`,
      projects: [
        {
          title: 'What is Regression Testing? A Practical Guide',
          link: 'https://marker.io/blog/regression-testing',
        },
        {
          title: '7 Best Regression Testing Tools in 2025',
          link: 'https://marker.io/blog/regression-testing-tools',
        },
        {
          title: 'What is Tree Testing? A Practical Guide',
          link: 'https://marker.io/blog/tree-testing',
        },
        {
          title: 'What is Black Box Testing? A Practical Guide',
          link: 'https://marker.io/blog/black-box-testing',
        },
        {
          title: 'A Practical Guide to Website QA Testing',
          link: 'https://marker.io/blog/website-qa-testing',
        },
        {
          title: 'How To Write Test Cases: A Step-By-Step Guide',
          link: 'https://marker.io/blog/how-to-write-test-cases',
        },
        {
          title: 'Operational Acceptance Testing: A Quick Overview',
          link: 'https://marker.io/blog/operational-acceptance-testing',
        },
      ],
    },
  ],
};

export default async function MarkerioPage() {
  const ogImages = await fetchOgImagesForPortfolio(markerioPortfolio);
  return (
    <>
      <PortfolioGrid parsed={markerioPortfolio} pageTitle="Content for Marker.io" ogImages={ogImages} />
      <div className="mx-auto max-w-6xl gutter pb-16">
        <Link href="/portfolio" className="text-sm font-semibold text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent">
          Back to the portfolio
        </Link>
      </div>
    </>
  );
}
