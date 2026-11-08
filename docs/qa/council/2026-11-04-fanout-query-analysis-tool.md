# Council verdict: fanout query analysis tool case study, 4 November 2026

**Decision put to the council:** Would you book the call from this page?
**Target:** http://localhost:3000/case-studies/fanout-query-analysis-tool (the production build of `redesign/seam-dated` after the 4 Nov rebuild) rendered at 16:56 WAT. Rendered text and every round: session scratchpad `council/fanout-query-analysis-tool/`.
**Seats:** CMO, agency founder, Head of Content and SEO (the buyers). Chair: Claude, running `~/.claude/skills/hiring-council`.
**Previous verdict for this page:** none.

## The verdict in one paragraph

No seat would book yet; all three would email first, and the agency founder would book after a build range came back. The judgment on the page is senior. "It reported 6 citations. The answer carried 10." is the scepticism the agency founder wants on the bench, and "In a 38-prompt trial the simulated runs agreed with the captured ones on brand mentions 36 times." shows she tested her cheap mode before anyone relied on it. Two errors written in this rebuild cost the page. The strip says "Built" "Oct 2026", and the run was 26 Aug to 18 Sep 2026. And "The client is cited in 30 answers and not cited in the other 100." is an example of how the chart works, written so it reads as a client result: the only AEO reading on the page is not a reading. Beyond those, the page shows no use after handover, names its users only as "An SEO agency’s founder and strategists", and gives no build price under "Want a tool like this for your team?".

## Scores

| Seat | Round 1 | Final | Would book the call? | One line |
|---|---|---|---|---|
| CMO | 4 | 5 | No, email first | Judgment proof exists; the offer has no price. |
| Agency founder | 7 | 6 | Narrowly, after an email | Missing facts mean email first, and that applies to my own score. |
| Head of Content and SEO | 7 | 6 | Not yet | Neither the tool in use today nor one real AEO reading. |

Spread: 5 to 6, narrowed from 4 to 7. Not averaged.

## Agreed changes, ranked

1. **Correct the strip and state use honestly** (all three). "Built" "Oct 2026" becomes 26 Aug to 18 Sep 2026. Keep "It ended with 28 clients and 141 live captures in the database" as use during the build, and add one plain line on what happened after handover. Give the team a headcount. No invented count: a guessed number costs more than a missing one (agency founder). (Peace)
2. **Label or cut the chart line** (all three). "The client is cited in 30 answers and not cited in the other 100." becomes a marked example, or a real dated reading from the 141 captures replaces it: engines, prompt count, citation rate. (Peace)
3. **Say what a build costs and who maintains it** (all three). Under "Want a tool like this for your team?", "what building it would involve" needs a build range, a monthly upkeep figure and a maintenance owner. "ChatGPT had stopped streaming the search wording." shows vendor drift, so say who fixes a broken capture (Head of Content). One sentence here; the range lives on /services#building (the chair's call, from the AI Docs Watch debate). (Peace)
4. **Replace engineering counts with what the tool removed** (CMO). "It took 309 commits over 24 days." buries the number a buyer would quote. Lead with the routine it ended: "every prompt meant switching it on by hand and uploading files to Claude". (Peace) for how long that routine took.
5. **Say she builds tools like this for other companies** (Head of Content, CMO). "The agency asked me to lead" reads as staff work, and a buyer's legal team will ask who owns the code. Say she built it on the agency's team and can build the same kind of tool for others. (Peace)

## Disagreements

- **The agency founder's 7.** The Head of Content attacked it: the founder had scored an API bill and a go-live date as running cost and adoption, and "An SEO agency’s founder and strategists" names a role, not users. The founder conceded in round 3 and dropped to 6.
- **The CMO's 4.** The agency founder argued a 4 means the page drives a buyer away, while the CMO called the 6-of-10 catch the best thing on the page. The CMO conceded the 38-prompt trial and rose to 5 in round 3.
- **Is the tool in production?** Settled by the chair's dates: built 26 Aug to 18 Sep, wider team access on 17 Sep, no recorded use after. All three now ask for one honest line rather than a count.

## Devil's advocate

The agency founder argued against the usage-count demand: 141 live captures across 28 clients came from real use, not tests. Partly convinced: enough use to book, not proof it is used today.

## What needs facts only Peace has

- (Peace) A build range, a monthly upkeep figure and who maintains a client build.
- (Peace) Whether the agency still uses the tool after 18 September, and how many strategists had access.
- (Peace) Whether any of the 141 captures gives a real dated citation reading.
- (Peace) How long the manual bookmarklet and upload routine took per prompt set.
- (Peace) Whether she can build the same kind of tool for another company.
- (Peace) What monitoring exists for a failed capture.

## Per seat

### CMO (5/10, email first)
**What decided it.** The 6-of-10 catch and the 38-prompt trial; no price.
**Three changes.** Build range and upkeep under the call; what the tool removed, not commits; correct the strip and mark the chart line.
**What moved in debate.** Up one on the trial; the ownership fact made a build range more necessary.

### Agency founder (6/10, narrowly, after an email)
**What decided it.** "It reported 6 citations. The answer carried 10."; no build price; anonymous users.
**Three changes.** Build range, upkeep and maintainer; correct the strip and give a headcount; label or cut the chart line.
**What moved in debate.** Conceded the Head of Content's attack; down one.

### Head of Content and SEO (6/10, not yet)
**What decided it.** The parser check and the reverted test fix; no use after 18 September; no real reading.
**Three changes.** Dates and honest use; relabel or cut the chart line; maintenance and ownership.
**What moved in debate.** Took the CMO's ownership point; down one on the chart line.

## Method and limits

- Rounds: positions, debate, vote, all three run.
- Verified by the chair: the run dates (26 Aug to 18 Sep 2026) and the chart line's status as an example, both from the build record in Peace's private AI OS repo; the 102-character title; BreadcrumbList schema.
- The strip date comes from the importer's front matter, not the body copy.
- Not checked: screenshots (no design critic on this page), the live site.
