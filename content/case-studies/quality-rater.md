---
title: "Quality Rater: reviewing pages using Google’s quality guidelines"
name: "Quality Rater"
blurb: "Checks every page against Google’s quality guidelines and points at the exact passage behind each flag."
kind: built
status: "An SEO agency’s founder and strategists, first version"
date: 2026-10-05
summary: "Quality Rater reads every page on a site against Google's Search Quality Rater Guidelines, gives each one a provisional rating, and points at the exact sentence behind every concern. I built it for an SEO agency's strategists and writers in 116 commits over about three weeks. It's a first version, and nobody has yet measured how often its ratings agree with a person's."
voice: informal
notion_url: https://app.notion.com/p/403992da7a5781f583bef06d8253072c
notion_last_edited: 2026-10-30T23:39:38.112Z
tags:
  - "content audit"
related:
  - "ai-docs-watch"
  - "okf"
---

### Hundreds of pages to audit against Google's guidelines, and nowhere to start

Google pays people to rate pages against a long set of guidelines. Does the page show first-hand experience? Is it clear who's responsible for it? Are its claims accurate? A strategist auditing a client's site against those questions has hundreds of pages and nowhere obvious to start.

I held the whole build to one rule. "Every app we build should help people do their job more easily, not take more time away from their hands."

### A cheap model judges, and every concern points at a sentence

**One model judges, another writes.** I didn't want an expensive model doing the judging. Jev, a decision model that returns probabilities rather than text, rates each page and points at the sentences behind each concern. Claude only writes a suggested rewrite, and only when someone opens a card. That kept a check at about 2 cents instead of about 90.

**Point, don't skip.** When the accuracy check doubted claims on recent topics, the easy fix was to switch it off for them. "We won't ignore. We'll make it point." Doubtful claims are quoted back as claims to check, and the strategist decides.

![The run screen groups suggested review priorities and shows how much of the site was assessed. Identifying information is anonymized.](images/quality-rater/qr-02-run.png)

*The run screen groups suggested review priorities and shows how much of the site was assessed. Identifying information is anonymized.*

**Severity, not traffic.** The first version ranked pages by search traffic. I took Search Console out entirely and grouped findings by how serious they are, high to low, highest first. A strategist starts at the top of a work list, not a chart.

**Remove what nobody uses, all of it.** The first design had a bubble map I couldn't read and a calibration screen that asked people to re-rate pages by hand. Both went. When the calibration tag came out and its screen stayed, I made it a rule for every project. "When you remove stuff, you should remove in whole, not in part." Its replacement is one action on the page report, "This rating is wrong", with a reason.

**The publisher isn't a red flag.** A company's own site doesn't need flagging for promoting the company's product. "Merely publishing on our website shows that we are the publisher." Jev is now told whose site it's reading. I didn't block the flag in code, because on an affiliate site the same finding is real.

**No paid page fetching.** The crawler reads pages itself at a steady pace. Paid fetching would have added $1 to $6 to every 548-page run.

### A site check that becomes a work list ordered by severity

A site check that rates every page and groups the findings by severity. A page report that shows the passage behind each concern, with a suggested rewrite. A site audit that turns repeated issues into a work list, a draft checker for articles before they publish, and an internal link finder. It runs on Railway, signed in with the agency's own email domain.

![A report points to the passage behind a concern so the reviewer can accept or reject it. They can defer it when more investigation is needed.](images/quality-rater/qr-03-page-report.png)

*A report points to the passage behind a concern so the reviewer can accept or reject it. They can defer it when more investigation is needed.*

### The riskiest finding was a confident rewrite that was wrong

I walked the live app myself before the team saw it and logged 11 problems. The one that mattered most was a suggested rewrite of a quote from an SEC filing that named the wrong cause. "The recommended text was even wrong, and the fact that someone can believe it is a problem now." The fix was a rewrite guard and a second check on meaning. In testing, that check got 15 of 15 judgments right and scored the bad SEC rewrite at 0.68 against 0.09 to 0.25 for faithful ones.

The first full walk-through turned up 68 findings, and all of them were fixed. The site audit read 640 pages on one client site for $0.058 and 2,000 on another for $0.16. On the first, 73% of 384 issues came from three rules, mostly on pages those rules didn't fit. That's how I knew the team needed a work list, not a rating.

It's live for the team, and two colleagues have access to the code. No measurement of agreement with human raters exists yet, so the ratings stay provisional and the page says so.
