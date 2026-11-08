---
title: "What AI search apps do before they answer: a public reference"
name: "A public reference to AI search traffic"
blurb: "What AI search apps send and receive while they answer you, explained field by field. Each explanation comes with the recording behind it."
kind: built
status: "Public reference"
date: 2026-10-02
published: 2026-10-25
summary: "A public reference to what AI search apps send and receive while they answer you. It covers every internal label ChatGPT, Gemini, Google AI Mode, Claude, Perplexity and Brave use in the background, explained from real recordings. My team recorded and cleaned 284 conversations, and I built the reference with the agency's founder in a few days. He now owns and edits it."
voice: informal
notion_url: https://app.notion.com/p/403992da7a5781549c62ef65f6569916
notion_last_edited: 2026-10-30T23:39:34.660Z
tags:
  - "AI search"
  - "research"
related:
  - "fanout-query-analysis-tool"
  - "ai-docs-watch"
---

### Thousands of internal labels that mean nothing on their own

When you record what an AI search app does while it answers, you get thousands of fields with internal names that mean nothing on their own. The agency's founder wanted a public reference that explains them, one folder per platform, plus a page on how they work together. He wanted it for a conference talk, and he asked for it overnight.

The recordings came first. My team recorded conversations in each app, and I built a cleaner that replaces personal values with stable placeholders. It finished at 284 sessions, every one passing a leak check twice. Before that, 51 of the first 89 files we delivered still carried live login cookies in a header the cleaner never read. We found it, re-masked all of them, and added the leak check.

### Every explanation says what was seen, apart from what was inferred

**Stop spending, and keep what's paid for.** The first runs on the company's API key cost $37 to $40 in an evening. "Stop spending money right now." Every later pass ran on subscription agents, and the pipeline learned to merge new work into what already existed instead of starting again.

**Say only what the recordings show.** An early draft ended each platform with "what you can do with it". I cut it. "We can be wrong about what you can do with it." Each platform now ends on what the labels mean. Every explanation separates what was observed from what was inferred, and links to the recording behind it.

![A reference entry explains a recorded field and links to an example, while marking interpretation as uncertain.](images/what-ai-search-apps-do-before-they-answer/telemetry-01-label-entry.png)

*A reference entry explains a recorded field and links to an example, while marking interpretation as uncertain.*

**Check the absences hardest.** The draft said several things were "not visible" in the recordings. A fact-check pass overturned five of those claims, and of 65 lines saying a label's purpose couldn't be seen, 59 turned out to have answers in the data. Google sends some of it as unnamed lists, which an extractor that looks for names can't see. Every absence is now checked by hand before it's published.

**One source of truth, his.** After the founder reviewed it, he rewrote all 19 pages himself. I didn't fold his edits back into the generator. His HTML became the single source, guarded by a check he wrote, and the generator now stops with an error if anyone runs it. One source edited in place beats two that drift.

**Hold a release when the data moves.** When ChatGPT changed its format, a strategist found that his citations had stopped parsing. A parser update was ready after three test chats. "We need more research first." I held it, adopted a teammate's parser after measuring both, and told the founder myself that his page described a citation format ChatGPT no longer sends.

### Eight platform folders where every example opens the exact line

A main article on how the labels work together, eight platform folders, a prompt readers can take to any AI tool, and narration of the pages in the founder's cloned voice. Every link to a recorded example opens the exact line, and all 3,708 resolve.

![The comparison summarizes what the recorded traffic exposed on each platform. It describes the recordings behind the reference, not a guarantee of current behavior.](images/what-ai-search-apps-do-before-they-answer/telemetry-02-platform-table.png)

*The comparison summarizes what the recorded traffic exposed on each platform. It describes the recordings behind the reference, not a guarantee of current behavior.*

### He used it for his talk, and two of my own wrong claims went out

The pages went live on the founder's site, held out of search until he was ready. He used them for his talk slides. Strategists check new recordings against them.

Two of my own wrong claims went out in one evening and I caught both. One described a refusal as a page the AI had opened, and one cited another product's recordings. A styling clash that made the labels look like they were floating was a shared class name. The audio estimate was wrong by half, 11,000 characters quoted against 21,733 measured.

I took a standing rule from it. When a platform we read changes, sweep every reader we own in the same session.
