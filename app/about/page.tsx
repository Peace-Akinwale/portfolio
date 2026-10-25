import { withOg } from '@/lib/og';
import { getStaticPage } from '@/lib/hashnode/client';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import '@/components/article/article.css';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = withOg({
  title: 'About',
  description: 'Peace Akinwale, Lagos. I write bottom-of-funnel content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams.',
  alternates: { canonical: `${SITE_URL}/about` },
}, { key: 'about', path: '/about', alt: 'About Peace Akinwale' });

export default async function AboutPage() {
  const page = await getStaticPage('about').catch(() => null);

  return (
    <div className="article gutter">
      <header className="article-head">
        <p className="kicker">About</p>
        <h1>{page?.title || "I'm Peace Akinwale"}</h1>
        <p className="standfirst">I write bottom-of-funnel content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams. Lagos.</p>
      </header>
      <div className="article-layout">
        <div>
          {page?.content?.html ? (
            // The WordPress page repeats its title as an <h1>; the header above already has it.
            <div className="prose" dangerouslySetInnerHTML={{ __html: page.content.html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>/, '') }} />
          ) : (
            <div className="prose">
              <p>I came to building from writing, and the two feed each other. Before I write anything, I dig into the product, the buyer and what the competitors are getting wrong. Before I build anything, I ask which part of the existing process should be left alone.</p>
              <p>Every project I run keeps a decisions file that’s read before each session, and nothing is called done until a real person has used it on the live app. The <Link href="/portfolio">record of the work</Link> and the <Link href="/case-studies">case studies</Link> show what that looks like.</p>
            </div>
          )}
          <p className="go mt-8">
            <Link href="/portfolio">The work</Link>
            <Link href="/services">Services and prices</Link>
            <Link href="/contact">Contact</Link>
          </p>
        </div>
        <figure className="m-0 max-w-[360px]">
          <Image src="/images/peace-akinwale-about-wedding.jpg" alt="Peace Akinwale" width={900} height={1200} sizes="(max-width: 760px) 100vw, 360px" className="rounded-[2px] border border-border" priority />
        </figure>
      </div>
    </div>
  );
}
