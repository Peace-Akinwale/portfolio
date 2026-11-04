import type { PriceRow } from '@/components/PriceList';

// The homepage's words, in one place so the page stays a layout and the copy
// stays reviewable. Passages marked "brief" are Peace's approved wording from
// the 25 Oct 2026 brief, edited by hand on 28 Oct 2026 to the copy rules in
// docs/qa/copy-rules-2026-10-28.md at her request. The originals are in
// docs/superpowers/specs/2026-10-25-site-rebuild-brief.md.
//
// 4 Nov 2026: the page is rebuilt around the four abilities the site has to
// prove (decisions.md, 4 Nov). Everything not marked "brief" is a draft for
// Peace's approval. Facts come from the case studies and docs/case-studies/.

export const HERO = {
  // Peace, 4 Nov 2026: the old hero was "too busy and too AI-ish". One plain
  // heading and one line; no mirrored pair, no proof list.
  heading: 'I write for B2B SaaS companies and build AI workflows for content teams.',
  line: 'I’m Peace Akinwale. My articles are the ones buyers read before they pick a product.',
  cta: 'Book a 30-minute call',
};

// One block per ability. The order is the order a buyer checks: can she write,
// can she build, does she understand the tools, how does she decide.
export const WRITING = {
  heading: 'A comparison article that ranked third on Google.',
  p1: '“10 best design annotation tools for agencies” is one of 51 articles I’ve written for ManyRequests since 2024. The product earns its place in the piece by solving the reader’s problem, not because a brief said to mention it.',
  p2: 'In April 2026 it was the third organic result on Google for “design annotation tools”. Their operations lead wrote that my product-led posts “led to more traffic and demo requests”.',
  // Cropped to the three organic results (design guide: show the evidence at a readable size).
  shot: '/images/home/serp-design-annotation-results.png',
  shotW: 685,
  shotH: 430,
  shotAlt: 'Google results for “design annotation tools” in April 2026, with the ManyRequests article in third place, marked with an arrow',
  links: [
    { href: '/case-studies/manyrequests', label: 'How the ManyRequests work went' },
    { href: '/portfolio', label: 'Writing samples by client' },
  ],
};

export const BUILDING = {
  heading: 'A Chrome extension that records the searches behind AI answers.',
  // Shortened 4 Nov 2026 at Peace's request (the text ran far below the image).
  p1: 'The tool records the searches behind AI answers and shows which pages each answer cited. Strategists run prompts at scale and export the results to analyse in Claude.',
  // Peace, 4 Nov 2026: the original full screen, not the crop (the crop looked soft and oversized on desktop).
  shot: '/case-studies/fanout-query-analysis-tool/fanout-01-one-run.png',
  shotW: 1620,
  shotH: 619,
  shotAlt: 'A captured AI answer in the fanout query analysis tool, with the brands named and the pages cited listed beside it. Client details are masked.',
  links: [{ href: '/case-studies/fanout-query-analysis-tool', label: 'How the fanout query analysis tool came about' }],
};

export const AI_TOOLS = {
  heading: 'A public monitor that shows an AI platform’s docs before and after each change.',
  // Shortened 4 Nov 2026 at Peace's request (the text ran far below the image).
  p1: 'AI Docs Watch tracks documentation changes at AI platforms such as OpenAI and Anthropic. Each change gets a short brief on why it matters, beside the before and after.',
  shot: '/images/home/docswatch-google-before-after.png',
  shotW: 1568,
  shotH: 505,
  shotAlt: 'AI Docs Watch showing a Google documentation page before and after a change, side by side, with the changed passages marked.',
  site: 'https://docswatch.stevetoth.ai',
  links: [
    { href: '/case-studies/ai-docs-watch', label: 'How I built AI Docs Watch' },
  ],
};

export const THINKING = {
  heading: 'Three questions before anything gets made.',
  questions: [
    // Shortened 4 Nov 2026 at Peace's request: the block ran far below its image.
    { q: 'Is this true?', a: 'I check every claim against its source, and run every workflow on the real task first.' },
    { q: 'What’s worth making?', a: 'Only the part that’s missing. Some tasks don’t need software, and I say so.' },
    { q: 'What does done mean?', a: 'When the person it’s for can use it without me, on the live app.' },
  ],
  // brief (edited 28 Oct)
  how: 'AI is one of the tools I direct. The part I own is the check.',
  shot: '/case-studies/okf/okf-02-note-trust.png',
  shotW: 1288,
  shotH: 925,
  shotAlt: 'A note in the agency’s knowledge base marked “Fact checked and confirmed”, with the reviewer, the date and a link to the original note in the founder’s archive.',
  links: [
    { href: '/case-studies/okf', label: 'How the knowledge base keeps writing and checking apart' },
    { href: '/the-success-message-was-the-bug', label: 'Five lessons from building the reading app' },
    { href: '/case-studies', label: 'All the case studies' },
  ],
};

const PRICE_ROWS: PriceRow[] = [
  { name: 'Refresh an existing article', price: '$400', unit: '2,000 to 2,500 words' },
  { name: 'Write a new article', price: '$600', unit: '2,000 to 3,000 words' },
  { name: 'Five articles a month', price: '$2,700', note: '10% off the per-article price' },
];

export const OFFER = {
  // brief
  writing: 'I write bottom-of-funnel content for B2B SaaS companies and agencies, and conduct enough product research to explain what someone can do with your product.',
  // One source for every price on the site (home, services, structured data).
  // Rows render as a small table; `prices` below derives the one-line form.
  priceRows: PRICE_ROWS,
  prices: PRICE_ROWS.map((r) => (r.unit ? `${r.name}, ${r.price} (${r.unit})` : `${r.name}, ${r.price}`)),
  // brief
  building: 'Tell me about the work your team repeats every week. I’ll tell you whether an AI workflow would take it off their plate, and build one depending on what your team needs.',
  // The workflow offer in the same shape as the writing prices (guide §7: comparable facts in comparable positions).
  workflowRow: { name: 'A workflow based on what you need', price: 'Custom', unit: 'Priced once we’ve talked about the task', note: 'Up to six weeks to build and settle' } as PriceRow,
};

// Approved passages from the 25 Oct brief that the writing record (/portfolio,
// lib/content/record.ts) still renders. They left the homepage on 4 Nov 2026
// and move with the record when that page is rebuilt.
export const CONTENTDB = {
  // brief
  p1: 'I built ContentDB to help writers use the expertise already sitting in a company’s content. It brings existing articles and videos into a searchable library that connects to an AI tool through MCP.',
  p2: 'When you need an expert insight for a new article, you ask your AI tool to find it in that library. You don’t have to dig through old studies and ebooks yourself.',
  caseStudy: '/case-studies/contentdb',
};

export const READING_APP = {
  // brief
  p1: 'People can listen to a digest or star a useful post to return to later. Those saved posts give the team material to discuss and draw on when creating new content. The app handles the recurring collection and preparation, while people decide what is worth using.',
  caseStudy: '/case-studies/reading-app',
  article: '/the-success-message-was-the-bug',
};

export const GARDE = {
  // brief. This paragraph belongs to Garde, never to Aloud.
  p1: 'A few friends liked it, but I couldn\'t find a way to go viral and reach more people. I also found that there were many free, faster alternatives. After four months of building and spending out of pocket, I stopped paying for cloud resources and shut it down. I wrote about that decision.',
  lead: 'Garde turned recipe videos into text so you could cook without rewinding.',
  essay: '/what-i-learned-vibe-coding-my-first-app-shutting-it-down',
};
