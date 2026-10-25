## Portfolio summary

I built ContentDB with AI coding assistance to keep articles, video transcripts, documents and pasted text in one library. It ties importing, organising by client and search together with a chat where you can bring a particular source into your question. It also gives a connected AI assistant tools to search the library and open a complete source.

## Case study

Saving research is only half the job. Later on, you need to find the passage again, with enough of the source around it to tell whether it actually answers your question.

ContentDB is my own software project for exactly that. In the March to April 2026 build, I connected a few ways of adding material with a web library, search and chat. AI coding assistance helped me build across the interface and the server. Each saved item keeps its text along with details like its title, source URL, tags and which client it belongs to.

### Bring articles, documents and whole batches into one library

I added separate ways in for links, pasted text and uploaded files, plus batch imports for YouTube videos and sitemap pages. They all feed the same library, so you don't need a different place to search each format.

[[img]]

Adding a group of sources needs more feedback than adding one article, because each item can take a while or fail on its own. So batch imports run as jobs that show their progress and tell you what finished or failed, and the server limits how many sources it works on at once. You can follow a bigger import and see which items need a second look.

For document uploads, plain text goes straight into the library, and other supported formats go through extraction first. I also added search by meaning, so you don't have to remember an item's exact title or wording to find it. Then you can open the stored text and read it properly.

### Group sources by client, and bring back a conversation's scope

In the April redesign, I organised sources by client instead of keeping a separate collections system. A writer can pick the client they're working on and search just that client's material. That makes it easier to get back to the right research without wading through sources saved for other assignments.

An earlier change also saves the selected client with each conversation. When you reopen a thread, the interface brings that selection back, so you can pick up where you left off without setting the scope up again.

### Show the text around a quote

A short matching passage can leave out the very sentence that explains it. So I added the surrounding context from the stored source. For transcripts, it picks the relevant segment and includes the segments on either side. For other text, it includes the nearby sentences.

The assistant tools return that context with the source title and URL, where there is one. Chat also gets the source titles, plus instructions to say so when information is missing. That gives you something to check before you use an answer or a quote. A generated answer still needs checking, though, and a guessed speaker label isn't a confirmed attribution.

### Bring a chosen source into the chat

Search helps when you're exploring a library. But sometimes you already know which article you want to talk about.

So I added a “Cite in chat” action. A writer picks a source and asks a question about it, and the server includes an excerpt from that source even if search would have missed it. For example, a writer could bring in a saved customer interview and ask which passages back up a point in their draft. Long documents still need checking, because the excerpt has a length limit.

### Search and open the library from an AI assistant

I added an MCP connection, which lets a compatible AI assistant use tools inside another app. ContentDB's tools cover searching saved content, opening a full item, adding material and finding insights in customer transcripts. You can work from your assistant without copying each document into the conversation yourself.

I also changed the connection so a server restart doesn't break an assistant's session. You don't have to reconnect before carrying on with your research, and the older connection still works for assistants already using it.
