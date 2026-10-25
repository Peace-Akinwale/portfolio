## Portfolio summary

I built a fanout query analysis tool for an agency's content strategists, turning a teammate's bookmarklet into a Chrome extension and a shared dashboard. It records the searches behind AI answers and tells apart the pages that came back from the pages that got cited. Strategists can check a client's visibility and send the recorded material to Claude for analysis.

## Case study

### AI answers come from searches the reader never sees

When someone asks ChatGPT which vendor to choose, it might search the web before it answers. If you can see those searches and the pages that came back, you can work out why a client showed up in the answer, or why it didn't.

### A teammate's bookmarklet proved the searches could be recorded

A teammate built a bookmarklet that captured ChatGPT's searches and the pages that came with them. Every prompt meant switching it on by hand, then downloading files and uploading them to Claude. The agency asked me to turn it into a Chrome extension. I added a shared workflow organised by client, so strategists could get back to their research without piecing together downloaded files.

### The extension records each answer while you use the AI tool as usual

A strategist picks a client, then uses ChatGPT, Claude or Perplexity the way they normally would. Each finished answer becomes a run, with whatever search records are available plus the response. That keeps the investigation organised as the strategist works through the client's questions.

[[img]]

There's a private switch for each site, so you can stop recording whenever you need to. The raw recording stays in your browser. Only the extracted records go to the team's shared database, and account and session identifiers come out first.

[[img]]

[[img]]

### Count returned pages and citations separately

The dashboard separates the pages that came back during search from the pages that were opened or cited. A strategist can see whether a client's page showed up in the results but never got cited, and then look at the other sources that were used. That gives them a specific visibility gap to dig into.

[[img]]

### Track brand mentions alongside website citations

A company can get recommended without a link, and its page can supply information without the company being named. The Brands page separates mentions from website citations, and records searches for the brand. So a strategist can describe the client's visibility accurately, instead of treating every appearance as the same thing.

[[img]]

### When the record is incomplete, the dashboard tells you what's missing

In the September recordings, some follow-up search wording wasn't available, even though the returned pages were there. Those rounds say “searches not recorded.” That stops a strategist from reading missing information as proof that no search happened.

[[img]]

The Review page lists the questions where the client was missing from at least one complete run. Strategists can look at the supporting recordings and mark questions as reviewed, which gives the team a shared queue of gaps to look into.

[[img]]

### Test a whole question set at once, labelled as simulated

I added a background service that runs a client's question set through OpenAI's API with web search switched on. That lets the team look at more answers without typing every prompt by hand. These runs are labelled simulated, so you can always tell them apart from recordings made in the consumer apps.

### Send results to Claude in one click

Send to Claude opens a run, or a filtered set of runs, with the team's analysis instructions and the recorded material already included. So the strategist can dig into the responses without moving files around by hand. Reports can also be exported for more analysis. The goal is for the strategist to analyse every response they get, and build a dashboard for the client if they want one.

I directed the build with AI coding agents between August and October 2026, setting the requirements and checking captures against the raw recordings. A teammate's bookmarklet was the starting point. Each run describes one answer at one moment, and future answers can be different.
