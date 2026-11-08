import { MetadataRoute } from 'next';
import { execFileSync } from 'node:child_process';
import { loadAllPosts } from '@/lib/content/posts';
import { listCaseStudies } from '@/lib/content/case-studies';
import { SITE_URL } from '@/lib/site';

// Every indexable route with a real last-modified date: the fixed pages (dated
// by the last commit to their source), the case studies and local articles
// (dated by the last commit to their markdown), the WordPress posts (dated by
// WordPress) and the three client sample pages WordPress serves through
// app/[slug]. Left out on purpose (3 Nov 2026 SEO audit): the /tag/* pages
// (thin), /projects and its tree (redirected or an app), /career-pathway (an
// old tool) and /services-v2 (a noindex mockup). changeFrequency and priority
// are gone because Google ignores them.

export type ModifiedAt = (sources: string[]) => Date | null;

// The fixed pages and the files whose last commit dates them. A page that
// renders content from another module lists that module too.
export const FIXED_PAGES: { path: string; sources: string[] }[] = [
  { path: '', sources: ['app/page.tsx', 'lib/content/home-copy.ts'] },
  { path: '/portfolio', sources: ['app/portfolio/page.tsx', 'lib/content/record.ts', 'lib/content/record-static.ts'] },
  { path: '/case-studies', sources: ['app/case-studies/page.tsx', 'content/case-studies'] },
  { path: '/projects/mylinks', sources: ['app/projects/mylinks/page.tsx', 'content/pages/mylinks.md'] },
  { path: '/blog', sources: ['app/blog/page.tsx', 'content/articles'] },
  { path: '/services', sources: ['app/services/page.tsx', 'content/pages/services.md'] },
  { path: '/about', sources: ['app/about/page.tsx', 'content/pages/about.md'] },
  { path: '/contact', sources: ['app/contact/page.tsx'] },
  { path: '/testimonials', sources: ['app/testimonials/page.tsx'] },
  { path: '/case-studies/manyrequests', sources: ['app/case-studies/manyrequests/page.tsx', 'content/pages/manyrequests.md', 'lib/portfolio/manyrequests.ts'] },
  // Client sample pages: WordPress pages rendered as portfolio grids by app/[slug].
  { path: '/b2b-content-for-manyrequests', sources: ['app/[slug]/page.tsx', 'lib/portfolio/manyrequests.ts'] },
  { path: '/content-for-highervisibility', sources: ['app/[slug]/page.tsx'] },
  { path: '/content-for-pangea', sources: ['app/[slug]/page.tsx'] },
];

const gitDates = new Map<string, Date | null>();

// The commit date of the last commit that touched any of the paths, or null when
// git has nothing (an untracked file, or a build without a .git directory).
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

export function buildSitemap(input: {
  posts: { slug: string; updatedAt: string; local?: boolean }[];
  caseStudies: { slug: string; date: string }[];
  modifiedAt?: ModifiedAt;
  now?: Date;
}): MetadataRoute.Sitemap {
  const now = input.now ?? new Date();
  const modifiedAt = input.modifiedAt ?? gitLastModified;

  const fixed: MetadataRoute.Sitemap = FIXED_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: modifiedAt(page.sources) ?? now,
  }));

  const studies: MetadataRoute.Sitemap = input.caseStudies.map((cs) => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    lastModified: modifiedAt([`content/case-studies/${cs.slug}.md`]) ?? validDate(cs.date) ?? now,
  }));

  const posts: MetadataRoute.Sitemap = input.posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: (post.local ? modifiedAt([`content/articles/${post.slug}.md`]) : null) ?? validDate(post.updatedAt) ?? now,
  }));

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
