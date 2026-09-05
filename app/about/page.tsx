import type { Metadata } from 'next';
import Image from 'next/image';
import { getStaticPage } from '@/lib/hashnode/client';
import { Container, PageHeader } from '@/components/ui';
import { ClientRow } from '@/components/ClientRow';
import { CtaBlock } from '@/components/CtaBlock';

export const metadata: Metadata = {
  title: 'About | Peace Akinwale',
  description:
    'Peace Akinwale is a B2B SaaS content writer who specializes in product-led content that ranks on Google and is cited in AI search.',
  alternates: {
    canonical: 'https://peaceakinwale.com/about',
  },
};

export default async function AboutPage() {
  const page = await getStaticPage('about');

  return (
    <>
      <PageHeader label="About" title={page?.title || 'I’m Peace Akinwale'} lede="B2B SaaS content writer in Lagos, Nigeria. I read the product before the brief." />

      <Container className="pb-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-20">
          <div>
            {page?.content?.html ? (
              <div className="prose" dangerouslySetInnerHTML={{ __html: page.content.html }} />
            ) : (
              <div className="prose">
                <p>
                  I write product-led articles that rank on Google, show up in ChatGPT and Perplexity, and move the needle
                  for the companies I work with.
                </p>
                <p>
                  My background is in understanding how products work and how buyers think. Before I write anything, I dig
                  into your product, your ICP, and what your competitors are getting wrong. The article only happens after
                  that.
                </p>
                <h2>How I work</h2>
                <p>
                  I write one first draft. No AI scaffolding, no outsourced outlines. I evaluate every topic for business
                  potential before I accept it, and I push back if the fit is not there. Most clients go from two rounds of
                  feedback to zero by the end of an engagement.
                </p>
                <p>
                  I also build lightweight AI systems and content workflows for teams who want less manual work without
                  losing quality in the output.
                </p>
                <h2>Who I have written for</h2>
                <p>
                  ManyRequests, Marker.io, HigherVisibility, Jabra, Pangea.ai, Spicy Margarita, and a handful of other B2B
                  SaaS brands over the past few years.
                </p>
              </div>
            )}
          </div>
          <div className="lg:pt-2">
            <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-sm bg-muted">
              <Image
                src="/images/peace-akinwale-about-wedding.jpg"
                alt="Peace Akinwale"
                fill
                sizes="(min-width: 1024px) 24rem, 100vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </Container>

      <Container className="py-12">
        <ClientRow />
      </Container>

      <CtaBlock />
    </>
  );
}
