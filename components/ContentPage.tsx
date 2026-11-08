import { preparePageImages } from '@/lib/content/page-images';
import { ImageLightbox } from '@/components/ImageLightbox';
import Link from 'next/link';
import Image from 'next/image';
import '@/components/article/article.css';
import './content-page.css';

export async function ContentPage({ title, html, portrait = false, caseStudy = false, published }: {
  title: string;
  html: string;
  portrait?: boolean;
  caseStudy?: boolean;
  published?: string;
}) {
  html = await preparePageImages(html);
  const introduction = portrait ? html.match(/^<p>[\s\S]*?<\/p>/)?.[0] : undefined;
  const body = introduction ? html.slice(introduction.length) : html;
  return (
    <article className="approved-page gutter">
      <ImageLightbox />
      <header className={portrait ? 'approved-head has-portrait' : 'approved-head'}>
        <div>
          {caseStudy && <p className="approved-back"><Link href="/case-studies">Case studies</Link></p>}
          <h1>{title}</h1>
          {introduction && <div className="prose approved-intro" dangerouslySetInnerHTML={{ __html: introduction }} />}
          {published && <p className="approved-date"><time dateTime={published}>{new Date(published + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time></p>}
        </div>
        {portrait && <Image src="/images/peace-akinwale-about-wedding.jpg" alt="Peace Akinwale" width={900} height={1200} sizes="(max-width: 640px) 90px, 140px" className="approved-portrait" priority />}
      </header>
      <div className="prose approved-prose" dangerouslySetInnerHTML={{ __html: body }} />
      {caseStudy && <p className="approved-back"><Link href="/case-studies">Back to case studies</Link></p>}
    </article>
  );
}
