export type CaseStudy = {
  slug: string;
  client: string;
  domain: string;
  category: string;
  format: string;
  headline: string;
  summary: string;
  result: string;
  year: string;
  stats: { value: string; label: string }[];
  published: boolean;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'manyrequests',
    client: 'ManyRequests',
    domain: 'manyrequests.com',
    category: 'Client portal software for agencies',
    format: '44 product-led articles on a 20-month retainer',
    headline: '44 product-led articles, including page-one rankings against Workfront and the design crowd',
    summary:
      'ManyRequests hired me to write articles where the product shows up inside the piece: in the comparisons, in the how-to steps, in the screenshots, in real customer stories.',
    result: 'Page one for "Workfront alternatives" and "design annotation tools"',
    year: '2024 to 2026',
    stats: [
      { value: '44', label: 'Articles published, 88% bottom of funnel' },
      { value: '#6', label: 'Google for "Workfront alternatives"' },
      { value: '20 mo', label: 'Active retainer' },
    ],
    published: true,
  },
  {
    slug: 'notebook-agency',
    client: 'Notebook Agency',
    domain: 'notebook.agency',
    category: 'B2B SaaS SEO agency, Toronto',
    format: 'Content operations: LinkedIn engine, blog pipeline, editorial feedback loop',
    headline: 'Building the content operation behind a founder-led SEO agency',
    summary:
      'A LinkedIn content engine grounded in the founder’s own notebooks, a blog production pipeline, and the editorial feedback loop that keeps both sounding like him.',
    result: 'In review',
    year: '2026',
    stats: [],
    published: false,
  },
];

export const PUBLISHED_CASE_STUDIES = CASE_STUDIES.filter((c) => c.published);
