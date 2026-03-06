# Portfolio Card Thumbnails Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add side thumbnails (OG images + favicons) to all portfolio cards across 5 pages.

**Architecture:** New `lib/ogImage.ts` fetches and caches OG images server-side. `PortfolioCard` becomes a flex layout with text on left and thumbnail on right. Favicon pulled from Google's favicon API. Fallback: brand-colored gradient with centered favicon.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, server-side fetch for OG scraping.

---

### Task 1: Create OG Image Fetcher (`lib/ogImage.ts`)

**Files:**
- Create: `lib/ogImage.ts`

**Step 1: Create the OG image utility**

```ts
const ogCache = new Map<string, string | null>();

/**
 * Extract the og:image URL from a page's HTML <head>.
 * Returns null if not found or fetch fails.
 * Results are cached in-memory so repeated renders don't re-fetch.
 */
export async function getOgImage(url: string): Promise<string | null> {
  if (ogCache.has(url)) return ogCache.get(url)!;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) { ogCache.set(url, null); return null; }

    // Only read the first 50KB — og:image is always in <head>
    const reader = res.body?.getReader();
    if (!reader) { ogCache.set(url, null); return null; }

    let html = '';
    const decoder = new TextDecoder();
    while (html.length < 50_000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
    }
    reader.cancel();

    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    ) ?? html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );

    const result = match?.[1] || null;
    ogCache.set(url, result);
    return result;
  } catch {
    ogCache.set(url, null);
    return null;
  }
}

/**
 * Extract domain from a URL for favicon fetching.
 */
export function getDomain(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * Get Google favicon URL for a domain.
 */
export function getFaviconUrl(domain: string, size = 32): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}
```

**Step 2: Verify the file compiles**

Run: `cd C:/AKINWALE/portfolio && npx tsc --noEmit lib/ogImage.ts 2>&1 | head -20`
Expected: No errors (or only unrelated existing errors)

**Step 3: Commit**

```bash
git add lib/ogImage.ts
git commit -m "feat: add OG image fetcher with caching and favicon helpers"
```

---

### Task 2: Update PortfolioCard with Side Thumbnail + Favicon

**Files:**
- Modify: `components/PortfolioCard.tsx`

**Step 1: Rewrite PortfolioCard**

The card becomes a flex row: text content on the left, thumbnail on the right. New props: `ogImage` (string | null) and `faviconUrl` (string | null).

Replace the entire file with:

