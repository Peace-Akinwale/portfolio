import Image from 'next/image';
import Link from 'next/link';
import type { ParsedPortfolio } from '@/lib/wordpress/parsePortfolio';

// Every writing sample, by client: the WordPress portfolio page's sections plus
// the Marker.io and Jabra sections the site adds. Compact list, one block per
// client, so the record above stays the showcase and this stays the index.
export function WritingSamples({ parsed }: { parsed: ParsedPortfolio }) {
  return (
    <section className="samples" id="writing" aria-labelledby="writing-h">
      <h2 id="writing-h">Writing samples, by client</h2>
      {parsed.sections.map((section) => (
        <div className="samples-section" key={section.heading}>
          <div>
            <h3>{section.heading}</h3>
            {section.introHtml && <div className="intro" dangerouslySetInnerHTML={{ __html: section.introHtml }} />}
            {section.readMoreLink && (
              <p className="more"><Link href={section.readMoreLink}>{section.clientName ? `All ${section.clientName} articles` : 'All articles for this client'}</Link></p>
            )}
            {section.caseStudyLink && (
              <p className="more"><Link href={section.caseStudyLink.href}>{section.caseStudyLink.label}</Link></p>
            )}
          </div>
          {/* A client's evidence sits under its own articles, at the image's own size (24 Nov 2026). */}
          <div className="samples-list">
            <ul>
              {section.projects.map((p) => (
                <li key={p.link ?? p.title}>
                  {p.link ? <a href={p.link} rel="noopener" target="_blank">{p.title}</a> : p.title}
                </li>
              ))}
            </ul>
            {section.figure && (
              <figure className="samples-figure" style={{ maxWidth: section.figure.width }}>
                <Image src={section.figure.src} width={section.figure.width} height={section.figure.height} sizes={`${section.figure.width}px`} alt={section.figure.alt} />
                <figcaption>{section.figure.caption}</figcaption>
              </figure>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
