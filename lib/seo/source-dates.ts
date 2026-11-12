// Last commit that touched each sitemap source, checked in because a Railway
// build has no .git and would otherwise stamp every static URL with the deploy
// time. Regenerate with: git log -1 --format=%cI -- <path>

export const SOURCE_DATES: Record<string, string> = {
  'app/page.tsx': '2026-11-09T15:48:37+01:00',
  'lib/content/home-copy.ts': '2026-11-08T20:57:03+01:00',
  'app/writing/page.tsx': '2026-11-08T21:20:55+01:00',
  'lib/content/record.ts': '2026-11-08T20:57:03+01:00',
  'lib/content/record-static.ts': '2026-11-08T20:57:03+01:00',
  'app/case-studies/page.tsx': '2026-11-08T20:57:03+01:00',
  'content/case-studies': '2026-11-08T21:20:55+01:00',
  'app/projects/mylinks/page.tsx': '2026-11-08T18:10:53+01:00',
  'content/pages/mylinks.md': '2026-11-08T18:10:53+01:00',
  'app/blog/page.tsx': '2026-11-08T18:10:53+01:00',
  'app/services/page.tsx': '2026-11-08T18:10:53+01:00',
  'content/pages/services.md': '2026-11-08T20:57:03+01:00',
  'app/about/page.tsx': '2026-11-08T22:02:32+01:00',
  'content/pages/about.md': '2026-11-08T22:02:32+01:00',
  'app/contact/page.tsx': '2026-11-08T18:10:53+01:00',
  'app/testimonials/page.tsx': '2026-11-08T20:57:03+01:00',
  'app/case-studies/manyrequests/page.tsx': '2026-11-08T18:10:53+01:00',
  'content/pages/manyrequests.md': '2026-11-08T20:57:03+01:00',
  'lib/portfolio/manyrequests.ts': '2026-11-08T20:57:03+01:00',
  'app/writing/[client]/page.tsx': '2026-11-08T20:57:03+01:00',
  'app/[slug]/page.tsx': '2026-11-08T21:20:55+01:00',
};

export function committedLastModified(sources: string[]): Date | null {
  let newest: Date | null = null;
  for (const source of sources) {
    const raw = SOURCE_DATES[source];
    if (!raw) continue;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) continue;
    if (!newest || date > newest) newest = date;
  }
  return newest;
}
