// The homepage's words, in one place so the page stays a layout and the copy
// stays reviewable. Passages marked "brief" are Peace's approved wording from
// the 25 Oct 2026 brief, edited by hand on 28 Oct 2026 to the copy rules in
// docs/qa/copy-rules-2026-10-28.md at her request. The originals are in
// docs/superpowers/specs/2026-10-25-site-rebuild-brief.md.

// Draft, 3 Nov 2026, for Peace's approval. The heading is hers (she liked it on
// 23 Oct). The two lines under it now say what she does and for whom before
// anything else, because three buyer readers could not tell from the first screen.
export const HERO = {
  heading: 'Good work starts with good questions.',
  line: 'I write the articles B2B SaaS buyers read before they choose a product, and I build the AI tools content and SEO teams use every week.',
  who: 'Peace Akinwale. 51 articles for ManyRequests since 2024. AI Docs Watch, public, checked every day. A search recorder and a page audit tool an SEO agency’s strategists use.',
};

// One plain line above each question, so a reader knows what the section is
// before reading the answer (3 Nov 2026 review).
export const SECTION_NAMES = {
  q1: 'How I check what I write and build',
  q2: 'How I choose what to make',
  q3: 'What finished looks like',
};

export const QUESTIONS = [
  { id: 'q1', label: 'Is this true?' },
  { id: 'q2', label: 'What’s worth making?' },
  { id: 'q3', label: 'What does done mean?' },
] as const;

// Draft one-line answers under each question, for Peace to approve (26 Oct 2026).
export const ANSWERS = {
  Q1: 'I learn all I can about your product, and I use it too, so your editor doesn’t have to correct me. When I build a tool, I check every screen and action so it works as it should.',
  Q2: 'Before I write or build anything, I look at what’s already out there and make the bit that’s missing.',
  Q3: 'It’s done when the person it’s for can use it without me. The editor has nothing left to fix, and the app finishes the job and tells you what happened.',
};

export const DOCS_WATCH = {
  // brief
  p1: 'AI Docs Watch checks API documentation for product changes across AI platforms such as OpenAI and Anthropic. It keeps the before-and-after versions so readers can see the exact wording that changed.',
  p2: 'Each change page includes a brief explaining the update and why it matters to someone using the platform. Readers can compare the original page with the updated version and follow the source link to check the details for themselves.',
  caption: 'A change page on the public site, 21 Oct 2026, with the side-by-side button and every archived version of the page underneath.',
  site: 'https://docswatch.stevetoth.ai',
  caseStudy: '/case-studies/ai-docs-watch',
};

export const CONTENTDB = {
  // brief
  p1: 'I built ContentDB to help writers use the expertise already sitting in a company’s content. It brings existing articles and videos into a searchable library that connects to an AI tool through MCP.',
  p2: 'When you need an expert insight for a new article, you ask your AI tool to find it in that library. You don’t have to dig through old studies and ebooks yourself.',
  caption: 'A search in my own workspace. The quote about three packages means something else once you see the sentence after it.',
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
  kv: [
    { k: '3', v: 'AI tools it records in: ChatGPT, Claude and Perplexity' },
    { k: '6 of 10', v: 'citations the first parser found on one capture. I checked the raw stream and fixed it before the client saw the number' },
  ],
  caseStudy: '/case-studies/fanout-query-analysis-tool',
};

export const GARDE = {
  // brief. This paragraph belongs to Garde, never to Aloud.
  p1: 'A few friends liked it, but I couldn\'t find a way to go viral and reach more people. I also found that there were many free, faster alternatives. After four months of building and spending out of pocket, I stopped paying for cloud resources and shut it down. I wrote about that decision.',
  lead: 'Garde turned recipe videos into text so you could cook without rewinding.',
  essay: '/what-i-learned-vibe-coding-my-first-app-shutting-it-down',
};

export const EDITOR = {
  intro: 'A piece on hybrid work schedules, ghostwritten for Jabra. The comment sits on version one of the draft, before any edits.',
  alt: 'Google Docs comment from Melissa Malec, 29 May 2025: "you had me hooked from start to finish! It was a really well researched, well structured, helpful piece of content with appropriate product placements. And that makes my heart happy."',
  caption: 'Melissa Malec, content lead at Jabra through Spicy Margarita. A screenshot of the document, not a quote I tidied up.',
  nathan: 'we never needed more than one round of feedback per article - and none towards the end of our project!',
  nathanBy: 'Nathan Vander Heyden, Head of Marketing at Marker.io, 25 Sep 2025',
  done: 'Done, for a section, means the reader gets the answer first. For a client’s heading “What is regression testing?” I opened with the definition and nothing before it. The editor kept it that way.',
};

export const ALOUD = {
  p1: 'Aloud is my audio reader. Paste a link or upload a PDF or EPUB, and hear it read. At first I let an AI cleanup pass rewrite every paragraph before narration. Rewriting someone’s book, I wrote in the decisions file, “is scraping away the integrity of the author’s text.” So I limited the pass to text I paste myself.',
  kv: [
    { k: '8 to 0', v: 'times a repeating page header was read out, on a ten-page test book' },
    { k: '18 to 32.2 min', v: 'how far a 33-minute article now narrates' },
  ],
  p2: 'I don’t call a build done until a real person has walked it on the live app.',
  shot: '/images/home/aloud-player.png',
  shotAlt: 'The Aloud player on a phone: a Listen and Read switch, the cover, the waveform, speed and skip controls, and a Highlight this passage button.',
  shotCaption: 'The player, in Listen mode. Read mode shows the words as they are spoken.',
  caseStudy: '/case-studies/aloud',
};

export const READING_APP = {
  // brief
  p1: 'People can listen to a digest or star a useful post to return to later. Those saved posts give the team material to discuss and draw on when creating new content. The app handles the recurring collection and preparation, while people decide what is worth using.',
  p2: 'I don’t call a build done until a real person has walked it on the live app. This app’s first notification said a post was in the feed and in the week’s roundup. The roundup didn’t have it. That became the first lesson in the article.',
  shot: '/case-studies/reading-app/reader-01-feed.png',
  shotAlt: 'The reading app’s feed with unread and starred posts and the reader’s own refresh control. Identifying information is blurred.',
  shotCaption: 'The feed, with unread and starred views. The reader chooses when to refresh, so new posts never move what they are reading.',
  caseStudy: '/case-studies/reading-app',
  article: '/the-success-message-was-the-bug',
  articleTitle: 'The success message was a bug: five lessons from building an app an agency uses to follow SEO and AEO trends',
};

export const HOW_I_WORK = {
  // brief
  p1: 'I research every article and design every tool myself. AI is one of the tools I direct, and the part I own is the check. For an article, I read the sources and make sure they back the claims. For a tool, I run the tasks someone will use it for, and make sure a failed step tells them what to do next.',
  p2: 'I keep a decisions file for every project, and every session starts by reading it. The writing and the building feed each other.',
};

export const OFFER = {
  // brief
  writing: 'I write BOFU content for B2B SaaS companies and agencies, and conduct enough product research to explain what someone can do with your product.',
  prices: [
    'Refresh an existing article, $400 (2,000 to 2,500 words)',
    'Write a new article, $600 (2,000 to 3,000 words)',
    'Five articles a month, $2,700',
  ],
  building: 'Tell me about the work your team repeats every week. I’ll tell you whether a tool would take it off their plate, then build it around how the team works.',
};
