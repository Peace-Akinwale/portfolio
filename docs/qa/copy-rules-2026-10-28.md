# Copy rules for peaceakinwale.com (Peace, 28 Oct 2026)

These apply to every page the site builds. They sit on top of the informal voice already in place.

## 1. No rule of three inside a sentence
Peace: "I hate rule of three." A sentence never lists three or more items ("a, b and c", "a, b, c", "a, b, or c").

- **Default fix:** keep the two items that matter most and drop the rest.
  - Before: "I built the monitoring, the archive and the public site."
  - After: "I built the monitoring and the public site."
- **When the items are facts that must stay** (platform names, named factors, the steps of a procedure), give the list its own sentence so the sentence before it carries the point.
  - Before: "AI Docs Watch watches the docs of Google, Gemini, OpenAI, Anthropic, Bing and Perplexity every day."
  - After: "AI Docs Watch watches six platforms' docs every day. Google, Gemini, OpenAI, Anthropic, Bing and Perplexity."
- A bulleted list with three bullets is fine. The rule is about sentences.
- Two clauses joined by a comma are not a list. Leave those alone.

## 2. Never the word "quietly"
Replace with what actually happened ("without an announcement", "with no note in the changelog") or cut it.

## 3. Paragraphs you can read on a phone
A paragraph makes one point and stays under about 60 words. Split a longer one where the point shifts (setup, then what happened, then what it means). A one-sentence paragraph is fine when it carries the section's point. A fourth sentence is fine when it closes the point and the paragraph is still under the limit. Never split mid-point just to hit a count.

## 4. Already in force, keep them
- No em dashes. No semicolons. No colon-led sentences in prose (a colon inside a quoted title is fine).
- Every number stays, and no number is added. Every quoted phrase stays word for word (`tests/content/informal.test.ts` checks this for the case studies).
- Other people's words are untouchable: client testimonials, the founder's quotes, Peace's approved passages (`APPROVED_BODY` in `lib/content/record.ts`, the two approved service passages in `lib/content/home-copy.ts`).
- Keep the `[[img]]` markers in `content/informal/*.md` exactly where they are, and keep the heading `### What an OKF is` in `okf.md` (the importer inserts the video after it).
- Keep the facts. Shortening a list is fine. Changing what happened is not.

## Checking
`node scripts/qa/triplets.mjs` lists every candidate sentence (some are two-clause false positives, read them). The 60-word check is in the same script's companion snippet in decisions.md for 2026-10-28.

## 5. Peace is the authority, AI is a tool she directs
Peace: "don't make it seem as if without AI I can't work." She has a background in cybersecurity and builds and secures software with her own judgement. Never write the cybersecurity part out, and never lean on it. Present her as the expert.

- Don't open a section or a sentence with the AI tooling ("I built it with AI coding agents", "AI-assisted"). Lead with what she decided, designed, checked or secured. If the tooling earns a mention, it comes after, as the tool she directed: "I set the product rules and the account-protection rules, and directed coding agents through the build."
- Never "AI did most of the code" or "the agents wrote it". Say what she owned: the requirements, the architecture, the security rules, the review against the source, the fixes.
- Watch for hedges that make her sound junior: "I tried", "I managed to", "with help from". Cut them.
- The services page's "Building" section and every case study's build paragraph get this treatment.

## 6. No adverbs
Peace: "keep an eye out for every adverb and remove them. I don't think we need them."

- Cut every manner and degree adverb: the "-ly" words (quickly, exactly, actually, simply, silently, slightly, easily, carefully, manually, automatically, properly, usually, completely, mostly, really, finally), and the degree words very, quite, pretty, just, almost, basically, truly, fairly.
- If the adverb was carrying a fact, replace it with the fact. "It checks the page automatically every day" becomes "It checks the page every day on its own schedule". "The rewrite missed it completely" becomes "The rewrite missed it".
- Words that set time, place or logic stay when they're doing work and go when they're filler: not, never, now, then, still, also, only, already, here, there, before, after, first, once, daily. Read each one. "I also added search" usually survives. "It still works fine" loses "still" and "fine".
- Adjectives ending in -ly are not adverbs (daily digest, early September, friendly, likely). Nouns aren't either (family, reply, assembly).
- Check with: node scripts/qa/triplets.mjs --adverbs

## 7. Writing goals and principles (Peace, 29 Oct 2026, verbatim)
Every rule above serves these. When a rule and a goal pull apart, the goal wins.

With every piece of content we publish, we aim to:

* Empower. Help people understand my work by using language that informs them and encourages them to make the most of what I do/offer.
* Respect. Treat readers with the respect they deserve. Put yourself in their shoes, and don’t patronize them. Remember that they have other things to do. Be considerate and inclusive. Don’t market at people; communicate with them.
* Educate. Tell readers what they need to know, not just what we want to say. Give them the exact information they need, along with opportunities to learn more. Remember that you’re the expert, and readers don’t have access to everything you know.
* Guide. Think of yourself as a tour guide for our readers. Whether you’re leading them through our educational materials or a task in our app, communicate in a friendly and helpful way.
* Speak truth. Understand my place in my potential client's lives. Avoid dramatic storytelling and grandiose claims. Focus on our real strengths.

In order to achieve those goals, we make sure our content is:

* Clear. Understand the topic or what you’re writing about. Use simple words and sentences.
* Useful. Before you start writing, ask yourself: What purpose does this serve? Who is going to read it? What do they need to know?
* Friendly. Write like a human. Don’t be afraid to break a few rules if it makes your writing more relatable (so important, which is why a little bracket, huh, wanna, etc. is good). All of our content, from splashy homepage copy to case studies to thought leadership, should be warm and human.
* Appropriate. Write in a way that suits the situation. Just like you do in face-to-face conversations, adapt your tone depending on who you’re writing to and what you’re writing about.

In practice: write to the reader ("you", "your team"), say what they get, and let a bracket or a casual word in where it makes a line sound like a person talking.
