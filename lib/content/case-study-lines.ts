// The two lines each case study gets on the index: the problem it answers and
// the decision that shaped it. Drafted 4 Nov 2026 from the build records in the
// private transcript index; "since" is the month real use began, from the
// case study's own date. Peace approves or rewrites every line.
export const CASE_STUDY_LINES: Record<string, { problem: string; decision: string; use: string }> = {
  'fanout-query-analysis-tool': {
    problem: 'Strategists could not see which searches an AI answer ran, or which pages it cited, without switching a bookmarklet on by hand for every prompt.',
    decision: 'Record in the browser the strategist already uses, keep only the extracted records on the shared database, and label simulated runs apart from real ones.',
    use: 'Built for an SEO agency’s strategists, August to September 2026',
  },
  'ai-docs-watch': {
    problem: 'AI platforms change their documentation without notice, and a summary of the change is not the change.',
    decision: 'Keep every captured version and show the before and after on the publisher’s own page, with the capture date and the effective date kept apart.',
    use: 'Built for the agency in July 2026, public since October',
  },
  'reading-app': {
    problem: 'Following SEO and AEO news meant living in a social feed and losing the posts worth keeping.',
    decision: 'One feed the reader refreshes on their own terms, starred posts that become newsletter notes, and nothing called done until a real person had walked it on the live app.',
    use: 'An SEO agency’s founder and team, since June 2026',
  },
  'quality-rater': {
    problem: 'Google’s quality guidelines are long, and a strategist reviewing a page had nowhere to start.',
    decision: 'Provisional ratings only, every finding tied to a numbered passage, and no claim of accuracy until it is measured against people.',
    use: 'An SEO agency’s strategists, first version, since October 2026',
  },
  okf: {
    problem: 'A founder’s knowledge sat in 1.23 million words across 534 Notion pages, and the team couldn’t tell which AI answers about it to trust.',
    decision: '683 linked notes in Google’s Open Knowledge Format, with every answer citing its source. A scripted source check and a person’s review carry different labels.',
    use: 'An SEO agency’s team, since July 2026',
  },
  'what-ai-search-apps-do-before-they-answer': {
    problem: 'Nobody outside the vendors could say what an AI search app sends and receives while it answers.',
    decision: 'Explain each recorded field from real recordings, and label what we saw apart from what we think it means.',
    use: 'Public reference, since October 2026',
  },
  aloud: {
    problem: 'Articles I meant to read stayed unread.',
    decision: 'Narrate the author’s wording as written. The cleanup pass only touches text I paste myself, because rewriting someone’s book is scraping away its integrity.',
    use: 'My own app, open to anyone who signs up',
  },
  contentdb: {
    problem: 'Every article meant digging old research out of documents and moving quotes by hand.',
    decision: 'One library grouped by client, with an MCP connection so an AI assistant can search it.',
    use: 'My own app, open to anyone who signs up, since March 2026',
  },
  reach: {
    problem: 'AI coding sessions stalled on steps that only work on my Mac’s screen.',
    decision: 'Hand the step to a session on the right Mac and send the result back. Passwords stay with me.',
    use: 'Personal tool',
  },
};
