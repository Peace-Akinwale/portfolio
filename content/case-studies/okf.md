---
title: "Building an OKF that a team can ask for guidance"
name: "An OKF a team can ask"
blurb: "A founder’s notes turned into linked notes the team can ask, and every answer cites where it came from."
kind: built
status: "An SEO agency’s team"
date: 2026-07-02
summary: "An OKF a team can ask. I turned an SEO agency founder's archive, about 1.23 million words across 534 Notion pages, into a knowledge base of linked notes in Google's Open Knowledge Format. The team can ask it questions and every answer cites the note and the source behind it. The hard part was trust, so a person's review and a scripted source check carry different labels."
voice: informal
notion_url: https://app.notion.com/p/403992da7a578116ae4ee9a53710f316
notion_last_edited: 2026-10-30T23:40:13.813Z
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

### An OKF is a set of short linked notes that remember their sources

An OKF is a set of short notes, one idea each, linked to each other and to the source they came from. Google published the format, and its specification says how a note records where it came from, when it was last checked and who checked it. An AI tool can answer from those notes instead of guessing across whole documents.

<figure class="video"><iframe src="https://www.youtube-nocookie.com/embed/esYAIA6lU-s" title="Build an OKF brain like mine! (Marie Haynes, YouTube)" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><figcaption>Marie Haynes walks through the OKF brain she built for her own SEO work. She shows how a note is structured and how it differs from retrieval over whole documents. 23 minutes, June 2026. The format itself is Google’s, and its <a href="https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md">specification is on GitHub</a>.</figcaption></figure>


### 1.23 million words the team couldn't tell whether to trust

The founder's thinking sat in two Notion archives. The agency asked for a brain the team could query, hosted like a site. I built the first version in two days, with extraction, search, a graph and a Claude connector.

Three weeks later a teammate asked me on a call how we could trust it wasn't making things up. I had to walk him through it at length. That call set the real job. I wrote it down that day. "What makes this fresh? What makes this reliable? Does this still match the reality of today?"

![The knowledge map shows connections between notes in different layouts. This is a historical screen; the on-screen totals belong to that capture.](images/okf/okf-06-graph-dark.gif)

*The knowledge map shows connections between notes in different layouts. This is a historical screen; the on-screen totals belong to that capture.*

### A person's review and a script's check never share a label

**Build to the specification, not a guess at it.** When Google published version 0.2 with trust signals, I read the spec itself and planned field by field. "I think we need to do it right based on what v2 says."

**Keep who wrote it apart from who checked it.** My first reaction was that everything should count as verified, because the founder wrote all of it. Then the distinction landed. He wrote the notes. An AI wrote the cards from them, and nobody had checked those. So all 470 cards shipped unverified, and I asked for a way to fix that by hand. Each note got a Mark as verified button, and later each row of the list did too. A script was never allowed to write a person's name into the verified field, because that would forge a review in something the team relies on.

![Source and human-review information on an individual note.](images/okf/okf-02-note-trust.png)

*Source and human-review information on an individual note.*

**Don't show it to the founder before I trust it.** Before the release I stopped. "No need to show Steve. I, myself, haven't seen it. I don't know what to trust here." I asked for a full check against the specification first. It found 43 clauses met and two small failures, and both were fixed before I shipped it.

**Review before anything lands.** New material goes through plan-then-approve. The tool screens it for secrets and personal data, then shows the notes it would create and the links it would add, and a person approves the plan. The weekly import of the founder's own new posts is the one exception, and it still runs the screening.

**Clients host their own.** When the agency wanted to offer OKFs to clients, the first plan was to host them. I changed it the same day. The client takes away a self-contained kit and hosts it, and the agency pays nothing for their usage after the build. The export refuses any file that carries the agency's servers or keys. Each run states up front how much it will read, about 400,000 words, and reads exactly that.

### Ask with citations, plus a kit clients host themselves

The OKF app has Ask with citations, Browse, a Graph, note pages with their trust badge and source link, an approval queue, and single and batch verify. A Claude connector lets the team ask from Claude. The client kit turns a client's own files into a hosted bundle. A demo kit read 101 documents into 331 notes for $4.60 in 48 minutes.

![The client-kit input screen, where a build starts with the client’s own source files.](images/okf/okf-05-build-kit.png)

*The client-kit input screen, where a build starts with the client’s own source files.*

### 683 linked notes, with 382 checked against their source

The archive became 683 linked notes with 2,939 links. A source check against the original Notion pages confirmed 382 of the first 470 cards, challenged 61 and flagged 20 as out of date. Those 381 confirmed cards carry a separate "Fact checked and confirmed" label from that check. The verified label stays for notes a person has reviewed.

I found several faults myself by using it. Badges I couldn't see turned out to be a cached old build. A note written in 2023 showed a 2024 date, because the importer stored Notion's last-edited time. The field was renamed to say what it is. 255 index files were counting as concepts, and removing them took the graph from 726 nodes to 470. Later, approvals started failing in silence. There were three causes, and 15 wrongly rejected items were recovered.

When I caught myself redesigning screens to my own taste, I stopped. "Let's not do this based on what I say. What's a good way to handle this?" Each screen now has a one-sentence job and five rules for changing it.
