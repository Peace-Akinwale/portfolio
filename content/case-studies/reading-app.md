---
title: "A reading app for reviewing posts and preparing newsletter notes"
kind: built
status: "private to the client’s team"
date: 2026-06-10
for: "Notebook Agency"
summary: "I built a private reading app for an agency founder who kept checking LinkedIn and saving posts across task lists. The app gathered public posts into one review feed, with audio digests to listen instead of reading. Starred posts fed newsletter notes that the founder could edit before sending them to the publishing system."
notion_url: https://app.notion.com/p/403992da7a578154a913e2c0f47463f7
notion_last_edited: 2026-10-25T14:24:03.685Z
links:
  - "Five lessons from building it, an article | /the-success-message-was-the-bug"
tags:
  - "reading"
  - "newsletter"
related:
  - "aloud"
  - "ai-docs-watch"
---

### Bring recurring research out of the social feed

The founder runs an SEO agency and two newsletters, and their research happened in the gaps of the day. In their words, LinkedIn was "on the home screen of my phone," they were "opening it 10 times a day," and every useful post went into one of three Google Tasks lists to come back to later. By June 2026 those lists held 714 saved items.

They wanted "a way to totally replace" that process with something that followed the people they trust, gathered those posts in one place and let them work through it "in a condensed and manageable way." They also preferred listening to long articles.

Until June 10, 2026, I had been building a different tool: an engine that drafted LinkedIn posts. On a call that day, the founder said their own writing setup already produced better posts, and that the real problem was the checking and saving. I wrote up the new requirements from the call, then built and deployed the first version of the reading app that night. The post engine's infrastructure stayed and was put to work for the new app.

### Review collected posts in one feed

The app crawls about 190 people's public posts every day, plus selected YouTube and X accounts and industry news feeds. The top of the feed says what the crawl did, so the founder knows how much is waiting before starting.


The founder can review posts in one place and star the ones worth using. Off-topic updates are hidden by default, with a “Show everything” switch to inspect what was excluded. Feedback helps refine the feed. This gives the founder a research queue they can work through deliberately instead of repeatedly reopening LinkedIn to see what is new.

### Listen to digests and newsletter notes

The founder preferred listening, so I added audio versions of the weekly LinkedIn and industry-news digests. They could catch up without reading every collected post. Newsletter notes also gained narrated and short-video versions, allowing the same edited material to be used in another format.

### From a star to a newsletter note

Starring a post does two things: it clears the post from the unread list, and it adds it to that week's newsletter note. On the Roundups screen, starred posts wait under "Building now," where they can be reordered, held for next week or topped with a note of the founder's own.


The app drafts a newsletter note from three selected posts and the founder's own commentary, following their chosen limit. The founder edits it before sending it to the publishing system as a draft. Research selections therefore become a starting point for the newsletter, without the founder collecting the same links again.

### Rules that protect the account

I set account-protection rules before writing any code. The app would hold no LinkedIn login or cookies and offer no way to post or comment. Engagement stays with the founder through links they open personally. Public posts come through a third-party data service that doesn't need the founder's account.

Two smaller rules came from watching the app in use. The feed refreshes only when asked, so posts don't jump during reading. A separate check prevents generated newsletter copy from promising agency services. That keeps an automated draft from making commitments the founder has not approved.

### Everything the app makes, in one place

As more outputs were added, I brought them into a shared Library. The founder could return to a digest or find a newsletter draft without remembering which part of the app generated it. The Library also linked to related research tools, including AI Docs Watch.


### What the build delivered

I directed the build with AI coding agents, translating the founder's requests into a connected reading and publishing workflow. The result gave them a place to review collected research and turn selected posts into newsletter drafts, with reader accounts for teammates.