```tsx
'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import type { PortfolioProject } from '@/lib/hashnode/parsePortfolio';

/* ── Brand colors for known clients ── */
const BRAND_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  manyrequests:    { bg: '#EDEDFF', text: '#3B3FC5', darkBg: '#1e1b4b', darkText: '#a5b4fc' },
  manyrequest:     { bg: '#EDEDFF', text: '#3B3FC5', darkBg: '#1e1b4b', darkText: '#a5b4fc' },
  highervisibility:{ bg: '#FEF7E8', text: '#9A7B1A', darkBg: '#2d1e00', darkText: '#fbbf24' },
  pangea:          { bg: '#EDF5F0', text: '#1B3A2D', darkBg: '#0d2318', darkText: '#6ee7b7' },
  markerio:        { bg: '#EDEFFF', text: '#2336CC', darkBg: '#12154a', darkText: '#a5b0fd' },
  jabra:           { bg: '#FFFBE6', text: '#856500', darkBg: '#2d2200', darkText: '#FFD100' },
};

/* ── Fallback palette for unknown clients ── */
const FALLBACK_COLORS = [
  { bg: '#FFF7ED', text: '#C2410C' },
  { bg: '#F0F9FF', text: '#0369A1' },
  { bg: '#FDF4FF', text: '#7E22CE' },
  { bg: '#F0FDFA', text: '#0F766E' },
  { bg: '#FFF1F2', text: '#BE123C' },
  { bg: '#FFFBEB', text: '#A16207' },
  { bg: '#F0FDF4', text: '#15803D' },
  { bg: '#FEF2F2', text: '#B91C1C' },
];

/* ── Gradient stops for branded fallback thumbnails ── */
const BRAND_GRADIENTS: Record<string, { from: string; to: string }> = {
  manyrequests:    { from: '#3B3FC5', to: '#7c7fff' },
  manyrequest:     { from: '#3B3FC5', to: '#7c7fff' },
  highervisibility:{ from: '#92400e', to: '#d97706' },
  pangea:          { from: '#1B3A2D', to: '#34d399' },
  markerio:        { from: '#4338ca', to: '#818cf8' },
  jabra:           { from: '#1a1a1a', to: '#555555' },
};

const FALLBACK_GRADIENTS = [
  { from: '#C2410C', to: '#fb923c' },
  { from: '#0369A1', to: '#38bdf8' },
  { from: '#7E22CE', to: '#c084fc' },
  { from: '#0F766E', to: '#5eead4' },
  { from: '#BE123C', to: '#fda4af' },
  { from: '#A16207', to: '#fcd34d' },
  { from: '#15803D', to: '#86efac' },
  { from: '#B91C1C', to: '#fca5a5' },
];

function getPillColor(clientName: string, isDark: boolean) {
  const key = clientName.toLowerCase().replace(/[\s._-]/g, '');
  for (const [brand, color] of Object.entries(BRAND_COLORS)) {
    if (key.includes(brand)) {
      return { bg: isDark ? color.darkBg : color.bg, text: isDark ? color.darkText : color.text };
    }
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

function getGradient(clientName: string) {
  const key = clientName.toLowerCase().replace(/[\s._-]/g, '');
  for (const [brand, grad] of Object.entries(BRAND_GRADIENTS)) {
    if (key.includes(brand)) return grad;
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
  }
  return FALLBACK_GRADIENTS[Math.abs(hash) % FALLBACK_GRADIENTS.length];
}

interface PortfolioCardProps {
  project: PortfolioProject;
  clientName?: string;
  ogImage?: string | null;
  faviconUrl?: string | null;
}

export function PortfolioCard({ project, clientName, ogImage, faviconUrl }: PortfolioCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const pill = clientName ? getPillColor(clientName, isDark) : null;
  const gradient = clientName ? getGradient(clientName) : null;

  const textContent = (
    <div style={{ flex: 1, minWidth: 0, padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        {faviconUrl && (
          <img
            src={faviconUrl}
            alt=""
            width={18}
            height={18}
            style={{ borderRadius: '4px', flexShrink: 0 }}
          />
        )}
        {clientName && pill && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              padding: '3px 10px',
              borderRadius: '8px',
              backgroundColor: pill.bg,
              color: pill.text,
            }}
          >
            {clientName}
          </span>
        )}
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          fontWeight: 600,
          lineHeight: 1.45,
          color: 'var(--foreground)',
          marginBottom: '14px',
        }}
      >
        {project.title}
      </h3>

      {project.link && (
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '0.02em',
          }}
        >
          Read article ↗
        </span>
      )}
    </div>
  );

  const thumbnail = (project.link && (ogImage || gradient)) ? (
    <div
      style={{
        width: '140px',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
        borderTopRightRadius: '13px',
        borderBottomRightRadius: '13px',
      }}
    >
      {ogImage ? (
        <Image
          src={ogImage}
          alt=""
          fill
          sizes="140px"
          style={{ objectFit: 'cover' }}
        />
      ) : gradient ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: '130px',
            background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {faviconUrl && (
            <img
              src={faviconUrl}
              alt=""
              width={28}
              height={28}
              style={{ borderRadius: '6px', opacity: 0.85, filter: 'brightness(1.3)' }}
            />
          )}
        </div>
      ) : null}
    </div>
  ) : null;

  const cardClass = `border border-border rounded-xl bg-background transition-all duration-300 ${
    project.link ? 'hover:-translate-y-[3px] hover:shadow-[0_10px_36px_rgba(0,0,0,0.08)]' : ''
  }`;

  if (project.link) {
    return (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
        style={{ display: 'flex', textDecoration: 'none', overflow: 'hidden' }}
      >
        {textContent}
        {thumbnail}
      </a>
    );
  }

  return (
    <div className={cardClass} style={{ display: 'flex', overflow: 'hidden' }}>
      {textContent}
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `cd C:/AKINWALE/portfolio && npx tsc --noEmit 2>&1 | head -20`

**Step 3: Commit**

```bash
git add components/PortfolioCard.tsx
git commit -m "feat: add side thumbnail and favicon to PortfolioCard"
```

---

### Task 3: Wire OG Data into PortfolioGrid

**Files:**
- Modify: `components/PortfolioGrid.tsx`

**Step 1: Update PortfolioGrid to accept and pass OG data**

The grid receives a map of `url -> ogImageUrl` and passes data down to each card. Also computes favicon URLs.

Replace the entire file with:

```tsx
import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';
import { PortfolioCard } from '@/components/PortfolioCard';
import { getDomain, getFaviconUrl } from '@/lib/ogImage';

interface PortfolioGridProps {
  parsed: ParsedPortfolio;
  pageTitle?: string;
  ogImages?: Record<string, string | null>;
}

