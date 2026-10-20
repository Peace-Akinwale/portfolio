# Kairos Labs: Case Study Log

A running log of work shipped for Kairos Labs. Updated as deliverables land, not in retrospective batches. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Kairos Labs, a B2B SaaS SEO and AEO agency.
- **Role:** Freelance writer since September 2026. Articles start from the agency's content calendar and its own AI article platform, open with the editor's Brief table, and go to the editor for review.
- **Earlier work not logged here:** the September 24 to October 1, 2026 articles (SEO for fintech, what to expect from an SEO agency, how to hire an SEO company). This log starts on 2026-10-08.

---

## 2026-10-08, a comparison article steered through the agency's own AI pipeline: its fact checker was wrong twice over, and the proof for a client claim came from a clean browser

The editor assigned two October topics. This entry covers the first, a "best content marketing agencies for enterprise software" comparison for a Head of Content, produced through the agency's in-house article platform and finished in a Google Doc. Written the same night from the session handoff (`HANDOFF_kairos-enterprise-content-agency-article_2026-10-08.md` in the AI OS folder) and a readback of the live Doc.

### What shipped

- **A live look at what Google rewards before outlining:** pages 1 to 4 for both assigned keywords, both AI Overviews expanded, and a word search of the three top competing guides. The editor's suggested angle, a long review cycle, appeared zero times in any of them. The AI Overview judged agencies on revenue over traffic, product expertise and AI search, so the article was framed around those.
- **One complete 17-step platform run** (research, SERP, brief, outline, draft, style, fact check, claim resolution, fixer, post-processing, AI-ism scrub, five link steps), steered by editing each step's text: research corrected, the SERP step replaced with the live findings, brief and outline rewritten, the draft cut from 2,561 to 2,228 words before the style pass. Final: 1,983 words, 8 links.
- **A Google Doc** with the platform's output in one tab and two revisions beside it. The later revision carries the editor's Brief table, a labelled excerpt, eight agency profiles with 150 to 174 word overviews, and each competitor's pricing checked on its own site that day.
- **Proof for a client claim:** three non-branded buyer questions asked of ChatGPT from a brand-new, signed-out browser profile. The agency's client was the first recommendation in all three answers (7, 16 and 6 mentions), screenshotted with the date.
- **A reusable capture script and a written method** in the AI OS, so the next claim of this kind takes minutes.

### Decisions worth recording

- **The platform's fact checker was overruled, with the source.** Its claim resolver marked 57 competitor facts "external source needed" and asked to delete three of the agency's own claims (a money-back guarantee, starting without the strategy sprint, the review cadence) because its knowledge base lacked them. All three are on the agency's public pricing page. 76 claims were kept; the one real correction it surfaced, a competitor's "GEO service" page that redirects to its AEO page, was applied.
- **Edit the step, do not ask the AI to revise it.** The one AI revision tried attached unrelated testimonials to an anonymized client example and invented an objection. After that every step was changed by direct edit.
- **No bot check bypassed, no sign-in.** Perplexity met the clean profile with a Cloudflare check, then asked it to sign up; Claude has no signed-out mode. Both were reported as limits, and the claim was kept to what ChatGPT showed, with the date and without crediting the work for the result.
- **Claims about competitors say no more than their own pages.** When a comparison column overstated how agencies work ("in every tier", "quoted in each piece"), each cell was tied by a link on the exact phrase the agency's page supports.

### Frictions and course corrections

- **The first answer to the research ask summarized a file another session had written that afternoon.** The request was a fresh run in the browser; it was redone from scratch.
- **The first paste into Google Docs turned every em dash into ",Äî"** because the clipboard was not UTF-8. One environment variable fixed it.
- **A rewrite swapped readable table cells for literal source quotes** and was rejected as "taking me literally". The earlier wording came back, with links on the exact phrases.
- **One competitor's pricing was reported as unpublished** until its SEO packages page was read: it prices by the word. Two lines in the Doc still carried the old claim at the end of the day and are on the fix list.
- **The editor's template was over-applied** (key features, customer proof blocks); only its pros and cons were wanted.

### Why this matters for the portfolio

- **An AI content pipeline is a draft, not a source.** Every step was checked against live evidence, and the pipeline's own verifier was wrong in a way only the public site could settle.
- **Proof for a marketing claim was produced cleanly:** a clean profile, non-branded questions, a date, and an honest list of what could not be tested.

---

## 2026-10-20, an enterprise SEO comparison sharpened around the work a buyer still has to manage

Editorial review of an enterprise SEO agency comparison moved beyond service lists to the consequences of each agency's scope. This entry draws on the October 20 handoff, the editing conversation, and a live read of the selected Google Docs revision.

### What shipped

- A separate review tab retains the revised comparison while preserving the original article. The live revision includes distinct implementation responsibilities and a shorter selection section. Publication approval remains unverified.
- A scoped AI OS calibration records rejected examples and the reasons behind the corrections, rather than preserving only polished final copy.
- A handoff and dated article snapshot retain the remaining editorial questions without treating a successful save as final approval.

### Decisions worth recording

- **Compare consequences, not just capabilities.** The article explains when an agency can implement changes and when the client's engineers still need to do the work. A list of technical services alone doesn't establish that distinction.
- **Don't manufacture cons for symmetry.** A discrepancy between deliverable counts on a website belongs in verification notes. It isn't automatically a meaningful limitation of the agency's service.
- **Diagnose the unfinished work before prescribing another audit.** Unclear implementation instructions and engineers with no time require different forms of agency support. That distinction gives the selection section something useful beyond repeating the profiles.
- **Separate standard packages from enterprise agreements.** Published entry-tier terms don't establish the scope or pricing of a custom enterprise engagement.

### Frictions and course corrections

- Repeated feedback exposed vague phrases such as “development capacity” and “on-page work.” Rewrites named the actual responsibility instead of replacing one abstract label with another.
- Routine expectations, including having writers or a main contact, took space without always helping the comparison. The editing standard became whether the detail changes the reader's decision.
- Some rewrites offered in chat were already present when the live document was read again. The handoff records the current artifact without guessing who pasted them or declaring unverified approval.

### Why this matters for the portfolio

- Useful comparison writing requires editorial judgment about evidence and buyer consequences, not just collecting accurate feature descriptions.
- Saving the rejected approaches and their reasons makes the next review more consistent without turning a successful article into a rigid template.

---
