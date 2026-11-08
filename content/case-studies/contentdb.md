---
title: "contentDB"
name: "ContentDB"
blurb: "A research library I can search from my AI writing tools, so I can find a useful passage and check its context while drafting."
kind: built
status: "Open to anyone who signs up"
date: 2026-03-03
published: 2026-10-25
summary: "How I built a research library that retrieves useful passages and source context inside an AI writing session."
voice: informal
notion_url: https://app.notion.com/p/403992da7a5781cfaff1de30c9c49f2f
notion_last_edited: 2026-10-31T09:35:09.780Z
tags:
  - "research"
  - "MCP"
related:
  - "aloud"
  - "okf"
---

contentDB stores customer conversations, research, and content in one place so you can query it through MCP in Claude or ChatGPT while you research, write, or update an article.

[Open the live app](https://contentdb.peaceakinwale.com)

## How it works

contentDB is a workspace database where you can add your company's high-value content from URLs or pasted text, including podcasts, transcripts, SME-led articles, ebooks, reports, surveys, LinkedIn posts, Reddit threads, and sales call transcripts. You can then search that material in the contentDB web app or query it from connected AI clients through MCP while writing or doing research.

For LinkedIn posts and Reddit threads, paste the text instead of adding the URL.

### Bring sources into one searchable system

Add links or pasted text, tag the right client, and make that source available for retrieval across the workspace.

![Adding Harvard Business Review’s B2B Elements of Value article with research tags and ManyRequests selected.](/images/approved/contentdb/01-add-source-hbr.jpg)

### Search with quote context

Find exact moments, surrounding context, and client-tagged material instead of isolated snippets.

![A keyword search for retainer returns 15 matching sources; the first six results are shown.](/images/approved/contentdb/02-keyword-search-retainer.jpg)

### Turn that stored research into structured, source-grounded answers you can write from

> I’m writing an article about how agency owners can get retainer clients. Use the contentDB connector to find public sources in my library about the problems founders faced before moving to retainers. Give me two useful examples, the exact supporting quotes with context, and links to the original sources. Use only public articles, interviews or podcasts, not private client material. If the library doesn’t support a claim, say so.

![An actual Claude request uses the ContentDB connector to retrieve public agency research.](/images/approved/contentdb/03-claude-request.jpg)

Claude gives a response from your database first, which helps keep the answer grounded. You can check the source and surrounding context before using it.

![Claude returns a passage about unpaid client requests and explains the surrounding interview context.](/images/approved/contentdb/04-claude-quote-context.jpg)

[Try contentDB](https://contentdb.peaceakinwale.com)

## Problem it solves

When writing for clients or your company, useful context is usually scattered across many links, docs, calls, and transcripts. You'd have to spend time on Google searches, interview SMEs, or comb through existing podcasts and reports to find relevant material.

If you rely on Google search or generic AI output, the writing often becomes weak or repetitive. contentDB keeps all your context in one place so you can pull relevant quotes, supporting detail, and customer wording quickly via Claude or ChatGPT’s MCP to improve the credibility of your work.

## Who it's for

Content strategists, B2B SaaS marketers, writers in general, and agencies with multiple clients.

## My role

I built it end-to-end: product direction, UX, data model, ingestion flows, transcript processing, pain-point extraction, semantic retrieval, MCP integrations, workspace access controls, and deployment setup.

## Key features

- Add content from URLs, pasted text, or uploaded files, including articles, YouTube videos, podcasts, transcripts, and reports. Paste the text for LinkedIn posts and Reddit threads.
- Store customer conversations and transcripts in a structured format with segments, timestamps, and speaker metadata when available.
- Extract pain points and retrieve quote context before and after the match instead of isolated snippets.
- Search your sources and read passages in context from the web app.
- Use the same workspace context inside connected AI tools through MCP.
- Filter by client inside one workspace so you can retrieve material for the correct account.

## What makes it different

- Manage and search your sources in the web app, and query the same material inside external AI tools through MCP.
- Retrieve contextual quotes from your database to support the answers you write from.
- Built for agency workflows where multiple clients share one workspace and research needs to stay organised by client.

## Stack

Next.js · Node.js / Express · Supabase (Postgres/Auth) · OpenAI (embeddings + extraction) · MCP SDK · Railway

## Why it matters

It makes writing workflows faster and more specific. Instead of starting from generic AI output, I can pull real context from a client's content and customer language from shared calls, then use that material to produce stronger, more credible content.

## Use contentDB

Use the web app to add and search your sources, then connect contentDB to your AI tools for research and writing.

[Visit contentDB](https://contentdb.peaceakinwale.com)

<p class="cta-row"><a class="button button-ink" href="/contact">Ask about a similar build</a></p>
