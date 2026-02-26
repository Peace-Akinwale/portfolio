import { getStaticPage } from '@/lib/hashnode/client';
import { parsePortfolioHtml } from '@/lib/hashnode/parsePortfolio';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Peace Akinwale',
  description: 'Explore the portfolio of Peace Akinwale - featured B2B SaaS writing projects.',
};

export default async function PortfolioPage() {
  const page = await getStaticPage('portfolio');
  const parsed = page?.content?.html
    ? parsePortfolioHtml(page.content.html)
    : null;

  if (parsed && parsed.sections.length > 0) {
    return <PortfolioGrid parsed={parsed} pageTitle={page?.title || 'Portfolio'} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
          style={{ fontFamily: 'var(--font-sans)' }}
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
