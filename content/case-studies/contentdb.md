---
title: "ContentDB: collect research and question your sources"
kind: built
status: "my own app, private beta"
date: 2026-04-15
summary: "I built ContentDB with AI coding assistance to collect articles, video transcripts, documents and pasted text in one library. The build connected importing, client-based organization and search with a chat where you could bring a particular source into a question. It also gave a connected AI assistant tools to search the library and open a complete source."
notion_url: https://app.notion.com/p/403992da7a5781cfaff1de30c9c49f2f
notion_last_edited: 2026-10-24T17:27:15.832Z
links:
  - "The ContentDB project page | /projects/contentdb"
tags:
  - "research"
  - "MCP"
related:
  - "aloud"
  - "okf"
---

Saving research is only the first part of using it. Later, you need to retrieve the passage with enough source context to judge whether it answers your question.

ContentDB is my personal software project for that workflow. In the March–April 2026 build, I connected several ways to add material with a web library, search and chat. AI coding assistance helped me build across the interface and server. Each saved item kept its text alongside details such as its title, source URL, tags and client association.

### Import articles, documents and batches into one library

I added separate entry points for links, pasted text and uploaded files, along with batch imports for YouTube videos and sitemap pages. Those sources fed the same library, so you didn't need a different place to search each format.

![contentdb add content demo](images/contentdb/contentdb-add-content-demo.png)

*Existing portfolio capture of the import screen with demonstration data; capture date unverified.*

Adding a group of sources needed more feedback than adding one article. Each item could take time or fail on its own. Batch imports ran as jobs with progress and completion or failure information, while the server limited how many sources it processed at once. That gave you a way to follow a larger import and see which items needed attention.

For document uploads, plain text could go straight into the library; other supported formats went through extraction. I also added search by meaning, so finding an item didn't depend on remembering its exact title or wording. You could then open the stored text to examine it.

### Group sources by client and restore a conversation's scope

During the April redesign, I organized sources by client rather than keeping a separate collections system. A writer could select the client they were working on and search that client's material. That made it easier to return to the right research without sorting through sources saved for unrelated assignments.

An earlier change also saved the selected client with each conversation. When you reopened a thread, the interface restored that selection. You could return to the research you were doing without setting up its scope again.

### Show the text around a retrieved quotation

A short matching passage can leave out the sentence that explains it. I added quotation context from the stored source. For transcripts, the implementation selected a relevant segment and included neighboring segments; for other text, it included nearby sentences.

The assistant tools returned that context with the source title and URL where available. Chat also received source titles and instructions to acknowledge missing information. That gave you material to inspect before using an answer or quotation. A generated answer still needed checking, and an inferred speaker label wasn't verified attribution.

### Bring a chosen source into chat

Search is useful when you're exploring a library. Sometimes you already know which article you want to discuss.

I added a “Cite in chat” action so a writer could choose a source and ask a question about it. The server included an excerpt from that source even if the search results would otherwise have missed it. For example, a writer could bring in a saved customer interview and ask which passages support a point in their draft. Long documents still needed checking because the excerpt had a length limit.

### Search and open the library from an AI assistant

I added an MCP connection, which lets a compatible AI assistant call tools in another application. ContentDB's tools covered searching saved content, opening a complete item, adding material and finding customer-transcript insights. You could work from an assistant without copying each document into the conversation yourself.

I also changed the connection so a server restart would not invalidate an assistant's session. That reduced the need to reconnect before continuing the research. The older connection remained available for assistants already using it.
