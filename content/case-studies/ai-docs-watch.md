---
title: "AI Docs Watch"
name: "AI Docs Watch"
blurb: "Shows you an AI platform’s docs as they were before and after each change, with the changed words marked."
kind: built
status: "live, public"
date: 2026-10-14
summary: "AI Docs Watch keeps an eye on the official help pages, policies, terms and API docs of Google, Gemini, OpenAI, Anthropic, Bing and Perplexity, every single day. When one of those pages changes, it publishes the page as it looked before and after, with the changed words marked. Each change gets a plain impact rating and a few words on what it means for an SEO or marketing team. I built the monitoring, the archive and the public site."
voice: informal
notion_url: https://app.notion.com/p/403992da7a57817c8a0ad5105de78b0e
notion_last_edited: 2026-10-24T17:28:05.687Z
links:
  - "Open AI Docs Watch | https://docswatch.stevetoth.ai"
tags:
  - "monitoring"
  - "documentation"
related:
  - "what-ai-search-apps-do-before-they-answer"
  - "fanout-query-analysis-tool"
---

### Help SEO and marketing teams keep up when platform guidance changes

If you work in SEO or content, you need to know when a platform changes its official guidance. And you don't want to reread the same documentation every day to find out. The agency's founder asked for a monitoring tool, so I built one around archived copies of the pages. That way, you can check the exact wording that changed before you decide whether your own work needs to change too.

### Before and after, on the publisher's own page

When the tool catches a change, the site publishes a change page with a short title, a rating and a button that shows you the change side by side.

![docswatch 02 change page](images/ai-docs-watch/docswatch-02-change-page.jpg)

*Archived documentation view, October 2026.*

The comparison marks the changed words in archived copies of the publisher's page. So a strategist can hold the explanation up against the original wording, and use that evidence when they advise a client.


### Keep the capture date and the effective date apart

A documentation change has more than one date, and it's easy to mix them up and end up saying something like "Google changed this on October 2." So the site keeps them separate.

- **The capture date** labels each side of the comparison. It's when a copy of the page was stored.
- **The date we caught the change** shows up in the page's version history, down to the minute.
- **The publisher's own date**, like "Last updated" or "Effective", stays inside the archived page and gets quoted in the write-up. It's never used as the change date.


Anthropic's usage policy shows why this matters. We captured it on October 7 and caught the change on October 14, but the new policy itself doesn't take effect until November 12, 2026.


### Keep old pages readable when a vendor changes its styling

Some vendors swapped out their stylesheets after a deployment, and older archived pages got hard to read. So I stored the styling with each capture. You can still look at an earlier page after the live site has changed, which keeps a comparison useful long after the day the change was caught.

### Help readers decide which changes deserve their attention

The impact rating helps you decide what to look at first. A high-impact update might mean you need to change how you work. A medium-impact one touches a narrower part of the guidance. A low-impact one is wording or layout, with nothing substantive changed. And because the archived comparison is right there, you can check what the rating is based on.

### Catch new headings in long policy rewrites

The founder asked whether we'd caught a new section in Anthropic's usage policy that bans seeding fake sources for AI answers. We had caught the change, but the first write-up didn't mention that section. The reason was mechanical. The policy rewrite had 152 changed passages, the writer only saw the first 24, and the new section started at passage 51.

So I changed what the writing step receives. New headings now come first, and it works to a text-length budget instead of a fixed number of passages. The revised write-up led with the section the first one missed. A team reading the summary now gets pointed straight at the policy issue it needs to look at.


### Publish the archive, and protect the hand edits

![docswatch 01 hub](images/ai-docs-watch/docswatch-01-hub.jpg)

*Archived documentation view, October 2026.*

I built it with AI coding agents. I set the product rules, checked the write-ups against the archived pages, decided how ratings and dates work, and handled each fix whenever a vendor or a reviewer showed us something we'd missed. The agency's CTO runs the server it's served from, and the founder reviews the site and edits pages by hand. The regeneration workflow protects those hand edits, so an editorial correction stays put when the system produces another version of the page.
