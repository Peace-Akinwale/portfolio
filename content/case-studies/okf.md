---
title: "I built an OKF"
name: "I built an OKF"
blurb: "A founder’s expertise organised into searchable notes, so the team can find and use relevant explanations without working through the whole archive."
kind: built
status: "An SEO agency’s team"
date: 2026-07-02
published: 2026-10-25
summary: "Turning a founder’s archive into a searchable knowledge base, with source links and records of how extracted notes were checked."
voice: informal
notion_url: https://app.notion.com/p/403992da7a578116ae4ee9a53710f316
notion_last_edited: 2026-10-30T23:40:13.813Z
tags:
  - "knowledge"
  - "OKF"
related:
  - "contentdb"
---

A founder can spend years explaining their ideas and approach to operations in articles, newsletters, and even via Slack DMs and emails. That knowledge is valuable to the team, but they won’t necessarily be able to replicate the founder’s thought process or POV when the founder is absent.

I built a knowledge base using Google’s Open Knowledge Format (OKF) to organize the founder’s material into linked notes the team can search and ask questions about. Someone working on a brief can find relevant context from this OKF and check its source before relying on it.

## What is an OKF?

An [OKF bundle](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) is a folder of linked Markdown files, which are text files that people and AI tools can read. Each note explains a concept or process and can record where the information came from, whether it has been reviewed, and when it needs checking again. This gives an AI tool a way to find relevant knowledge and see what supports it before using it in an answer.

[Marie Haynes’ article and walkthrough](https://www.mariehaynes.com/okf/) first put OKF on our radar. My boss shared them with me in June 2026 and asked me to build one. I used his existing SEO and AI notes and newsletters as the source material, so the team could ask questions about ideas he had already explained.

## How it works

The [OKF documentation on GitHub](https://github.com/GoogleCloudPlatform/knowledge-catalog/tree/main/okf) has guidance on how to create and use a bundle. I used that guidance to organize the source material into searchable notes that AI tools can read. The approach follows Andrej Karpathy’s [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): extract ideas from the sources, connect related notes, and maintain that knowledge as new material comes in.

This structure makes it easy to find a specific idea and explore the related material, even when the person searching doesn’t know the exact phrase used in the original.

For example, I made a small demo using my own writing process. Someone can ask, “How do you make a product useful inside an article?” and see an answer that connects how I research the reader’s needs, use the product, and choose examples that explain what the reader can do with it. They can open the supporting notes and read my original wording beside the explanation.

![Demo using Peace’s own writing notes, with an answer and supporting sources](/case-studies/okf/okf-demo-desktop.png)

The source link matters because the context may change how a note should be used. An answer about a particular situation shouldn’t quietly, unintentionally become advice for every situation. Nuances matter.

I kept source references and quotations with the notes and made the answerer distinguish the founder’s own views from outside material. I also added a review step for new notes that conflict with an established position. Those notes are held out of answers until someone resolves the conflict, so new material doesn’t silently replace the founder’s existing guidance.

## Record what has been checked

Extracting a note and checking it are separate tasks. I manually reviewed all 500 notes in my client's OKF because [OKF v0.2](https://cloud.google.com/blog/products/data-analytics/okf-v0-2-adds-trust-signals/) adds fields for recording who created a note and who verified it, so an AI-generated note (because AI is behind organizing it) won't be treated as though a person has checked and approved it.

AI tools can hallucinate, including when they turn source material into notes. I designed the answerer to use the notes it had read, cite them, and say when the knowledge base didn’t cover a question. That doesn’t make errors impossible, but it gives the team something specific to check instead of an answer with no source behind it.

And you may ask, how is this different from asking an LLM to explain your SOP based on what you’ve fed it before?

An LLM can explain an SOP you upload. The difference here is that the team has a shared set of linked notes they can inspect, correct, and reuse across different needs and questions (and AI tools). The sources and review records stay with those notes, rather than depending on what someone supplied in a particular chat.

This allows the team to use the founder’s thinking while preparing a brief or working through a problem, check the reasoning behind an answer, and ask a more specific follow-up when they need the founder’s input.
