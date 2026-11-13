import { MetadataRoute } from 'next';
import { execFileSync } from 'node:child_process';
import { loadAllPosts } from '@/lib/content/posts';
import { listCaseStudies } from '@/lib/content/case-studies';
import { committedLastModified } from '@/lib/seo/source-dates';
import { SITE_URL } from '@/lib/site';

// Every indexable route with a real last-modified date: the fixed pages (dated
// by the last commit to their source, or by lib/seo/source-dates.ts when the
// build has no git history), the case studies (dated by the `date` in the
// file, which is also the date on the page), the WordPress posts (dated by
// WordPress) and the three client sample pages. Left out on purpose (3 Nov
// 2026 SEO audit): the /tag/* pages (thin), /projects except the MyLinks
// landing page, /career-pathway and /services-v2. changeFrequency and priority
// are gone because Google ignores them. The deploy clock is never a lastmod.

export type ModifiedAt = (sources: string[]) => Date | null;

// The fixed pages and the files whose last commit dates them. A page that
// renders content from another module lists that module too.
export const FIXED_PAGES: { path: string; sources: string[] }[] = [
  { path: '', sources: ['app/page.tsx', 'lib/content/home-copy.ts'] },
  { path: '/writing', sources: ['app/writing/page.tsx', 'lib/content/record.ts', 'lib/content/record-static.ts'] },
  { path: '/case-studies', sources: ['app/case-studies/page.tsx', 'content/case-studies'] },
  { path: '/projects/mylinks', sources: ['app/projects/mylinks/page.tsx', 'content/pages/mylinks.md'] },
  { path: '/blog', sources: ['app/blog/page.tsx', 'content/articles'] },
  { path: '/services', sources: ['app/services/page.tsx', 'content/pages/services.md'] },
  { path: '/about', sources: ['app/about/page.tsx', 'content/pages/about.md'] },
  { path: '/contact', sources: ['app/contact/page.tsx'] },
  { path: '/testimonials', sources: ['app/testimonials/page.tsx'] },
  { path: '/case-studies/manyrequests', sources: ['app/case-studies/manyrequests/page.tsx', 'content/pages/manyrequests.md', 'lib/portfolio/manyrequests.ts'] },
  // Client sample pages: WordPress pages rendered as portfolio grids by app/[slug].
  { path: '/writing/manyrequests', sources: ['app/writing/[client]/page.tsx', 'app/[slug]/page.tsx', 'lib/portfolio/manyrequests.ts'] },
  { path: '/writing/highervisibility', sources: ['app/writing/[client]/page.tsx', 'app/[slug]/page.tsx'] },
  { path: '/writing/pangea', sources: ['app/writing/[client]/page.tsx', 'app/[slug]/page.tsx'] },
];

const gitDates = new Map<string, Date | null>();

// The commit date of the last commit that touched any of the paths, or null when
// git has nothing (an untracked file, or a build without a .git directory).
// Railway's production build has no git history, so callers fall back to
// committedLastModified instead of the deploy clock.
export function gitLastModified(sources: string[]): Date | null {
  let newest: Date | null = null;
  for (const source of sources) {
    let date = gitDates.get(source);
    if (date === undefined) {
      date = null;
      try {
        const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', source], {
          cwd: process.cwd(),
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
        const parsed = out ? new Date(out) : null;
        if (parsed && !Number.isNaN(parsed.getTime())) date = parsed;
      } catch {
        date = null;
      }
      gitDates.set(source, date);
    }
    if (date && (!newest || date > newest)) newest = date;
  }
  return newest;
}

function validDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function withLastModified(url: string, lastModified: Date | null): MetadataRoute.Sitemap[number] {
  return lastModified ? { url, lastModified } : { url };
}

export function buildSitemap(input: {
  posts: { slug: string; updatedAt: string; local?: boolean }[];
  caseStudies: { slug: string; date: string }[];
  modifiedAt?: ModifiedAt;
  now?: Date;
}): MetadataRoute.Sitemap {
  const modifiedAt = input.modifiedAt ?? gitLastModified;
  // `now` is accepted so older callers still type-check. It is not a lastmod:
  // a deploy must not stamp every URL with the build clock.

  const fixed: MetadataRoute.Sitemap = FIXED_PAGES.map((page) =>
    withLastModified(`${SITE_URL}${page.path}`, modifiedAt(page.sources) ?? committedLastModified(page.sources)),
  );

  // A case study's lastmod is its own `date`, the same date the page shows.
  // That date lives in the file, so a build without git still has it.
  const studies: MetadataRoute.Sitemap = input.caseStudies.map((cs) =>
    withLastModified(
      `${SITE_URL}/case-studies/${cs.slug}`,
      validDate(cs.date) ?? modifiedAt([`content/case-studies/${cs.slug}.md`]) ?? committedLastModified([`content/case-studies/${cs.slug}.md`]),
    ),
  );

  const posts: MetadataRoute.Sitemap = input.posts.map((post) =>
    withLastModified(
      `${SITE_URL}/blog/${post.slug}`,
      (post.local ? modifiedAt([`content/articles/${post.slug}.md`]) ?? committedLastModified([`content/articles/${post.slug}.md`]) : null) ?? validDate(post.updatedAt),
    ),
  );

  const seen = new Set<string>();
  return [...fixed, ...studies, ...posts].filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await loadAllPosts();
  return buildSitemap({
    posts: posts.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt, local: (p as { local?: boolean }).local === true })),
    caseStudies: listCaseStudies(),
  });
}
