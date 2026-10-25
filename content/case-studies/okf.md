---
title: "Building an OKF that a team can ask for guidance"
name: "An OKF a team can ask"
blurb: "A founder’s notes turned into linked notes a team can question, with answers that cite the notes they came from."
kind: built
status: "in team use, private"
date: 2026-10-20
summary: "An OKF (Open Knowledge Format) is a folder of short notes, one idea per note, each recording where it came from, whether a person checked it and when it goes stale. I turned an SEO agency founder's 1.23 million words of notes into an OKF of 683 linked notes. The team can ask it questions and get answers that cite the exact notes they came from. I then built a kit that does the same for a client's own documents, which the client hosts themselves."
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

Open Knowledge Format stores knowledge as short, linked text notes that people and AI tools can read. Each note records its sources and review status, with a date for checking whether it is still current. That gives a team more context than an answer copied from an unlabelled document.

<figure class="video"><iframe src="https://www.youtube-nocookie.com/embed/esYAIA6lU-s" title="Build an OKF brain like mine! (Marie Haynes, YouTube)" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><figcaption>Marie Haynes walks through the OKF brain she built for her own SEO work: how a note is structured, how it differs from retrieval over whole documents, and approving an update plan before anything is added. 23 minutes, June 2026. The format itself is Google’s, and its <a href="https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md">specification is on GitHub</a>.</figcaption></figure>


### The founder's knowledge was scattered, and the team kept asking

The agency's founder had years of thinking spread across two Notion archives, an AI project and their own head. When the team needed an answer, they asked the founder, or asked an AI tool connected to the raw archives, which searched whole pages and gave uneven answers. The goal was a single, distilled source the team could ask instead, in the founder's own frameworks.

### 1.23 million words into 683 linked notes

I converted about 1.23 million words across more than 500 pages into focused notes, including concepts and playbooks. Related notes link to each other, allowing a teammate to move from an explanation to the procedure it supports. The reviewed snapshot contained 683 notes with 2,939 links.


### Ask a question, get an answer you can check

A teammate can ask how the agency handles a particular piece of work instead of searching the archives or waiting for the founder. The tool uses an index to select up to eight relevant notes, then reads them in full to prepare an answer grounded in that material.


I required source citations and a clear distinction for outside material. A teammate can open a cited note to check the instructions before using them. Its review status shows whether someone has checked the note or whether it still needs human scrutiny.


### Review proposed notes before publishing

New material can come from a URL, a Notion page, a YouTube video, a PDF or pasted text. Before anything is published, the tool screens it for secrets and personal data, extracts proposed notes and shows a plan: which notes it will create, which it will update and which links it adds. An admin approves or rejects the plan. If a publish turns out wrong, one click adds a reversing change, so nothing is ever silently rewritten.


I made the review step mandatory early on. The first version published new material automatically. After watching a long video turn into notes I hadn't seen, I switched it to plan-then-approve, so I could see exactly what was being added before it landed.

### Reserve verified status for human review

A person must approve a note before it receives verified status. Existing notes began unverified rather than receiving that label automatically. The distinction helps teammates decide what they can use with confidence and what they should check before acting.

### Build a client-hosted knowledge bundle

The agency then wanted to offer this to clients. I designed the client version so the client hosts it themselves with hosting costs handled by the client. A strategist or the client drops in files, a folder or a zip, and gets back a linked note bundle, a map and a website they can host.


A colleague has used the same skill to build a client bundle. Export checks look for agency keys and server addresses, helping keep internal access details out of a package handed to a client.

### What the build delivered

I directed the build with AI coding agents. The aim was to make the agency's knowledge usable when its key people were unavailable, while keeping review decisions with people. Teammates could ask for guidance and inspect the material behind the answer before applying it.
