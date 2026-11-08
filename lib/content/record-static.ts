import type { RecordEntry } from './record';

// Entries that are not a case study or a local article: writing samples with
// their evidence, what clients said, and dated decisions. Every fact is from
// prototypes/2026-10-21-three-directions/content.md (sourced there) or the
// live site. Images are the sanitized ones under public/images/home.

export const STATIC_ENTRIES: RecordEntry[] = [
  {
    id: 'research-first',
    kind: 'decided',
    date: '2026-08-26',
    dateLabel: '26 Aug 2026',
    month: '2026-08',
    title: 'Research before code.',
    body: [
      'I was asked to lead a browser extension that records how AI assistants search the web and which pages they cite. I spent the first day researching what already existed.',
      'Both competing extensions were free, and one was written by the author of the research the whole method rests on. Building first would have reproduced an existing tool with fewer features. The one thing neither did was analysis as the output, so I made that the brief.',
      'The same day, a capture reported six citations where ten existed, because a parser dropped a whole class of them. I checked it against the raw stream and corrected it before the client saw the number.',
    ],
    links: [{ label: 'How the fanout query analysis tool came about', href: '/case-studies/fanout-query-analysis-tool' }],
  },
  {
    id: 'sign-up',
    kind: 'decided',
    date: '2026-07-31',
    dateLabel: '31 Jul 2026',
    month: '2026-07',
    title: 'Refuse the sign-up form.',
    body: [
      'The members’ site for an eight-week course lets people in from a list of email addresses. A form that accepts a password from whoever is at the keyboard proves nothing about who is typing. So I left out password sign-up. You get an emailed link, then you set a password.',
    ],
    links: [{ label: 'The course portal, in an article', href: '/blog/build-a-course-portal-around-the-instructors-workflow' }],
  },
  {
    id: 'aeo',
    kind: 'wrote',
    date: '2026-04-14',
    dateLabel: '14 Apr 2026',
    month: '2026-04',
    title: 'What AEO checklists leave out.',
    href: '/blog/how-to-optimize-for-aeo',
    context: 'on my blog',
    quote: {
      text: 'The challenge with this is that everyone’s running the same checklist on a Claude Project or custom GPT. And the content coming out of it is starting to look identical.',
      by: 'From the article',
    },
    body: [
      'Many AEO guides recommend the same content changes, such as opening sections with direct answers and adding FAQs. The piece is about what you add after the checklist, which is original research and the buyer’s own words for their problem.',
    ],
    more: {
      summary: 'One decision from inside the article',
      body: [
        'For a client’s section titled “What is regression testing?” I opened with the definition. “Regression testing ensures that previously developed features or actions perform as expected after developers made changes to the code.” No preamble about why QA teams do it. The editor kept it that way, because it’s what you expect to see under that heading.',
      ],
    },
    links: [{ label: 'Read the article', href: '/blog/how-to-optimize-for-aeo' }],
  },
  {
    id: 'regine',
    kind: 'said',
    date: '2026-02-09',
    dateLabel: '9 Feb 2026',
    month: '2026-02',
    title: 'Regine Garcia, ManyRequests',
    quote: {
      text: 'He asks the right questions, challenges assumptions when needed, and consistently delivers content that aligns with the content strategy.',
      by: 'Regine Garcia, Operations, Content & Systems at ManyRequests, on LinkedIn',
    },
    body: ['I’ve written 51 articles for ManyRequests since 2024.'],
    links: [{ label: 'How that work went, in a case study', href: '/case-studies/manyrequests' }],
  },
  {
    id: 'annotation',
    kind: 'wrote',
    date: '2026-01-05',
    dateLabel: '5 Jan 2026',
    month: '2026-01',
    title: '10 best design annotation tools for agencies.',
    href: 'https://www.manyrequests.com/blog/design-annotation-software',
    context: 'for ManyRequests',
    body: [
      'A comparison piece where the client’s product earns its place by solving the reader’s problem, not because a brief said to mention it. In April 2026 it was the third organic result on Google for “design annotation tools”.',
    ],
    figure: {
      src: '/images/home/serp-design-annotation.png',
      width: 1299,
      height: 872,
      alt: 'Google results for \'design annotation tools\' in April 2026, with the ManyRequests article in third place',
      caption: 'Google, April 2026. Rankings move, so this is a dated screenshot, not a promise.',
    },
    links: [{ label: 'Read the article on ManyRequests', href: 'https://www.manyrequests.com/blog/design-annotation-software' }],
  },
  {
    id: 'nathan',
    kind: 'said',
    date: '2025-09-25',
    dateLabel: '25 Sep 2025',
    month: '2025-09',
    title: 'Nathan Vander Heyden, Marker.io',
    quote: {
      text: 'we never needed more than one round of feedback per article - and none towards the end of our project!',
      by: 'Nathan Vander Heyden, Head of Marketing at Marker.io, on LinkedIn',
    },
    body: [],
    links: [{ label: 'The Marker.io samples', href: '/writing' }],
  },
  {
    id: 'editor',
    kind: 'wrote',
    date: '2025-05-29',
    dateLabel: '29 May 2025',
    month: '2025-05',
    title: 'What an editor wrote on the first draft.',
    context: 'ghostwritten, for Jabra',
    body: [
      'Melissa Malec, content lead at Jabra through Spicy Margarita, left this on a piece about hybrid work schedules. It’s a screenshot of the doc, not a quote I tidied up.',
    ],
    figure: {
      src: '/images/home/editor-comment-jabra.png',
      width: 335,
      height: 469,
      alt: 'Google Docs comment from Melissa Malec, 29 May 2025: "you had me hooked from start to finish! It was a really well researched, well structured, helpful piece of content with appropriate product placements. And that makes my heart happy."',
      caption: 'The comment, as left in the document.',
      narrow: true,
    },
    links: [{ label: 'Every testimonial', href: '/testimonials' }],
  },
];
