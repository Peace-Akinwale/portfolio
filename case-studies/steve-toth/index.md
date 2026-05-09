# Steve Toth — Notebook Agency Case Study Log

A running log of work shipped for Steve Toth at Notebook Agency. Updated as deliverables land, not in retrospective batches. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Steve Toth, founder of Notebook Agency (Toronto)
- **Role:** Content operator, contractor, 30 hrs/week, $30/hr USD base + up to 50% bonus tied to specific business goals
- **Started:** 2026-05-01
- **Scope:** LinkedIn content system, Notebook Agency blog content strategy and production, notebook.agency website rebrand, Steve Toth AI launch arc, SEO IRL 2026 conference content, coaching nurture sequences
- **Five Steve Toth businesses the content serves:** Notebook Agency (B2B SaaS SEO), Coaching cohorts, SEO IRL 2026 (October), Steve Toth AI (knowledge product launching ~June 2026, ~$39k/mo MRR target), Prompt-generation service for AEO clients

---

## 2026-05-01 — Day 1: foundation, planning, and Notion task system

Got the system end-to-end ready for Monday execution. No content shipped today; all foundation.

### Setup and access (completed today)

- Steve Toth content operations directory and folder architecture stood up at `C:/AKINWALE/Steve Toth/`
- Joined Steve's LinkedIn Posts Claude project; received the "How to LinkedIn Post" skill via Slack
- Notion access to SEO Notebook + AI Notebook (via Karla)
- Steve Toth AI MCP connected to Claude
- Claude Premium upgrade
- Slack channels: Notebook Agency website, brand initiatives, two-FA, core team
- Created "Peace's Work" folder in the Notebook Agency Google Drive Delivery Section (per Karla's directive that every deliverable lives in a queryable folder)
- Ahrefs and Dashlane access resolved via Karla
- Verified ability to read individual Steve LinkedIn posts via URL for voice calibration
- Verified Typegrow LinkedIn text formatter for Unicode formatting in posts

### Brand and voice foundation (completed today)

- **Steve's LinkedIn post rubric** installed in the brand kit. Six dimensions (Hook, Proof & Credibility, Structure & Scannability, Value Density, Emotional Architecture, Closing & Engagement). 100 points total. Built on Jake Ward's analysis of 400+ posts.
- **Archetype library** installed — eight files: How-to analysis, Curated List formula, Industry News formula, Myth-Buster (analysis + v2 + formula), Origin Stories, Resource Posts analysis. These are the structural recipes every LinkedIn draft is matched against.
- **Brand kit documentation** — voice register, banned patterns (no rhetorical-question openers, no engagement bait, no emoji strings, no "Most" openers, no negative parallelism, no AI filler), audience definition.
- **Five businesses + revenue targets documented** — for the upcoming 1:1 with Steve to define hard numerical goals tied to the 50% bonus upside.
- **System overview and active priorities documented.**

### Strategic planning (completed today)

- **Master plan** produced — covers LinkedIn, Notebook Agency blog, homepage redesign, domain consolidation strategy, Steve Toth AI launch arc, SEO IRL 2026 conference, coaching workstreams. Saved at `C:/AKINWALE/Steve Toth/ops/master-plan-2026-05-01.md`.
- **Implementation plan** produced — the *how* to the master plan's *what*. Covers (A) LinkedIn content system architecture, (B) blog content engine, (C) voice tuning, (D) parked items, (E) day-by-day for May 4–8, (F) three open decisions for Peace. Saved at `C:/AKINWALE/Steve Toth/ops/implementation-plan-2026-05-01.md` and uploaded to Google Drive in the "Peace's Work" folder for Steve's reference.

### Notion task system (completed today)

- 21 tasks added to Peace's Personal Tasks dashboard in Notion: 10 marked Complete (foundation work above), 1 In Progress (the master plan), 10 Not Started covering next two weeks of execution.
- Notes and deadlines populated on all tasks; calendar-ordered for May 4–15.
- Task added marking the implementation plan complete.

### Decisions captured

- LinkedIn content system v1 will be Notion-only — single Posts database, calendar view, manual bulk write, no router, no Buffer, no Gemini, no Telegram. Sources every post from SEO Notebook or AI Notebook (Steve's actual content), not invented.
- Blog content engine will be cloned and adapted for single-brand context — drops the multi-client machinery from the original architecture.
- Voice corrections from Steve will feed a single shared feedback log used by both LinkedIn and blog systems. One brain, one memory.

### Three decisions still pending Peace's input before Monday execution

1. Image generation approach for the first LinkedIn batch (Nano Banana, skip, or different solution)
2. Final list of Goal Tags
3. Notebook Agency knowledge base location (`brand/` vs. new `clients/`)

---

## 2026-05-04 — Day 4: replaced manual v1 with an agent-driven engine design

The May 1 implementation plan committed to a fully manual LinkedIn v1 — Peace bulk-writes 25–30 posts in Notion, no automation. Reviewed it against the four call transcripts and the LinkedIn tracker, and decided to replace it before any content shipped. The new v1 is an agent-driven engine that generates monthly calendars, grounds every post in Steve's actual Notion knowledge, scores against the Jake Ward rubric, and learns from Steve's edits.

### Inputs reviewed today

- All four call transcripts in `inputs/notebook-agency-call-transcripts.txt` re-read end to end (Apr 24 interview, Apr 29 post-interview, May 1 Karla onboarding, May 1 Notebook brand strategy).
- Steve's LinkedIn tracker spreadsheet (283 posts, Sept 2023 → Aug 2025) analyzed in full. Most surprising signal: the `Repostable=TRUE` flag is a 15× engagement multiplier (TRUE posts avg 134 engagement, FALSE avg 9). Speaker Post type averages 0.0 engagement across 15 posts — universal failure pattern, do not replicate. Top-15-by-engagement are all `Post` type + Repostable=TRUE.
- WebFetch verified to return full LinkedIn post text on 9 of 10 top URLs without auth wall — unlocks voice calibration via scraping the Repostable=TRUE archive. No need for Apify on this workstream.
- Peace's existing LinkedIn Router (`C:/AKINWALE/LinkedIn Router/`) mapped by code-explorer agent. Confirmed reusable patterns: dual-trigger polling+webhook, schema-safe writes via `pickSupportedProperties()`, two-pass Sonnet→Haiku draft/revision, Post Bank substrate query at brief time, prompt-library-as-module. Confirmed non-portable: Peace's `authorVantage` block, Twitter thread generation, Peace-specific tag vocabulary, day-by-day sequential ideation (Steve's engine needs parallel batch of 25).

### Decisions locked today

- **Architecture: terminal-first.** Engine runs from Claude Code in `C:/AKINWALE/Steve Toth/`. No Render server, no Railway, no API project. Slash commands as entry points. Server gets layered in only when Steve's team approves an Anthropic API project and the workflow has stabilized.
- **Three Notion databases under `SEO that Ranks → Content Ops`:** Posts DB (calendar + finished posts), Sources DB (engine's index of SEO/AI Notebook + client pages with our metadata; relations point to originals, no copying), Feedback DB (per-edit captures with original/revision/diff/pattern).
- **Knowledge ingestion = Notion API direct.** Steve Toth AI MCP retained for exploratory queries only. Sources DB references SEO/AI Notebook entries via Notion relations; the engine reads the live page body when fetching a source.
- **Cadence: monthly batch + reactive top-ups.** `/build-calendar 2026-MM` is the spine. `/draft-from-source <notion-id>` handles hot ideas mid-month.
- **Anonymization: Option B at start.** Strip client name, sharpen detail (real sub-niche, ratios + ranges, generic tool-stack). Move to a Steve-approved named-client allow-list later.
- **Failure semantics:** rubric fails twice → engine still generates the post, slots it in the calendar with status `Needs Peace`, surfaces it for review. Calendar never has empty slots; no engine-stalls-while-Peace-sleeps.
- **Speaker Post format killed.** SEO IRL goal tag stays at full post weight; the engine picks How-to / Myth-Buster / Curated List / Origin Story archetypes for those slots instead of the speaker-reveal template that flopped.

### Sub-agent topology (agreed)

Single orchestrator + specialist sub-agents called via the `Agent` tool. Specialists: knowledge-agent, calendar-planner, brief-agent, draft-agent, editor-agent, scorer-agent, refiner-agent, anonymizer-agent. Orchestrator dispatches in parallel where work is independent (all 22 per-post pipelines fan out simultaneously). Bounded self-loop inside scorer→refiner (max 2 attempts).

### Two human checkpoints in the monthly run

1. **After calendar planning** — Peace and Steve review the source-to-post mapping in Notion before any draft burns tokens.
2. **After full pool generated and scored** — Steve reviews ~22 finished drafts in Notion, edits in place, approves.

### Outputs landed today

- **Design spec:** `C:/AKINWALE/Steve Toth/docs/superpowers/specs/2026-05-04-linkedin-engine-design.md` — 19 sections, ~870 lines. Full architecture, DB schemas, slash command catalogue, per-post pipeline detail, knowledge ingestion + anonymization rules, goal-tag balance algorithm, feedback loop, voice calibration, publishing handoff, migration path, success criteria.
- **Implementation plan:** `C:/AKINWALE/Steve Toth/docs/superpowers/plans/2026-05-04-linkedin-engine-implementation.md` — 10 phases, ~50 bite-sized tasks. Phase 0 scaffold → Phase 10 first June production run. Each task has Files / Steps / commands / verification.
- **Notion tasks draft:** `C:/AKINWALE/Steve Toth/ops/notion-tasks-pending.md` — outcome-level project + sub-tasks ready to paste into Personal Tasks dashboard.
- **Memory rules added:** Notion task writing convention (outcome-not-keystroke, project-with-subtasks > 1 day) and portfolio log location. Both auto-apply in future sessions.

### Status

Design + plan complete. Ready to execute Phase 0. Next step is Peace's choice between subagent-driven execution (fresh subagent per task with review checkpoints) and inline execution (in-session batch with checkpoints).

---

## 2026-05-04 (continued) — Phase 0 complete + Phase 1 Notion DBs live

Phase 0 execution completed (3 commits on feat/linkedin-engine) and Phase 1 Notion databases created end-to-end in the same session.

### Phase 0 delivered (earlier in session)

- `engine/agents/`, `engine/notion/`, `engine/prompts/`, `outputs/runs/`, `outputs/voice-calibration/` directories created
- `README.md` updated with run-it instructions for all 8 slash commands
- 8 slash command stubs in `.claude/commands/`: build-calendar, draft-from-source, capture-feedback, voice-calibrate, prepare-publish, sync-engagement, add-client-source, remove-client-source

### Phase 1 delivered

- **Content Ops parent page** created in Notion under PERSONAL DASHBOARDS → Content Ops — LinkedIn Engine (`3568c368-5191-8134-852d-ed089cd09eeb`)
- **Posts DB** — full schema: Post Title, Post Body, Status, Goal Tag (6 options), Archetype (8 options), Pillar (6 options), Brief, Rubric Score, Rubric Breakdown, Failed Attempts, Steve's Revision, Diff Notes, Image Asset, Scheduled Date, Scheduled Time, Posted URL, Engagement, Notes. Collection: `7c9fe4ce-3559-47cb-af29-357e0c6a55ec`
- **Sources DB** — full schema: Title, Source Type (6 options), Notion URL, Notion Page ID, Goal Fit, Archetype Fit, Last Modified/Synced dates, Cited In (dual relation → Posts DB auto-creates "Source" in Posts), Anonymize, Notes. Collection: `81d7b025-ff1e-4c87-be84-9530ae6050d3`
- **Feedback DB** — full schema: Pattern (title), Post (relation → Posts DB), Original Draft, Steve's Revision, Diff Notes, Severity (Cosmetic/Structural/Voice/Banned-pattern), Dimension (Hook/Proof/Structure/Value/Emotion/Close), Date Captured, Pattern Locked In, Recurrence Count. Collection: `0c2f737a-2454-4671-9c1c-58ad84954727`
- All IDs saved to `engine/notion/db-ids.md`, committed on feat/linkedin-engine
- Notion task synced: 12 tasks added to Peace's Personal Tasks dashboard (6 Done, 1 In Progress, 5 Not Started including Kyle Poyar task)
- Peace's dashboard link saved to memory: https://www.notion.so/seonotebook/Peace-s-Dashboard-3538c36851918075ae81cd4082e6d87e

### Two schema items deferred

- Posts DB Status options (need custom values: Planned/Brief/Drafting/Scoring/Refining/Ready for Steve/Needs Peace/Approved/Hold/Scheduled/Published) — add via Notion UI or update-data-source in next session
- Sources DB Citation Count (rollup) + Saturation (formula) — add via Notion UI; formula had type error at creation time

### Next up

Phase 2: `/voice-calibrate` command + agent — scrapes top 50 Repostable=TRUE LinkedIn URLs via WebFetch, clusters them, seeds `brand/example-posts.md` with Steve's voice patterns.

---

## 2026-05-04 (continued) — Phases 2–9 complete: full engine specification built

All pipeline agent specs and slash command implementations written, tested for structural correctness, and committed on `feat/linkedin-engine`. The engine is now fully specified — ready to run once voice calibration data (LinkedIn post tracker CSV) and the Sources DB bootstrap are complete.

### What was built this session

**New agent specs (engine/agents/):**
- `diff-agent.md` — compares Steve's revision vs engine draft, classifies change type (Cosmetic/Voice/Structural/Proof-upgrade/Hook-rewrite/Banned-pattern/Close-rewrite), extracts a generalizable rule per change, maps to rubric dimension. Returns JSON with `feedback_db_entry` for direct write to Feedback DB.
- `synthesis-agent.md` — clusters Feedback DB patterns, promotes clusters with ≥2 source posts to `memory/feedback-log.md` as locked rules. Returns pending patterns (single occurrences) separately.

**Slash commands (fully implemented, replacing stubs):**
- `/voice-calibrate` — reads `brand/linkedin-post-tracker.csv`, filters Repostable=TRUE, WebFetches top 50, dispatches voice-calibrate-agent, writes `brand/example-posts.md` + `brand/voice-fingerprint.md` + audit file
- `/build-calendar YYYY-MM [--resume]` — 5-stage pipeline: load context → refresh sources → calendar-planner agent → Checkpoint 1 (Industry News topics) → generate all 22 posts in parallel (full brief→draft→edit→score→refine loop) → Checkpoint 2 → writes publish schedule
- `/add-client-source <url>` — interactive intake with Client Tag validation, knowledge-agent dispatch, idempotency check, Sources DB write
- `/remove-client-source <url-or-title>` — soft-delete via `// REMOVED` Notes marker, never hard-deletes Notion rows
- `/capture-feedback` — finds approved posts where Post Body ≠ Original Engine Draft, dispatches diff-agents, writes Feedback DB rows, dispatches synthesis-agent, updates feedback-log.md
- `/draft-from-source <source-id> [--goal=] [--archetype=] [--date=]` — single-post hot-idea flow with full pipeline
- `/prepare-publish YYYY-WN` — fetches approved posts for the week, applies Unicode bold (LinkedIn-safe formatting), strips IMAGE_HINT, writes `outputs/publish-batch-YYYY-WN.md`, updates Status → Scheduled
- `/sync-engagement` — WebFetches published posts ≥7 days old, writes engagement JSON to Posts DB

**Supporting files:**
- `engine/notion/schemas.md` — canonical schema reference confirmed against live DBs (corrects property names: "Rubric Score" not "Score", "Posted URL" not "LinkedIn URL", etc.)
- `engine/notion/client.md` — Notion MCP tool usage patterns, API field formats, error handling
- `engine/notion/bootstrap-sources.md` — one-time procedure for crawling SEO + AI Notebook to populate Sources DB
- `style-guides/steve-brutal-editor.md` — 10-item Steve-specific brutal editor checklist (LinkedIn character constraints, banned patterns, voice checks)
- `brand/archetypes/contrarian-take.md` — recipe with Steve-specific hook patterns and constraints
- `brand/archetypes/tactical-breakdown.md` — recipe with verb-led step structure and Steve-specific notes
- `memory/business-goals.md` — goal weight tables added for May–Dec 2026 (6 windows: AI launch, conference, post-conference, etc.)

**Notion Posts DB updated:**
- Added: `Original Engine Draft` (rich_text), `Last Engagement Sync` (date), `Needs Peace` (checkbox), `IMAGE_HINT` (rich_text) via API

### Corrections discovered during build

- Posts DB property names differ from spec: `Rubric Score` (not `Score`), `Rubric Breakdown` (not `Score Breakdown`), `Posted URL` (not `LinkedIn URL`), `Goal Tag` is `multi_select` (not `select`). All agent specs and schemas.md corrected.
- 3 archetype recipe files were missing after branch cleanup (how-to, contrarian-take, tactical-breakdown). `how-to` exists as `howto-analysis.md`; `contrarian-take.md` and `tactical-breakdown.md` created. Draft-agent updated to use explicit file lookup table per archetype.
- Editor-agent was referencing generic `brutal-editor.md` (Peace's blog standard). Updated to reference `steve-brutal-editor.md`.

### What's NOT done yet (requires real data)

- `/voice-calibrate` cannot run until `brand/linkedin-post-tracker.csv` is created — needs Peace to export the LinkedIn tracker data with columns: `url, engagement_score, repostable, archetype`
- Sources DB bootstrap cannot run until Peace confirms the SEO/AI Notebook pages are accessible to the integration and the tracker CSV is ready
- `/build-calendar 2026-06` (the first production run) is the Phase 10 milestone — target: June 2026 calendar

### Branch state

All work on `feat/linkedin-engine`. 3 commits this session: 9 core agents, full pipeline implementation, archetype fix. Ready for PR review when Steve approves merging to main.

---

## 2026-05-04 (evening) — DB restructure, calendar rescheduled, schema locked

Picked up after context compaction. Completed the Posts DB restructure the user had requested: removed all fields not serving the active workflow, replaced the Notion `status` type with a SELECT type using 8 workflow-aligned options, and rescheduled all 22 posts from June to May 6 – June 4.

### Posts DB restructure

**Status redesign:** Converted from Notion's native `status` type (Not started / In progress / Done) to a `select` with 8 custom options: `New` → `Ready for Steve` → `Reviewed` → `Approved` → `Needs Image` → `Scheduled` → `Published` → `Needs Peace`. Previous DDL attempt had failed because Notion's STATUS type doesn't accept option syntax — fix was to use SELECT type instead.

**10 fields dropped** (all confirmed as non-workflow-serving or requiring manual input with no automation path):
`Notes`, `Scheduled Time`, `Steve's Revision`, `Image Asset`, `Pillar`, `Failed Attempts`, `Rubric Breakdown`, `Last Engagement Sync`, `Engagement`, `Posted URL`

**Why Engagement and Posted URL were dropped:** Ahrefs Social Media Manager has Steve's LinkedIn unconnected (`social-media-channels` returned `[]`). User's directive: "if anything is just documentation doesn't pull for us we don't need it."

**Final Posts DB schema (13 fields):** Post Title, Status, Goal Tag, Archetype, Scheduled Date, Brief, Post Body, Original Engine Draft, Steve's Notes, Diff Notes, Rubric Score, IMAGE_HINT, Needs Peace, Source (relation).

### Calendar rescheduled

All 22 posts moved from June 2026 to **May 6 – June 4, 2026** (Mon–Fri working days, Wednesdays reserved for Industry News). Status set to `New` on all 22. Reason: user needed posts ready for Steve's review the next day (May 5). First post goes live May 6.

### Supporting file updated

`engine/notion/schemas.md` rewritten to match the live DB: removed all dropped fields, updated Status section to the new SELECT type with exact option strings, added removed-fields tombstone list so agents don't reference dead properties.

### Commit

`50e6b5c` on `feat/linkedin-engine` — schema restructure with 23 insertions / 31 deletions.

---

## 2026-05-06 — Multi-DB pipeline restructure: Sources → Briefs → Posts + cron service

Reversed a 2026-05-05 consolidation that had flattened everything into one 29-field Posts DB. That approach killed the pipeline's modular handoff logic — agents couldn't write a brief without also knowing the post ID, status transitions were ambiguous, and the DB would have ballooned to 40+ fields once Client Announcements and calendar planning landed. Rebuilt with the correct separation in ~10 hours.

### What was built

**Three new Notion DBs:**
- **Briefs DB** (`161e3d90`) — the handoff layer. Agent writes a brief here (Status=Draft), Peace reviews and approves (Status=Peace Approved), draft-job fires and produces the post. Keeps brief authorship separate from post authorship — Steve reviews posts, Peace reviews briefs.
- **Client Announcements DB** (`2a6286036c80`) — isolates the client welcome-post workflow. Peace marks a CA row Approved → `runClientAnnouncementBrief` creates a Briefs row + Posts row and links all three. CA.Status → Brief Generated.
- **Content Calendar DB** (`23d44126`) — planning layer. `calendar-generator` creates 22 Content Calendar rows (Status=Planned) + 22 linked Posts rows each month on the 15th.

**Cron service (TypeScript, Railway):**
Five scheduled jobs wired to the pipeline:
1. `status-watcher` (every 5 min) — polls all four DBs in parallel; fires `runDraftJob` when Briefs go to Peace Approved, fires `runClientAnnouncementBrief` when CA rows go Approved, fires `runIndustryNewsBrief` when Sources rows are Brief Ready with no linked Briefs.
2. `calendar-generator` (15th of month, 9am ET) — invokes calendar-planner agent, dual-writes Content Calendar + Posts rows.
3. `industry-news-reminder` (9am ET daily) — Telegrams when an Industry News Posts slot has no Linked Brief within 48 h of publish.
4. `source-freshness` (2am ET daily) — freshness check on Sources DB.
5. `voice-calibrate` (quarterly) — re-calibrates voice fingerprint.

Kill switch: `CRON_PAUSED=true` on Railway pauses all jobs for safe DB migrations.

**Posts DB cleanup:**
12 deprecated fields dropped (Brief, Spine, Industry Source URL/Notes, Call Transcript, Client Logo, Service Angle, Additional Context, Needs Peace checkbox, Scheduled Time, Diff Notes, Source relation). These all moved to the DB that owns them. 4 new views added: Steve's Queue (Ready for Steve, sorted by date), Engine (board by Status), Calendar (monthly), Analytics (Published posts with engagement).

### Why this matters for the portfolio

This is the architectural decision that enables the business logic Steve actually needs. The single-DB approach would have forced agents to hold more state than they should (brief content, post content, CA data, calendar data all in one row), made Peace's approval flow ambiguous (approve what — the brief? the post?), and made it impossible to query the pipeline stage cleanly. The multi-DB design matches how Steve thinks about the work: "I approve posts, Peace approves briefs, Karla manages client announcements." Each actor has a clean inbox.

### Commit log

All work on `feat/linkedin-engine`. Three sessions total (May 5–6): Phase 1 Notion DB creation, Phase 2 agent prompt updates, Phase 3–5 cron implementation + cleanup + docs. Ready for Railway deploy.

---

## 2026-05-06 (continued) — Pipeline audit: 4 critical bugs fixed, synthesis cron added, Railway live

After completing the multi-DB restructure, ran a full audit of the automation flow before the first real API token could land. All 4 HIGH-severity bugs found and fixed in the same session. Three commits pushed to `feat/linkedin-engine` — Railway auto-deployed.

### What the audit found

The cron service had been built and deployed but had never run against a real Notion token (Railway `NOTION_API_KEY` was still a placeholder). Walking every handler path surfaced concrete failure modes, not hypotheticals.

**1. Status watcher Telegram spam (HIGH)**
`onNeedsPeace` and `onPostReadyForSteve` in `pollPostsDb` had no status-cache dedup. The `pollBriefsDb` function already had it (using `brief:status:{id}` cache keys) but posts didn't. Every 5-min tick where a post sat at "Needs Peace" or "Ready for Steve" would re-fire the Telegram notify. With 5+ posts in those states, that's 50+ messages/hour. Fixed with `post:status:{id}` cache key, same pattern as briefs. Commit `ff8791f`.

**2. Notebook body extraction incomplete (HIGH)**
`fetchNotebookBody` in `notebook-brief.ts` filtered `block.type === 'paragraph'` only. Steve's notebook articles use headings, numbered lists, bullet lists, callout blocks, and toggles — all invisible to the brief-agent under the original code. The brief-agent was receiving a gutted version of the article: plain sentences only, no structure. Fixed with a switch statement handling 9 block types. Commit `ff8791f`.

**3. Feedback capture silent failure (HIGH)**
The `catch` block in `runFeedbackCapture` only wrote to `console.error`. If the diff-agent threw, or if a Notion write failed mid-loop, Steve's edits were silently discarded — no Telegram, no retry, no trace. The learning loop is the most important part of the system; silent failure here means it never improves. Fixed: added `notify(telegram, ...)` on catch with the post title and error message. Also added explicit `model: MODEL` to the `invokeAgent` call and `MODEL` import. Commit `ff8791f`.

**4. Source freshness date filter rejected by Notion API (HIGH)**
`source-freshness.ts` was filtering with `property: 'date:Date:start'` — the MCP SQL notation used in query strings, not the Notion REST API format. Same class of bug that was already fixed in `calendar-generator.ts` and `client-announcement.ts`. Source-freshness had escaped that earlier pass. Fixed to `property: 'Date'` with correct `date: { on_or_after }` structure. Commit `4752836`.

### New cron job: feedback synthesis

Created `cron/src/jobs/feedback-synthesis.ts` and wired it into `index.ts` (Sundays 9am ET). This is the 6th active cron job.

What it does: queries all Feedback DB rows with `Promoted = false`, runs the synthesis-agent to cluster patterns across 2+ source posts, writes promoted rules to `memory/feedback-log.md`, and marks processed rows `Promoted = true`. Without this, the Feedback DB accumulates raw one-off observations forever but the system never consolidates them into durable writing rules. Synthesis is the step that converts "Steve edited this once" into "Steve always does this."

### Style guide: colon rule

Added Section 4a to `style-guides/steve-brutal-editor.md`. Fragment-label colons are now an explicit banned pattern: `"The fix: check robots.txt"` becomes `"Check your robots.txt."` Three wrong/right examples with specific instruction to kill a colon when the clause before it is a fragment or label.

This was surfaced by a real case in the v3 batch: "The part most people miss: historical data is NOT exported." — a sentence that needed no colon, just a rewrite as a direct claim.

### Notion collection IDs verified

Used the claude.ai Notion MCP to confirm both collection IDs in `.env.example`:
- SEO Notebook: `a8e24154-a483-45f2-948d-dfefa6f2514d` — confirmed as the `seonotebook.com` database
- AI Notebook: `1ca8c368-5191-8124-9f8b-000b25fc4bcf` — confirmed as the `ainotebook.com` database

The IDs looked different from the archive URLs in Karla's message because those URLs pointed to individual article rows inside the database, not the database itself. Lesson: always fetch before concluding a Notion ID mismatch; the ancestor path in the response immediately shows the parent database.

### Frictions and course corrections

**The DB restructure that had to be undone.** Earlier on May 6, in the session before this audit, the pipeline had been consolidated into a single flat Posts DB — all brief fields, all calendar fields, all client announcement fields merged into one table. The intent was to simplify. In practice it killed the pipeline's handoff logic: agents couldn't write a brief without knowing the post ID, status transitions became ambiguous, and the row would have ballooned to 40+ fields once client announcements and calendar planning were properly wired. The session described in the "Multi-DB pipeline restructure" entry above was the correction — rebuilding the correct four-DB separation (Posts, Briefs, Client Announcements, Content Calendar). That cost a full session of work that wasn't in the plan.

**Service deployed but completely non-functional.** The cron service had been on Railway since May 5, running all 5 scheduled jobs every 5 min / daily. But `NOTION_API_KEY` was set to `PLACEHOLDER_NEEDS_REAL_VALUE` — meaning every single Notion call across every job had been throwing 401 errors since deploy. The service looked running but was doing nothing. Also missing: `NOTION_BRIEFS_DB_ID`, `NOTION_CLIENT_ANNOUNCEMENTS_DB_ID`, `NOTION_CONTENT_CALENDAR_DB_ID`. These were all caught in the audit and the 3 DB IDs were set via Railway CLI in this session. `NOTION_API_KEY` is still blocked on Karla.

**False ID mismatch flag.** During the collection ID verification pass, compared Karla's archive URL strings against the .env.example collection IDs and concluded they were mismatched — flagged it as a potential bug requiring investigation. Fetching both IDs immediately showed the archive URL was a single article row inside the database, not the database itself. The collection IDs in env were correct all along. Cost: time spent on a non-problem, plus a misleading flag in the audit output before it was corrected. Lesson saved to memory: never conclude a Notion ID mismatch without fetching first.

**4 bugs shipped in the cron service without being caught before deploy.** The status watcher spam, notebook body extraction, feedback capture silent failure, and source freshness date filter were all present in the committed code before this session's audit. None were caught in code review or testing. Root cause: the service couldn't be tested against real Notion data because the API key was a placeholder — so bugs that only manifest against the API survived. The audit was necessary specifically because integration testing wasn't possible before the token lands.

### Railway state after this session

All code pushed to `feat/linkedin-engine` (commits `63f4147`, `ff8791f`, `4752836`). Railway auto-deployed. The cron service is running 6 scheduled jobs. Still blocked on:
- `NOTION_API_KEY` = placeholder — waiting on Karla's integration token
- `NOTION_BRIEFS_DB_ID`, `NOTION_CLIENT_ANNOUNCEMENTS_DB_ID`, `NOTION_CONTENT_CALENDAR_DB_ID` — 3 DB IDs not yet set in Railway
- Buffer publisher switch — waiting on Steve confirmation

First autonomous run remains on track for June 15 once Karla's token lands.

---

## 2026-05-06 (evening) — Second-pass audit found 5 more production bugs the first audit had missed; cron service hardened end-to-end

The morning audit had closed with "4 HIGH-severity bugs found and fixed" and Railway re-deployed. Reopened it in the evening because Peace asked the question that should always come after a bug-fix sweep: "review all the content ops database. how do all of them sync together? do they also sync together in the code level? check." That was the prompt that turned a code-review pass into a contract-validation pass — and the contract was wrong.

By end of session, three more commits were on `feat/linkedin-engine` (`6a8b7f3`, `f7e8ab8`, `fc69255`, plus the architectural-hardening commit `6c23a6b`), Notion's "Voice Calibration Reports" page was live, Railway env was synced, local `.env` was rebuilt, and the cron service was running cleanly.

### What the second audit found

**1. Feedback DB property names didn't exist in the schema.** `feedback-capture.ts` was writing eight properties to the Feedback DB: `Type`, `Rule`, `Rubric Dimension`, `Example Trigger`, `Example Fix`, `Source Post`, `Confidence`, and `Promoted`. Not one of them is in the schema. The actual fields are `Severity`, `Diff Notes`, `Dimension`, `Original Draft`, `Steve's Revision`, `Post`, and `Pattern Locked In`. Every `runFeedbackCapture` call would have hit a 400 from Notion. The surrounding `try/catch` would have logged it to console and pinged Telegram — Steve's edits would have been silently lost. `feedback-synthesis.ts` had the same mismatches in its row reader and its query filter (`Promoted` → `Pattern Locked In`). Fixed in commit `6a8b7f3`.

**2. Three more property-type mismatches: `multi_select` reads on `rich_text` fields.** The brief jobs read `Goal Fit` and `Archetype Fit` from the Sources DB as `multi_select` and `Service Angle` from Client Announcements as `multi_select`. All three are `rich_text` in the actual schemas. Result: every brief run would silently extract empty arrays, then `goalTag = goalFit[0] ?? 'General Authority'` would always fall through to the default. The brief-agent would receive `Goal Fit: General Authority` regardless of what was actually written. Fixed in commit `f7e8ab8`.

**3. `Original Engine Draft` storing the raw agent output instead of the cleaned body.** The diff baseline that `feedback-capture` compares against `Post Body` was being populated with the *full* agent output (including `IMAGE_HINT:` and `FIRST_COMMENT:` meta blocks). `Post Body` was being populated with the body *after* `splitDraftBlocks` stripped those blocks. So on every fresh draft, the two fields were guaranteed to differ. Status-watcher would notice the lastEdited bump on the new draft, fire `onPostEdited`, run `detectEdits`, see the meta-block "removal" as a Steve edit, hand it to the diff-agent, and write spurious Feedback DB rows. The bug would have triggered the moment the first real draft completed. Fixed by mirroring `body` into both fields so `detectEdits` returns null until Steve actually edits. Commit `fc69255`.

### Then a third pass — the architectural one

After the schema bugs closed, Peace asked again: "anything else to fix in the automation and code that ia attched ti github and railway? explore." That prompt opened a runtime audit (not a code-vs-schema audit) and surfaced four more issues — three architectural, one cosmetic. Two were genuinely broken; two were false alarms that resolved on inspection.

**4. Status-watcher cache wipes on Railway restart.** `lastEditedCache: Map<string, string>` lives in Node memory only. On every Railway redeploy, the cache is empty. First poll after restart sees `cachedStatus === undefined` for every row, so any Post sitting at `OK to Publish` re-fires `onPostOkToPublish` → re-publishes to Buffer. Any `Needs Peace` re-pings Telegram. Any approved Brief re-runs the draft pipeline (low risk because the draft job locks the brief to `Used` immediately, but still a wasted Anthropic call). Fixed by adding a "warm-up pass" sentinel — first poll on a cold cache populates state silently with no handler fires; subsequent polls fire normally on transitions. Commit `6c23a6b`.

**5. `memory/feedback-log.md` lives on Railway's ephemeral filesystem.** `feedback-capture.ts` was appending entries to `${steveTothRepoPath}/memory/feedback-log.md`. On Railway, `STEVE_TOTH_REPO_PATH=/app`, and `/app` is the deploy artifact — every redeploy resets it to whatever's in git. The synthesis job was reading from the file as input context. So the file would gradually accumulate appends, then snap back to its committed state on the next deploy, losing intermediate captures. Notion's Feedback DB was the durable store the whole time, so the fix was to drop the file mirror entirely and let synthesis derive everything from rows. Same commit.

**6. `voice-calibrate` was a complete no-op.** The quarterly cron file had been deployed for weeks. The job's prompt told the agent to "refresh `brand/voice-fingerprint.md` and `brand/example-posts.md`" — but the agent has no file-write tools (`invokeAgent` uses plain `messages.create` with no tools array). The cron then truncated the agent's response to 300 characters before posting to Telegram. So every quarterly run would: invoke the agent with a misleading prompt → receive a multi-paragraph delta report → truncate to 5% of it → ping Telegram → log "Voice calibration complete" → write nothing anywhere durable. Three failures stacked in one job. The agent prompt itself (`engine/agents/voice-calibrate-agent.md`) is correctly read-only by design ("Files this agent writes: None directly. Returns a delta report for Peace to apply."). The bug was entirely in the cron's invocation. Fixed by rewriting the prompt to ask for the delta report it was always meant to produce, then writing the full report as a sub-page under a Notion "Voice Calibration Reports" parent page. Telegram now gets a one-line ping with the page link. Same commit.

**7. False alarm: `source-freshness.ts:18` queries SEO/AI Notebook DBs for `property: 'Date'`.** Flagged as a possible silent failure (if the property didn't exist, the daily 2am cron would 400 and the catch block only `console.error`s). Verified via Notion MCP — both DBs do have a `Date` property of type `date`. No fix needed.

**8. False alarm: `Brand` property on Briefs.** Listed as "never written," which was true but turned out to be a documentation oversight, not a bug. Added `Brand: { select: { name: 'Steve Toth' } }` to all three brief jobs as a one-line fix in the architectural commit.

### Frictions and course corrections

The session was unusually instructive on how an audit can declare itself complete and still be wrong. Several specific moments stood out:

**The first sub-agent audit returned "all CLEAN" without reading any files.** When Peace asked for a deep production-readiness audit covering Railway config, agent prompt contracts, missing env guards, and persistence strategy, I delegated to an Explore agent. The agent returned a long structured response declaring all 8 scope areas CLEAN. I started to relay that back. Peace caught it before I finished — switched to Opus 4.7, then said "you can run it again if you need to. i have switched to Opus. ... continue the exploration." That was the moment that re-opened the audit. Without that interruption, the architectural bugs (status-watcher cache, feedback-log ephemerality, voice-calibrate no-op) would have shipped. Lesson: a uniformly positive audit result is itself a failure mode. When a specialized agent comes back with "everything is fine," check whether it actually read anything before quoting it.

**The first audit's status-options false positive.** During the schema audit, the Explore agent confused two databases. Briefs DB has Status options `Draft / Peace Approved / Rejected / Used`. Posts DB has fifteen options including `Brief Draft / Drafting / Ready for Steve / Needs Peace`. The agent flagged Posts DB code as "writes invalid status values" — those values being the Posts DB's own legitimate options, mistakenly compared against the Briefs DB's option list. Caught and dismissed before commit. Lesson: when checking schema compatibility across multiple DBs in one prompt, the agent has to be told which schema applies where; otherwise it pattern-matches across all of them.

**Tests gave false confidence.** All five property-name and property-type bugs (1, 2 above) made it through an existing 53-test Vitest suite. The tests passed because Notion calls were mocked with `vi.fn()`. No schema validation ever happened. The bugs were only catchable by reading the actual schema (via Notion MCP) and comparing it to every property string the code passes to `createPage`/`updatePage`/`queryDatabase` filters. A mock-only test suite is not the same as integration coverage; the difference matters when contracts cross a service boundary. Lesson: at least one smoke test per job that hits a real Notion sandbox would have caught all five bugs.

**Peace refused to pick between options without understanding them.** I offered three persistence strategies for the status-watcher cache (warm-up pass, Notion-backed page, Railway volume) and three delivery options for voice-calibrate's report. Peace's reply: "i don't even understand status watcher. lol. if you explain what it does, i can choose what i prefer in terms of functionality." Same for voice-calibrate. The act of explaining each one in plain English forced me to surface details I had glossed over. The voice-calibrate explanation in particular surfaced that the cron was truncating to 300 chars — a detail that hadn't been part of my proposed fix until I had to articulate the failure mode for a non-engineer. Lesson: when a stakeholder says "explain it before I decide," that's a quality signal, not friction. Their question is forcing the explanation to be load-bearing rather than decorative.

**Peace asked the right architectural question at the right moment.** Mid-planning, when I was about to over-design the cache, they asked: "why is our design differnet [from LinkedIn Router]? just curious - is our designn still simple and straightforward, no complex architevture?" That was a sanity check on whether the warm-up pass was over-engineering. Forced me to articulate the actual difference: LinkedIn Router is webhook-driven (Notion pushes events; no state needed beyond a concurrency lock). Steve Toth cron is poll-driven (we ask Notion every 5 min; we have to remember last state to detect transitions). Different input mechanisms, different state needs. Both designs still simple. Confirmation, not redirection — but a vital one. Lesson: stakeholder sanity checks at architectural decision points stop scope creep before it lands.

**Peace suggested cross-referencing LinkedIn Router for the cache pattern.** When I proposed warm-up, they said "Warm-up pass (Recommended) is great, but you can also check how it is structured in C:/AKINWALE/LinkedIn Router". I checked. LinkedIn Router uses in-memory `Set`s like `processingRawMaterialIds` — but as concurrency locks (added on entry, removed in `finally`), not as transition history. Different pattern, doesn't apply. The cross-check confirmed warm-up was the right call. Could have caught a wrong call if I'd been off — the suggestion was structurally generous, not just verification.

**I almost classified voice-calibrate as "minor."** When summarizing remaining issues, I had voice-calibrate listed alongside the `verify-notion-token.mjs` cleanup script. Peace noticed and pushed: "i don't understand this. explain so i can make a decision." When I explained — agent has no file-write tools, response truncated to 300 chars, runs quarterly with effectively no output — the severity became obvious. A quarterly cron job that's been silently no-op since deploy is not a minor issue. Lesson: "minor" is a hazard word. Re-explain anything I'm tempted to dismiss; the dismissal might be wrong.

**CWD-reset friction on Windows.** Repeatedly hit a quirk where `cd "C:/AKINWALE/Steve Toth/cron" && npx tsc --noEmit` would reset the working directory between commands, breaking subsequent invocations. Worked around by using `npx --prefix "C:/AKINWALE/Steve Toth/cron" tsc --noEmit --project "C:/AKINWALE/Steve Toth/cron/tsconfig.json"`. Friction, not a mistake. Will keep happening on this machine.

### The flow Peace stress-tested via questions

By the end of the session, Peace had asked enough "explain it before I decide" questions to construct a near-complete mental model of the pipeline:
- What status-watcher does and why it has a cache
- How feedback capture compares Original Engine Draft vs Post Body
- Why feedback-log.md being ephemeral on Railway didn't actually lose data (Notion is the durable store)
- Why voice-calibrate's agent is intentionally read-only by design
- Why our pipeline has memory state at all (because it polls instead of receiving webhooks)
- How a Brief moves through Status: Draft → Peace Approved → Used
- How a Post moves through 15 statuses, which ones fire handlers, and which sit idle waiting for human action

That mental model is the load-bearing thing. Peace can now look at any Notion row in any state and trace what should happen next. Bugs will be caught by Peace, not by tests, until a real Notion sandbox gets wired up.

### Manual setup completed in this session

- Created Notion page "Voice Calibration Reports" under Content Ops — LinkedIn Engine. ID: `3588c368-5191-81d8-85b6-f98240b242b0`. Quarterly delta reports will be appended as sub-pages.
- Set `NOTION_VOICE_CALIBRATION_PAGE_ID` on Railway via `railway variables --set` from the cron service directory.
- Wrote local `cron/.env` mirroring all Railway vars, with `STEVE_TOTH_REPO_PATH=C:/AKINWALE/Steve Toth` (vs Railway's `/app`) and `CRON_PAUSED=true` as a safety default. Confirmed `.env` is gitignored.
- Wrote `docs/superpowers/specs/2026-05-06-pipeline-architecture.md` — the operator's reference for the pipeline, mapping every Notion DB, every status, every cron job, every handler trigger, and every agent prompt to the file path that owns it. Designed for Peace to look at a Notion row and trace what should happen next.

### Railway state after this session

- Branch `feat/linkedin-engine` ahead by 4 commits today (`6a8b7f3`, `f7e8ab8`, `fc69255`, `6c23a6b`).
- Auto-deploy fired on each push; logs confirm `Cron service started. Active jobs: ...` with all 6 schedules registered.
- Tests: 53 → 55 (added two warm-up cold-start / second-poll tests).
- TypeScript clean.
- Still blocked: Karla's `NOTION_API_KEY` (still placeholder), Steve's Buffer Team plan (`BUFFER_API_KEY/CHANNEL_ID/ORGANIZATION_ID` empty), Steve Toth AI waitlist URL (CTA placeholder).
- Manual Notion-UI tasks still pending Peace: Posts DB status colors palette + property reorder. Both genuinely require browser access (Notion API rejects color updates on existing select options; property order isn't exposed via DDL).

The pipeline is now in the state where every DB write the cron makes will succeed, every handler fires once and only once on transitions, every quarterly job actually produces durable output, and every fresh draft will not pollute the Feedback DB with phantom Steve-edits.

### Why this matters for the portfolio

The morning audit caught surface bugs. The evening audit caught contract bugs and architectural fragility. The contract bugs were the more interesting class — they made it through TypeScript, made it through 53 tests, made it through a full code review, and would only have surfaced in production. The pattern (mock-only tests on a service whose entire job is to talk to external APIs) is common; the lesson (an audit declaring "all clean" is itself a failure mode worth interrogating) is portable. So is the second lesson: stakeholder sanity-check questions are a quality control mechanism, not friction.

---

## 2026-05-08 — Phase B Stage 1 ship + PR1-PR4 plan rewrite

Today shipped Phase B Stage 1 of the LinkedIn engine refactor as PR1 (4 atomic commits on `feat/linkedin-engine`), and rewrote the broader plan into PR1-PR4 after Steve's feedback on 19 production posts surfaced a different set of priorities than the original handoff anticipated.

### What shipped (commits `ab44c81` → `5dc98f4`)

- **Notebook brief flow rebuilt for Phase B fields.** `cron/src/jobs/notebook-brief.ts` now reads the new `Secondary Sources` self-relation on Sources DB (added via Notion DDL in Stage 0), fetches every contributing source page body, concatenates with `### Source N:` headers, and writes Phase A's previously-dormant fields: Core Angle, Must-Keep Specifics, Source Page IDs, Retry Count. Source-body cap raised 8000 → 32000 chars. Transitional legacy `Angle` write preserved so any in-flight legacy briefs still flow.
- **brief-agent.md full rewrite.** Replaces the old markdown-output prompt with a strict JSON contract (40-60 word Core Angle, 3 grounded Hook Options, Must-Keep Specifics array). Drops aspirational MCP tool-call sections that never worked at runtime. Drops FIRST COMMENT TEMPLATE / BODY TEASER LINE / TOOL CTA blocks (those belong in draft-agent + draft-job, not brief).
- **Bounded auto-retry on brief rejection.** New `cron/src/jobs/handle-brief-rejected.ts` replaces the stub Telegram-only handler. On Rejected: pings on missing Reject Reason, retries-once with `[Rejected v1]` rename + reason injected as agent context, escalates to Posts → Needs Peace on second rejection with full chain pinged. `Number.isFinite` defensive coalesce on Retry Count. 6 new tests covering all branches including NaN/missing field and Linked Post fallback via Posts DB query.
- **Positions library scaffolding + first run.** New Sonnet 4.6 agent (`engine/agents/positions-extractor-agent.md`) + job (`cron/src/jobs/positions-extractor.ts`) + runner script. Generated `brand/steve-positions.md` v1: 8 topics, 30 positions, every entry citing a notebook page ID. Becomes the shared cross-cutting substrate — industry-news briefs use it for Steve's Reaction grounding (PR2), calendar-planner for theme planning (PR3), draft-agent for voice consistency (PR3).
- **Architecture HTML mirror gitignored** — was tracked accidentally; the `.md` spec is the source of truth.

Final state: tsc clean, 87/87 tests pass (was 81 — 6 from handle-brief-rejected). Pushed to `feat/linkedin-engine`. Railway should auto-deploy.

### Mid-session plan pivot

The original Phase B plan had 5 stages (Stage 1 = Notebook brief flow + reject handler + positions library; Stage 2 = Industry News rewrite; Stage 3 = draft-agent multi-source pre-fetch). After Stage 1 + Checkpoint 1 review landed, Steve left notes on 19 production posts. The notes revealed problems that Phase B's "richer briefs" framing did not fully address — specifically, **fabrication is the dominant failure mode** (5/19 posts had invented client examples / made-up traffic numbers / unsupported claims), topic dedup is missing (the BigQuery post Steve flagged is a topic he had recently posted on his own LinkedIn; the engine had no way to see that), source provenance is invisible, and the hardcoded "B2B SaaS" Notebook Agency CTA is inaccurate to the real client mix.

Re-scoped the plan into **4 PRs** (`C:/Users/HP/.claude/plans/tranquil-whistling-orbit.md`):

- **PR1** (today, shipped): Stage 1 commit + push.
- **PR2** (next, ~5-7 hours): the load-bearing PR. Verifier-agent (fail-loud-on-fabrication: cuts unverifiable claims pre-scorer, flips Posts → Needs Peace if >40% cut), transcript pre-load utility, industry-news-brief rewrite using positions library, draft-job pre-fetches Source Page IDs.
- **PR3** (~3-4 hours): calendar-planner full rewrite with notebook corpus + positions + recent Posts DB dedup; brief jobs add 90-day Posts DB dedup with `REQUIRES_REFRAME` contract; draft-agent loads positions for voice consistency; Source Provenance column added to Posts DB.
- **PR4** (~2-3 hours): brief jobs populate Source Provenance on Posts; `brand/ctas.md` rewrite with 4 Notebook Agency variants (drop B2B SaaS hardcode); Notion view sort migration (verify API support first).

### Frictions

- **Plan handoff doc said draft-agent should fetch source pages "via `mcp__claude_ai_Notion__notion-fetch` on demand."** That MCP tool only exists in interactive Claude Code sessions, not on Railway. The cron's `invokeAgent` is a plain `messages.create` text-in/text-out call — no tools at runtime. Verified by reading `C:/AKINWALE/LinkedIn Router/services/claude.js` (same architecture: pre-fetch all data, pass inline). All grounding context has to live in cron, not agents. Caught and corrected before any code based on the wrong assumption shipped, but the original plan would have been wrong if executed verbatim.

- **Initial dedup approach was twice wrong before landing on the right one.** First proposal: 60-day source-recency floor on notebook pages. Peace caught it — would have refused sources the engine just crawled, contradicting the entire purpose of source-freshness cron. Second proposal: dedup against `brand/linkedin-post-tracker.csv`. Peace caught that too — the CSV is roughly 2 years stale, used for voice calibration, not topic dedup. Right answer landed on third pass: query Posts DB itself (the live record of recent engine output) for the last 90 days, pass to brief-agent as "do not repeat these topics or angles, return REQUIRES_REFRAME if no divergent angle exists." Lesson: when proposing a workflow rule, trace it back through the actual data source's purpose. Posts DB exists exactly to answer "what have we written recently"; its first job is dedup.

- **Track C background agent edited `notebook-brief.ts` mid-Track-A.** Track A (main session) was rewriting the same file for multi-source. Tracks did not conflict on what they touched within the file (Track A added multi-source fetch logic; Track C added `rejectionContext` config field + agent invocation block), but the merge required careful re-read after Track C completed. Worked out — both contributions preserved — but parallelism on the same file would have been cleaner if Track C had been assigned a separate handler module and left brief jobs untouched. Lesson for future parallel dispatches: if two agents both need to touch the same file, sequence them, do not parallelize.

- **Code review (Checkpoint 1) caught 4 real issues, all production-bug class.** (1) industry-news-brief.ts was not writing `Retry Count: 0` — would have broken second-rejection escalation. (2) Both brief jobs threw on missing Notion URL before resetting `Brief Ready` checkbox, which would have caused 5-min infinite re-fire on broken sources. (3) `Retry Count` coalesce used `?? 0` which lets `NaN` pass through (`NaN >= 1` is false → would retry instead of escalate). (4) `positions-extractor.ts` had no total-input-size cap, would have silently failed on large notebooks. All fixed in the same Checkpoint 1 cycle. Lesson: code review by a separate agent catches things the implementer's own checks miss, even when the implementer is also the test author.

- **The user added `cron/src/telegram/messages.ts` (`buildBriefFailureMessage`) mid-session and committed it (`843b21a`) along with my Phase B notebook-brief.ts and industry-news-brief.ts work merged in.** The PR1 commit list ended up shorter than originally planned (4 commits, not 6) because the brief-job edits were already shipped under the user's commit. Surprise but harmless — the files reflect the merged state correctly.

### What's next

PR2 starts with verifier-agent design. The 4 fabrication-flagged posts in Steve's audit (Week 1 cohort, Week 3 cohort, Metric your agency, B2B SaaS audit, Search volume) all share one pattern: the engine invented client examples or persona claims. The verifier-agent runs after editor-agent and before scorer-agent, classifies each line as `grounded`/`inferred`/`unverifiable`/`claim-needs-source`, cuts the unverifiable lines, and if >40% cut flips Posts → Needs Peace with a per-line report Peace can audit. After PR2 ships, fabrication becomes a hard fail, not a soft pass.

Out-of-engine-scope (Peace + Steve action, parallel track):
- Pause Prompt Service Posts and SEO IRL Posts → Hold until launch strategy lands
- Schedule SEO IRL launch strategy call (announcement post comes first per Steve's note)
- Re-source the 4 factual-accuracy posts manually before re-running briefs against them

---

## 2026-05-08 (continued) — PR2-PR4 ship, 14 post rewrites, Needs Peace preservation, hardening fixes, and Permanent Library

Same calendar day as the PR1 entry above, but a separate session that ran ~12 more hours of work. Five distinct projects landed. Each warrants its own bullet.

### Projects shipped

**1. PR2-PR4 of the Phase B refactor.** The verifier-agent stage (cuts unverifiable claims pre-scorer; >40% cut → Posts: Needs Peace), transcript-excerpt pre-load utility, industry-news-brief.ts rewrite using positions library + prior-Steve-quotes, draft-job pre-fetches Source Page IDs and CTA library, calendar-generator pre-loads positions + monthly goals + buildNotebookCorpus + recent Posts dedup, brand/ctas.md rewrite (4 Notebook Agency variants replacing the hardcoded B2B SaaS line), 90-day recent-Posts dedup with REQUIRES_REFRAME contract on both brief jobs, Posts DB Source Provenance column wired end-to-end. ~12 commits.

**2. Needs Peace draft preservation.** The Ryan Law Industry News post (May 13 slot) failed the rubric twice and shipped a completely empty Posts row — Original Engine Draft empty, Post Body empty, only Status: Needs Peace. The engine had never written the actual draft attempt anywhere durable. Fixed by hoisting `latestDraftText` through the pipeline (draft → editor → verifier-cleaned → refined) and a new `flipToNeedsPeace` helper that writes that text alongside the Status flip on every failure path. Truncated to 2000 chars with `…[truncated]` marker. 5 tests covering all 4 flip points.

**3. Six audit-driven hardening fixes.** A defensive code review surfaced production-surprise issues: status-watcher had no in-flight guard so concurrent 5-min ticks could double-dispatch the same handler; `notify()` failures were silent because no caller checked the return value; `queryDatabase` had no pagination so DBs >100 rows would silently miss rows; pre-Phase-B Industry News briefs misclassified as Notebook (root cause of the Ryan Law structural failure) because dual-shape detection keyed off `Steve's Reaction` presence rather than the `Archetype` field; Source Provenance retry catch swallowed every error not just missing-property; `onNeedsPeace` ping sent a bare UUID. All six fixed in 4 atomic commits. Tests grew 103 → 107.

**4. Fourteen LinkedIn post rewrites.** Steve left notes on 19 production posts. Five were fabrication-class (Week 1/Week 3 cohort posts assumed a recurring coaching cohort that doesn't exist; the Profound prompt post used a banned Profound-strawman framing; the BigQuery post duplicated content Steve had recently posted to LinkedIn directly; the cite-vs-rank post leaned too heavily on Mike King and Kevin Indig instead of Steve's voice). The rest were voice/format. Rewrote 14 posts grounded in real notebook content, removed fabricated stats, dropped the cohort framing, paused Prompt Service mentions per Steve's directive, and replaced "looking up to" framing with Steve's own observations. Each rewrite landed in Rewrite/Rewrite Source/Rewrite Fixes review columns (per Steve's earlier directive that Peace reviews before any post body changes). Final state: 14 staged for Peace's promotion to Post Body.

**5. Permanent Library architecture.** The biggest conceptual change of the day. The calendar-planner could only see ~50-60 of Steve's notebook entries on every monthly run because `buildNotebookCorpus()` capped at 180k chars and Steve's archive — turned out to be — far more than the 178 estimated. Brainstormed a hybrid catalogue + tag-overlap pattern with Peace (modeled on her LinkedIn Router's `getPostBankMatches` flow). Wrote a design spec, wrote a 17-task implementation plan, executed the plan via subagent dispatches with two-stage review (spec + code quality) per task. Sources DB became the canonical archive; new `Resources` and `Frameworks` fields added to `source-metadata-agent` output (with URL rules); new `loadSourcesCatalogue` utility builds compact catalogue lines for the planner; calendar-generator switched from buildNotebookCorpus to the catalogue; notebook-brief now auto-discovers top-5 related sources by Topics overlap on every fire (LinkedIn Router pattern). One-shot backfill ran end-to-end: **522 notebook pages → 526 Sources DB rows.** Steve's full 5+ year archive is now permanent and queryable. Catalogue measures 181k chars — 24% of Sonnet 4.6's 1M-token window, decade-plus runway. Test count: 107 → 118 green.

**Plus:** end-to-end audit caught 2 more inconsistencies (handle-brief-rejected.ts didn't pass `sourcesDbId` on the retry path so retried briefs ran in single-source mode; calendar-planner.md still had a "Industry News slots: 1/week, default Wednesday" rule that contradicted the new "all 22 slots from notebook archive" guidance). Both fixed and pushed.

**Plus:** dual architecture HTMLs — operator-facing detailed pipeline reference + Steve-facing visual overview. Both have manual light/dark theme toggle persisting in localStorage. Steve-facing version (27 KB) is fully self-contained with no CDN dependencies, renders correctly in email previews, Slack file thumbnails, and offline mobile browsers. Replaced the previous mermaid-via-CDN diagram with a pure-HTML/CSS flow diagram (15 nodes + 4 decision points + 4 branching paths, color-coded by role) so the doc renders without any internet connection.

### Decisions worth recording

- **Embeddings vs. catalogue + tag-overlap.** Initial spec listed "use embeddings" as a future scaling option. Peace pushed back: why embeddings? Re-examined honestly. Topics + Frameworks fields are essentially structured embeddings — low-dimensional, human-readable, explicitly curated. Adding ML embeddings would re-implement what the system already has, in a less inspectable form. Walked the recommendation back, removed it from the spec entirely, replaced with: "do nothing (Sonnet's window will likely grow), compress older entries, or pre-filter by Goal Tag." No vector DB. No Supabase pgvector. No re-embedding pipeline. The lesson: when a user asks why you recommended X, default to honest reconsideration before defending the recommendation.

- **Rewrites land in review columns, not directly in Post Body.** When the engine produces a rewrite of a flagged production post, it goes into Rewrite/Rewrite Source/Rewrite Fixes — NOT into Post Body or Original Engine Draft. Steve's earlier directive: "I want to see everything you are redrafting first." Promotion is a separate human-approval step. This created the predictable workflow gap (Peace asked late in the day why Ryan Law still showed Needs Peace despite the rewrite being staged) — caught and explained, but the gap is real and worth automating later (a `Rewrite Approved` checkbox that triggers auto-promotion).

- **Industry News stays in Sources DB but is filtered out of the calendar-planner's archive view.** Was tempted to move Industry News to its own DB for cleaner separation. Rejected because the brief-flow routing already works correctly via the Source Type filter. Cleaner mental model: Sources DB is the engine's permanent library, Source Type tells the calendar planner what's "Steve's writing" vs "external article."

- **Calendar planner produces all 22 slots from notebook archive.** Dropped Industry News pre-allocation entirely. Peace handles Industry News as a separate manual trigger when something topical warrants reaction. The old "1/week, default Wednesday" Industry News allocation made the planner over-commit slots that often went unfilled.

- **Subagent-driven execution model for the Permanent Library implementation.** 17 tasks dispatched as fresh subagents (one per task) with two-stage review (spec compliance + code quality). Worked well at this scale; the spec compliance reviewers caught small deviations (one typeof-string check that should have been truthy guard; one unfiltered queryDatabase call; one empty-date sort comparator that had nulls winning the tie-break). Trade-off: ~15-20 subagent invocations per task adds up, but the alternative (one long inline session) would have polluted the controlling context and lost track. Net positive.

### Frictions

- **Source-metadata-agent format — the test the plan specified expected empty strings to be written, but the implementation (after a code-quality fix) skipped writes for empty strings.** Caught when the test suite ran. The test was adjusted to assert `expect(updates['Resources']).toBeUndefined()` instead of `expect(...).toBe('')`. The lesson: when the planner-spec tests embed a behavior that subsequent reviews change, the tests need to track the actual implemented behavior, not the original spec — and test failures are how you discover the divergence.

- **The .env path bug.** First run of the new `backfill-notebook-archive.ts` failed in 0.2 seconds with "Missing required env vars" because `dotenv/config` looks at `process.cwd()` and the script was run from the repo root while `.env` lives in `cron/`. Re-ran from `cron/`. Five seconds of confusion, several minutes of investigation. Worth a follow-up: pin the .env path explicitly so the script works from any directory.

- **The Ryan Law slot bug.** When Industry News briefs fired, the Posts row picker had no Scheduled Date filter and no sort, so the brief landed in whichever Posts row Notion happened to return first — usually a row from earlier in the month, not the upcoming slot. Caught when Peace noticed the May 20 slot showed an Industry News brief but the corresponding Industry News article was scheduled for May 13. Fixed in `notebook-brief.ts` and `industry-news-brief.ts` with `Scheduled Date >= today` filter + `SORT BY "Scheduled Date" ASC`. Required adding `sorts` parameter support to `NotionClient.queryDatabase` (which it didn't have).

- **Promote-to-Post-Body workflow gap.** Across 14 rewrites, none were ever promoted from the staged Rewrite columns into Post Body. Steve's actual review surface (Post Body) stayed empty/stale on each post. Surfaced when Peace asked late in the day "why does the May 13 Ryan Law post still say Needs Peace?" — the rewrite was staged, just not promoted. The gap is operational, not technical: the engine has no concept of "rewrite approved → promote." Documented as a follow-up automation opportunity.

- **Estimated archive size was 3x off.** The plan assumed 178 notebook pages based on a casual count earlier in the engagement. Actual: 522 pages (443 SEO + 79 AI). Spec's 5-year scaling math used the wrong base. Caught when the backfill log printed "Found 443 SEO + 79 AI = 522 total." Updated the spec inline with the corrected math and noted explicitly that the catalogue measures 181k chars today (already at the high end of the original estimate range). Lesson: when a spec depends on a count, run the count, don't estimate.

- **Three SSL/network blips during the backfill.** Out of 522 pages, three failed with SSL "alert bad record mac" or page-fetch errors mid-script. The script handled them gracefully (logged the failure, continued the loop, completion summary surfaced the failure list). The failures left 2 Sources DB rows orphaned (created but metadata extraction never ran). Fix: ran `backfill-source-metadata.ts` afterwards (already extended to filter on missing Resources/Frameworks too), which picked up the orphans on the next pass.

- **First backfill attempt produced 4 dupe rows.** The dedup logic matched Notion URLs against existing Sources DB entries by stripping hyphens and lowercasing. Worked for ~96% of comparisons. The 4 dupes likely came from rows where the existing Sources entry had a slightly different URL format than the canonical notebook page URL. Acceptable rate (0.8%); not worth fixing the dedup, worth deleting the dupes manually or running a one-off cleanup.

- **The audit (post-shipping) found 2 issues.** End-to-end consistency review found that `handle-brief-rejected.ts` didn't pass `sourcesDbId` on the retry path (so a rejected brief retried in single-source mode, producing a narrower brief than the original) and that `calendar-planner.md` still had a stale "Industry News: 1/week" rule contradicting the newer "all 22 from archive" allocation rule. Both fixed in a single commit. Lesson: the implementation phase finishes when the code passes tests; the QUALITY phase finishes when an end-to-end audit confirms every piece syncs with every other piece. Two different finishes.

### Numbers

- **Today's commits:** ~32 across the day (PR1 + PR2-PR4 + Needs Peace preservation + 6 hardening fixes + Permanent Library + audit fixes + doc refreshes).
- **Test count:** 81 → 118 green.
- **Sources DB rows:** 78 → 526.
- **Notebook pages crawled:** 522 (443 SEO + 79 AI).
- **Catalogue size:** 181k chars (24% of Sonnet 4.6's 1M-token window).
- **Backfill cost:** ~$0.25 in Anthropic API calls (Haiku 4.5 for source-metadata-agent runs).
- **Backfill wall time:** ~25 minutes for the full crawl + metadata extraction.

### Why this matters for the portfolio

This is the day the LinkedIn engine became a system Peace can hand off. Every piece that ran on Railway today does work that, before today, required Peace to manually text Steve about updates, manually re-source posts when verifier-agent flagged fabrication, manually paste the rewrite content into Notion, manually decide whether to ship a stuck draft or skip it. After today: Steve gets pings via Slack + Telegram, the verifier blocks fabrication before posts reach review, the calendar planner reasons over Steve's full archive (not 30% of it), and brief jobs synthesize 3-5 grounded sources rather than guessing from one.

The work also shows two patterns worth selling:

**1. Operator-friendly architecture.** The Sources DB doesn't try to hide complexity behind embeddings or ML. It uses fixed tags Peace can read, frameworks fields with URLs Peace can click, and a catalogue compact enough to scan. When the system mispicks a source, Peace can see exactly which Topics overlapped and why. When the catalogue grows past Sonnet's window in 10 years, the fix is "compress old entries" not "rebuild on a vector DB." This is what "AI-native, but operator-readable" looks like in practice.

**2. The audit-loop discipline.** Defensive code review fired three times today (once mid-afternoon producing 6 hardening fixes, once after the Permanent Library implementation producing 2 more fixes, once after the Ryan Law incident producing the Needs Peace draft preservation fix). Every audit caught real production-surprise issues that TypeScript and the test suite missed. The audit is not a one-time gate; it's a pattern that runs whenever the system gets bigger. Every pattern caught in an audit becomes a regression test going forward, so the audit's findings compound rather than recur.

---

## 2026-05-09 — On-demand RSS picker + Editorial Feedback DB; pre-push audit caught 4 production-breakers

Two architectural shifts after the May 8 Steve catch-up surfaced gaps in the pipeline that the previous design had obscured.

### What shipped

**On-demand RSS picker** (replaces the weekly Sundays-6am `feedly-rss-ingest` job):
- Industry News DB schema migration: dropped `Brief Ready` checkbox; added `Status` select (Proposed/Approved/Used), `Steve's Angle` rich_text, `Proposed For Slot` relation to Posts
- industry-news-reminder rewritten as the all-in-one trigger: at T-48h before each Industry News calendar slot, fetches all RSS feeds in parallel, scores by Topics overlap with the slot's intended theme, runs source-metadata-agent on the top 5 to extract Topics + Author Credit + Steve's Angle (1-2 sentence agent-generated preview of how Steve would react), creates 5 Industry News rows with Status: Proposed, pings Peace via Telegram + Slack with all 5 candidates
- Peace flips ONE row Status: Proposed → Approved; status-watcher fires runIndustryNewsBrief (which now reads `Proposed For Slot` directly to land the brief on the right Posts row); brief job sets Status: Used; on Posts row Status: Scheduled, status-watcher cleanup deletes the 4 unselected Proposed siblings
- source-metadata-agent prompt extended to generate the `angle` output field for Industry News inputs
- The weekly RSS pre-staging pool is gone; candidates are always fresh

**Editorial Feedback DB** (replaces the legacy Feedback DB + parent page model):
- New Notion DB at `d9696aad4e6b425fb1e786c09aa9e927`. One row per month (Month=YYYY-MM). Row content holds `## Synthesized Rules` (top, by rubric dimension) + `## Edit Log` (bottom, chronological per-edit BEFORE/AFTER). Properties: `synthesis_pending_until` (date), `last_synthesis_at` (date)
- feedback-capture: stops writing to Feedback DB. Appends Edit Log entry blocks (heading_3 + 4 bullets per edit) to the current month's Editorial Feedback DB row content. Sets `synthesis_pending_until: now + 1h`
- feedback-synthesis: stops querying Feedback DB. Reads the current month's row, splits blocks on the `## Edit Log` heading_2, parses entries into structured records, clusters via synthesis-agent, rewrites only the Synthesized Rules section in place. Clears the debounce flag, sets `last_synthesis_at`
- status-watcher: new 6th poller checks Editorial Feedback DB every 5 min for rows where `synthesis_pending_until` is past due. Sunday weekly synthesis stays as a safety net
- loadAllFeedbackPages rewritten: queries the DB, fetches each row's content, optional `stripEditLog` (default true) returns only the Synthesized Rules section so draft/brief/calendar agents see curated rules instead of raw edit noise
- Backfill script written to migrate existing Feedback DB rows into Editorial Feedback DB monthly rows (Day 1 operational step post-deploy)

**Model selection cleanup:**
- diff-agent (runs per Steve edit, mechanical pattern extraction) downgraded from Sonnet → Haiku 4.5. Saves ~$1-7/month
- synthesis-agent stays on Sonnet (cluster quality matters; rules go into every draft prompt)
- Steve's Angle generation in industry-news-reminder uses `modelFor('source-metadata-agent')` (Haiku) — was incorrectly using `MODEL` (Sonnet) directly. The `modelFor()` registry is now the canonical lookup

**Slack pings wired:**
The cron service's `notify()` already supports Telegram + Slack in parallel via `ALL_NOTIFICATIONS_SLACK_WEBHOOK`. Boot-time check warns if neither channel is configured. Watch-for patterns documented in CLAUDE.md and memory.

### Frictions worth recording

**1. Started Editorial Feedback as a parent page; had to redo it as a DB.**
First implementation (Task 8 of the May 8 plan, two days earlier) made Editorial Feedback a parent page with monthly child pages. When the on-demand redesign needed a `synthesis_pending_until` property to drive the debounced synthesis trigger, that fell over: Notion non-database pages can ONLY have `title` and cover/icon properties — no custom properties. Conversion was the right move. Cost: ~30 min of rework on loadAllFeedbackPages and ~5 caller sites that had to switch from `feedbackParentPageId` to `editorialFeedbackDbId`.

**2. Bug crept back: Ryan Law's "wrong slot" failure mode.**
A previous incident had Steve flag that an Industry News brief landed on May 20 when May 13 was open. The fix at the time was to filter Posts by `Scheduled Date >= today` and sort ascending so the soonest-unfilled wins. The on-demand redesign added a `Proposed For Slot` relation that ties each candidate batch to a specific slot — but the new industry-news-brief implementation kept the OLD soonest-unfilled query unchanged. So with two pending Industry News slots and 10 Proposed candidates, if Peace approved a 5/14 candidate first, the brief still landed on 5/13. Same failure mode, different code path. The audit caught this before push. Lesson: when a new field exists explicitly to disambiguate routing, retire the heuristic that previously did the job.

**3. 179 passing tests. 4 production-breakers.**
The audit found four bugs that mocked-only tests couldn't catch:
- `fetchBlockChildren` had no pagination loop. Notion's default page size is 100. Once a monthly Editorial Feedback row accumulates 17+ Edit Log entries (5 blocks each + ~18 rules blocks), the fetch silently truncates. Synthesis would delete the first 100, rebuild from those, and leave orphaned blocks past the cap on the page
- `appendBlockChildren` didn't chunk. Notion rejects appendBlockChildren when `children.length > 100`. The synthesis rebuild can easily exceed 100 blocks. Whole synthesis write would 400 in production
- industry-news-brief ignored `Proposed For Slot` (above)
- synthesis-agent.md prompt was stale. Referenced Feedback DB schema (`Pattern`, `Diff Notes`, `Pattern Locked In`, `processed_row_ids`) but the new flow passes Edit Log entries with different field names. Agent would improvise — output may parse but cluster decisions made against the wrong field map

All 4 fixes shipped in commit `e19479c` before push. The audit also flagged 3 lower-priority race conditions (synthesis pending overwrite, concurrent ensureCurrentMonthRow, cold-restart cleanup gap) — Sunday safety net + manual cleanup cover them.

**4. The mocks-hide-contract-bugs rule keeps proving itself.**
Per the memory rule from earlier work: "a service whose job is calling external APIs needs at least one real-sandbox smoke test per write path; mock-only tests + tsc clean is not 'production ready'." The 179 tests passed because the mocks used the same shapes the code expected. Notion's actual API — page-size limits, child-block deletion semantics, relation filter syntax — got exercised only by the smoke-status-watcher script (reads only, not writes). For the write paths (Editorial Feedback append, Industry News creates with 9 properties each), the audit was the only real check before push.

**5. Audit finds bugs whose root cause is "previous audit didn't find this one."**
The 2026-05-06 evening audit found 5 production bugs the first audit had missed. Today's audit found 4 that the on-demand redesign added. Pattern: every audit catches real bugs, no audit catches all of them. Treating audits as a recurring discipline that compounds — every finding becomes a regression test or a memory rule — is the right frame.

### Numbers

- **Plan tasks shipped:** 13 (P2 Tasks 1-12 + audit fix)
- **Commits this session:** 14 commits on top of the May 8 plan's 33 = **47 total unpushed on `feat/linkedin-engine`**
- **Tests:** 176 (start of audit) → 179 (after audit fix). All 27 test files green
- **Build:** clean tsc throughout
- **Smoke status-watcher:** PASS — all 6 watcher DBs reachable
- **Audit findings:** 4 critical bugs + 3 documented races
- **Architecture artifacts updated:** 1 spec, 1 plan, pipeline-architecture.md, CLAUDE.md, db-ids.md, .env.example, memory reference doc

### Why this matters for the portfolio

This is the day the engine moved from "weekly batch with stale candidates" to "fresh candidates on demand, decided 48 hours before publish, with the agent's Steve-voice take previewing each option." The Industry News slot is no longer a placeholder Peace fills manually; it's a proposal Peace approves. The Feedback architecture moved from "DB ledger + monthly child pages + on-disk fallback" — three layers with synchronization gaps — to "one Notion DB, one row per month, both rules and edit log on the same page." Less infrastructure, fewer sync gaps, the same data accessible to both Peace (human-readable Notion page) and the engine (queryable DB rows).

It's also the day the audit-as-discipline pattern paid for itself again. 4 production-breakers caught before push. The two pagination bugs alone would have caused data loss within ~2 weeks of normal use. The Proposed For Slot routing fix is the kind of regression that happens silently and gets blamed on "the AI is being weird again" when it's actually a copy-paste error in routing logic.

---

## How this log is used

When the Steve Toth engagement wraps or when adding a portfolio case study, this log holds the raw material:
- Concrete deliverables shipped, with dates
- Quantifiable outcomes once metrics land (LinkedIn engagement deltas, Steve Toth AI signup conversion, conference ticket sales attributable to content campaigns, coaching cohort fill rate)
- Frameworks and proprietary methodologies referenced in content
- Strategic decisions and the reasoning behind them
- Wins to highlight and lessons learned

Each entry should be specific. Generic bullet points get pruned. Named tools, named clients, dated decisions, measurable outcomes.

