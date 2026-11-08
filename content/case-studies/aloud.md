---
title: "Aloud"
name: "Aloud"
blurb: "A way to listen to the articles and documents I keep saving, with the author’s wording preserved in the narration."
kind: built
status: "Open to anyone who signs up"
date: 2026-06-15
published: 2026-10-25
summary: "Building a tool to listen to saved articles, preserve authored text and finish narrating the whole document."
voice: informal
notion_url: https://app.notion.com/p/403992da7a578174ba0dea8a39cb42fc
notion_last_edited: 2026-10-30T23:39:10.582Z
tags:
  - "audio"
  - "reading"
related:
  - "contentdb"
---

Aloud turns articles, PDFs, ebooks, and documents into audio so you can listen to the things you’ve been meaning to read.

![Aloud Library with a Continue listening card and saved articles](/images/approved/aloud/00-library.jpg)

## Why I built it

I like reading, but I had articles and books I kept bookmarking without getting around to them. My schedule is usually packed, so listening to them was an easier way for me to get through them without procrastination.

I built Aloud for myself and my wife, with a separate library for each of us so we could save our separate stuff and pick up where we left off.

## How it works

You can paste text, add a link to an article, or upload a Word document, EPUB, or PDF. Aloud extracts the text and uses OpenAI’s text-to-speech API to turn it into audio.

For articles and books, it preserves the author’s wording while cleaning up things such as repeated PDF headers and page numbers. That way, you can listen to the piece you saved without hearing the same header on every page. It also helps ensure that the AI doesn’t rewrite what the author wrote (because I noticed that bug at first).

Aloud also splits longer pieces into sections for narration. The audio is generated on the server, so you don’t have to keep the browser open while it processes.

![Adding a link to a Kevin Indig article in Aloud](/images/approved/aloud/01-add-article.jpg)

*I added [Kevin Indig’s article on AI search](https://www.kevin-indig.com/talks/winners-losers-ai-search) by pasting its link and choosing Listen now.*

## Listen, read along, and save useful passages

You can change the playback speed, skip through the recording, and resume where you stopped. There’s also a reading view if you want to follow the text while listening.

When you hear something you want to remember, you can save the passage as a highlight.

![Aloud reading view showing the selected sentence about search rankings and AI citations, with the Highlight button marked](/images/approved/aloud/03-player-callout.svg)

*I saved Indig’s comparison of AI citations for pages ranking first and tenth because I wanted to revisit what his research said about the value of ranking well.*

![Aloud’s Marks page showing saved passages from several articles, with Kevin Indig’s passage about AI citations first](/images/approved/aloud/05-marks-collection.jpg)

You can search those highlights later and return to that point in the recording without listening to the whole piece again.

![Search results in Marks showing a saved passage and a link to its timestamp](/images/approved/aloud/04-search-marks.jpg)

## Bottom line

Aloud gives me a way to get through my bookmarked content and keep the parts I want to return to. If you’d like to try it, ask me for an invitation.

[Open Aloud](https://aloud.peaceakinwale.com/)
