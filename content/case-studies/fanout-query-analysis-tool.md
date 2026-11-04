---
title: "Fanout query analysis tool, the searches behind AI answers"
name: "Fanout query analysis tool"
blurb: "Records the searches behind AI answers, and tells the pages that came back apart from the ones that got cited."
kind: built
status: "An SEO agency’s founder and strategists"
date: 2026-08-26
built: "Aug to Sep 2026"
published: 2026-10-25
summary: "The fanout query analysis tool records what happens behind an AI answer. It shows the searches ChatGPT, Claude or Perplexity ran, the pages that came back, and the pages that got cited. I built it for an SEO agency's strategists, starting from a teammate's bookmarklet. It became a Chrome extension with a shared dashboard, plus a service that runs whole prompt sets through the API and labels them as simulated."
voice: informal
notion_url: https://app.notion.com/p/403992da7a578155bc78c7d8e436e561
notion_last_edited: 2026-10-30T23:40:10.376Z
tags:
  - "AI search"
  - "Chrome extension"
related:
  - "what-ai-search-apps-do-before-they-answer"
  - "ai-docs-watch"
---

### The searches behind an AI answer explain why a client showed up, or didn't

When someone asks ChatGPT which vendor to choose, it may search the web first. If you can see those searches and the pages that came back, you can work out why a client showed up in the answer, or why it didn't.

A teammate had proved it could be recorded. His bookmarklet captured ChatGPT's searches and pages, but every prompt meant switching it on by hand and uploading files to Claude. The agency asked me to lead a Chrome extension built from it. I set two requirements on the first day. It needed a dashboard, not a panel per run, and it had to record while you use the AI tool, with no button to press.

### The parser I inherited missed four of ten citations

On day one I ran the bookmarklet's analysis on one capture and read the result against the raw stream. It reported 6 citations. The answer carried 10. It dropped every page ChatGPT reads in full rather than skims. The extension's parser reads both kinds, and I passed the finding back to the teammate.

### It records while strategists work, and says what it couldn't record

**Record in the browser people already use.** A strategist picks a client and uses ChatGPT, Claude or Perplexity as usual. Each finished answer becomes a run with its searches, pages and citations. There's a private switch for each site, the raw stream stays in the browser, and only the extracted record goes to the shared database.

![A captured answer, with its recorded citations and brand mentions.](images/fanout-query-analysis-tool/fanout-01-one-run.png)

*A captured answer, with its recorded citations and brand mentions.*

**Run whole prompt sets, and say they're simulated.** Strategists needed to track many prompts at once, not one at a time, so I reversed my own earlier rule against paid API calls. Before building it, I tested five real prompts across four model settings. Cheap was the aim, but not at the cost of useless data on a real client. The default became the cheapest setting that still matched the captured runs, and every API run is labelled Simulated so nobody mistakes it for a recording from the consumer app.

**Say what wasn't recorded.** Then runs started showing zero searches but eight pages. ChatGPT had stopped streaming the search wording. Zero searches would have been a false claim, because the pages prove a search happened. The label became "searches not recorded".

**A chart that doesn't flatter the client.** Citations show as a running total, with the number of answers asked written beside it. One line, and it still tells the truth. Take a made-up example. If a client is cited in 30 answers out of 130, the chart shows the other 100 beside the 30.

![The Brands view keeps brand mentions separate from website citations.](images/fanout-query-analysis-tool/fanout-03-brands.png)

*The Brands view keeps brand mentions separate from website citations.*

**Strategists own the judgement calls.** Competitor lists come from the strategist, because I could get them wrong. Sources are split into publishers and competitors and aggregated, so clients don't see the noise the team sees.

### A Chrome extension with a shared dashboard, plus a runner for whole prompt sets

A Chrome extension for ChatGPT, Claude and Perplexity with a side panel for the summary, the searches and the sources. A dashboard with a client roster, an overview per client, prompts, sources cited, brands, a review queue and reports. A runner service that sends prompt sets through the API within a monthly cap and emails the strategist when a batch finishes. A one-click send to Claude with the analysis instructions and the recorded material attached, and a client view a strategist can share.

![The review queue identifies captured and simulated runs. Incomplete captures have a separate count.](images/fanout-query-analysis-tool/fanout-05-review.png)

*The review queue identifies captured and simulated runs. Incomplete captures have a separate count.*

### Green tests kept missing what the live app showed

The first live capture found 46 pages and 14 citations, and three defects that 283 passing tests had missed. That kept happening, so I stopped trusting green tests on their own. 117 runner tests passed against database rows that never occur in production. A speed fix kept 2,209 tests green and broke the page in the browser, so I reverted it. Bug hunts before the team got access found that any signed-in account could empty twelve tables, and that the extension dropped answers on Claude and Perplexity. Both were fixed.

Simulated runs cost about $0.04 a prompt, and a client's 100-prompt set about $4 to $6. In a 38-prompt trial the simulated runs agreed with the captured ones on brand mentions 36 times.

It took 309 commits over 24 days. It ended with 28 clients and 141 live captures in the database, and the wider team was given access.
