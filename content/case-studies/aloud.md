---
title: "Aloud: listen to saved articles and return to useful passages"
kind: built
status: "my own app, invite-only"
date: 2026-09-28
summary: "I built Aloud with AI coding assistance because I had articles I wanted to read and kept leaving them unread. The app brought links, documents and pasted text into a personal audio library, with a reading view, saved passages and a written and spoken recap. Later, I changed narration to preserve authors' wording and prepare the whole item after I left the player."
notion_url: https://app.notion.com/p/403992da7a578174ba0dea8a39cb42fc
notion_last_edited: 2026-10-24T17:27:37.604Z
links:
  - "The public Aloud log on GitHub | https://github.com/Peace-Akinwale/portfolio/blob/master/case-studies/aloud/index.md"
tags:
  - "audio"
  - "reading"
related:
  - "contentdb"
  - "reading-app"
---

I wanted to listen to the articles I kept leaving unread, along with documents I had saved. Aloud gave me a way to work through that material without having to sit down and read every page.

I started Aloud in June 2026 as a personal app for me, my wife and people I invite. Working with AI coding assistance, I built an import-to-audio workflow with a reading view for saving useful passages. Each person had a separate library, listening progress and recap. In September, I changed how Aloud prepared long items and handled authors' text.

### Turn articles and documents into audio with a reading view

I started with articles and pasted text, then added PDF, EPUB and Word extraction. The narration pipeline divided imported text into playable segments. The player joined those segments into a listening session with speed controls, a sleep timer and saved progress.

Playback continued while I moved between screens, so browsing the library did not interrupt an article. Read mode let me check the wording alongside the narration; Listen mode kept the audio controls in view.


The first approach started audio quickly, but relied on the player to request the remaining chapters. Leaving it could mean the rest was never prepared.

### Preserve authors' wording and remove repeated PDF headers

I first allowed an AI cleanup step to adapt imported text for speech. Later, I rejected that behavior for other people's writing. An article or book should retain the author's words when I listen to it.

I changed the rule so links and uploaded documents bypassed rewriting. My own pasted text and the generated recap could still use speech preparation. A recap is a new piece of writing; an imported article is something I chose to hear as written.

PDFs needed another distinction: a heading belongs in the reading, but the same running header on every page usually doesn't. The later extraction work used page positions and text size to remove repeated headers while keeping headings and rebuilding paragraphs. For articles and EPUBs, the reading view also kept structure such as lists, quotations and images with captions.

### Finish preparing a long item after I leave the player

The original approach could stop before the end of long material. I moved narration of the whole item to the server so leaving the player screen wouldn't stop the remaining preparation.

That meant accepting the cost of generating a complete item when adding it. Aloud had a monthly allowance for each person, and the later implementation checked the remaining allowance before each paragraph. Preparing the audio and listening to it were separate steps: pausing and playing a stored segment didn't require generating it again.

### Follow the spoken words in the reading view

The reader highlighted the approximate spoken word so I could find my place when switching from listening to reading. I estimated timing from each paragraph's audio duration, avoiding the cost of a separate alignment service.

### Save passages and replay their audio

I added highlights so I could keep a passage while listening or select text while reading. A highlight could carry a note and a route back to its source.

“The keepers” replayed audio around saved highlights, letting me revisit useful passages without finding them in the full article. Daily Recall resurfaced highlights I had not seen recently. Reusing stored audio kept repeat listening from triggering another generation request.

### Create a written and spoken recap from recent items and highlights

The weekly recap was part of my original request. I built it around recently played item titles and saved passages, then made the written recap playable through the same audio system. It gave me another route back to the material I'd marked during the week.

### Give each invited person a private library and audio allowance

Each invited person needed their own queue and progress.

The app checked access against invited-user records and applied each person's audio allowance. That let me share the tool without mixing our listening histories or leaving narration spending unlimited.
