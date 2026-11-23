// Public project write-ups share /case-studies. Nested MyLinks app routes
// deliberately do not match this list.
export const WORDPRESS_CASE_STUDY_SLUGS = [
  'linkedin-router',
  'mystyleguide',
  'portfolio-project',
  'editorial-style-guide',
] as const;

export const PROJECT_CASE_STUDY_SLUGS: readonly string[] = [
  ...WORDPRESS_CASE_STUDY_SLUGS, 'contentdb', 'mylinks',
];

export function isWordPressCaseStudy(slug: string): boolean {
  return WORDPRESS_CASE_STUDY_SLUGS.some((value) => value === slug);
}

export function caseStudyHref(href: string): string {
  const match = href.match(/^(?:https?:\/\/(?:www\.)?peaceakinwale\.com)?\/(?:projects\/)?([^/?#]+)\/?([?#].*)?$/i);
  if (!match || !PROJECT_CASE_STUDY_SLUGS.includes(match[1].toLowerCase())) return href;
  return `/case-studies/${match[1].toLowerCase()}${match[2] ?? ''}`;
}
