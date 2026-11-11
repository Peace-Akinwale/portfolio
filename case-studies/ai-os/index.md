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
