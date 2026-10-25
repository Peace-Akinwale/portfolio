// The homepage's words, in one place so the page stays a layout and the copy
// stays reviewable. Passages marked "brief" are Peace's approved wording from
// the 25 Oct 2026 brief and are used verbatim.

export const HERO = {
  heading: 'Good work starts with good questions.',
  line: 'I build AI products and I write. Most of what I do is deciding what’s worth making and checking that it’s true.',
  who: 'Peace Akinwale, Lagos. I write BOFU content for B2B SaaS companies and agencies, and I build AI-assisted tools for content teams.',
};

export const QUESTIONS = [
  { id: 'q1', label: 'Is this true?' },
  { id: 'q2', label: 'What’s worth making?' },
  { id: 'q3', label: 'What does done mean?' },
] as const;

export const DOCS_WATCH = {
  // brief
  p1: 'AI Docs Watch checks API documentation for product changes across AI platforms such as OpenAI and Anthropic. It keeps the before-and-after versions so readers can see exactly what changed.',
  p2: 'Each change page includes a brief explaining the update and why it matters to someone using the platform. Readers can compare the original page with the updated version and follow the source link to check the details for themselves.',
  caption: 'A change page on the public site, 21 Oct 2026: the summary, the side-by-side button and every archived version of the page underneath.',
  site: 'https://docswatch.stevetoth.ai',
  caseStudy: '/case-studies/ai-docs-watch',
};

export const CONTENTDB = {
  // brief
  p1: 'I built ContentDB to help writers use the expertise already sitting in a company’s content. It brings existing articles, videos and research into a searchable library that connects to an AI tool through MCP. When you need an expert insight for a new article, you can ask your AI tool to find relevant material in that library instead of searching through old studies, ebooks and thought-leadership pieces yourself.',
  caption: 'A search in my own workspace. The quote about three packages reads differently once you see the sentence after it.',
  caseStudy: '/case-studies/contentdb',
};

export const MANYREQUESTS = {
  title: '10 best design annotation tools for agencies.',
  url: 'https://www.manyrequests.com/blog/design-annotation-software',
  body: 'A comparison where the client’s product earns its place by solving the reader’s problem, not because a brief said to mention it. One of 51 articles I’ve written for them since 2024. By April it sat on page one of Google for “design annotation tools”.',
  caption: 'Google, April 2026. Rankings move, so this is a dated screenshot, not a promise.',
  quote: 'He asks the right questions, challenges assumptions when needed, and consistently delivers content that aligns with the content strategy.',
  quoteBy: 'Regine Garcia, Operations, Content & Systems at ManyRequests, 9 Feb 2026',
  caseStudy: '/case-studies/manyrequests',
};

export const AEO = {
  // brief
  heading: 'What AEO checklists leave out',
  p1: 'Many AEO guides recommend the same content changes, such as opening sections with direct answers and adding FAQs. When writers give those instructions to Claude Projects or custom GPTs, the resulting articles can start to sound alike.',
  p2: 'In this article, I explain how I use original research and buyers’ own language to give an article something specific to say, alongside the structure that helps AI tools find and cite it.',
  url: 'https://peaceakinwale.com/how-to-optimize-for-aeo',
  href: '/how-to-optimize-for-aeo',
};

export const FANOUT = {
  // brief
  p1: 'Capturing searches alone wasn’t enough to justify building the tool. The team also needed to inspect the results and turn them into clear takeaways about what was happening in a client’s AI search activity.',
  p2: 'A strategist can run multiple prompts at scale and export the results as JSON for further analysis in Claude. They can also use that material to build a dashboard showing a client’s visibility across those recorded AI answers.',
  caseStudy: '/case-studies/fanout-query-analysis-tool',
};

export const GARDE = {
  // brief. This paragraph belongs to Garde, never to Aloud.
  p1: 'A few friends liked it, but I couldn\'t find a way to go viral and reach more people. I also found that there were many free, faster alternatives. After four months of building and spending out of pocket, I stopped paying for cloud resources and shut it down. I wrote about that decision too.',
  lead: 'Garde turned recipe videos into text so you could cook without rewinding.',
  essay: '/what-i-learned-vibe-coding-my-first-app-shutting-it-down',
};

export const EDITOR = {
  intro: 'A piece on hybrid work schedules, ghostwritten for Jabra. The comment sits on version one of the draft, before any edits.',
  alt: 'Google Docs comment from Melissa Malec, 29 May 2025: "you had me hooked from start to finish! It was a really well researched, well structured, helpful piece of content with appropriate product placements. And that makes my heart happy."',
  caption: 'Melissa Malec, content lead at Jabra through Spicy Margarita. A screenshot of the document, not a quote I tidied up.',
  nathan: 'we never needed more than one round of feedback per article - and none towards the end of our project!',
  nathanBy: 'Nathan Vander Heyden, Head of Marketing at Marker.io, 25 Sep 2025',
  done: 'Done, for a section, means the reader gets the answer first. For a client’s heading “What is regression testing?” I opened with the definition and nothing before it. The editor kept it exactly that way.',
};

export const ALOUD = {
  p1: 'Aloud is my audio reader. Paste a link, a PDF or an EPUB and hear it read. An AI cleanup pass had been quietly rewriting every paragraph before narration. Rewriting someone’s book, I wrote in the decisions file, “is scraping away the integrity of the author’s text.” The pass now runs only on text I paste myself.',
  kv: [
    { k: '8 to 0', v: 'times a repeating page header was read out, on a ten-page test book' },
    { k: '18 to 32.2 min', v: 'how far a 33-minute article now narrates' },
  ],
  p2: 'Nothing I build is called done until a real person has walked it on the live app. The log of every change to Aloud is public, mistakes left in.',
  caseStudy: '/case-studies/aloud',
  log: 'https://github.com/Peace-Akinwale/portfolio/blob/master/case-studies/aloud/index.md',
};

export const READING_APP = {
  // brief
  p1: 'People can listen to a digest or star a useful post to return to later. Those saved posts give the team material to discuss and draw on when creating new content. The app handles the recurring collection and preparation, while people decide what is worth using.',
  article: '/the-success-message-was-the-bug',
  articleTitle: 'The success message was the bug: five lessons from building an AI-assisted reading tool',
};

export const HOW_I_WORK = {
  // brief
  p1: 'I use AI to help me research articles and build tools, and I check whether the result does what I need it to do. For an article, that means reading the sources and checking that they support the claims. For a tool, it means trying the tasks someone will use it for and checking what happens when a step fails, so they know what went wrong and what to do next.',
  p2: 'Every project I run keeps a decisions file that’s read before each session. I came to building from writing, and the two feed each other.',
  log: 'https://github.com/Peace-Akinwale/portfolio/blob/master/case-studies/steve-toth/index.md',
};

export const OFFER = {
  // brief
  writing: 'I write BOFU content for B2B SaaS companies and agencies, and conduct enough product research to explain what someone can actually do with your product.',
  prices: [
    'Refresh an existing article, $400 (2,000 to 2,500 words)',
    'Write a new article, $600 (2,000 to 3,000 words)',
    'Five articles a month, $2,700',
  ],
  building: 'Tell me about the task your team keeps doing manually. I’ll help you work out whether building a tool would make it easier, then build around how the team works.',
};
