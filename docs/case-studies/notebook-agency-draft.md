# Case study draft: Notebook Agency (Steve Toth)

**Status: draft, unpublished, not linked.** Lives at `/case-studies/notebook-agency` behind `published: false` in `lib/content/case-studies.ts`, marked `noindex`. To publish: set `published: true` and it joins the index, sitemap, and homepage record automatically.

**Sanitisation applied.** Removed from the source log: hourly rate, bonus structure, hours per week, revenue and MRR targets, internal staff names, tool credentials and IDs, internal file paths, commit hashes. Kept: what was built, the decisions, the lessons, and figures that describe the work rather than the deal.

**Before publishing, confirm with the client:** naming Steve Toth and Notebook Agency, the description of the LinkedIn tracker analysis, and the mention of the conference and coaching practice.

---

## Building the content operation behind a founder-led SEO agency

Notebook Agency is a B2B SaaS SEO agency in Toronto whose founder, Steve Toth, publishes constantly: a LinkedIn audience built on years of daily posts, two public notebooks of SEO and AI notes, a coaching practice, and a conference. The content was the business. The problem was that all of it ran through one person.

I joined in May 2026 as the content operator. The brief was to build the system that lets the founder's voice scale without the founder writing every word: a LinkedIn engine grounded in his own notebooks, a blog production pipeline for the agency, and the feedback loop that keeps both sounding like him.

### The challenge: a voice that could not be outsourced, and a calendar that could not be missed

Three years of the founder's LinkedIn posts told a clear story once I analysed the tracker: a small share of posts, the ones other people reposted, carried almost all of the engagement. One format, the "speaker announcement," averaged zero. Ghostwritten generic thought leadership was never going to work here. Every post had to come from something he had actually written or said.

At the same time, the agency needed a predictable monthly volume of posts and articles, reviewed by a founder with very little time, and published on a schedule that did not depend on anyone being awake.

### What I built: an engine that drafts from the notebooks, scores against a rubric, and learns from his edits

**Grounding.** Every post starts from a source: an entry in one of the founder's two public notebooks, a call transcript, or an industry item he has a position on. Sources live in a Notion database with their own metadata, and the engine reads the live page body at draft time. Nothing is invented. A verifier step cuts any claim it cannot trace to a source, and if it cuts too much the post is flagged for a human instead of being published thin.

**Scoring.** I turned an analysis of hundreds of his best posts into a 100-point rubric across six dimensions: hook, proof, structure, value density, emotional architecture, and close. Eight archetypes (how-to, curated list, myth-buster, origin story, and others) give each draft a shape. A draft that fails the rubric twice is still slotted into the calendar, marked for review, so the calendar never has an empty day.

**The feedback loop.** When the founder edits a draft in Notion, the engine diffs his revision against the original, classifies the change (voice, structure, proof, banned pattern), and stores it. A synthesis job clusters those edits and promotes recurring ones into rules the drafting agents read next time. His corrections become the style guide. Over the first month the engine also gained a colon rule, a positions library, and a list of banned openers, all from his edits rather than my guesses.

**Operations.** The pipeline runs as a scheduled service, not from my laptop: a monthly batch of roughly twenty-two posts generated in two waves with two human checkpoints, a real-time Notion webhook so a status change in the database schedules or cancels the post in the publishing tool within a minute, an image pipeline, and alerts to Telegram when anything fails. The founder's workflow is now: open Notion, read, edit, change a status.

### Beyond LinkedIn: the same system, pointed at the blog and the website

The blog pipeline reuses the engine's grounding and feedback layers for long-form agency articles. For the website rebrand I built a self-contained interactive preview of the new homepage so the founder and the design lead could react to a real page rather than a document; that file became the spec for the build. For the LinkedIn visuals, eight animated prototypes in a day isolated what "more personality" actually meant for this audience, and the winning direction became the first entry in a template library the engine now picks from per post.

### What I learned: three lessons worth keeping

**Audit the pipeline before trusting it.** Three review passes on the first version found nine production bugs the happy path never showed: silent fallbacks, a scheduler that could double-publish, tests that had drifted from the code. The audits took a day. The alternative was finding out in the founder's feed.

**Ask the API what it accepts.** Three wrong guesses at a publishing tool's schema cost three deploys. One introspection query fixed it. When an API can describe itself, that is the first move.

**"I'll know it when I see it" is legitimate feedback.** The visual direction took eight prototypes, each isolating one variable. That was not waste. It was the only way to find out what the founder was pointing at.

### Results

The engine is in production and the first monthly batches have shipped. Engagement deltas, newsletter and product signups attributed to the content, and conference ticket sales from the campaign are being tracked and will be added here once there is enough data to report honestly.
