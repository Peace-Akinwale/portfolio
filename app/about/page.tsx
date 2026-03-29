import { getStaticPage } from '@/lib/hashnode/client';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About | Peace Akinwale',
  description: 'Peace Akinwale is a B2B SaaS content writer who specializes in product-led articles that rank on Google and get cited in AI search.',
};

export default async function AboutPage() {
  const page = await getStaticPage('about');

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto">
      {/* Photo */}
      <div className="mb-12">
        <div className="relative w-full max-w-md mx-auto aspect-[3/4] overflow-hidden rounded-lg shadow-xl">
          <Image
            src="/images/peace-akinwale-about-wedding.jpg"
            alt="Peace Akinwale"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
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
            I&rsquo;m a B2B SaaS content writer based in Lagos. I write product-led articles that rank on Google, show up in ChatGPT and Perplexity, and actually move the needle for the companies I work with.
          </p>
          <p className="mb-6 text-muted-foreground">
            My background is in understanding how products work and how buyers think. Before I write anything, I dig into your product, your ICP, and what your competitors are getting wrong. The article only happens after that.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-10 text-foreground">
            How I work
          </h2>
          <p className="mb-4 text-muted-foreground">
            I write one first draft — no AI scaffolding, no outsourced outlines. I evaluate every topic for business potential before I accept it, and I push back if the fit isn&rsquo;t there. Most clients go from two rounds of feedback to zero by the end of an engagement.
          </p>
          <p className="mb-4 text-muted-foreground">
            I also build lightweight AI systems and content workflows for teams who want to reduce the manual work on their plate without sacrificing quality on the output.
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-10 text-foreground">
            Who I&rsquo;ve written for
          </h2>
          <p className="mb-4 text-muted-foreground">
            ManyRequests, Marker.io, HigherVisibility, Jabra, Pangea.ai, Spicy Margarita, and a handful of other B2B SaaS brands over the past few years.
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
