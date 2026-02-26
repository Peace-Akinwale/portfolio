import { getStaticPage } from '@/lib/hashnode/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Peace Akinwale',
  description: 'Professional writing and content creation services by Peace Akinwale.',
};

export default async function ServicesPage() {
  const page = await getStaticPage('services');

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="font-sans text-5xl md:text-6xl font-bold mb-8">
        {page?.title || 'Services'}
      </h1>

      {page?.content?.html ? (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content.html }}
        />
      ) : (
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">
            Professional writing and content creation services.
          </p>
          <p className="text-muted-foreground">
            To customize this page, create a static page called "services" in your Hashnode dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
