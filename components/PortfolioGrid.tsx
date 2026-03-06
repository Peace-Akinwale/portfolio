import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';
import { PortfolioCard } from '@/components/PortfolioCard';
import { getDomain, getFaviconUrl } from '@/lib/ogImage';

interface PortfolioGridProps {
  parsed: ParsedPortfolio;
  pageTitle?: string;
  ogImages?: Record<string, string | null>;
}

export function PortfolioGrid({ parsed, pageTitle, ogImages = {} }: PortfolioGridProps) {
  // Derive a page-level favicon from the first project link (for individual client pages)
  const firstLink = parsed.sections[0]?.projects[0]?.link ?? null;
  const pageDomain = firstLink ? getDomain(firstLink) : null;
  const pageFavicon = pageDomain && parsed.sections.length === 1 ? getFaviconUrl(pageDomain, 24) : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      {pageTitle && (
        <div className="mb-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            {pageFavicon && (
              <img
                src={pageFavicon}
                alt=""
                width={24}
                height={24}
                style={{ borderRadius: '6px', flexShrink: 0 }}
              />
            )}
            <h1
              className="text-4xl md:text-5xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {pageTitle}
            </h1>
          </div>
        </div>
      )}

      <div className="space-y-16">
        {parsed.sections.map((section, i) => {
          const sectionDomain = section.projects[0]?.link
            ? getDomain(section.projects[0].link)
            : null;
          const sectionFavicon = sectionDomain ? getFaviconUrl(sectionDomain) : null;

          return (
          <section key={i}>
            {/* Only show section heading if there are multiple sections */}
            {parsed.sections.length > 1 && (
              <div className="mb-6 flex items-center gap-4">
                <h2
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.01em',
                    textTransform: 'none',
                    color: 'var(--muted-foreground)',
                    whiteSpace: 'normal',
                  }}
                >
                  {section.heading}
                </h2>
                <hr className="flex-1 border-border" />
              </div>
            )}

            {/* Intro text (company description) */}
            {section.introHtml && (
              <div
                className="prose prose-sm max-w-none mb-8
                  [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-[var(--muted-foreground)] [&>p]:mb-3
                  [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2
                  [&_strong]:text-foreground"
                dangerouslySetInnerHTML={{ __html: section.introHtml }}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.projects.map((project, j) => {
                const projectDomain = project.link ? getDomain(project.link) : null;
                const favicon = projectDomain ? getFaviconUrl(projectDomain) : sectionFavicon;
                return (
                  <PortfolioCard
                    key={j}
                    project={project}
                    clientName={section.clientName}
                    ogImage={project.link ? (ogImages[project.link] ?? null) : null}
                    faviconUrl={favicon}
                  />
                );
              })}
            </div>

            {section.readMoreLink && (
              <div className="mt-6">
                <a
                  href={section.readMoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  See more →
                </a>
              </div>
            )}
          </section>
          );
        })}

        {/* Past Achievements — styled to match the card aesthetic */}
        {parsed.pastAchievementsHtml && (
          <section>
            <div className="mb-6 flex items-center gap-4">
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  whiteSpace: 'nowrap',
                }}
              >
                Past Achievements
              </h2>
              <hr className="flex-1 border-border" />
            </div>

            <div
              className="border border-border rounded-xl bg-background"
              style={{ padding: '32px' }}
            >
              <div
                className="prose prose-sm max-w-none
                  [&>h1]:font-sans [&>h1]:text-base [&>h1]:font-semibold [&>h1]:leading-snug [&>h1]:mb-3 [&>h1]:mt-8 first:[&>h1]:mt-0
                  [&>h2]:font-sans [&>h2]:text-base [&>h2]:font-semibold [&>h2]:leading-snug [&>h2]:mb-3 [&>h2]:mt-8
                  [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-[var(--muted-foreground)] [&>p]:mb-4
                  [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_img]:my-6
                  [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2
                  [&>hr]:my-8 [&>hr]:border-border"
                dangerouslySetInnerHTML={{ __html: parsed.pastAchievementsHtml }}
              />
            </div>
          </section>
        )}

        {/* CTA section — styled as a distinct block */}
        {parsed.ctaHtml && (
          <section>
            <div
              className="border border-border rounded-xl bg-muted/30"
              style={{ padding: '32px' }}
            >
              <div
                className="prose prose-sm max-w-none
                  [&>h2]:font-sans [&>h2]:text-lg [&>h2]:font-bold [&>h2]:leading-snug [&>h2]:mb-4 [&>h2]:text-foreground
                  [&>h3]:font-sans [&>h3]:text-lg [&>h3]:font-bold [&>h3]:leading-snug [&>h3]:mb-4 [&>h3]:text-foreground
                  [&>p]:text-sm [&>p]:leading-relaxed [&>p]:text-[var(--muted-foreground)]
                  [&_a]:text-accent [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2
                  [&>hr]:hidden"
                dangerouslySetInnerHTML={{ __html: parsed.ctaHtml }}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
