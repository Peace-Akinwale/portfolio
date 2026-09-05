import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';
import { Container, IndexList, IndexRow, PageHeader } from '@/components/ui';
import { getDomain, getFaviconUrl } from '@/lib/ogImage';

interface PortfolioGridProps {
  parsed: ParsedPortfolio;
  pageTitle?: string;
  lede?: string;
  /** OG images are fetched upstream; the index does not render them. */
  ogImages?: Record<string, string | null>;
}

/** Portfolio as an index: one section per client, one row per piece. */
export function PortfolioGrid({ parsed, pageTitle, lede }: PortfolioGridProps) {
  const firstLink = parsed.sections[0]?.projects[0]?.link ?? null;
  const pageDomain = firstLink ? getDomain(firstLink) : null;
  const pageFavicon = pageDomain && parsed.sections.length === 1 ? getFaviconUrl(pageDomain, 32) : null;
  // Running number across sections, computed up front rather than mutated during render.
  const offsets = parsed.sections.reduce<number[]>((acc, section, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + parsed.sections[i - 1].projects.length);
    return acc;
  }, []);

  return (
    <>
      {pageTitle && (
        <PageHeader
          label="Portfolio"
          title={
            <span className="flex items-center gap-4">
              {pageFavicon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pageFavicon} alt="" width={28} height={28} className="h-7 w-7 rounded-sm" />
              )}
              {pageTitle}
            </span>
          }
          lede={lede}
        />
      )}

      <Container className="flex flex-col gap-16 pb-24">
        {parsed.sections.map((section, i) => (
          <section key={i}>
            {parsed.sections.length > 1 && (
              <h2 className="t-h3 mb-2 text-foreground">{section.heading}</h2>
            )}
            {section.introHtml && (
              <div
                className="mb-6 max-w-prose text-[15px] leading-relaxed text-muted-foreground [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_p]:mb-3 [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: section.introHtml }}
              />
            )}
            <IndexList>
              {section.projects.map((project, j) => {
                const domain = project.link ? getDomain(project.link) : null;
                return (
                  <IndexRow
                    key={j}
                    number={String(offsets[i] + j + 1).padStart(2, "0")}
                    title={project.title}
                    href={project.link}
                    meta={project.description}
                    aside={
                      domain ? (
                        <span className="inline-flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={getFaviconUrl(domain, 32)} alt="" width={14} height={14} className="h-3.5 w-3.5 rounded-sm" loading="lazy" />
                          {section.clientName || domain}
                        </span>
                      ) : (
                        section.clientName
                      )
                    }
                  />
                );
              })}
            </IndexList>
            {section.readMoreLink && (
              <a href={section.readMoreLink} className="mt-5 inline-block text-sm font-semibold text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent">
                See more from {section.clientName}
              </a>
            )}
          </section>
        ))}

        {parsed.pastAchievementsHtml && (
          <section className="border-t border-border pt-12">
            <h2 className="t-h3 mb-6 text-foreground">Past achievements</h2>
            <div
              className="prose [&_h1]:text-[1.125rem] [&_h2]:text-[1.125rem] [&_img]:rounded-sm [&_img]:border [&_img]:border-border"
              dangerouslySetInnerHTML={{ __html: parsed.pastAchievementsHtml }}
            />
          </section>
        )}

        {parsed.ctaHtml && (
          <section className="border-t border-border pt-12">
            <div
              className="prose [&_h2]:text-[1.25rem] [&_h3]:text-[1.25rem] [&_hr]:hidden"
              dangerouslySetInnerHTML={{ __html: parsed.ctaHtml }}
            />
          </section>
        )}
      </Container>
    </>
  );
}
