# AI OS (skills and working context), personal product: case study log

A running log of Peace's own AI working system: the skills, instructions and shared context that Claude Code and Codex load for every job. Updated as deliverables land. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Peace Akinwale (own product).
- **Stack:** Claude Code skills under `~/.claude/skills`, a shared context repo mirrored to a private GitHub repo, and the models in use at the time: Claude Opus 5.5 and Fable 5.1.
- **Method:** audits against the model vendor's current prompting documentation, and blind with-and-without tests judged by a separate agent.

---

## 2026-11-08, 58 skills audited against the current models, 21 retired, and the most-used skill rebuilt after it lost a blind test

Written the same day, from the audit report and its evidence folder in the AI OS repo, the skill backups, and test runs in the session.

### What shipped

- **An audit of all 58 skills** against the current prompting guidance for Opus 5.5 and Fable 5.1, with a verdict per skill and a full backup taken before any change.
- **21 skills retired** (moved to a backup folder, not deleted): duplicates, skills their own authors had withdrawn, Windows-era tools on a Mac, and a design skill that lost its blind test. 37 remain.
- **The handoff skill rebuilt** from 273 lines plus four reference files to about 85 lines.

### Decisions worth recording

- **Test removal, don't just read.** Three skills ran on the same task with and without the skill, judged blind. Two made the output worse: the old handoff skill produced 2,162 words, repeated its done-list five times and invented decisions, against 970 words and nothing invented without it; a design skill made a more generic page in more than three times the time. One, a writing-cleanup skill, helped slightly.
- **Rebuild, then test again.** The new handoff skill keeps only what a fresh session cannot recover, says each fact once and sets no length target. On the same fixture a blind judge scored it 9 on one model and 8 on the other, against 7 for no skill.
- **Keep what the owner chooses.** Three design presets the audit marked as overlapping were kept as call-by-name tools because the owner wanted them.

### Frictions and course corrections

- **The audit's own numbers needed a recount.** The first count of unused skills said 35; a looser match that caught sub-agent and plugin calls found 32. The report was corrected, and the retire list was recounted from 22 to 21.
- **A sub-agent claim was wrong.** An auditor said a vendor's update command never removes retired skills; the vendor's own change note said it does. The real cause was a different installer that only refreshes surviving skills.

### Why this matters for the portfolio

- Instructions written for older models can make newer ones worse. The way to know is to remove them and measure, not to reason about it.
- Findings from delegated agents are hypotheses. The two corrections above came from checking them against the source before reporting.

---

## 2026-11-10 to 2026-11-11, a design method for agent-built screens that starts from what the screen is for, not how it looks

Written the day after, from the skill folder and its decisions log, the research folder and its test record, and the skills repo's commits.

Peace asked for one dependable system so that agents building apps, tools and marketing pages produce work that reads like a pre-AI top team made it, on the first build: understood without explanation, simple to move through, every word earning its place. He asked for it to be researched from reliable authorities, talks and real screens.

### What shipped

- **A skill, `structure-first`, with nine steps in a fixed order:** the job the screen does, the things it shows, the map between screens, the screen type, the words, the states, a grey clickable skeleton, then the look, then a check. Each project gets one written blueprint that every later session reads before changing a screen.
- **A research base behind every rule:** published guidance from platform and design-system authors, recorded talks, and screenshots of 117 app screens and 46 marketing pages from products people called intuitive.
- **A screen checker** that loads a page in a browser and fails it on measurable faults: tap sizes, contrast, line length, type sizes, overflow, unlabeled controls. It accepts the owner's deliberate exceptions from a file, each with its reason, instead of silencing the check.
- **A first test, one brief built twice:** 52 checker failures without the method, 0 with it. A fresh agent that saw only screenshots understood one of three screens clearly better. Recorded as one run, not as proof.
- Published to Peace's skills repo on GitHub, with later commits adding the checker fixes and three lessons from the first real use.

### Decisions worth recording

- **Structure before style.** An audit found about 20 installed design skills, all working on looks and contradicting each other, while Peace's recorded complaints were about understanding ("i need to click around"). The method puts every decision about looks after the job, the words and the states.
- **The owner sees a grey skeleton, not a styled draft.** It is the one point where work is shown before it is finished, so structure is judged before color can distract from it.
- **Exceptions are data, not code.** A deliberate choice such as a white label on the brand red is written into an accepted-findings file with its reason, so the checker stays strict for everyone else.

### Frictions and course corrections

- **The first real use exposed checker false positives:** closed disclosure panels, disabled controls, a file input inside its label, gradients on form controls and hairline shadows were all flagged. Each was fixed in the checker and pushed.
- **Three of its own rules were missing** and were added after that use: say why background work is not moving, state the coverage of any number built from partial data, and make tables answer to their container at half a laptop screen.
- **Peace stopped a report that came while agents were still running:** "Finish what you started before you tell me." Reporting now waits until the work is checked.

### Why this matters for the portfolio

- The useful constraint on AI-built interfaces is not taste but order: settle what the screen is for and what it says, then style it, then measure it.

