## Portfolio summary

AI Docs Watch is a public monitor of six AI platforms' documentation. It keeps every captured version of a page and shows the before and after on the publisher's own page, with a short report of what changed and when it takes effect. I built the first version in one evening for an SEO agency's founder, who now gets its reports in Slack every day. It caught Anthropic's usage policy rewrite on 14 October, four weeks before the new policy takes effect. The first report on it covered the wrong part, and fixing that changed how every report is written.

## Case study

### AI platforms rewrite their docs without notice, and the day it happens matters

The agency's founder asked for something that watches ChatGPT's, Gemini's and Claude's "how it works" pages and compares the versions when they change. AI platforms rewrite their documentation without notice, and the rewrite often decides how they crawl, cite and rank pages. If you advise clients on AI search, you need to know the day it happens.

I set one rule before I wrote anything. The diff is only the trigger. What he needs is a short report of what changed and what it means for the pages he advises on.

### Every report can be checked against the page itself

**Real pages, not a demo.** The first build needed something to show. I didn't let it invent busy states. "Crawl their last updates and let's see what they say." Every baseline came from the live pages that evening.

**A report that can't lie.** The day after launch I fact-checked the first reports myself and found three that were wrong. One read a rename from a link label, one guessed about an unreleased product, and one framed old archive changes as news. "There's a problem with Docs Watch, and I just caught it. Imagine if he saw this first." I rewrote the rules for what a report may say, stripped page boilerplate before comparing, and re-baselined every page. Later I went further. The reports state what happened and carry no opinion, and the code rejects a first-person take.

**Build the archive.** He showed me how archive.org keeps whole pages. A side-by-side screenshot wasn't enough. "If we need to build the capability of archive.org, let's build it." Each version is stored as the page itself, so you can compare the original wording yourself instead of trusting the summary.

**Only pages it can read every day.** A page that renders only with JavaScript failed in silence. "If we can't reliably crawl them regularly, let's leave them." It came back once a headless browser could fetch it. When I narrowed the legal pages to the ones that affect search and buyers, I asked for one more check "so that you don't not crawl things that you should crawl". That check found four more pages OpenAI's sitemap didn't list.

**Ask before crawling in public.** Before the site went public I asked, "Is there any law against this kind of crawling? Just so we don't mess up in a grand way." The answer came from research, not a lawyer, and shaped the pages. They carry short excerpts with attribution, a live link, a named crawler and a takedown contact.

[[img]]

### A daily monitor with a short report and the full before and after for every change

A daily monitor checks the watchlist and archives every page that changes. Each change gets a page with a short report, its impact rating, and a link to the full before and after on the publisher's own page. You can filter by platform, search, and read every archived version underneath.

[[img]]

The founder edits the public site by committing to it. A marker in each edited page stops the generator from overwriting his words.

[[img]]

### It caught four changes early, and one wrong report changed how every report is written

The watchlist went from 11 pages to about 500, across Google, OpenAI, Anthropic, Perplexity, Bing and Gemini. The site has 127 high or medium impact changes and 369 archived versions.

Four catches are public and dated. ChatGPT Instant Checkout and the Shopify catalogue, caught 23 July. Google's fact-checking rule, caught 2 October, before the LinkedIn posts about it. OpenAI's product feed requiring you not to block its bots, caught 14 October. Google's Search Console control to opt out of AI Overviews, caught 27 October.

Anthropic's usage policy rewrite is the catch I learned most from. It changed on 8 October and takes effect on 12 November. The monitor captured it and wrote about the wrong part. The rewrite had 152 changed passages, and the step that writes the report only saw the first 24. The section that mattered began at passage 51. Raising the limit wasn't enough on its own, so the report now lists every new heading first. The capture date and the effective date sit apart on every page, because a reader needs both. One says when the monitor caught it, and the other says when it starts to count.

Other failures came from scale. Vendor stylesheets expired, so 45 of 56 archived pages lost their styling until every capture embedded its own CSS. A bot-check screen was stored as a page's "before", and a cheaper fetch path published false changes. I withdrew 18 of 192 rather than deleting them, and added a hold-for-review step that catches 16 of the 19 known false changes before they publish.

[[img]]

It costs about $35 to $70 a month at 500 pages. The founder gets a report in Slack for each change and a daily summary. Readers of the agency's reading app and its course students have it too.
