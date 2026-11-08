---
title: "An app an agency uses to follow SEO and AEO trends"
name: "An app an agency uses to follow SEO and AEO trends"
blurb: "Pulls the posts worth reading into one feed you can listen to, and starred posts turn into newsletter notes."
kind: built
status: "An SEO agency’s founder and team"
date: 2026-06-10
published: 2026-10-25
summary: "An app an SEO agency uses to follow SEO and AEO trends. It collects posts from the people and sources the founder follows, lets him listen to digests, and turns the posts he stars into the week's newsletter roundup. The first version went live the night I started it, and it has run for the founder, his team and the agency's course students since."
voice: informal
notion_url: https://app.notion.com/p/403992da7a578154a913e2c0f47463f7
notion_last_edited: 2026-10-30T23:42:18.968Z
links:
  - "Five lessons from building it, an article | /the-success-message-was-the-bug"
tags:
  - "reading"
  - "newsletter"
related:
  - "aloud"
  - "ai-docs-watch"
---

### A founder opening LinkedIn ten times a day and losing the posts he wanted to keep

On our first call the agency's founder described his day. He was opening LinkedIn ten times a day to keep up, he learns best by listening, and he wanted the posts worth reading in a condensed, manageable form. The posts he kept were the raw material for two newsletters, and they were getting lost in the feed.

That call changed the plan. I'd been asked for a LinkedIn post engine. The reading feed became the build instead, and the first version went live that night.

### It reads to him, and his voice stays his own

**The app reads, and it doesn't write his posts.** "Radar is not to write his LinkedIn content, although he can definitely create content from ideas he has saved." The app collects, summarises and reads aloud. The founder's voice stays his. The client newsletter is still sent from Notion, where his team already works.

**A notification goes to the exact thing.** "When the user decides to click on that notification, it should take them to the exact page or chat or activity that the notification popped up for. So this must be well done." Every notification, whether a push, a Slack message or the bell in the app, opens the item it's about.

**Refresh is the reader's choice.** I added a refresh when the app came back to the foreground, to help on iPhone. Five days later I took it out. "Until a user pulls to refresh, app should not auto refresh." Pull-to-refresh replaced it, and the rule went into the project's instructions. Other updates can arrive silently, but the reader's place never moves on its own.

![The feed groups unread and starred posts and shows collection status. The reader chooses when to refresh. Identifying information is anonymized.](images/reading-app/reader-01-feed.png)

*The feed groups unread and starred posts and shows collection status. The reader chooses when to refresh. Identifying information is anonymized.*

**Keep his behaviour, fix where it lands.** The founder wanted the page to jump to the top after he cleared a post. I kept that, and changed what's at the top. It's now the first post he hasn't seen yet. The alternative, rebuilding the feed with only unseen posts, would have removed posts he never asked to remove.

**The message reports what the worker did.** A notification once told the founder his link was in the roundup when it wasn't. I set a rule afterwards. The background job that does the work reports what happened, and the alert repeats that report. It can't claim more than the job confirms.

**Check a pattern before teaching it.** When we studied how the founder edited one week's roundup, I stopped before changing the writer's instructions. "These patterns come from one week. Before editing the roundup writer's prompt, validate them against two or three earlier published weeks." Four patterns held every week, and only those went in.

### One feed with digests to listen to and roundups built from his stars

A feed of posts from about 200 followed profiles and 28 news sources, with unread, read and starred views and filters for LinkedIn, X, news and YouTube. Digests the founder can listen to. Weekly roundups built from his stars, capped at his top three in the order he ranked them. Idea queues, a studio for drafting from saved ideas, notifications that deep-link, and an admin view. Later came pasting any link into the feed or a roundup, AI Docs Watch for readers, and sign-in with Google.

### The live app kept finding what 1,253 tests missed

The feed went live on day one at 714 imported ideas and 159 profiles. Team accounts came two weeks later, with anyone on the agency's email domain approved as a reader. Course students got the same reader access the month after, and they can sign themselves up.

I tested on the live app, not just in the test suite, and the live app kept finding what the tests missed. A server-side duplicate check raced and let three copies of one link through. An Undo on the star toast didn't remove the star. A feed jump passed every unit test and failed three ways in the browser. After the false notification, I ran a truth audit across this app and two others and found 27 messages that could claim success without proof. All 27 were fixed.

The founder publishes the roundup note the app generates rather than writing his own. The project ran to 573 commits and 1,253 tests.