---

## 2026-11-18, a draft scorer that says what to change, why the data supports it, and writes the fix on request

Written at the end of the session, from the AI Search Lab repo's commits (`04045be` to `9e41753`), its decisions log (D41 to D45) and its status log.

The AI Search Lab scores an article draft against what ChatGPT, Claude, Perplexity and Google AI Mode cited in about 1,800 recorded sessions. A score alone left Peace asking "what do i do with what i got?" This session turned the score into a list of actions, each one traceable to the recordings, and added a way to have the missing pieces written.

### What shipped

- **What to do next, in four groups:** edit the draft, fix when you publish, needs a different page, and not worth changing. Each fix shows the points it would add on each AI tool, worked out by re-scoring the draft with that one thing changed. Checked against a real re-score of a client draft: within 1 point on every tool.
- **"Why, and what instead" on every fix:** what the recordings showed, how sure we are (Strong, Some or Weak evidence), what cited pages of the same kind had, and a reason labelled as a guess. "How sure" compares like with like: pages of the same type in the same answer, with the dominant sites removed.
- **Write it for me:** one paid model call writes a meta description, title, URL, intro, summary or a comparison table, from the draft's own facts only. The price is on the button and the real cost is shown after.
- **Suggested title, meta description and URL,** written against today's top Google results for the draft's main searches and the recorded patterns for that field. Each comes with a "why this" line and the Google results it competed with. Use it, which scores a new version and shows each tool's score before and after, or dismiss it, with undo.
- **Real tests cost about 13 US cents in all.** A meta description suggestion took about 45 seconds and 4 cents. Layout checks passed with 0 failures on 12 views. A fresh reader's findings were fixed before the work was called done.

### Decisions worth recording

- **Every recommendation shows what it rests on.** Peace: "I need to be able to answer all of these things when I'm using the app so that I won't just take what it says for what it says." The check behind this changed the advice. On one rule, the raw gap (3.4% against 12.6%) shrank to 4.0% against 6.1% when pages were compared like for like, and two sites supplied 58% of the pages with the trait.
- **Weak evidence is not advice.** A fix whose gap disappears among comparable pages moves to "not worth changing" instead of appearing with a low-confidence badge.
- **One signal for certainty.** An earlier build showed both an asterisk and a badge. A fresh reader could not tell them apart, so the badge stayed and the asterisk went.
- **The writing model was chosen by the owner's taste, with the alternatives priced.** Newer models were on the key, and one had a strong writing review. Peace kept the one he liked, because the price difference was cents per click.

### Frictions and course corrections

- **Measuring each fix on checked rules only gave numbers a real re-score did not match.** It was switched to the full formula. The less certain part of each estimate moved under "may also move".
- **A missing meta description was a false alarm.** The client's doc wrote "Meta description:" as a line of text at the top. The scorer now reads those labelled lines, and every saved draft was scored again.
- **Peace rejected the first explanation panels as unclear:** "be clear, be straight to the point, and leave only information a reader would need." They were cut to four short rows with whole percentages.
- **Saved advice went stale after code changes.** One test request hit the old server just before its restart and saved stale advice again. The lesson went into the bug-hunt pattern library.
- **A large score jump is labelled as an estimate.** One suggested meta description moved a tool's predicted score from 38 to 65. That is the formula's estimate, not an observed change in what the tool cites.

### Why this matters for the portfolio

- An AI recommendation is only usable when the person acting on it can see what it rests on and how sure it is. Building that in changed which recommendations survived.

---

## 2026-11-24, a day of the owner's own fixes, then a whole-app bug hunt that fixed 15 bugs, each reproduced before it was touched

Written at the end of the session, from the AI Search Lab repo's commits (`988f277`, `8b3508a`), its decisions log (D189 to D201) and the test runs of that session.

The draft scorer was under a feature freeze so Peace could use it for real work. Using it, he hit friction and asked for fixes one at a time, then asked for a bug hunt over the whole app, "not just what you just did now".

### What shipped

- **Fixes from real use:** a heading that stays under the pointer when a section opens or closes (it jumped 629 pixels before); Google Docs imports and pastes that keep the doc's Title as the main heading and image captions as small print; a progress line, with honest wording and no fake percentage, for every wait on an outside service; a client added in place from the draft form, with nothing typed lost; a new client's likely competitors suggested by one small model call, to check before saving.
- **A whole-app bug hunt:** three read-only reviewers covered the server, the import and paid-service code, and the front end, and returned 32 candidates. The most serious were reproduced before any fix, and 15 were fixed. Examples: a draft that merely mentioned an HTML tag in its text was cut off at that point on save; a paragraph starting "Title tags are..." was read as the page title and removed from the body; accepting a second rewrite silently dropped the first; a slow paid call could take over the buttons of whatever record was on screen when it came back.
- **Checks:** the server suite passed with new regression checks, and the browser suite passed 312 of 312 on a copy of the database. Each fixed bug's reproduction script was run again and showed the bug gone.

