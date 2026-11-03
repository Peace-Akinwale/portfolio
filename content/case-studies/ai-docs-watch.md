---
title: "AI Docs Watch, a daily monitor of six AI platforms’ docs for SEO and content teams"
name: "AI Docs Watch"
blurb: "Shows you an AI platform’s docs as they were before and after each change, with the changed words marked."
kind: built
status: "everyone, it’s public"
date: 2026-10-14
summary: "AI Docs Watch checks six AI platforms' documentation and policies every day. They are Google, Gemini, OpenAI, Anthropic, Bing and Perplexity. When a page changes, it publishes both versions with the changed words marked. Each change gets a plain impact rating and a few words on what it means for an SEO or marketing team. I built the monitoring and the public site."
voice: informal
notion_url: https://app.notion.com/p/403992da7a57817c8a0ad5105de78b0e
notion_last_edited: 2026-10-31T08:47:00.392Z
links:
  - "Open AI Docs Watch | https://docswatch.stevetoth.ai"
tags:
  - "monitoring"
  - "documentation"
related:
  - "what-ai-search-apps-do-before-they-answer"
  - "fanout-query-analysis-tool"
---

### Help SEO and marketing teams see what AI platforms change

AI platforms change how they work all the time, and their own documentation is the clearest record of it. It might be a new opt-out, or a ranking factor that disappears without an announcement. Each edit tells you more about how the platform decides what to show, which is what you need to know to be visible in it.

The agency's founder asked for a way to catch these edits without rereading the same pages every day, so I built a monitoring tool around archived copies of them. You can see the wording that changed and the date it changed, then decide whether your tactics need to change.

Three changes it caught show what I mean.

- **Google added an AI opt-out to Search Console.** AI Docs Watch [caught it on October 27, 2026](https://docswatch.stevetoth.ai/google/control-what-you-share-with-google-search/2026-10-27/). Google's documentation now lists a site-wide control that takes a site out of AI Overviews and AI Mode. If you're a publisher who doesn't want your content used there, that's the switch. If you're a brand that wants to be seen, it's a reason to make sure nobody flips it by accident. And any site in your space that opts out leaves more room in those answers for the ones that stay.
- **ChatGPT spelled out how it ranks products.** [Caught on July 23, 2026](https://docswatch.stevetoth.ai/openai/shopping-with-chatgpt-search/2026-07-23/). OpenAI's shopping help page named the factors it ranks merchants by. They are availability, price, quality, and whether you're the maker or the primary seller. It also said Shopify stores are fed in with no setup, and it dropped Instant Checkout from the list of ranking factors. A brand selling through ChatGPT now knows which product data to fix first.
- **OpenAI's product feed came with a condition.** [Caught on October 14, 2026](https://docswatch.stevetoth.ai/openai/merchant-feed-terms/2026-10-14/). OpenAI's merchant feed terms now say a merchant who submits a feed can't block OpenAI's crawlers and gives up any text-and-data-mining opt-out against OpenAI. That's a trade worth making on purpose, not one to find out about after you've signed.

Each of these got its own change page on the day it was caught, showing the old wording next to the new.

### Before and after, on the publisher's own page

When the tool catches a change, the site publishes a change page with a rating and a button that shows you the change side by side.

![Docs Watch connects an addition to OpenAI’s crawler documentation with questions marketers can ask about their advertising landing pages.](images/ai-docs-watch/docswatch-adsbot-explanation-actions-2026-10-30.jpg)

*Docs Watch connects an addition to OpenAI’s crawler documentation with questions marketers can ask about their advertising landing pages.*

The comparison marks the changed words in archived copies of the publisher's page. So a strategist can hold the explanation up against the original wording, and use that evidence when they advise a client.

![image](images/ai-docs-watch/image.png)

### Keep the capture date and the effective date apart

A documentation change has more than one date. It's easy to mix them up and end up saying something like "Google changed this on October 2." So the site keeps them separate.

- **The capture date** labels each side of the comparison. It's when a copy of the page was stored.
- **The date we caught the change** shows up in the page's version history, down to the minute.
- **The publisher's own date**, like "Last updated" or "Effective", stays inside the archived page and gets quoted in the write-up. It's never used as the change date.

![Readers can narrow the updates by platform or search for a relevant topic. The impact definitions explain how the changes are classified.](images/ai-docs-watch/Screenshot_2026-10-31_at_09.44.29.png)

*Readers can narrow the updates by platform or search for a relevant topic. The impact definitions explain how the changes are classified.*

Anthropic's usage policy shows why this matters. We captured it on October 7 and caught the change on October 14, but the new policy itself doesn't take effect until November 12, 2026.

![Readers can compare the original wording behind an update, rather than relying only on the write-up.](images/ai-docs-watch/docswatch-03-google-before-after.png)

*Readers can compare the original wording behind an update, rather than relying only on the write-up.*

### Keep old pages readable when a vendor changes its styling

Some vendors swapped out their stylesheets after a deployment, and older archived pages got hard to read. So I stored the styling with each capture. You can still look at an earlier page after the live site has changed, which keeps a comparison useful long after the day the change was caught.

### Help readers decide which changes deserve their attention

The impact rating helps you decide what to look at first. A high-impact update might mean you need to change how you work. A medium-impact one touches a narrower part of the guidance. A low-impact one is wording or layout, with nothing substantive changed. The archived comparison is on the same page, so you can check what the rating is based on.

### Catch new headings in long policy rewrites

The founder asked whether we'd caught a new section in Anthropic's usage policy that bans seeding fake sources for AI answers. We had caught the change, but the first write-up didn't mention that section. The reason was mechanical. The policy rewrite had 152 changed passages, and the writer only saw the first 24. The new section started at passage 51.

So I changed what the writing step receives. New headings now come first, and it works to a text-length budget instead of a fixed number of passages. The revised write-up led with the section the first one missed. A team reading the summary now gets pointed to the policy issue it needs to look at.



### Publish the archive, and protect the hand edits



I set the product rules and decided how ratings and dates work, then directed AI coding agents through the build. I checked the write-ups against the archived pages. When a vendor or a reviewer showed us something we'd missed, I made the fix.

The agency's CTO runs the server it's served from, and the founder reviews the site and edits pages by hand. The regeneration workflow protects those hand edits, so an editorial correction stays put when the system produces another version of the page.
