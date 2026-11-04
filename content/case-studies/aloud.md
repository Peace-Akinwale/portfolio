---
title: "Aloud: listen to saved articles and return to useful passages"
name: "Aloud"
blurb: "My audio library for the articles I keep meaning to read, with a reading view and saved passages."
kind: built
status: "Open to anyone who signs up"
date: 2026-06-15
published: 2026-10-25
summary: "Aloud is my audio reader. Paste a link or upload a PDF, EPUB or Word file and hear it read, with a reading view and saved passages. I built it for myself and my wife and later opened it to anyone. Three decisions shaped it. Keep the author's words as written, prepare a whole item before you ask for it, and put a ceiling on what each person can spend."
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

### I like reading and I wasn't reading

I like reading and I wasn't reading. Articles I meant to get to stayed unread, and so did the PDFs I'd saved. Before I started I wrote down what I wanted. An app that reads my links and documents to me, follows the tone and the sentence variation so the listening feels smooth, and sends me a weekly digest of what I heard. In my words that day, "it may unlock a real blocker for me because i like reading, but i don't read because audiobooks would be a better fit for me."

It had to work for more than one person from the start. Me and my wife, and anyone I chose to invite, each with their own library.

### The author's words stay as written, and every item is narrated in full

**Keep the author's words.** The first version let an AI cleanup pass adapt every import for speech. That's what made the narration smooth, and three months in I heard what it cost. It was rewriting a book. I stopped it. "When I add a link, a book, or a PDF, those ones should not be written at all. When you write them, you are scraping away the integrity of the author's text." Now the cleanup pass only touches text I paste myself and the weekly recap, which is new writing anyway. Links, PDFs, EPUBs and Word files are narrated as written. The decisions file records that this reversed my first choice, and why.

**Headings stay, running headers go.** The first fix for PDFs stripped the headers, and I pushed back. "Don't strip page headers. They are important." Then I saw the distinction I'd missed. A heading belongs in the reading. The same line at the top of every page doesn't. The extraction now reads each page's positions and type sizes. A line that repeats in the same slot across pages is dropped, and anything larger than body text is a heading and never touched.

**Prepare the whole item, even when I leave.** A 5,191-word article, about 33 minutes of audio, "finished" at 18 minutes. The player was driving the narration and stopped when I closed it. My instruction was plain. "Fix it so it can process everything in one go. Narration should keep running when I leave." Narration moved to the server. That has a cost I accepted on purpose. Every item is narrated in full the moment you add it, so the allowance is now checked before every segment, not once per batch.

**A ceiling on spend.** Family members get a monthly minutes cap. When I decided to open Aloud to the public, I gave each new account a one-time $2 budget instead, because a monthly $2 puts no ceiling on my total bill. A $5 global daily ceiling sits over all of it, and the app says "Paused until midnight UTC" when it's reached.

### Any link or document becomes audio, with the passages you keep

Paste, link, PDF, EPUB, Word and markdown go in. Each becomes audio you can play at your own speed with a sleep timer, back 15 and forward 30 seconds, and lock-screen controls. Read mode highlights its best estimate of the word being spoken, timed from each paragraph's audio length, so I didn't need to pay for an alignment service.

Highlights carry a note and a way back to the source. "The keepers" replays the audio around your saved passages, Daily Recall brings back the ones you haven't seen in a while, and the weekly recap can be read or heard. Each person has a private library and their own allowance. Sign in with a password, an emailed code or Google.

![June 2026 build capture with the Listen and Read switch above the player and a passage-saving action below it.](images/aloud/aloud-listen-june-2026.png)

*June 2026 build capture with the Listen and Read switch above the player and a passage-saving action below it.*

### What the live app showed, including two faults I didn't catch myself

The ten-page test book went from the running header read out eight times to zero, with all 42 paragraphs in order. The 33-minute article went from 18 minutes narrated to 32.2.

Not every fault was in my code. One morning I couldn't sign in to two of my apps. The shared database had hung after another app ran about 69,600 queries a day against it. I didn't upgrade the plan. "I can't upgrade. Not worth it. Find ways to reduce the volume of noise." The noisy app went from 48 queries a minute to 13.

Uploads over 10MB failed with "No file uploaded". The first explanation blamed the old host's limit and was wrong. The real cause was the framework's own proxy cap, raised to 64MB, after which 12MB and 24MB PDFs went through. On my phone the library loaded 27MB of cover art per visit. The covers are 23 to 40KB each now.

Two things I didn't catch myself, and I count them too. One commit left nine live items marked ready with no audio. A regression test found it. And for three days a trigger belonging to another app on the shared sign-in refused every new Aloud account. Nobody had tried to sign up, so nothing told me.

Aloud runs on Railway and is open to anyone. The users I can prove from the usage ledger are me and one family member. The test suite went from none to 48.
