---
title: "ContentDB: collect research and question your sources"
name: "ContentDB"
blurb: "Your articles and transcripts in one library you can search from a chat or from your AI assistant."
kind: built
status: "Open to anyone who signs up"
date: 2026-04-15
summary: "I built ContentDB to keep articles and video transcripts in one searchable library. It organises sources by client and adds a chat where you can bring a particular source into your question. It also gives a connected AI assistant tools to search the library and open a complete source."
voice: informal
notion_url: https://app.notion.com/p/403992da7a5781cfaff1de30c9c49f2f
notion_last_edited: 2026-10-31T09:35:09.780Z
links:
  - "Try ContentDB | https://contentdb.peaceakinwale.com"
tags:
  - "research"
  - "MCP"
related:
  - "aloud"
  - "okf"
---

Saving research is only half the job. Later you need to find the passage again, with enough of the source around it to tell whether it answers your question.

ContentDB is my own software project for that job. In the March to April 2026 build I connected a few ways of adding material to a web library with search and chat. I owned the interface and the server work, and directed AI coding assistants through both. Each saved item records its source URL and the client it belongs to.

### Bring articles and whole batches into one library

I added separate ways in for links and uploaded files. Batch imports bring in YouTube videos and sitemap pages. They all feed the same library, so you don't need a different place to search each format.

![image](images/contentdb/image.png)

Adding a group of sources needs more feedback than adding one article. Each item can take a while or fail on its own.

So batch imports run as jobs that show their progress and tell you what finished or failed, and the server limits how many sources it works on at once. You can follow a bigger import and see which items need a second look.

For document uploads, plain text goes into the library as it is. Other supported formats go through extraction first. I also added search by meaning, so you don't have to remember an item's exact title or wording to find it. Then you can open the stored text and read it in full.

### Group sources by client, and bring back a conversation's scope

In the April redesign, I organised sources by client instead of keeping a separate collections system. A writer can pick the client they're working on and search only that client's material. That makes it easier to get back to the right research without wading through sources saved for other assignments.

An earlier change also saves the selected client with each conversation. When you reopen a thread, the interface brings that selection back. You can pick up where you left off without setting the scope up again.

### Show the text around a quote

A short matching passage can leave out the sentence that explains it. So I added the surrounding context from the stored source. For transcripts it picks the relevant segment and includes the segments on either side. For other text, it includes the nearby sentences.

The assistant tools return that context with the source title and URL, where there is one. Chat also gets the source titles, plus instructions to say so when information is missing. That gives you something to check before you use an answer or a quote. A generated answer still needs checking. A guessed speaker label isn't a confirmed attribution.

### Bring a chosen source into the chat

Search helps when you're exploring a library. But sometimes you already know which article you want to talk about.

So I added a “Cite in chat” action. A writer picks a source and asks a question about it, and the server includes an excerpt from that source even if search would have missed it.

Say a writer brings in a saved customer interview and asks which passages back up a point in their draft. Long documents still need checking, because the excerpt has a length limit.

### Search and open the library from an AI assistant

I added an MCP connection, which lets a compatible AI assistant use tools inside another app. ContentDB's tools let an assistant search saved content and open a full item. They can also add material and find insights in customer transcripts. You can work from your assistant without copying each document into the conversation yourself.

I also changed the connection so a server restart doesn't break an assistant's session. You don't have to reconnect before carrying on with your research, and the older connection still works for assistants already using it.

![Historical demonstration of quotation context in an earlier ContentDB interface. The matching passage appears between the text before and after it; this is not a capture of the current UI.](images/contentdb/contentdb-quote-context-existing-demo.png)

*Historical demonstration of quotation context in an earlier ContentDB interface. The matching passage appears between the text before and after it; this is not a capture of the current UI.*
