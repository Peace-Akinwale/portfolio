import { getStaticPage } from '@/lib/hashnode/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Peace Akinwale',
  description: 'Explore the portfolio of Peace Akinwale - featured B2B SaaS writing projects.',
};

export default async function PortfolioPage() {
  const page = await getStaticPage('portfolio');

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {page?.title || 'Portfolio'}
        </h1>
      </div>

      {page?.content?.html ? (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content.html }}
        />
      ) : (
        <div className="space-y-6">
          <p className="text-xl leading-relaxed text-muted-foreground">
            A showcase of my B2B SaaS writing projects and work samples.
          </p>
          <div className="mt-12 p-6 rounded-lg bg-muted">
            <p className="text-sm mb-2 text-muted-foreground">
              <strong className="text-foreground">Your portfolio content will appear here</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              To customize this page, create a static page called "portfolio" in your Hashnode dashboard. I can see you already have one - it should load automatically once the connection is stable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
