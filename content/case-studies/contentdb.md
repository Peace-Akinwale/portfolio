---
title: "ContentDB: collect research and question your sources"
name: "ContentDB"
blurb: "Your articles and transcripts in one library you can search in the app or from your AI assistant."
kind: built
status: "Open to anyone who signs up"
date: 2026-03-03
published: 2026-10-25
summary: "ContentDB is my research library. It keeps a company's articles, podcasts, transcripts and PDFs in one place, and an AI assistant can search it through MCP, so a writer gets the exact passage a leader wrote or said instead of something found online. I built it for my own articles and later rebuilt it as a quote checker for writers. Anyone can sign up, with $2 of AI usage to start."
voice: informal
notion_url: https://app.notion.com/p/403992da7a5781cfaff1de30c9c49f2f
notion_last_edited: 2026-10-31T09:35:09.780Z
links:
  - "Try ContentDB | https://contentdb.peaceakinwale.com"
tags:
  - "research"
  - "MCP"
related:
  - "aloud"
  - "okf"
---

### The quotes a writer needs sit in places nobody searches

Every article I write leans on what the company already knows, like an executive's podcast answer or a gated ebook. Those pieces sit in different places, so in practice nobody uses them. I'd dig through old documents and move quotes by hand.

Before the first commit I wrote down what I wanted the product to do. A writer asks their AI tool whether any executive has said something relevant on a topic, and gets back what they actually wrote or said. "Fast, precise, exactly what is in their previous database, not just a random insight found online. This is the premise I am gunning for."

### One job, done from inside the writer's own AI tool

**MCP from the first commit.** The point was to search the library from Claude while writing, so the MCP server shipped on day one. Two days later I saw what setup asked of a user. They had to clone a repo and edit a config file in a terminal. "I don't think the best use case with MCP is for users to have to head to their terminal to fix it." The hosted endpoint and a connector page in Settings replaced all of that.

**Narrow it to a quote checker.** The first build ran 126 commits and then sat for six months. When I came back, I wrote down two options. A research workspace for agencies needs billing and roles that one maintainer can't sustain. A quote checker for writers, MCP-first, does one job well. I picked the second and cut the rest, from the AI summary on every search to billing. Generation happens in the writer's own Claude or ChatGPT, so ContentDB only pays for finding and checking.

**Show the text around the quote.** The thing that makes a quote safe to use is the sentence before and after it. The old build stored that context and never showed it. Search now returns a passage of 300 to 800 characters with the passages either side. PDFs and Word files are stored verbatim, and anything a model had to retype is badged "Not verbatim".

![image](images/contentdb/image.png)

**Let people in, with a ceiling.** When I set up access, I didn't have anyone's email in advance. "The emails are available when they sign up. That's why I said people should be automatically added to an allowlist." Anyone can now sign up and gets $2 of AI usage, once, per account. The gate lives in the app, not in the shared database, because a database trigger on the shared sign-in had already broken another app's sign-ups that week.

**Railway, because MCP can't wait.** The free host slept, and the API took 32 to 43 seconds to wake. That's too slow for a tool Claude calls in the middle of an answer. I moved it to Railway and retired the old hosts.

### A library that returns the passage and the text around it

Article URLs, YouTube, podcast feeds, sitemaps, pasted text, call transcripts, PDFs, Word files and images go in. Sources are grouped by client. Search returns the passage and its neighbours. Ten MCP tools give Claude or ChatGPT the same search, and a pain-points view pulls customer problems out of transcripts. Sign in by email or Google.

![Historical demonstration of quotation context in an earlier ContentDB interface. The matching passage appears between the text before and after it; this is not a capture of the current UI.](images/contentdb/contentdb-quote-context-existing-demo.png)

*Historical demonstration of quotation context in an earlier ContentDB interface. The matching passage appears between the text before and after it; this is not a capture of the current UI.*

### 5,194 passages for a cent, and two outages no screen showed

The rebuild added 50 commits on top of the first 126. Backfilling passages for my 76 sources produced 5,194 passages for about a cent, and the whole library has cost $0.04 in AI usage to date. The test suite went from 44 to 238.

Some failures came to me from outside. Early on, a user's Claude Desktop couldn't see the server and they asked for a refund. I shipped two transport fixes that day. On my return I found the database had been paused for inactivity during the six-month gap and the old host had been blocking every deploy. Neither showed up on screen. A bug hunt found them.

One came from me. Before the release I asked, "Should I trust you and push live? Have you done a bug hunt first? Have you tested the app itself in browsers?" It hadn't. Seven more fixes and a full walk through the app came before I merged it.

ContentDB runs at contentdb.peaceakinwale.com. The user I can prove is me. Sign-up is open.