export function PortfolioGrid({ parsed, pageTitle, ogImages = {} }: PortfolioGridProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      {pageTitle && (
        <div className="mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {pageTitle}
          </h1>
        </div>
      )}

      <div className="space-y-16">
        {parsed.sections.map((section, i) => {
          const domain = section.projects[0]?.link
            ? getDomain(section.projects[0].link)
            : null;
          const sectionFavicon = domain ? getFaviconUrl(domain) : null;

          return (
            <section key={i}>
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
```

**Step 2: Verify it compiles**

Run: `cd C:/AKINWALE/portfolio && npx tsc --noEmit 2>&1 | head -20`

**Step 3: Commit**

```bash
git add components/PortfolioGrid.tsx
git commit -m "feat: wire OG images and favicons into PortfolioGrid"
```

---

### Task 4: Create OG Fetching Helper for Pages

**Files:**
- Create: `lib/fetchOgImages.ts`

**Step 1: Create a batch fetcher that pages can call**

```ts
import { getOgImage } from '@/lib/ogImage';
import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';

/**
 * Given a parsed portfolio, fetch OG images for all project links in parallel.
 * Returns a record of link -> ogImageUrl (or null).
 */
export async function fetchOgImagesForPortfolio(
  parsed: ParsedPortfolio
): Promise<Record<string, string | null>> {
  const links = parsed.sections
    .flatMap((s) => s.projects)
    .map((p) => p.link)
    .filter((link): link is string => !!link);

  const unique = [...new Set(links)];
  const results = await Promise.all(unique.map((url) => getOgImage(url)));

  const map: Record<string, string | null> = {};
  unique.forEach((url, i) => {
    map[url] = results[i];
  });
  return map;
}
```

**Step 2: Commit**

```bash
git add lib/fetchOgImages.ts
git commit -m "feat: add batch OG image fetcher for portfolio pages"
```

---

### Task 5: Update Portfolio Page to Fetch OG Images

**Files:**
- Modify: `app/portfolio/page.tsx`

**Step 1: Add OG fetching to the server component**

Replace the entire file with:

```tsx
import { getStaticPage } from '@/lib/hashnode/client';
import { parsePortfolioHtml } from '@/lib/hashnode/parsePortfolio';
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { fetchOgImagesForPortfolio } from '@/lib/fetchOgImages';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Peace Akinwale',
  description: 'Explore the portfolio of Peace Akinwale - featured B2B SaaS writing projects.',
};

const NEW_MANYREQUESTS_ARTICLE = {
  title: '6 Best Project Management Software for Designers in 2026',
  link: 'https://www.manyrequests.com/blog/project-management-software-for-designers',
};

const MARKERIO_SECTION = {
  heading: 'Ghostwritten content for Marker.io',
  clientName: 'Marker.io',
  projects: [
    {
      title: 'What is Regression Testing? A Practical Guide',
      link: 'https://marker.io/blog/regression-testing',
    },
    {
      title: 'How To Write Test Cases: A Step-By-Step Guide',
      link: 'https://marker.io/blog/how-to-write-test-cases',
    },
    {
      title: 'What is Black Box Testing? A Practical Guide',
      link: 'https://marker.io/blog/black-box-testing',
    },
  ],
  readMoreLink: '/b2b-content-for-marker.io',
};

const JABRA_SECTION = {
  heading: 'Ghostwritten content for Jabra',
  clientName: 'Jabra',
  projects: [
    {
      title: '7 Modern Meeting Room Designs & What You Need to Nail Them',
      link: 'https://www.jabra.com/discover/modern-meeting-room',
    },
    {
      title: 'How to Increase Employee Engagement (By Fixing What\'s Broken)',
      link: 'https://www.jabra.com/discover/increase-employee-engagement',
    },
  ],
};

export default async function PortfolioPage() {
  const page = await getStaticPage('portfolio');
  const parsed = page?.content?.html
    ? parsePortfolioHtml(page.content.html)
    : null;

  if (parsed && parsed.sections.length > 0) {
    parsed.sections[0].projects.unshift(NEW_MANYREQUESTS_ARTICLE);
    parsed.sections.splice(1, 0, MARKERIO_SECTION);
    parsed.sections.splice(2, 0, JABRA_SECTION);

    const ogImages = await fetchOgImagesForPortfolio(parsed);

    return <PortfolioGrid parsed={parsed} pageTitle={page?.title || 'Portfolio'} ogImages={ogImages} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          {page?.title || 'Portfolio'}
        </h1>
      </div>
      <div className="space-y-6">
        <p className="text-xl leading-relaxed text-muted-foreground">
          A showcase of my B2B SaaS writing projects and work samples.
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/portfolio/page.tsx
git commit -m "feat: fetch OG images on portfolio page"
```

---

### Task 6: Update Catch-All Slug Page for Client Sub-Pages

**Files:**
- Modify: `app/[slug]/page.tsx` (lines 181-204, the portfolio rendering block)

**Step 1: Add OG fetching to the portfolio branch**

In `app/[slug]/page.tsx`, find the block at ~line 181-204 that renders `PortfolioGrid` for static pages with portfolio content. Add the import and OG fetch:

Add import at the top (after the existing imports):
```ts
import { fetchOgImagesForPortfolio } from '@/lib/fetchOgImages';
```

Then replace lines 185-204 (the `if (hasPortfolioContent)` block) with:

```tsx
    if (hasPortfolioContent) {
      if (slug === 'b2b-content-for-manyrequests' && parsed.sections.length > 0) {
        parsed.sections[0].projects.unshift({
          title: '6 Best Project Management Software for Designers in 2026',
          link: 'https://www.manyrequests.com/blog/project-management-software-for-designers',
        });
      }

      const ogImages = await fetchOgImagesForPortfolio(parsed);

      return (
        <>
          <PortfolioGrid parsed={parsed} pageTitle={staticPage.title} ogImages={ogImages} />
          <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
            <Link
              href="/portfolio"
              className="inline-block font-sans text-sm uppercase tracking-wide border-b-2 border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
            >
              ← Back to Portfolio
            </Link>
          </div>
        </>
      );
    }
```

**Step 2: Commit**

```bash
git add app/[slug]/page.tsx
git commit -m "feat: fetch OG images for client sub-pages"
```

---

### Task 7: Update Marker.io Dedicated Page

**Files:**
- Modify: `app/b2b-content-for-marker.io/page.tsx`

**Step 1: Add OG fetching**

Replace the entire file with:

```tsx
import { PortfolioGrid } from '@/components/PortfolioGrid';
import { fetchOgImagesForPortfolio } from '@/lib/fetchOgImages';
import type { ParsedPortfolio } from '@/lib/hashnode/parsePortfolio';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content for Marker.io | Peace Akinwale',
  description: 'B2B writing samples for Marker.io — QA testing and software testing guides.',
};

const markerioPortfolio: ParsedPortfolio = {
  sections: [
    {
      heading: 'Content for Marker.io',
      clientName: 'Marker.io',
      introHtml: `<p>Marker.io is a visual bug reporting tool that helps product and QA teams capture feedback and report bugs directly on their website or app. Their head of content reached out to collaborate, and I've been writing in-depth QA and software testing guides for their blog. All articles were ghostwritten.</p><p>Published articles include:</p>`,
      projects: [
        {
          title: 'What is Regression Testing? A Practical Guide',
          link: 'https://marker.io/blog/regression-testing',
        },
        {
          title: '7 Best Regression Testing Tools in 2025',
          link: 'https://marker.io/blog/regression-testing-tools',
        },
        {
          title: 'What is Tree Testing? A Practical Guide',
          link: 'https://marker.io/blog/tree-testing',
        },
        {
          title: 'What is Black Box Testing? A Practical Guide',
          link: 'https://marker.io/blog/black-box-testing',
        },
        {
          title: 'A Practical Guide to Website QA Testing',
          link: 'https://marker.io/blog/website-qa-testing',
        },
        {
          title: 'How To Write Test Cases: A Step-By-Step Guide',
          link: 'https://marker.io/blog/how-to-write-test-cases',
        },
        {
          title: 'Operational Acceptance Testing: A Quick Overview',
          link: 'https://marker.io/blog/operational-acceptance-testing',
        },
      ],
    },
  ],
};

export default async function MarkerioPage() {
  const ogImages = await fetchOgImagesForPortfolio(markerioPortfolio);

  return (
    <>
      <PortfolioGrid parsed={markerioPortfolio} pageTitle="Content for Marker.io" ogImages={ogImages} />
      <div className="max-w-4xl mx-auto px-6 pb-16 text-center">
        <Link
          href="/portfolio"
          className="inline-block font-sans text-sm uppercase tracking-wide border-b-2 border-foreground hover:border-muted-foreground hover:text-muted-foreground transition-colors"
        >
          ← Back to Portfolio
        </Link>
      </div>
    </>
  );
}
```

**Step 2: Commit**

```bash
git add app/b2b-content-for-marker.io/page.tsx
git commit -m "feat: fetch OG images on marker.io page"
```

---

### Task 8: Test Locally and Verify

**Step 1: Run the dev server**

Run: `cd C:/AKINWALE/portfolio && npm run dev`

**Step 2: Verify all 5 pages visually**

Check in browser:
- `http://localhost:3000/portfolio` — cards should show side thumbnails
- `http://localhost:3000/b2b-content-for-marker.io` — same
- `http://localhost:3000/b2b-content-for-manyrequests` — same
- `http://localhost:3000/content-for-highervisibility` — same
- `http://localhost:3000/content-for-pangea` — same

Expected: Cards have text on left, thumbnail on right. Favicon next to pill. Cards without OG images show branded gradient fallback.

**Step 3: Verify build succeeds**

Run: `cd C:/AKINWALE/portfolio && npm run build 2>&1 | tail -20`
Expected: Build completes without errors.

**Step 4: Clean up mockup file**

Run: `rm C:/AKINWALE/portfolio/mockup-card-layouts.html`

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: clean up mockup file"
```
