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
