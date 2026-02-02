import { getStaticPage } from '@/lib/hashnode/client';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About | Peace Akinwale',
  description: 'Learn more about Peace Akinwale - B2B SaaS writer and AI Content Engineer.',
};

export default async function AboutPage() {
  const page = await getStaticPage('about');

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      {/* Photo */}
      <div className="mb-12">
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] overflow-hidden rounded-lg shadow-xl">
          <Image
            src="/images/peace-akinwale-about.jpg"
            alt="Peace Akinwale"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
          {page?.title || "I'm Peace Akinwale"}
        </h1>
      </div>

      {/* Content */}
      {page?.content?.html ? (
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content.html }}
        />
      ) : (
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
            I'm a B2B SaaS writer who specializes in content that converts. From comparison pages to alternative pages and technical how-to guides, I help SaaS companies turn readers into customers.
          </p>

          <h2 className="font-serif text-2xl font-bold mb-4 mt-8 text-foreground">
            What I Do
          </h2>
          <p className="mb-4 text-muted-foreground">
            I craft strategic content that drives results for B2B SaaS companies. My expertise lies in creating comparison pages, alternative pages, and comprehensive how-to guides that educate and convert.
          </p>

          <h2 className="font-serif text-2xl font-bold mb-4 mt-8 text-foreground">
            Beyond Writing
          </h2>
          <p className="mb-4 text-muted-foreground">
            I also build AI systems that scale, helping businesses automate and optimize their content operations.
          </p>

          <div className="mt-12 p-6 rounded-lg bg-muted">
            <p className="text-sm mb-2 text-muted-foreground">
              <strong className="text-foreground">Want to customize this page?</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Create a static page called "about" in your Hashnode dashboard to replace this placeholder content with your story.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
