---
title: "What AI search apps do before they answer: a public reference"
kind: built
status: "published, public"
date: 2026-10-02
for: "Notebook Agency"
summary: "When you ask ChatGPT, Claude, Perplexity, Gemini or Google's AI Mode a question, the app sends and receives data in the background: the searches it writes, the pages it pulls in, the sources it attaches to each sentence. I recorded hundreds of real AI search conversations, built the pipeline that turned that traffic into a labeled reference, and published it as a public article with eight platform pages and narrated audio. A reader can look up the field names catalogued from the recorded sessions and see what it holds, where it appears and whether that meaning was observed or inferred."
notion_url: https://app.notion.com/p/403992da7a5781549c62ef65f6569916
notion_last_edited: 2026-10-24T17:28:34.379Z
tags:
  - "AI search"
  - "research"
related:
  - "fanout-query-analysis-tool"
  - "ai-docs-watch"
---

### Explain the fields visible in AI search traffic

The agency's founder wanted a reference explaining the field names visible in AI search recordings. Those names are difficult to interpret on their own. I built a page for each platform so a researcher could look up an unfamiliar field and examine the recording behind its explanation, rather than start from raw traffic each time.

### Hundreds of recorded conversations as the raw material

The reference is built on browser recordings I made and cleaned in September for an earlier research project: 284 three-turn conversations across ChatGPT and its deep research mode, Gemini, Google AI Mode, Google AI Overviews, Claude, Perplexity and Brave. A teammate chose which sessions to record. I recorded them, removed personal and account data, and built a parser for each platform.

### Turn recordings into entries researchers can inspect

I built a pipeline to extract the AI apps' own requests and response fields from the recordings. It excluded trackers associated with visited websites, keeping unrelated web activity out of the reference. This turned a large set of recordings into entries a researcher could search and compare.

### What a reader can look up

Each entry explains what the field contains and links to an example from the recordings. A researcher can follow that example to check whether the proposed meaning fits the data they are examining.


The main article compares what each platform exposes, including whether its search queries are visible. That helps someone planning an investigation choose which records to inspect and understand where a platform leaves gaps.


### Label observations and interpretations

Entries distinguish visible data from an interpretation of what it means. Words such as “likely” make that uncertainty explicit, so a reader does not mistake the reference for official vendor documentation. Example values use safe placeholders rather than exposing account data.

### A version for listening

Some readers learn better by listening, so I added narration to the article and all eight platform pages: nine audio tracks generated from the published pages themselves. When the pages changed, I re-rendered the tracks from the new text and changed the file addresses so returning listeners got the new audio instead of a cached old one.

### Handing the pages to the founder

The first complete version went live on October 2, 2026, after a round of review notes from the founder that I applied everywhere the same issue appeared. Over the next two days, the founder rewrote and extended all the pages and added a check that keeps every required section in place.

My original generator could have replaced the founder's edits with older source material. I retired it and used the edited pages for subsequent updates, including narration. That preserved the editorial work and kept listeners on the same version as readers.

### Keeping the reference current as the apps change

The reference describes the apps as they behaved when the conversations were recorded in September 2026. AI apps change their traffic as they ship new models. On October 8, ChatGPT moved to a new model, and its answers started marking citations in a different way. I compared fresh traffic against the ChatGPT page the same day: 133 of its 183 labels still appeared. That comparison showed why the reference needs dated observations and fresh recordings. Researchers can check whether an entry still matches the traffic they see rather than assume the field will remain unchanged.
