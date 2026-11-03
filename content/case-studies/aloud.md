---
title: "Aloud: listen to saved articles and return to useful passages"
name: "Aloud"
blurb: "My audio library for the articles I keep meaning to read, with a reading view and saved passages."
kind: built
status: "me, and anyone who signs up"
date: 2026-09-28
summary: "I built Aloud because I had articles I wanted to read and kept leaving unread. It turns links and documents into a personal audio library, with a reading view and saved passages. In September I changed narration so it keeps the author's wording and finishes preparing a whole item after I've left the player."
voice: informal
notion_url: https://app.notion.com/p/403992da7a578174ba0dea8a39cb42fc
notion_last_edited: 2026-10-30T23:39:10.582Z
links:
  - "Try Aloud | https://aloud.peaceakinwale.com"
tags:
  - "audio"
  - "reading"
related:
  - "contentdb"
  - "reading-app"
---

I wanted to listen to the articles I kept leaving unread, plus the documents I'd saved. Aloud gave me a way to get through all of it without sitting down and reading every page.

I started Aloud in June 2026 as a personal app I share with my wife and the people I invite. I designed an import-to-audio workflow with a reading view for saving the useful bits, and directed AI coding assistants through the build. Everyone gets their own library and listening progress.

In September I changed how Aloud prepares long items and how it handles an author's text.

### Turn articles and documents into audio, with a reading view

I started with articles and pasted text. Then I added extraction for PDF, EPUB and Word files. The narration pipeline splits imported text into playable segments. The player strings them into one listening session with speed controls and a sleep timer.

Playback keeps going while you move between screens, so browsing the library doesn't interrupt an article. Read mode lets you check the wording alongside the narration, and Listen mode keeps the audio controls in view.

![June 2026 build capture with the Listen and Read switch above the player and a passage-saving action below it.](images/aloud/aloud-listen-june-2026.png)

*June 2026 build capture with the Listen and Read switch above the player and a passage-saving action below it.*

The first approach got audio playing without a wait, but it relied on the player to ask for the remaining chapters. If you left the player, the rest might never get prepared.

### Keep the author's wording, and drop repeated PDF headers

At first, I let an AI cleanup step adapt imported text for speech. Later, I stopped doing that for other people's writing. If I'm listening to an article or a book, it should keep the author's words.

So I changed the rule. Links and uploaded documents skip rewriting. My own pasted text and the generated recap can still get speech preparation, because a recap is new writing. An imported article is something I chose to hear as written.

PDFs needed one more distinction. A heading belongs in the reading, but the same running header on every page doesn't. The later extraction work uses page positions and text size to remove repeated headers while keeping real headings and rebuilding paragraphs. For articles and EPUBs, the reading view also keeps structure like lists and captioned images.

### Finish preparing a long item after I leave the player

The original approach could stop before the end of a long piece. So I moved narration of the whole item to the server, and leaving the player no longer stops the rest from being prepared.

That meant accepting the cost of generating a complete item as soon as you add it. Aloud gives each person a monthly allowance, and the later version checks what's left before each paragraph. Preparing the audio and listening to it are separate steps, so pausing and playing a stored segment doesn't generate it again.

### Follow the spoken words in the reading view

The reader highlights its best estimate of the word being spoken, so you can find your place when you switch from listening to reading. I estimated the timing from each paragraph's audio length, which meant I didn't have to pay for a separate alignment service.

### Save passages and replay their audio

I added highlights so you can keep a passage while you're listening, or select text while you're reading. A highlight can carry a note and a way back to its source.

“The keepers” replays the audio around your saved highlights, so you can go back to useful passages without hunting for them in the full article. Daily Recall brings back highlights you haven't seen in a while. Because it reuses stored audio, listening again doesn't trigger another generation request.

### A weekly recap you can read or hear

The weekly recap was part of my original idea. I built it from the titles of the week's played items and your saved passages, then made the written recap playable through the same audio system. It gives you another way back to the things you marked during the week.

### Give each invited person a private library and an audio allowance

Everyone I invite needs their own queue and progress.

The app checks access against the invited-user list and applies each person's audio allowance. That lets me share the tool without mixing up our listening histories, or leaving narration spending open-ended.
