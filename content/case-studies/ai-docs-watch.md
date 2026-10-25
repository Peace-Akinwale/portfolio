---
title: "AI Docs Watch"
kind: built
status: "live, public"
date: 2026-10-14
for: "Notebook Agency"
summary: "AI Docs Watch checks the official help pages, policies, terms and API docs of Google, Gemini, OpenAI, Anthropic, Bing and Perplexity every day. When one of those pages changes, it publishes the page as it stood before and after, with the changed words marked, a plain impact rating and what the change means for an SEO or content team. I built the monitoring, the archive and the public site."
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

### Help content teams keep up with changing platform guidance

An SEO or content team needs to know when official platform guidance changes, without rereading the same documentation every day. The agency's founder asked for a monitoring tool. I built the comparison around archived pages so readers could check the changed wording before deciding whether their own work needed to change.

### Before and after, as the publisher's own page

When a change is caught, the site publishes a change page with a short title, a rating and a button to see the change side by side.

![docswatch 02 change page](images/ai-docs-watch/docswatch-02-change-page.jpg)

*Archived documentation view, October 2026.*

The comparison marks the changed words in archived copies of the publisher's page. A strategist can check the explanation against the original wording and use that evidence when advising a client.


### Distinguish capture dates from effective dates

A documentation change has more than one date, and mixing them up leads to wrong claims like "Google changed this on October 2." The site keeps them apart:

- **The capture date** labels each side of the comparison. It's when a copy of the page was stored.
- **The date the change was caught** appears in the page's version history, down to the minute.
- **The publisher's own date**, such as "Last updated" or "Effective", stays inside the archived page and is quoted in the write-up. It's never used as the change date.


Anthropic's usage policy shows why this matters. We captured it on October 7 and caught the change on October 14, but the new policy itself takes effect on November 12, 2026.


### Preserve archived pages when vendor styling changes

Some vendors replaced their stylesheets after a deployment, leaving older archived pages difficult to read. I stored styling with each capture so readers could still inspect an earlier page after the live site changed. Preserving that context makes a comparison useful beyond the day the change is detected.

### Help readers decide which changes need their attention

The impact rating helps a reader prioritize the changes. High-impact updates may require a change in practice; medium-impact updates affect a narrower part of the guidance. Low-impact updates cover wording or presentation with no identified substantive change. The archived comparison lets the reader inspect the basis for that rating.

### Include new headings in long policy comparisons

The founder asked whether we had caught a new section in Anthropic's usage policy that bans seeding fake sources for AI answers. We had caught the change, but the first write-up didn't mention that section. The reason was mechanical: the policy rewrite had 152 changed passages, the writer only saw the first 24, and the new section started at passage 51.

I changed the input so the writing step received new headings first and used a text-length budget instead of a fixed passage count. The revised explanation led with the section the earlier version missed. A team relying on the summary would now be directed to the policy issue it needed to examine.


### Publish the archive with protected editorial changes

![docswatch 01 hub](images/ai-docs-watch/docswatch-01-hub.jpg)

*Archived documentation view, October 2026.*

I built it with AI coding agents. I set the product rules, checked write-ups against the archived pages, decided how ratings and dates work, and handled each fix when a vendor or a reviewer showed us something we'd missed. The agency's CTO runs the server it's served from, and the founder reviews the site and edits pages by hand. The regeneration workflow protects those manual edits. That keeps an editorial correction in place when the system produces another version of the page.
