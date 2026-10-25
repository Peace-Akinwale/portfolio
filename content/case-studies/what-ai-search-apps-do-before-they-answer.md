---
title: "What AI search apps do before they answer: a public reference"
name: "A public reference to AI search traffic"
blurb: "What AI search apps send and receive while they answer you, explained field by field, with the recording behind each one."
kind: built
status: "published, public"
date: 2026-10-02
summary: "When you ask ChatGPT, Claude, Perplexity, Gemini or Google's AI Mode a question, the app sends and receives data in the background. That includes the searches it writes, the pages it pulls in and the sources it attaches to each sentence. I recorded hundreds of real AI search conversations, built the pipeline that turned all that traffic into a labelled reference, and published it as a public article with eight platform pages and narrated audio. A reader can look up a field name from the recorded sessions and see what it holds, where it shows up, and whether we saw that meaning or inferred it."
voice: informal
notion_url: https://app.notion.com/p/403992da7a5781549c62ef65f6569916
notion_last_edited: 2026-10-24T17:28:34.379Z
tags:
  - "AI search"
  - "research"
related:
  - "fanout-query-analysis-tool"
  - "ai-docs-watch"
---

### Explain the fields you see in AI search traffic

The agency's founder wanted a reference that explained the field names that show up in AI search recordings, because they're hard to make sense of on their own. So I built a page for each platform. A researcher can look up an unfamiliar field and check the recording behind its explanation, instead of starting from raw traffic every time.

### Hundreds of recorded conversations to start from

The reference is built on browser recordings I made and cleaned in September for an earlier research project. There are 284 three-turn conversations across ChatGPT and its deep research mode, Gemini, Google AI Mode, Google AI Overviews, Claude, Perplexity and Brave. A teammate chose which sessions to record. I recorded them, stripped out personal and account data, and built a parser for each platform.

### Turn recordings into entries a researcher can check

I built a pipeline that pulls the AI apps' own requests and response fields out of the recordings. It leaves out the trackers from the websites visited, so unrelated web activity stays out of the reference. That turned a big pile of recordings into entries a researcher can search and compare.

### What a reader can look up

Each entry explains what the field contains and links to an example from the recordings. A researcher can follow that example to check whether the suggested meaning matches the data in front of them.


The main article compares what each platform exposes, including whether you can see its search queries. That helps anyone planning an investigation pick which records to look at, and understand where a platform leaves gaps.


### Label what we saw, and what we think it means

Entries keep visible data apart from an interpretation of what it means. Words like “likely” make that uncertainty plain, so nobody mistakes the reference for official vendor documentation. Example values use safe placeholders instead of real account data.

### A version you can listen to

Some people take things in better by listening, so I added narration to the article and all eight platform pages. That's nine audio tracks, generated from the published pages themselves. When the pages changed, I re-rendered the tracks from the new text and changed the file addresses, so returning listeners got the new audio instead of an old cached copy.

### Handing the pages over to the founder

The first complete version went live on October 2, 2026, after a round of review notes from the founder that I applied everywhere the same issue came up. Over the next two days, the founder rewrote and extended all the pages, and added a check that keeps every required section in place.

My original generator could have overwritten the founder's edits with older source material. So I retired it and used the edited pages for every update after that, narration included. That kept the editorial work intact, and kept listeners on the same version as readers.

### Keep the reference current as the apps change

The reference describes the apps as they behaved when the conversations were recorded in September 2026. AI apps change their traffic as they ship new models. On October 8, ChatGPT moved to a new model, and its answers started marking citations differently. I compared fresh traffic against the ChatGPT page the same day, and 133 of its 183 labels still showed up. That's why the reference needs dated observations and fresh recordings. Researchers can check whether an entry still matches the traffic they see, instead of assuming a field will stay the same.