### Decisions worth recording

- **No fix without a reproduction.** A reviewer's report was treated as a hypothesis. Findings that depend on how an outside service really behaves, such as Google Docs suggestions arriving as text, were reported as unconfirmed and left unfixed rather than guessed at.
- **Waits say what is happening, not a made-up percentage.** The server cannot report real progress, so the bar eases toward the end and fills only when the answer is back. The time limits quoted are the app's own timeouts, not estimates.
- **A label for the owner's real content, without retraining.** An opinion piece with tips did not fit the page types. The existing type was renamed to include thought leadership, with a rule for mixed pages, because the scoring model's categories cannot change without new data.

### Frictions and course corrections

- **The hunt found a bug in a fix made earlier the same day.** The "keep the heading in place" fix scrolled the page even when the section sat in a side panel with its own scrollbar, so the draft jumped instead. It now scrolls whatever actually contains the section.
- **A new feature broke test isolation.** Keeping an unscored draft in the browser made later test walks start with an earlier walk's text. The fix lives in the test harness, so the feature stays as built.
- **A clean slate meant more than drafts.** Peace asked for one, the drafts were deleted, and he came back: "you didn't remove existing clients nor did you add a button where i can delete them myself." The clients went too, a backup was kept, and every client row now has a visible Remove button.
- **One paid call was not made.** The new competitor suggestion was tested with a fake model only. It copies a request shape the app already uses successfully, and the handoff names it as the first thing to check if it fails.

### Why this matters for the portfolio

- Using the product for real work surfaces different problems from building it. Treating every bug report, including an AI reviewer's, as a claim to reproduce first kept the fixes on real defects and off noise.

---

## 2026-11-24, the outline AI was guessing its structure; now it reads how the pages the AI tools cited were built

Written at the end of the session, from the AI Search Lab repo's commits (`8df20eb`, `af5cf8f`, `433b91f`, `a789129`), its decisions log (D202 to D205) and the test runs of that session. It follows the earlier entry for the same day.

The draft scorer's "Outline a new page" screen hands a writer an outline before they write. Peace rearranged it from a ten-change review, then asked the question that mattered: "Is there an AI behind this outline page and does it get its idea on how to structure based on our contexts of multiple pages the AI platforms cited?" It did not.

### What shipped

- **Outlines grounded in cited pages.** For the recorded questions closest to the writer's, the app now reads the pages the AI tools actually cited, from recordings already on the machine, and pulls each page's own H1 to H3 in order, pages of the chosen kind first. The screen shows them under "How cited pages were built", with a link to each, and the outline AI is given them and told to follow what they cover, in its own words, never copying a heading. A written outline records which pages it drew on. For the onboarding question on screen, three how-to guides came first; a vendor homepage, cited more often but useless as a model for a guide, was left out.
- **The screen says what the AI is.** "How this outline was made" names the model, what it was given, what it was not given (the client's site or documents), and, for an outline written before this change, that its sections were the model's own judgement.
- **The review's fixes, across the app.** A way back from pages reached by a link, a draggable divider between the document and its side panel, Google results that link to their pages, and every heading marked with its level.
- **The bug hunt's lower-severity findings fixed,** among them: one client per name, real searches for questions in other languages (they produced the search "2026"), whole-word client-name matching, one paid call at a time, and tables reaching the paid model as rows rather than run-together cells.
- **An origin check.** The local server now refuses changes and paid calls from any other website, and requests sent under another site's name.
- **Checks:** the end-to-end suite passed 325 of 325 and the first-run walk 19 of 19, after the last change.

### Decisions worth recording

- **Show the AI's inputs on the screen, not only in the code.** A writer judging an outline needs to know whether its structure came from evidence or from the model. The page says which, per outline, including the old one that predates the change.
- **Ground structure in the recordings, not a new paid search.** The cited pages and their saved copies already existed from the research phase, so grounding costs nothing per outline. The writing call grew by about 0.3 cents; the 15-cent cap held.
- **A paid call is never made to test this.** No outline was rewritten with the new grounding; that first real call was left to Peace.

### Frictions and course corrections

- **The tests had been paying.** A morning feature asks an AI model for a new client's competitors the moment a name is typed. An older end-to-end walk types a client name, so roughly nine full test runs each made one or two real paid calls. It surfaced only because the new one-at-a-time lock refused the second call and the error tripped the page-error check. Every test context now fakes that endpoint, and the suite was re-run against a server with no keys at all, where any paid call would fail: 325 of 325 passed.
- **The first-run walk found a click that never landed.** Typing a client's name and clicking Save at once did nothing: leaving the name box started the suggestion, and its progress line pushed the button down mid-click. The suggestion now waits to see where the focus went.
- **The server tests had been failing silently for an hour.** They copied the real database and named four drafts that the owner had just cleared. They now run on a kept test database.

### Why this matters for the portfolio

- An AI feature earns trust when the screen says what the model was given. Asking that question out loud exposed that the outline was ungrounded, and the fix used evidence the project already held.

---
