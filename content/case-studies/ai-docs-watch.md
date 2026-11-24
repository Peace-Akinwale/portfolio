---
title: "Helping a team act on changes to AI platforms"
name: "AI Docs Watch"
blurb: "A way to follow changes to AI platforms’ documentation, so your team can decide when its workflows or guidance need attention."
kind: built
status: "The agency’s founder, every day in Slack. Public since October 2026"
date: 2026-07-22
published: 2026-10-25
summary: "Monitoring AI documentation changes so a team can see what affects its workflows and check the source before acting."
voice: informal
notion_url: https://app.notion.com/p/403992da7a57817c8a0ad5105de78b0e
notion_last_edited: 2026-10-31T08:47:00.392Z
tags:
  - "monitoring"
  - "documentation"
related:
  - "fanout-query-analysis-tool"
---

Your approach to AI (and how you understand it) depends partly on what the platforms make available and how those features work. AI platforms' Docs changes can give you a reason to revisit your tactics to AI search or reconsider your thoughts about how to use AI tools and their API.

I built AI Docs Watch to make those changes easier to follow, with the original evidence beside the explanation. This gives a team a way to spot something worth investigating without repeatedly checking those pages manually or waiting until a major news outlet talks about it.

## Show what changed and why someone might care

The monitor saves versions of each documentation page, compares them, and prepares a short report about what changed. Readers can open the before-and-after view to check the original wording before deciding whether the change affects their work.

![AI Docs Watch summarizes a change to OpenAI’s advertising policies, identifies who it affects, and links to the source comparison.](/case-studies/ai-docs-watch/retina/change-summary.png)

![Readers can compare the original wording behind an update, rather than relying only on the write-up.](/case-studies/ai-docs-watch/retina/before-after.png)

The system also sends updates to Slack, and now you can subscribe to receive it via email. That brings changes into a place the team already checks, with a route back to the full comparison when something deserves attention.

## What I learned

To identify changes, the monitor checks a page and compares its content with the previous version. But some websites don’t make all that content available in the same way.

For example, Bing’s crawler page uses JavaScript to load its main content, so it needed a browser to run that JavaScript before the monitor could read it. I added an automated browser for pages like that and kept the simpler method for pages it could read directly.

This allows the monitor to access the changes without taking the extra browser step for every page. Running a browser takes more processing time, and the browser service I used adds a cost, so I reserved it for pages that needed it.

Reading the content brought another problem. Menus and related-article links can change even when the main content of a page stays the same. I filtered those out so a renamed navigation link wouldn’t be reported as a change to how a platform works, which can lead to bloated reports about changes.

[Open AI Docs Watch](https://docswatch.stevetoth.ai)
