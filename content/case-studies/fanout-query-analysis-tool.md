---
title: "Fanout query analysis tool"
kind: built
status: "in team use, private"
date: 2026-10-01
for: "Notebook Agency"
summary: "I built a fanout query analysis tool for an agency’s content strategists, extending a teammate’s bookmarklet into a Chrome extension and shared dashboard. It records the searches behind AI answers and distinguishes returned pages from citations. Strategists can review client visibility and send the recorded material to Claude for analysis."
notion_url: https://app.notion.com/p/403992da7a578155bc78c7d8e436e561
notion_last_edited: 2026-10-24T22:21:21.230Z
tags:
  - "AI search"
  - "Chrome extension"
related:
  - "what-ai-search-apps-do-before-they-answer"
  - "ai-docs-watch"
---

### AI answers are built from searches the reader never sees

When someone asks ChatGPT which vendor to choose, it may search the web before answering. Seeing those searches and the pages returned helps a content strategist investigate why a client appeared in the answer or was left out.

### A teammate's bookmarklet proved the searches could be recorded

A teammate built a bookmarklet that captured ChatGPT's searches and associated pages. Each prompt required manual activation, followed by file downloads and an upload to Claude. The agency asked me to develop it into a Chrome extension. I added a shared, client-organized workflow so strategists could return to their research without piecing together downloaded files.

### The extension records each answer while you use the AI tool normally

A strategist selects a client, then uses ChatGPT, Claude or Perplexity normally. Each completed answer becomes a run containing the available search records and response. This keeps the investigation organized as the strategist works through the client's questions.


A private switch per site stops recording when you need it. The raw recording stays in your browser. Only the extracted records go to the team's shared database, with account and session identifiers removed first.



### Count returned pages and citations separately

The dashboard distinguishes pages returned during search from pages opened or cited. A strategist can see whether a client's page appeared in the results but received no citation, then inspect the other sources used. This gives them a specific visibility gap to investigate.


### Track brand mentions alongside website citations

A company can be recommended without a link, while its page can supply information without the company being named. The Brands page separates mentions from website citations and records searches for the brand. A strategist can therefore describe the client's visibility accurately instead of treating every appearance as the same outcome.


### When the record is incomplete, the dashboard says what's missing

In the September recordings, some follow-up search wording was unavailable even though returned pages were present. Those rounds show “searches not recorded.” That keeps a strategist from treating missing information as proof that no search occurred.


The Review page lists questions where the client was absent from at least one complete run. Strategists can inspect the supporting recordings and mark questions reviewed, giving the team a shared queue for investigating gaps.


### Testing a whole question set at once, labeled as simulated

I added a background service that submits a client's question set through OpenAI's API with web search enabled. The team can examine more answers without entering every prompt by hand. These runs are labeled simulated so they remain distinguishable from recordings made in the consumer apps.

### Results go to Claude in one click

Send to Claude opens a run, or a filtered set of runs, with the team's analysis instructions and recorded material included. The strategist can examine the responses without manually transferring files. Reports can also be exported for further analysis. The goal is so the strategist can analyze each response they get and so they can create a dashboard for the client if they want to. 

I directed the build with AI coding agents between August and October 2026, setting the requirements and checking captures against the raw recordings. A teammate’s bookmarklet supplied the starting point. Each run describes one answer at a particular moment; future answers can differ.
