---
title: "Building an OKF that a team can ask for guidance"
name: "An OKF a team can ask"
blurb: "A founder’s notes turned into linked notes the team can ask, and every answer cites where it came from."
kind: built
status: "in team use, private"
date: 2026-10-20
summary: "An OKF (Open Knowledge Format) is a folder of short notes, one idea per note. Each note records its source and whether a person checked it. I turned an SEO agency founder's 1.23 million words into an OKF of 683 linked notes. Answers to the team's questions cite those notes. Then I built a kit for clients to host themselves."
voice: informal
notion_url: https://app.notion.com/p/403992da7a578116ae4ee9a53710f316
notion_last_edited: 2026-10-24T22:18:34.889Z
links:
  - "Google’s OKF specification on GitHub | https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md"
  - "Marie Haynes on building an OKF brain | https://www.youtube.com/watch?v=esYAIA6lU-s"
tags:
  - "knowledge"
  - "OKF"
related:
  - "contentdb"
  - "quality-rater"
---

### What an OKF is

Open Knowledge Format stores knowledge as short linked notes that people and AI tools can both read. Each note records its sources and its review status. It also carries a date for checking whether it's still current. That gives a team more context than an answer copied out of an unlabelled document.

<figure class="video"><iframe src="https://www.youtube-nocookie.com/embed/esYAIA6lU-s" title="Build an OKF brain like mine! (Marie Haynes, YouTube)" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><figcaption>Marie Haynes walks through the OKF brain she built for her own SEO work. She shows how a note is structured and how it differs from retrieval over whole documents. 23 minutes, June 2026. The format itself is Google’s, and its <a href="https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md">specification is on GitHub</a>.</figcaption></figure>


### The team kept asking the founder, because the knowledge was scattered

The agency's founder had years of thinking spread across two Notion archives and their own head. When the team needed an answer, they asked the founder. Or they asked an AI tool connected to the raw archives. It searched whole pages and gave patchy answers. The goal was one distilled source the team could ask instead, in the founder's own frameworks.

### 1.23 million words into 683 linked notes

I turned about 1.23 million words from more than 500 pages into focused notes that include concepts and playbooks. Related notes link to each other, so a teammate can move from an explanation to the procedure it supports. The reviewed snapshot had 683 notes with 2,939 links.


### Ask a question, and get an answer you can check

A teammate can ask how the agency handles a particular piece of work instead of searching the archives or waiting for the founder. The tool uses an index to pick up to eight relevant notes, then reads them in full to put together an answer grounded in that material.


I made source citations a requirement, along with a clear marker for outside material. A teammate can open a cited note and check the instructions before using them. Its review status shows whether someone has checked the note, or whether it still needs a person to look it over.


### Review proposed notes before they're published

The tool takes new material in several forms. A URL, a Notion page, a YouTube video, a PDF or pasted text all work. Before anything gets published, the tool screens it for secrets and personal data. Then it pulls out proposed notes and shows a plan. The plan lists the notes it'll create or update and the links it'll add.

An admin approves or rejects it. If a publish turns out wrong, one click adds a reversing change. Nothing gets rewritten without a record.


I made the review step mandatory early on. The first version published new material with no review. After watching a long video turn into notes I hadn't seen, I switched it to plan-then-approve. That way I could see what was being added before it landed.

### Keep “verified” for notes a person has reviewed

A person has to approve a note before it gets verified status. Existing notes started out unverified, and none got the label without a review. That helps teammates tell what they can use with confidence from what they should check before acting on it.

### Build a knowledge bundle the client hosts

The agency then wanted to offer this to clients. I designed the client version so the client hosts it themselves and covers the hosting costs. A strategist or the client drops in a folder or a zip. They get back a linked note bundle and a website they can host.


A colleague has already used the same skill to build a client bundle. I added export checks that look for agency keys and server addresses, which helps keep internal access details out of a package handed to a client.

### What the build delivered

My aim was to make the agency's knowledge usable when its key people weren't around, while keeping review decisions with people. I set that review rule and directed AI coding agents through the build. Teammates can ask for guidance and check the material behind an answer before they act on it.
