import Link from 'next/link';
import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';

// Every writing sample, by client: the WordPress portfolio page's sections plus
// the Marker.io and Jabra sections the site adds. Compact list, one block per
// client, so the record above stays the showcase and this stays the index.
export function WritingSamples({ parsed }: { parsed: ParsedPortfolio }) {
  return (
    <section className="samples" id="writing" aria-labelledby="writing-h">
      <h2 id="writing-h">Writing samples, by client</h2>
      <p>Everything I’ve published or ghostwritten that I’m allowed to link to. The list above shows off the ones with proof attached. This is all of it.</p>
      {parsed.sections.map((section) => (
        <div className="samples-section" key={section.heading}>
          <div>
            <h3>{section.heading}</h3>
            {section.introHtml && <div className="intro" dangerouslySetInnerHTML={{ __html: section.introHtml }} />}
            {section.readMoreLink && (
              <p className="more"><Link href={section.readMoreLink}>More from this client</Link></p>
            )}
          </div>
          <ul>
            {section.projects.map((p) => (
              <li key={p.link ?? p.title}>
                {p.link ? <a href={p.link} rel="noopener" target="_blank">{p.title}</a> : p.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
