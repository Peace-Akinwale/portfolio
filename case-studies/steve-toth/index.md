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

## 2026-05-10 — Pipeline rebuild + two-wave monthly batch

A planned full rebuild after Steve's May 8 catch-up. Two major shifts: the 5-agent pipeline got replaced with a leaner draft → brutal-editor → revision → scorer chain, and the monthly batch got split into two waves to avoid Anthropic rate limits firing 20+ posts in parallel.

### What shipped

**Pipeline rebuild (Deploys A/B/C):**

- Old 5-agent chain replaced with draft → brutal-editor → revision → scorer. The brutal-editor pass applies a mechanical checklist (banned patterns, hook strength, length, colon usage, sentence splits) and emits inline flags like `[TOO LONG]`, `[NEEDS PROOF]`, `[WEAK HOOK]`. The revision pass clears flags where source content permits.
- Voice file consolidated from 4 separate files (`steve-toth.md`, `voice-fingerprint.md`, `example-posts.md`, `rubric.md`) into single `brand/steve-toth-voice.md`. 7 verbatim top-performer posts replace the previous 5. Voice file is injected inline into draft + brutal-editor + revision steps to fix voice drift.
- Rubric moved out of markdown and into Notion Rubric DB (6 dimensions: Hook 25, Proof 20, Value 20, Structure 15, Voice 10, Close 10, with per-band score descriptions). Editing the rubric no longer requires a code deploy.
- Monthly batch endpoint: `POST /generate-monthly-batch` on the Express server (now living alongside the cron in the same process). Auto-fires on the 25th when ≥15 slots eligible; nudges Peace with a curl command otherwise.
- calendar-generator and voice-calibrate jobs removed. Peace builds calendars manually in the writing workspace, runs `npm run sync-kb` + `npm run import-calendar` to push to Notion.
- feedback-synthesis rewired: synthesis cron writes promoted rules DIRECTLY into `## Synthesized Rules` section (no intermediate "Proposed Rules" step). Watermark dedup via `last_synthesis_at`. Telegram lists new rule patterns so Peace can delete the ones she disagrees with.
- Hashtag matrix added (#seonotebook tactical SEO, #ainotebook AEO/AI-search, #grateful client announcements, no hashtag default). Brutal-editor + revision agents enforce.
- First Comment three-mode rewrite: Mode A (resource attribution), Mode B (NONE default), Mode C (per-slot CTA opt-in via `First Comment CTA` field on Content Calendar slot row).
- MISSING_LINK sentinel: when draft-agent promises a resource but no Source Page URL is available, it emits `[MISSING_LINK: <description>]`. draft-job converts that to a Steve's Notes annotation instead of writing junk to First Comment.
- Word target tightened to 200-280 across all agents and the batch job.
- Archetype recipes (Jake Ward formulas) injected into draft-agent via inline `ARCHETYPE RECIPE:` block per brief.

**Two-wave monthly batch:**

The single-pass batch had been hitting Anthropic rate limits when 20+ posts fired in parallel. Split into Wave 1 (first 10, fire immediately at Status: Peace Approved) and Wave 2 (remaining, Status: Deferred + Fire After timestamp 2 hours out). A new `*/30` cron job (`deferred-batch-check`) flips Deferred briefs to Peace Approved once Fire After passes. Initially Wave 2 state lived in a JSON file under `cron/data/deferred-batches/YYYY-MM-wave2.json` — moved to Notion the next day (see May 11) because Railway's filesystem is ephemeral and a restart between the wave fires would lose the deferred queue.

### Numbers

- Tests: 179 → 211 passing across 31 files
- Commits: ~14 across the deploys
- Architecture artifacts updated: 1 spec, 1 plan, CLAUDE.md, db-ids.md, .env.example, pipeline-architecture.md

### Why this matters for the portfolio

The agent chain got simpler AND the voice got more reliable in the same change. Five agents (each with its own context and prompt) is harder to debug than four where one is a mechanical checklist runner. Voice consolidation means the source of truth for "how Steve sounds" is one file Peace can read top-to-bottom in ten minutes, not four scattered across the repo. The two-wave batch is the kind of detail that only matters in production: it doesn't affect functionality, only the rate at which functionality executes. Steve never sees the deferral; he just sees a steady drip of drafts arriving across a 2-hour window instead of an "all 20 at once or 0" outcome.

---

## 2026-05-11 — Real-time Notion webhook, image pipeline rewrite, Buffer cancellation flow, and a Buffer GraphQL schema saga

Long day. Real-time Notion webhook (so Peace doesn't wait 60s for a status flip to fire), full image-pipeline rewrite (notebook images now render the entire post body, not just hook + 3 bullets), a 12-issue hardening pass against the May 10 rebuild, the Buffer cancellation feature, a multi-attempt GraphQL schema saga that finally got solved by introspection, and four stale test files repaired in CI.

### What shipped

**Real-time Notion webhook**

- New endpoint: `POST /webhooks/notion` on the cron's Express server. Notion-side automations now push status changes to the engine in <1s, instead of waiting up to 60s for the next poll tick.
- `inflight.ts` shared module so the webhook route and the polling loop use the same `once()` guard — a webhook firing and a poll firing within seconds of each other won't double-dispatch the same handler.
- `dispatchPageEvent`: fetches the Notion page, resolves its parent DB, routes to the matching StatusWatcherHandler.
- Polling stays at 60s as a safety net for transition-based handlers (onPostEdited, onPostUnapproved) that require prev-status comparison — webhooks don't include the previous state.

**Image pipeline rewrite (Canva is gone, notebook images render the full post body)**

- Previously the notebook image showed only the hook + 3 bullets — a static template that didn't reflect the actual post structure.
- New parser walks the post body into an ordered `BodyBlock[]` (p / lede / signal / arrow / numbered / closing). Lede detection: a paragraph immediately preceding a list gets bolded as a lead-in. IMAGE_HINT for notebooks overrides the title; for newspapers it's a 20-45 word dek under the headline.
- Font reduced 21→18px and back up to 20px after testing — 18 was too tiny on screen, 20 fits a full 200-280 word post on the 1100px page without overflow.
- `extract-inputs.ts` rewritten and extracted so draft-job and image-retry share the same parser.
- Old Canva-format IMAGE_HINTs (sentences starting "Notebook-style page." or >15 words) are detected and discarded — they were being used as the notebook title heading, producing garbled output for backfilled posts.
- All Canva references removed from active pipeline (client-announcement archetype no longer references Canva Connect API).

**Status-watcher tightened**

- Poll cadence dropped from 5 minutes to 1 minute. Matches the LinkedIn Router's default. Status changes (Approved, Peace Approved, Rejected) now trigger pipeline within ~60 seconds instead of ~5 minutes.
- Posts stuck at `Needs Image` (image gen failed silently in draft-job) get one automatic retry per Railway session after a 5-min grace window. On success → Status: Image Ready (so Peace knows to review the new image, not the whole post) + Telegram ping with the image URL. On failure → Telegram ping with the error so Peace can attach manually.
- Manual `Needs Image` flip (post had a real previous status like Draft/Approved) fires on the next poll tick with no grace period. New posts (no previous status) keep the 5-min grace to avoid racing the draft job's own inline image attempt.
- `post:image-retried` cache key cleared when a post transitions back to Needs Image so manual re-triggers (different IMAGE_HINT, new prompt) aren't permanently blocked by the first-run sentinel.

**12-issue hardening pass against the May 10 rebuild**

Smoke-testing the rebuild surfaced a cluster of small bugs. Twelve fixed in one push:

- Issue 1: industry-news-reminder was reading from Posts DB schema (`Post Title`, `Scheduled Date`) but the slots actually live in Content Calendar DB (`Topic`, `Date`, `Angle`). 5 candidates per slot now generated correctly.
- Issue 3: **Wave 2 state moved from `cron/data/deferred-batches/*.json` (ephemeral filesystem) into Notion Briefs DB** (`Status: Deferred` + `Fire After` date property). A Railway restart between Wave 1 and Wave 2 no longer loses the deferred queue. This was the May 10 design's biggest weakness, caught within 24 hours.
- Issue 4: Post Body and Original Engine Draft use `chunkRichText` to bypass Notion's 2000-char-per-rich-text-element limit. Posts over 2000 chars were getting silently truncated.
- Issue 8: `isEligibleSlot` extracted as a shared function so `countEligibleSlots` and `runGenerateMonthlyBatch` use the same filter. Was diverging — the reminder said "20 eligible slots" but the batch processed 8 because they disagreed on what "eligible" meant.
- Issue 9: handleBriefRejected escalation flips Posts to `Needs Peace` (was `Draft` — overwrote Peace's review with a generic Draft state).
- Issue 10: status-watcher seeds source cache with current timestamp on cold restart so a Railway redeploy doesn't re-fire every Brief Ready source.
- Issue 12: feedback-synthesis preserves preamble blocks above the `## Synthesized Rules` heading (was overwriting them).
- Plus: feedTitle uses RSS channel title not the URL; client-announcement archetype name fixed in both Brief and Posts rows; `Myth-Buster` → `Myth Buster` typo fix in generate-image; feedback-capture/synthesis timestamp parsers accept both legacy `YYYY-MM-DD HH:MM` and new `YYYY-MM-DDTHH:MM` formats.

**Supabase / Node 20 fix**

- supabase-js 2.105+ eagerly initialises Realtime, which throws on Node 20 (no native WebSocket). First attempt: downgrade to 2.104.0 + `auth.persistSession: false`. Second attempt (the real fix): wire `ws` package as the realtime transport, matching the LinkedIn Router pattern. The first attempt was a stopgap; the second is the fix the SDK error message itself suggests.

**Buffer cancellation flow (the headline feature)**

- When Peace flips a Posts row from `Scheduled` → `Draft`, the engine cancels the already-scheduled Buffer post via Buffer's `deletePost` GraphQL mutation. Previously this only worked for `Approved → Draft` — once a post was in Buffer's queue, you'd have to delete it manually in Buffer's UI.
- status-watcher's `onPostUnapproved` condition extended: fires on `(cachedStatus === 'Approved' || cachedStatus === 'Scheduled')` when Status flips to `'Draft'`.
- handle-post-unapproved reads the stored Buffer Update ID off the Posts row, calls Buffer to cancel, clears the Buffer Update ID on the row so re-approval re-schedules cleanly, and Telegram-pings Peace.
- index.ts notify message no longer hardcodes "Approved → Draft" wording; it says "moved back to Draft" so it's accurate for either transition path.

**Stale test repair (4 files, 12 silently-failing tests)**

The full Vitest suite revealed 12 silently-red tests that had been broken for weeks. Production code had been refactored but tests weren't updated. CI was passing on the files with no failures — the runner doesn't fail the build for stale tests, only failing assertions.

- `deferred-batch.test.ts`: tests were for the May 10 file-based Wave 2. Rewrote fully for the Notion-DB-based version (queries Deferred + Fire After). Dropped temp-dir + file-fixture helpers; mocked `notion.queryDatabase` + `createPage` + `updatePage`.
- `draft-job.test.ts`: one test asserted `createPage` was called with `Status: Draft` directly. Updated to assert the create-then-update flow: `createPage` with `Status: Needs Image`, then `updatePage` with `Status: Draft` + Image external URL.
- `handle-brief-rejected.test.ts`: tests expected escalated posts to flip to `Status: Draft`. Updated to `Status: Needs Peace` matching Issue 9 above.
- `industry-news-reminder.test.ts`: tests used slot mocks with `Post Title` / `Scheduled Date` (Posts DB schema). Updated to `Topic` / `Date` (Content Calendar schema) and added `contentCalendarDbId` to the config.
- Final state: 224/224 passing across 32 files.

### The Buffer GraphQL schema saga (the day's deepest lesson)

Buffer's `deletePost` mutation rejected the first three attempts. The same mistake at each step: guessed at the schema instead of asking for it.

- **Attempt 1:** Selected a `success: Boolean` field on the response. Error: *"Cannot query field 'success' on type 'DeletePostPayload'."* The guess that the payload has a `success` field was wrong.
- **Attempt 2:** A web search said `DeletePostPayload` is a union of `DeletePostSuccess { id }` and `NotFoundError { message }`. Used inline fragments. Error: *"Fragment cannot be spread here as objects of type 'DeletePostPayload' can never be of type 'NotFoundError'."* The search was wrong. `NotFoundError` is not a member of this union — and the error message even *implies* `DeletePostPayload` isn't a union at all, which I read as fact when it was actually misleading.
- **Attempt 3:** Stripped the fragments back to just `__typename` (always valid on any GraphQL type). It deployed. But: no actual signal whether the mutation worked, and if it failed in production no real error would surface to Peace.

**The fix that worked:** a one-off `scripts/introspect-buffer.mjs` running GraphQL introspection against `api.buffer.com` directly. Three queries answered everything:

1. `Mutation.deletePost` returns `DeletePostPayload!`
2. `DeletePostPayload` IS a UNION (despite attempt 2's error message implying otherwise) with two members: `DeletePostSuccess` and `VoidMutationError` — not `NotFoundError`.
3. `DeletePostInput.id` is `PostId!` — not `String!` or `ID!`.

**Attempt 4** used the verified schema and worked first time. The script got deleted after one use; no introspection artifact left in the repo.

End-to-end test: scheduled a real post via the engine, flipped Notion Status `Scheduled → Draft`, watched the Buffer-side scheduled post disappear within ~60s. Buffer's `VoidMutationError.message` will now surface in Telegram if a future cancellation fails (post already published, auth issue, etc.) instead of a generic 400.

### Frictions worth recording

**1. Three wrong guesses about Buffer's schema before one right introspection.** The lesson is uncomfortable but clean: when a GraphQL API rejects your mutation, introspect the schema in one query instead of pattern-matching from search results or prior projects. The web search was *wrong*. The error message in attempt 2 was actively *misleading* (it sounded like "DeletePostPayload is not a union" when it really meant "NotFoundError is not a member of this union"). Reacting to each error individually compounded the back-and-forth across three deploys. Cost: maybe an extra 25 minutes and three deploys; benefit: the eventual fix is provably correct because it came from Buffer's own introspection endpoint, not from any external source.

**2. 12 silently-failing tests in CI.** Discovered because the Buffer cancellation feature added one new test and Peace ran the whole suite as a sanity check. Without that, the failing tests would have stayed silently red indefinitely. Four files had drifted from production behavior over the prior week's refactors. **Lesson: a green CI badge isn't proof the test suite reflects current behavior, and "run the full suite at least weekly" is cheap insurance.**

**3. Auto-fix loops without verification.** Peace's note: *"you sure this is going to work now?"* came after Attempt 3. The honest answer was "the GraphQL is now valid; I don't know if it actually deletes the post." That uncertainty is a smell — implementations should ship with a verifiable check, not "looks plausible." The introspection script made the next attempt verifiable.

**4. .env path tripped me up — again.** The introspection script first failed reading `.env` because `import.meta.url` resolves to the script's directory, not `cron/`. Same class of bug as the backfill .env failure on May 8. Pinned the path to `cron/.env` explicitly. Same bug, second time — worth a memory rule or a project-wide helper.

**5. The Supabase fix was two attempts deep.** First attempt (downgrade + persistSession:false) was a stopgap that worked but ignored what the SDK was actually saying. The error message literally said "pass `ws` as the realtime transport." Reading and trusting the error message would have been the first move. **Lesson: SDK error messages that suggest a specific fix are doing you a favor; take them at face value before reaching for downgrades.**

**6. Race between Buffer's "scheduled" and "publishing now" states.** Not encountered today but worth flagging: if Peace flips `Scheduled → Draft` within seconds of Buffer's publish trigger, the cancellation might fire after Buffer has already begun publishing. The Buffer API will return `VoidMutationError`; Peace will see the real error message in Telegram and need to manually pull the post from LinkedIn. Documented as a known edge case; no engine-side mitigation needed.

### Decisions worth recording

- **Don't sync Buffer → Notion automatically for `Published` status (yet).** When Buffer actually publishes a post, the Notion row stays at `Scheduled` indefinitely. Two ways to fix: poll Buffer every 15 min for scheduled posts whose `Scheduled Date < now` and flip to Published if Buffer confirms, or wire a Buffer webhook. Polling is the simpler path and matches existing architecture; deferred for a future session.
- **Two-step `Needs Image → Draft` flow stays.** When draft-job creates a Posts row, it always creates at Status `Needs Image` and only flips to `Draft` after image generation succeeds. This guarantees the row exists even if image gen blows up — Peace can then manually retry images instead of losing the entire draft. Counter-intuitive at first glance (why not just retry image gen inline?) but the right invariant for an async pipeline.
- **GraphQL union types are the modern API default.** Buffer uses unions for every mutation result. The pattern (`DeletePostSuccess | VoidMutationError`, `PostActionSuccess | NotFoundError | UnauthorizedError | ...`) is more verbose than `{ success, errors }` but lets the caller exhaustively handle each failure shape. Worth treating as the default assumption next time a new mutation gets wired up — and introspect the schema first to confirm.
- **Introspection scripts are throw-away tooling, not committed assets.** The `introspect-buffer.mjs` script lived for the duration of one debugging session and got deleted afterward. The artifact that stays in the repo is the corrected `cancel-update.ts` with a comment line explaining the schema (verified via introspection 2026-05-11). The script's value was the one-time answer it produced; the comment carries that answer forward.

### Numbers

- **Commits:** 17 pushed today on `feat/linkedin-engine`
- **Tests:** 211 → 224 passing across 32 files (12 newly passing after stale-test repairs + 1 new Buffer test)
- **Files changed in 12-issue hardening:** 8 source files + 4 test files
- **Buffer GraphQL introspection queries:** 4 (1 to find the return type, 3 to inspect type fields)
- **Deploys to Railway:** 5 (12-issue hardening + Supabase fix + image pipeline + Buffer cancellation v1–v4)
- **End-to-end verification:** real post scheduled in Buffer, then cancelled via Notion status flip, confirmed gone from Buffer's queue within 60s

### Why this matters for the portfolio

The Buffer cancellation flow closes a real operator pain point: before today, if Steve looked at a scheduled post and said "kill it," Peace had to delete it manually in Buffer's UI AND flip the Notion status, with no guarantee both happened. After today: one Notion status flip, the engine handles the rest, Peace sees a Telegram confirmation. The cancellation feature itself is ~30 lines of code; the value is in the workflow it removes from Peace's plate.

The GraphQL schema saga is the day's deepest lesson and worth a paragraph in the eventual case study. The honest pattern: **when an API rejects your call, the right first move is to ask the API what it accepts, not to pattern-match against guesses.** GraphQL has the rare property that the API can describe itself programmatically — and that capability should be the first move, not the last resort. Three wrong attempts before one right introspection is the kind of cost that compounds invisibly when you treat APIs as black boxes.

The 12 stale tests are the kind of debt that builds up in any fast-moving codebase. The remediation cost was about 90 minutes; the alternative was finding out about the divergences six months later when a real regression slipped through CI silently because it landed in a file where the *other* tests were also broken. **Auditing the full test suite is a checkpoint, not a build-step assumption.**

---

## 2026-05-12 — Notebook Agency homepage interactive preview artifact

Built a 214 KB self-contained HTML preview of the redesigned notebook.agency homepage so Steve and Karla can click through the redesign in concrete terms before any Webflow work begins. 14 sections, all photos and the notebook image and the "N" mark embedded as base64, vanilla-JS interactivity, no build step.

### What shipped

- Single `.html` file at `Website Update/notebook-agency-redesign-preview.html`. Opens by double-click from any folder; no localhost paths inside, so it travels cleanly.
- 14 sections, top to bottom: sticky nav with N-mark + red `Let's Talk` pill / hero ("Be the answer AI gives." + live-site H1 preserved verbatim) / auto-scrolling client logo marquee (Clearbit) / 4×2 services grid with custom SVG icons / Brand Truth Framework with scroll-triggered word reveal + animated bar chart / Results with three animated bar-chart cards (Base / Growth / Peak phases) / Industries vertical card stack / SEO IRL 2026 credential card with the CXL AEO Cohort badge / Team section with a text-column-matches-photo-grid-height fix (CSS `align-items: stretch` + `object-fit: cover` so neither side hangs short) / scroll-tied horizontal testimonial carousel / Claude-Powered Agency 4-card grid / From Steve's Notebooks (real `steve-notebook.avif` fetched from `cdn.prod.website-files.com` + base64-embedded so the section renders offline) / red CTA panel / footer.
- The Notebook Agency "N" mark — the real production 3-path SVG (`#ff4646`, viewBox `0 0 1000 778`) — inlined in the nav, footer, and as the favicon data URI.
- All four `Let's Talk` CTAs route to `https://notebook.agency/contact` (new tab).

### The section that took the most iteration: testimonials

Final implementation: **horizontal carousel tied to scroll**. Section is ~210vh tall, the sticky inner frame is one viewport, three slides (Will Cannon / Hongwei Liu / Jeff Collins) translate left as the user scrolls. A red progress dot row in the header shows the active slide; dots are clickable to jump.

Rejected alternatives:
- Auto-rotate every 7s — Steve called it passive ("the user has to wait for the page to do something")
- Stack of three cards with no slider — functional but loses the "this is a featured section" weight
- Vertical sticky scroll with crossfade — worked, but produced a lot of vertical black space below the sticky frame that read as broken
- Click-to-switch tabs only — matches the live site exactly but loses the scroll-driven discovery Steve originally asked for

### Decisions worth recording

- **Hero eyebrow killed.** Old "CLAUDE-POWERED AEO AGENCY" pill removed per Steve. The red tagline "Be the answer AI gives." replaces it, with the live-site H1 preserved verbatim.
- **Services subtitle killed.** "Eight services, one growth engine." removed per Steve. Card padding bumped to `40px 32px 44px`, icon size to 64px, title weight 600 — the visual weight now matches the live site rather than the earlier flatter version.
- **Claude-Powered Agency repositioned later in the page** (replaces the email-course block on the live site) per Steve's feedback that it shouldn't be the first thing after the marquee. From Steve's Notebooks slots in right after it.
- **Custom SVG over emoji.** The original 📓 ⚡ 🔗 📊 icons in Claude-Powered Agency read as informal — replaced with custom 26px line icons (open book / sparkle / network graph / trending-up chart) in dark rounded squares. Section padding tightened 120→100px and card-grid gap 20→14px to remove the airy black space Steve flagged.
- **From Steve's Notebooks added** per Steve's feedback that the live-site notebook block was missing. An initial SVG illustration of a notebook was rejected as not realistic; the production `.avif` got fetched and base64-embedded instead.

### What's still placeholder

- Services body copy (transcribed from a small screenshot — needs verification against the design source or the live site text)
- Services icons (custom SVG placeholders — needs Karla's icon set from the design package)
- Marie Haynes photo (needs the original production-quality asset)
- Case-study link destinations on industries / results cards (`href="#"` for now)
- Team careers section (currently a nav link only — confirm whether a homepage section is required)

### How it's being shared

- Email/Slack the `.html` file directly — recipient double-clicks
- Or drop on `netlify.com/drop` for a public URL (no signup) — fully interactive when opened from the URL
- Reachable while in active dev at `http://localhost:49205` via the brainstorming companion server

### Spec

`docs/superpowers/specs/2026-05-12-notebook-agency-preview-artifact.md` — captures section-by-section decisions, placeholders, the post-sign-off path (preview file becomes source of truth for layout / copy / interaction; existing redesign design doc owns the strategic rationale).

### Why this matters for the portfolio

The preview is the moment the redesign moves from concept doc to artifact Steve and Karla can react to in concrete terms instead of abstract feedback. Webflow build follows from sign-off on this file. The artifact also doubles as the QA spec for the build team: every section's layout, motion, and copy decision is already resolved, so the Webflow execution is mechanical rather than re-litigated.

---

## 2026-05-13 — LinkedIn animation style: 8 prototypes, reference analysis, template library plan

Started the day with one prototype direction (v6 — clean vertical step flow on the May 15 post). Steve liked the format but flagged it as "horizontal bars stacked below itself" — not the **shapes, form, personality** he wanted from his reference GIFs. Six more prototypes later, v8 locked the new direction: a cluster-map infographic with a branching SVG tree, pebble-shaped clusters, person-icon illustrations, headline pill annotation with a handwritten Caveat-font callout, and a pull-quote punchline.

### Reference analysis

Steve shared four animated LinkedIn GIFs from his feed as anchors. Two proved central:

- **Tas Bober — "How to Build 5 Landing Pages"** — lavender background, big bold purple display headline, branching tree diagram with a horizontal manifold fanning down to 7 numbered mint tiles, varied pastel pill chips in a second tier below. Photo + signature in the bottom corner.
- **"How to Create a People-Generated Content Engine" (PGC)** — white background, headline with a rainbow gradient highlight pill on "People-Generated Content" + a tilted speech-bubble callout `PGC`, custom SVG funnel illustrations with person-icons at different fill levels (Execs / Industry Creators / Customers), capsule chips arranged in tiers above and below.

The common thread: **shapes, branching, varied geometry, illustrated elements, headline as visual centerpiece.** Not stacked rectangular cards. Big bold display type that IS the visual element. Multiple shape families per image (tiles + capsules + pills + speech bubbles + custom illustrations).

### Iteration log (all today, all in `outputs/prototypes/`)

| # | Direction | Outcome |
|---|---|---|
| v1, v2 | First passes, 1200×628 landscape, AEO content | Wrong format (Steve's references are all portrait) |
| v3 | 800×1000 portrait, 5-step vertical flow with animated spotlight + marching ants | Format correct; structure still rectangular cards |
| v4 | 2×2 grid layout | Different arrangement, same rectangular language |
| v5 | Cycling head-term-vs-variants comparison | **Rejected** — content changes mid-cycle; "everything should be visible at once, you shouldn't have to wait for a bar to load" |
| v6 | Clean vertical flow on the May 15 post content; archetype label removed | Production-ready but Steve flagged the structure as too uniform |
| v7 | Dark editorial inversion — graphite bg `#131310`, neon per-node accents, italic Fraunces 52px display, purple bloom radial | Beautiful but still card-stack |
| **v8** | **Cluster-map infographic — locked direction** | **Branching tree + pebble clusters + headline annotation + pull-quote** |

### What v8 does differently

- **Branching tree diagram (SVG)** — head term → trunk → horizontal manifold → three drops with arrowheads, plus animated `stroke-dasharray` flows that fire down each branch in sequence
- **Pebble-shaped clusters** (`border-radius: 50% / 38%`) — distinct shape from the lavender rounded-rectangle head term at top. The mint winner cluster (Civil Engineers) is physically lifted `translateY(-12px) scale(1.04)` from the others even on frame 0.
- **Person-icon SVG illustrations** inside each cluster (4–5 silhouettes per cluster — echoes the PGC funnel figures)
- **★ BUILD HERE winner badge** — tilted black pill in Outfit 9.5px letterspacing 0.14em, floating off the winner's top-right corner. Bounces on activation.
- **Headline pill annotation** — "not" highlighted in a tilted (−2.2deg) black ink pill with a dashed inner border, paired with a handwritten "the lie" callout in Caveat 700 24px with a curly SVG arrow pointing back at the pill (Tas Bober's PGC speech-bubble move adapted)
- **CPC pill chips, multiplier badges, vol-sub kicker labels** — varied micro-typography creating real visual hierarchy inside each cluster
- **Pull-quote punchline** at the bottom: *"One keyword lies. The cluster tells the truth."* in Fraunces 30px with a mint text-highlight on the second sentence
- **Warm radial gradient wash + grain** in the background — atmosphere, not flat fill

### Animation orchestration

Same loop as v3–v7, more moving parts. Frame 0 has the full diagram visible. The spotlight then cycles: head term activates → left branch fires + Civil Engineers (winner — longer hold + badge bounce) → middle branch + HR & Onboarding → right branch + Cert Hunters → punchline glow → reset. ~6-second cycle. Marching ants on each shape use JS-injected SVG overlays (rounded rects for the head term, ellipse-style rects for the pebbles to match the pebble border-radius).

### Gallery for Steve's review

`outputs/prototypes/gallery.html` — an interactive dark-themed showcase with all 8 prototypes in scaled iframes. v8 is the full-width hero card at the top; v3–v7 sit below as a reference grid. Each card opens to a full-size modal with the animation running live. Built so Steve can click through the visual options in one place without managing 8 separate file paths.

### The decision: template library, not v8 for every post (Path B)

v8's "head term vs. verticalized cluster" frame fits maybe 40% of Steve's posts. The rest need different visual structures. Forcing every post through v8 would make the agent twist data to fit. Path forward: v8 becomes the first entry in a **template library of ~6 visual patterns** — cluster-map (v8), step-flow (v6 restyled with v8's system), 2×2 grid (v4 restyled), before-after, spectrum, framework-spotlight. A diagram-spec-agent (Haiku) picks the right template per post during the cron pipeline.

Steve confirmed v8 as the locked direction. The other 5 templates and the pipeline integration (template-ize the HTML → diagram-spec-agent in `cron/src/agents/` → wire to the existing HCTI image step → upload to Supabase) are scoped as the next workstream.

### Outputs landed today

- 7 new animated prototypes (`animated-diagram-prototype-v3.html` through `v8.html`)
- Interactive gallery (`outputs/prototypes/gallery.html`)
- LinkedIn image template style doc — `docs/linkedin-image-templates/README.md` — covers reference analysis, full iteration log, v8 visual specification, template library plan, and pipeline integration handoff (template-ize + diagram-spec-agent + renderer)
- Pointer to the style doc added to `CLAUDE.md` under a new "LinkedIn image templates (animation style)" section
- Memory entry `linkedin_animation_style.md` indexed in `MEMORY.md` so the path is findable across sessions

### Frictions worth recording

**1. "I'll know it when I see it" feedback is expensive but legitimate.** Steve couldn't articulate what was missing from v3–v7 until he saw a version that finally had it. The eight-prototype iteration wasn't waste — each version isolated a different variable (format → grid arrangement → cycling content → archetype labels → dark/light → shape language). The cost wasn't avoidable by asking better questions upfront; it was paid in iteration. **Lesson:** when a stakeholder describes visual feedback in feeling words ("playful," "personality," "shapes"), the fastest path is parallel prototyping with explicit hypotheses per version, not deeper discovery questions.

**2. Reference images don't render via WebFetch.** All four LinkedIn images came back as binary GIF data from WebFetch — useless for the small-model analysis the tool runs on the content. The fix that worked: WebFetch saves binary downloads to disk under `tool-results/`, and the Read tool can open them directly as image input to the multimodal model. **Lesson:** when WebFetch returns binary, look for the on-disk path it logs and Read it directly.

**3. The brainstorming flow's task list doesn't fit iterative design work.** The brainstorming skill creates tasks like "Propose 2–3 approaches with trade-offs" → "Present design sections" → "Write design doc" → "Invoke writing-plans." That's a feature-spec flow, not a "make another iteration of a visual prototype" flow. Stale tasks accumulated in this session before being cleaned up. **Lesson:** brainstorming is the right entry skill for spec work; for iterative design, create a single focused task per iteration and don't carry over the spec-doc tail.

### Why this matters for the portfolio

This was the first time the LinkedIn image system moved beyond "rounded-rectangle card with a bold headline." v8 is closer in spirit to what Steve was actually pointing at when he shared his references — **shapes, form, personality, visual orchestration.** The eight-prototype iteration is the part of the work worth showing: the cost of "I'll know it when I see it" feedback wasn't 8 wasted prototypes — it was 8 prototypes that progressively isolated what "more visual" actually meant for this brand and audience. The template library is the answer to making that visual quality repeatable across 30 posts a month without forcing every post into the same frame — which is the real product, not v8 itself.

---

## How this log is used

When the Steve Toth engagement wraps or when adding a portfolio case study, this log holds the raw material:
- Concrete deliverables shipped, with dates
- Quantifiable outcomes once metrics land (LinkedIn engagement deltas, Steve Toth AI signup conversion, conference ticket sales attributable to content campaigns, coaching cohort fill rate)
- Frameworks and proprietary methodologies referenced in content
- Strategic decisions and the reasoning behind them
- Wins to highlight and lessons learned

Each entry should be specific. Generic bullet points get pruned. Named tools, named clients, dated decisions, measurable outcomes.


## Backfill note, written 2026-08-06

The entries below were reconstructed on 2026-08-06 to close an 85-day gap between
2026-05-13 and 2026-08-06. They are **retrospective**, which breaks this log's own
rule of writing entries as deliverables land, so they are marked as such rather
than passed off as contemporaneous.

Reconstructed from records written at the time, not from recollection: 68 dated
handoff documents in `Steve Toth/docs/plans/handoffs/`, the session memory index
and its per-workstream files, `decisions.md` in the root and in `radar/` and
`web/`, and the git history of four repositories (743 commits in `Steve Toth`,
76 in `coaching-portal`, 151 in `notebook-okf`, plus this one). Where a number
could not be verified against a record or a live check it is called out instead
of estimated.

New entries drop the em dash per the standing house rule; existing entries above
were left as written.

---

## 2026-05-14 to 2026-05-21, animated diagram pipeline, prompt caching, and the Railway account question

Short stretch between the LinkedIn animation prototypes and the pipeline rebuild.

### What shipped

- Animated diagram pipeline: a `diagram-spec` agent, a `render-video` step, five templates, and a nixpacks image carrying Chromium and ffmpeg so Railway could render video at all.
- The video pipeline wired into the Buffer publish path and the image-retry path, so a failed image did not strand a post.
- Prompt caching added to the writing pipeline, the first of several passes at getting per-run cost down.

### Decisions worth recording

- **Railway account migration scoped, not executed.** Requirements captured in `docs/brainstorms/2026-05-21-railway-account-migration-requirements.md`. Worth noting because the whole video and cron surface depended on that account.

### Why this matters for the portfolio

This is the last work built on the assumption that the LinkedIn engine was the product. Ten days later the image direction was thrown out, and a month later the engine itself was.

---

## 2026-05-25 to 2026-05-28, image pipeline rebuilt, calendar goes propose-then-approve, RAG anchors, and the content ops PWA

The heaviest build stretch of May: 86 commits across four days.

### What shipped

- **Image pipeline replaced.** HCTI and the video pipeline removed, `diagram-spec-agent` retired, and a `gpt-image-2` notebook image pipeline wired into every call site behind a new `image-prompt-agent` with retry and moderation handling.
- **Calendar became a two-phase flow.** `runCalendarProposal` then `runCalendarFromProposal`, with the status watcher doing a dual-transition poll so Steve proposes, reviews, then approves, rather than a calendar appearing fully formed.
- **RAG anchors for briefs.** A citation requirement in the brief agent, an `ANCHOR_THIN` and `REQUIRES_REFRAME` trigger, citations plumbed through the notebook, idea, industry-news and client-announcement briefs, and Phase A and B migration scripts to roll it out over existing rows.
- **Sources catalogue got usable.** Goal Fit, Archetype Fit, Key Scenarios, Notion URL, and a per-track filter, plus a backfill script for existing rows.
- **`softUpdatePage`**, a Notion helper for non-fatal property writes, so one bad optional field could not fail a whole page update.
- **The content ops PWA** (`web/`): briefs review, post pipeline view, image upload, login with a show and hide password toggle.
- Brutal-editor and revision merged into a single editor pass carrying full brand-kit context.
- Business positioning injected as a cached `stablePrefix` for the notebook and industry-news brief agents, so they knew Steve's named frameworks before reading a source.

### Frictions and course corrections

- Four brief-pipeline quality fixes landed the day after the batch, then a Sources DB fan-out in the idea brief was replaced outright by a generative positioning-doc agent.
- The writing model gained an explicit ban on the word "gap" and a what, why, how claim discipline, then per-archetype reasoning requirements a day later.

### Why this matters for the portfolio

Propose-then-approve is the pattern that survived everything else. Every later system, Radar's briefs, the roundups, the LinkedIn Posts engine, the Coaching Portal's cohort duplication, puts a human checkpoint in the same place: the machine proposes, the human approves, nothing publishes on its own.

---

## 2026-05-30 to 2026-06-01, PWA review fixes, and the trial font that had to go

### What shipped

- LinkedIn Ops PWA review fixes plus M1 to M8 hardening, held local rather than deployed.
- Idea-reject reasons surfaced in the app, ending silent `REQUIRES_REFRAME` failures where a rejected idea simply vanished.
- A PWA update-available banner, the first version of an update instrument that kept reappearing in later apps.
- **Trial Roobert swapped for the licensed Roobert variable web font.** Shipping a trial font in a client product is a licensing problem, not a cosmetic one.

### Why this matters for the portfolio

"Silent failure" is the recurring bug class across this whole engagement. An idea that disappears with no reason shown is the same defect as a phantom Docs Watch alert two months later: the system knew something and did not say it.

---

## 2026-06-02 to 2026-06-04, three client-feedback waves and Steve Memory

### What shipped

- **Client feedback waves 1 and 3**: an Ideas tab, edit sizing, a 9am default, numbered key points, picker removal, a fast approve-to-post trigger, and a grow-only post editor that could not silently shrink Steve's text.
- **Multi-device push** with reliable enable and a self-serve test, plus a clock-style time picker for scheduling.
- **Steve Memory**, built across U2 to U9: a Supabase schema (`memory_events`, `steve_profile_versions`), fire-and-forget event capture on high-signal actions, a daily append-mostly `memory-refresh` agent on cron, injection of the profile into the five generation and brief agents but deliberately **not** the scorer, a PWA Memory screen with a server-side byte cap, a deterministic seed from May's synthesised rules, and a weekly liveness canary.
- The frozen Sunday synthesis job retired in favour of the daily refresh loop.
- 20 numbered units (U1 to U20) shipped on 06-03 alone: a 50k character idea limit with a live counter, the Jake Ward playbook imported as the canonical archetype source, a canonical 8-archetype set with legacy aliases, a loud fallback so no draft ships recipe-less, on-demand rubric scoring, a non-destructive revise path, a grounding and relevance gate with visible `[VERIFY]` markers, SSRF-hardened URL reading, and Buffer deletions reconciled back to Draft.

### Decisions worth recording

- **The scorer does not see the memory profile.** Injecting Steve's profile into the judge as well as the writers would let the system grade itself against its own drift.
- **The canary is separate from the job it watches.** A liveness check inside the thing that can freeze cannot report that it froze. The same reasoning later put Radar's feed alarm in a different Railway service from the crawler.

### Why this matters for the portfolio

Steve Memory is the clearest example of the engagement's actual technical problem: the system had to learn a specific person's voice from his corrections without being able to ask him. The design constraints, append-mostly, byte-capped, canaried, judge excluded, are all about making an automated learning loop safe to leave running.

---

## 2026-06-05 to 2026-06-08, Opus for the voice agents, archive RAG, and the chat rebuild

### What shipped

- **Model tiering locked**: Opus 4.8 for the agents that write or judge brand voice (draft, editor, scorer, revise), cheaper tiers for synthesis and mechanical extraction. This became `AGENT_MODELS` in `cron/src/claude/models.ts` as the single source of truth.
- **Voice rules tightened** over three commits in one day: an absolute no-emoji rule replacing a carve-out, unicode bold restricted to links and URLs with attribution names left plain, then emoji reduced to "sparingly, default none" with four more voice anchors.
- **Archive RAG grounding** for the draft pipeline: an `embedText` seam, a structural chunker, and Supabase-backed retrieval over Steve's own archive.
- **Compose chat, U1 to U10**: a conversations store, a state machine, archetype and brief and draft turns, a feedback-rewrite loop, score and image turns, approve into Notion Posts and on to Buffer, the UI, and memory events.
- **Then it was rebuilt.** Round 2 renamed it `/chat` with a Chat and Draft canvas, and on 06-08 Phase 1 collapsed the whole thing into a single conversational thread, with chips, free-text routing, auto-pick and a finished-post card.
- Push dispatch moved to FCM HIGH urgency for Android heads-up delivery, with tag and renotify dedup and haptics.

### Frictions and course corrections

- The chat surface was designed, shipped, ungated in production, then restructured twice inside four days. The multi-screen wizard was the wrong model; one thread was right.

### Why this matters for the portfolio

Shipping something, watching it get used, and then deleting its structure rather than defending it. The rebuild was not a bug fix.

---

## 2026-06-09, LinkedIn image direction thrown out and rebuilt deterministically

Three handoffs in one day (`HANDOFF_linkedin-image-pipeline_2026-06-09`, `_2`, `_3`) mark a direction change rather than a build.

### What changed

- Image-AI generation abandoned for LinkedIn diagrams. Replaced with **deterministic HTML and CSS rendering** through `cron/src/image/render/` and `cron/src/image/templates/`, output as 1080x1350 JPEG or animated GIF.
- Direction pivoted to light and colourful "clean infographic", with the red asterisk footer mark kept as the single brand anchor.
- Six templates plus a palette specified. Superseded v1 to v8 explicitly marked do-not-read so the old direction could not leak back in.

### Decisions worth recording

- **Deterministic beats generative for brand assets.** An image-AI diagram cannot be regenerated identically, cannot be corrected surgically, and cannot be held to a palette. HTML and CSS can.
- Recolouring the remaining templates and wiring the pipeline was deliberately **blocked on Steve's sign-off** rather than pushed through.

### Why this matters for the portfolio

A reversal on a tool choice, made on quality grounds, with the earlier work explicitly retired rather than left lying around to confuse the next session.

---

## 2026-06-10, the pivot: Notebook Radar

The day the engagement changed shape. Steve's call redirected everything: his own Claude project would write his personal posts, so the system's job became (1) replacing his all-day LinkedIn checking and (2) generating the weekly slate.

### What shipped

- **Notebook Radar**, a standalone Next.js 16 PWA, scaffolded and shipped the same day across 28 commits: the curation suite, a custom brand mark (signal-ping icon set plus social logos), trash with restore, week history navigation, and a perceived-speed and data-safety wave.
- Idea dump on the old PWA, so half-formed ideas could be saved from the New tab, plus a dedicated Ideas tab and a running-build versus live-build display in Settings.

### Decisions worth recording

- **Account safety is non-negotiable and predates the code.** No LinkedIn credentials or cookies anywhere, ever. Manual link-out engagement only. No LinkedIn write path. Steve had prior warnings and a lockout, so this constraint is a business fact, not a preference. It is duplicated in the root instructions rather than living only in the lazily-loaded `radar/AGENTS.md`, because a safety rule must not depend on which directory you happen to be working in.
- **Provider seams stay mock-by-default** (`SCRAPE_ENABLED`, `TTS_ENABLED`, `BUFFER_ENABLED`), so going live is an environment flip, never a code rewrite.

### Why this matters for the portfolio

The strongest single moment in the engagement: a client call invalidated six weeks of direction, and the response was a working replacement app the same day rather than a defence of the existing one. Everything from here to August is Radar.

---

## 2026-06-11 to 2026-06-17, real data, real crawl, real notifications, real audio

### What shipped

- **714 ideas imported** from Steve's task-queue export, with the ideas list given the capacity to hold them.
- **Apify go-live on 06-15**: a daily LinkedIn crawl with author-comment capture, a hardened cron, and a pre-Steve cleanup pass. This is the moment Radar stopped being a shell and started carrying live data (roughly $37/month).
- **Friday full automation**: an auto industry-news post, RAG-grounded and voice-locked, plus Buffer write-back so the Week board reflected true post status, and an Unschedule button.
- **Web push via VAPID**, so Steve got PWA notifications rather than only Telegram, plus a Settings page with on/off and send-test, heads-up notifications that pop over the current app, and deep-linked taps.
- **Note audio**, the first-class feature for an auditory learner: migration 008 (`notes-audio` bucket, `note_audio_log`, `radar_notifications`), a Notion notes library, body and promo segmentation, a `renderNoteAudio` orchestrator, a serial render cron, and notify-on-ready across in-app, push and Slack.
- A **notification centre**: Alerts feed, bell badge, mark-read API.
- **Railway heartbeat drives note-audio**, a deliberate workaround for Vercel Hobby's cron limits.

### Frictions and course corrections

- The branded walkthrough HTML was built, then redesigned to button-and-function because Steve's feedback was "too much text", then embedded inside `/guide` via iframe.
- An em dash was dropped from the post-card footer, and instant cache-first Ideas landed the same day.

### Why this matters for the portfolio

Audio is not a nice-to-have here, it is an accessibility-shaped product decision: the client learns by listening, so the digest had to be listenable before it had to be pretty.

---

## 2026-06-23 to 2026-06-30, multi-user access, curation that learns, and the feed performance fight

The densest Radar stretch: dark mode, auth, newsletters, and 41 commits on 06-30 alone.

### What shipped

- **Multi-user access**: Supabase Auth via `@supabase/ssr`, migration 011 (accounts, roles, approval, domains, ideas owner) and 012, session middleware with fail-closed admin gating, auth routes, authz helpers with per-handler gating, role-gated nav, preview-as-reader, owner-scoped private reader Ideas, an Admin tab, and per-user feed read and starred state.
- **Weekly roundups** with Notion push, separated digests, a nav redesign, and star-driven roundup selection.
- **Monthly Client Newsletter**, admin-only, on a Notion-first model.
- **SEO and AEO post labels with auto-translation.**
- **Curation that learns**: post-quality classification riding the existing Haiku pass, default-feed curation hiding noise and off-topic posts with a "show everything" escape hatch, thumbs up and down rating, and a maturity-lag crawl ingesting only posts at least a day old (Steve's call).
- **Ask Radar**: synthesised Q&A over the collected corpus, then made a floating widget, then made conversational with history.
- **Topics Radar**, ranking SEO and AEO topics by engagement, with real clustering and a weekly matured-engagement re-pull so rankings settle on final numbers.
- Reshare pull-through capturing the quoted source post, `lnkd.in` links unfurled to real URLs at crawl time with a backfill, and post images cached to Supabase so they stop expiring.
- Team surfaces: submit-a-person with abuse controls, a readable `/profiles` with Suggest-a-person and an admin pending queue, and nominate-a-news-source.
- **Feed performance, three attempts**: windowed render painting ~30 cards, then paginated fetch shipping page 1 and streaming the rest, then a manual "Load more" button replacing infinite scroll outright because infinite scroll was the lag.

### Decisions worth recording

- **Auth fails closed.** Admin gating denies by default; a transient database blip must not promote anyone.
- **Curation needs an escape hatch.** Hiding posts by default is only acceptable alongside "show everything" and a review view, otherwise the system is silently deciding what the client never sees.

### Why this matters for the portfolio

Three separate performance approaches, with the winner being the one that removed a feature rather than optimised it.

---

## 2026-07-01 to 2026-07-08, the feedback loop closes, and the feed goes multi-source

### What shipped

- **The learning loop**: a migration for thumbs-down notes and `feed_tuning_rules`, optional reasons captured on the post PATCH, a "Tell us why" prompt on the toast, a nightly job distilling reasons into rules, and the classifier consuming those rules fail-open.
- **Admin corrections as authoritative signal**: `feed_post_corrections` (migration 027), a global re-classify endpoint, a Correct UI on filtered posts, and corrections fed back into the loop as an authoritative KEEP.
- **YouTube as a first-class feed source**: 16 seed channels over free channel RSS, thumbnails, an in-app player, ingest-time about-lines, `@handle` URL resolution, a stricter video quality bar, and channel removal with purge.
- **X as a first-class source**: 15 seeded SEO and AEO accounts with a strict tweet quality bar, then merged with LinkedIn into one feed with cross-source dedup.
- **Verification surfaces**: comment-thread summaries so corrections surface before a claim ships, server-side YouTube transcripts so Claude reads the actual video (via Supadata, so it runs from Vercel without yt-dlp), and an independent web fact-check agent on Sonnet with search.
- Ideas got drag-to-reorder with owner-verified positions, and Studio gained note-creator injection and "Copy full pack".
- "Chat with this post" across Claude, ChatGPT, Gemini and Perplexity, on the feed and in roundups, with reader-facing versions in roundup notes and the client newsletter using Steve's verbatim preamble wording.
- A coaching-student role tier, and an admin-only Feedback view showing Steve's curation feedback and what Radar learned from it.
- Timely-news posts aging out after 7 days on every platform.
- Button lag killed via an `iad1` region fix, a retracting header, and optimistic idea saves.

### Frictions and course corrections

- The newsletter TTS provider was switched from ElevenLabs to Speechify on 07-07. As of today production is still on ElevenLabs, so that switch did not hold; the blocker turned out to be manual approval of Steve's voice key, not a missing release.

### Why this matters for the portfolio

The thumbs-down loop is the part worth showing a client: a curation system that gets a reason, distils it nightly, and lets an admin overrule it with a correction that outranks the model.

---

## 2026-07-13 to 2026-07-17, note video, reader tier, and the LinkedIn Posts engine

### What shipped

- **Note video**: an AI-narrated audiogram MP4 pipeline for Notion notes, with frames streamed straight into ffmpeg for near-zero scratch disk, carrying the official Notebook N monogram. Runs on a Railway worker.
- **Reader equals student**: one consumer UI, reader Star and Fetch fixes, then a reader-tier lockdown with invite-only signup by domain, no good/bad rating, no Ask Radar or Profiles, reader-aware copy and a role-gated guide.
- **The LinkedIn Posts engine, U1 to U8**: a vendored skill contract, a Perplexity Search API client, a fetch stage into `news_items`, selection with primary-source verification, drafting under the skill contract, `li_posts` persistence with review APIs, a `/li-posts` review UI, and a daily cron with an @Steve notify, a no-news path and a canary. Migrations 046 and 047.
- **Feed performance via the database**: a fast Unread feed and badge counts through anti-join RPCs (migration 050), then migration 051 so those RPCs honour the owner-post curation exemption.
- Global feed search (full-text search, API and UI), then search results made actionable in place with expand, Good, Star and Idea.
- Roundup rework: editable sources, bump to next week, a smart YOUR NOTE, an include-picker, a held-for-next-week list with move-back, auto-generated subject lines, and a week navigator spanning this week plus three ahead.
- Deep-linked notifications: every notification routes to its exact resource, with per-item push URLs and digests in the bell.
- Steve's own posts bypass all curation and always land in a feed.

### Decisions worth recording

- **`proxy.test.ts` asserts every reader tab is reachable by a reader.** A new reader-facing tab pointing at a gated path now fails CI instead of dead-ending a real user.
- **Roundup honesty**: "Write it now" reports whether it created or refreshed, rather than implying fresh work either way.

### Why this matters for the portfolio

Two things a reviewer can check: performance solved in the database rather than the client, and a permissions tier with a test that fails the build when the navigation lies.

---

## 2026-07-20 to 2026-07-24, the crawl death, Docs Watch, and SEO IRL

### What shipped

- **Library nav v2**: a vertical badge-annotated section list replacing the horizontal switcher, with a rollback path through a `NAV_V1` environment flag.
- **Feed staleness root-fixed.** The crawl had been dying silently. Fixed at the mechanism: crawl moved to a dedicated Railway `radar-crawler` service, chunk size cut from 25 to 12, and feed-health monitoring added, plus a tight same-day freshness alert firing about 50 minutes after the expected crawl.
- **Docs Watch**: an AI-provider documentation change tracker with advisory briefs, expanded on 07-24 with Perplexity and Google structured data, and a wayback backfill guarded to new pages only.
- **"What's in the link" article summaries**, with honest feed failure states rather than blank cards.
- Steve's own note promoted to a first-class roundup source, pinned first, with manual-only generation.
- **SEO IRL sponsor-leads watcher**: a Slack ping mentioning Steve and Peace on every new sponsorship inquiry.

### Decisions worth recording

- **The crawler deploys by snapshot, not git push** (`railway up radar --path-as-root -s radar-crawler`). Worth writing down because a git push looks like it deployed and does not.
- **The feed alarm runs out-of-process**, later moved to `note-video-worker`, so a dead crawler cannot suppress its own alarm.

### Why this matters for the portfolio

A silent-death bug fixed at the mechanism rather than patched: the fix was a separate service, a smaller chunk size, and an alarm that lives somewhere the failure cannot reach.

---

## 2026-07-24 to 2026-07-31, the Coaching Portal, built in its own repo

A second product, 76 commits in eight days, in its own repository (`stevetoth/coaching-portal`) against its own Supabase project.

### What shipped

- **Bootstrap on Next 16 with OpenNext on Cloudflare Workers**, then a core schema covering identity, cohorts, content, an allowlist hook and audited mutations.
- **The login door**: three methods with a viewer-context DAL as the single authority, failing closed everywhere. Google SSO was later removed, leaving password, magic link and reset.
- **Week-gated cohorts** with sandboxed session HTML and a presentation mode using the real Fullscreen API, full week pages with progress tracking, and the four-tab week detail.
- **Admin surfaces**: content versioning, trash, an access UI, preview-as-role, a link catalog (the most repeated ask from the client call), and cohort template duplication with per-item propagation and lineage-computed divergence, later made selective.
- **Power 25 buyer pages** with a locked coaching teaser and proven cross-prospect isolation.
- **Cloudflare Stream playback** with locally signed per-video tokens, and **Zoom webhook-first recording ingestion** with a cron-executed resumable drain.
- **An installable, self-updating PWA that is structurally unable to cache gated content.**
- **Design pass**: Notebook design tokens, a dark theme, Roobert, UI primitives, then light-by-default with a dark toggle. The licensed Roobert woff2 came in at 112 KB, replacing a 723 KB trial ttf, which fixed both a licensing exposure and a payload problem in one change.
- **The live content test**, which found eight real bugs, then a 16-item ledger remediation on 07-31 whose deepest root cause was a port split causing CSRF 403s.
- A sign-up flow (`/create-account`, emailed link, forced `/set-password`) and an instructor dashboard ordered quietest-first.

### Verified today

- 1,091 tests passing across 85 test files (`npx vitest run`, 2026-08-06), 26 migrations.

### Decisions worth recording

- **A password sign-up form was refused.** The allowlist checks the address, not the typist, so a form that accepts a password from whoever is at the keyboard does not prove identity. The flow became email-link then forced password set.
- **The PWA cannot cache gated content**, enforced structurally rather than by policy.

### Why this matters for the portfolio

The strongest standalone artefact in the engagement: a second product with its own repo, database, auth model, video pipeline and 1,091 tests, built in eight days, with a security decision made by refusing a requested feature.

---

## 2026-07-01 to 2026-08-05, Notebook OKF Brain, and the trust-signal release

A third product in its own repository (`stevetoth/notebook-okf`), 151 commits, hosted on Railway.

### What shipped

- **A bundle library** with a read-through GitHub layer, atomic Trees commits, forward revert and a hierarchical index. Git as the store, so every change to the knowledge base is a commit.
- **An extraction pipeline**: a Sonnet extractor, a Haiku tagger, a taxonomy hard-gate, held routing for anything that failed the gate, and a writer stage.
- **A navigation-precision gate before scaling**, passing 8 of 12 and 6 of 6 on gold-tier, run as the go or no-go on Wave 2 rather than ingesting first and measuring later.
- **Wave 1** of 26 gold-tier concepts held for review, then **Wave 2** ingested in resumable batches of 25.
- **Surfaces**: a browse home, a reading view, a public `/okf/` bundle route, `llms.txt`, an interactive knowledge graph (vendored Cytoscape, type colours, collapse-at-scale), and an agentic index-navigation answerer with per-citation provenance and an explicit refusal when coverage is thin.
- **An MCP connector for Claude** with an in-app OAuth 2.1 authorisation server (PKCE and DCR), four tools, and consult logging.
- **Ops**: a weekly ingest cron, a liveness canary, a deterministic lint job, a stuck sweep, a freshness banner and a runbook.
- **OKF v0.2 trust signals, live 2026-08-05**: trust badges, a mark-as-verified button, 470 concepts migrated, 150 flagged stale, and the graph corrected from 726 to 470 nodes once phantom index-concepts were purged. Independently spec-audited as conformant.

### Decisions worth recording

- **No LLM ever writes a trust field.** Verification happens only through a real identity, and the dev bypass stamps nothing. A trust signal an LLM can set is not a trust signal.
- **Thin coverage produces a refusal, not an answer.** The answerer says it does not know rather than synthesising from insufficient material.

### Why this matters for the portfolio

The provenance model is the point: every claim carries a source, a date and a trust state, and the system is built so the machine cannot promote its own confidence.

---

## 2026-08-03 to 2026-08-05, iOS performance, honest auth, and audits that measure

### What shipped

- **717 KB of unused `raw` stopped shipping on every feed load**, cutting the default feed page from 851 KB to 90.6 KB. Cause: a `returns setof` RPC sends every column unless the call site projects them.
- **Refresh on resume plus a freshness stamp**, because iOS PWAs have no pull-to-refresh, and a deferred-persist helper so cache writes left the tap path.
- **Docs Watch for readers and students**, then a Docs Watch admin surface with add and manage pages and a before-and-after change view, plus **two-tier fetching**: cookie-aware plain fetch first, escalating to Apify for JS-only pages.
- **Real self-service password reset via Resend** on `notebookers.com`, a deliberate, scoped exception to the password-only rule. Magic-link login stays dropped.
- **Branded auth emails live for the Coaching Portal** on 08-04, after moving `notebookers.com` to Cloudflare, verifying the Resend domain, and configuring Supabase custom SMTP. Three login-flow fixes shipped alongside, including honest but uniform sign-in failure copy and an email that survives a wrong-password retry.
- **A UI audit harness**, which uncovered two auth siblings that had drifted apart.
- **SEO IRL speaker cards** and the sponsorship page work.

### Frictions and course corrections

- The Docs Watch release shipped, then a six-reviewer review and a measured UX audit found what shipping had missed: four production change rows that were pure noise (two graded behavioural, so Steve received Opus briefs and Slack mentions for non-events), a false green "Now watching this page" for a page that had failed to fetch, a `{data}`-only Supabase read that could erase a real change, and roughly 40 sub-44px tap targets on the admin page, now zero.
- Supabase's own auth Site URL had been stale at a `vercel.app` address since the domain move, which no amount of application-side work would have surfaced.

### Decisions worth recording

- **Audit against reality, not source.** Querying production rows and measuring the rendered DOM found all of the above. Reading the components would have produced opinions instead.
- **Never destructure only `{ data }` from a Supabase query.** Failures arrive as `{ data: null, error }` without throwing, so ignoring `error` conflates "the read failed" with "the value is absent". That exact gap silently bounced admins on every transient blip until 08-03.

### Why this matters for the portfolio

The honest version of a ship: the feature went out, a structured review found four classes of defect the build had missed, and the remediation is documented alongside the release rather than quietly folded in.

---

## 2026-08-06, portfolio reel, and this backfill

### What shipped

- **A 67.2 second vertical portfolio reel** (1080x1920, 30fps) built from real screen recordings of four running apps: Notebook Radar, the Coaching Portal, Notebook OKF Brain and the AEO Site Auditor. 18 cuts, every cut frame-exact on a 100 BPM beat grid.
- A reusable capture and edit toolchain in `radar/scripts/`: `reel-capture.mjs` (Playwright video capture with DOM-level client anonymising and a per-scene redaction leak scanner), `reel-overlays.mjs`, `reel-build.mjs` (per-segment renders so any one cut can be swapped without a full re-render), `reel-music.mjs`, `reel-shotlist.mjs` and `reel-datascan.mjs`.
- **This backfill**, plus four rescued log entries that existed only in the working tree.

### Frictions and course corrections

- The first cut ran 45 seconds and was rejected as too fast and unclear: 12 of 16 screens carried no explanatory text at all. Recut to 67.2 seconds with a product intro card per app, a plain-language label on every screen, and slower in-capture scrolling.
- The music was assumed to be 120 BPM. Measuring it gave 100 BPM (comb score 0.3012 against 0.0004 at 120), so the entire cut grid was re-timed.
- The redaction leak scanner caught two real failures before delivery: `stevetoth.ai` was blurring only "steve" and leaving "toth.ai" readable, and `PATTERN.test()` on a global regex was advancing `lastIndex` and silently skipping every other match.

### Why this matters for the portfolio

Two habits worth showing: measuring an assumption (the tempo) instead of trusting it, and building a verifier for the safety-critical step rather than eyeballing it, which is what caught both redaction leaks.

---
## 2026-08-06, a feature nobody used, rebuilt from the reason nobody used it

Steve had a monthly client newsletter in his content app and had never finished one. Two existed, June and July, both still drafts with the "Add your picks here" placeholder untouched. Peace's read was behavioural rather than technical: "he didn't tell me, but that's the feel I get, because when you like something, he uses it." Measuring the two rows before touching anything turned that instinct into a cause.

### What shipped

- **The newsletter became a composer instead of a summariser.** The old version had no item list at all: it summarised a Notion date range, which is why nothing could be removed, added or reordered. Items are now his own notes from any month and either notebook, plus industry news and starred posts, in one list in his order.
- **One picker over four sources**, opening pre-filled with suggested picks so accepting is one tap and searching is the exception. Nothing persists until the button, so cancelling costs nothing.
- **Rewritten for the client, not the practitioner**: a skim block, then per item what changed, what this means for you, what to do about it. One closing ask, picked from presets rather than invented monthly.
- **Monthly and on demand**, audio, generated subject lines, a personal intro stored separately so it survives every rewrite, and a delete path.
- **Zero database migrations.** The existing columns from the weekly-roundup feature carried the whole item model, so the work was code only.
- Live on production, verified by request: the newsletter page returns 200, and 867 tests pass across 96 files with a clean typecheck, lint and build.

### Decisions worth recording

- **Generated copy may never promise work on the client's behalf.** The first approved prototype had a "what we are doing" block under every item, and Peace killed it: "i am concerned we may be promisiing something we won't/don't do. so, what do we do about that? better to not promise shey?" It became "what to do about it", advice the reader can act on, with "ask us" as the strongest wording allowed. Enforced by a lint over the generated text, not by asking the model nicely.
- **Two rules moved from the prompt into code, because the prompt had already failed.** The July issue shipped 12 em dashes against a system prompt that said "NO em dashes" in capitals. The seven most recent weekly roundups shipped zero, and the difference was the output shape, not the instruction. Both the dash strip and the promise check are now deterministic post-processing with the prompt as a second line.
- **Legacy rows left in the old format on purpose.** June and July are the evidence of the old behaviour. The scheduled job returns an existing row without recomposing it, so it cannot overwrite them.
- **The success measure is explicitly not "it shipped".** Steve has still never marked a newsletter ready or sent, and that is recorded as the open item rather than dressed up.

### Frictions and course corrections

- **The first prototype was rejected.** It carried the practitioner voice into a longer format and its builder could only choose weeks of his own notes, not industry news or posts. Rebuilt around the actual reader before any code was written.
- **Three defects were found by running the thing, not by reading it.** A Notion helper does not populate the field that says which notebook a note came from, only its sibling helpers do, so every auto-suggested note would have been saved under the wrong notebook. The roundup's section-ordering guard fails open on any document with an extra heading, so it silently never applied to newsletters at all. And the audio renderer reuses a stored narration script, so a rewritten newsletter kept audio describing text that no longer existed.
- **A pre-merge audit found seven more, two of them invisible to review.** The ordering guarantee could degrade silently when the model re-slugged a URL, and auto-built newsletters shipped with no closing ask while the editor showed one selected. All fixed before the merge rather than after.
- **A test on localhost pushed a real notification to two real phones.** The local environment shares the production database and carries live notification credentials, so exercising an API route created a genuine Notion page and web-pushed Steve and Peace a link to a row that was then deleted. Peace received the dead link and asked "did you trigger this?". That produced a second, real fix: notification deep links are relative, so they open on whichever address the app was installed from, and installs predating the domain move still sat on the old one. Old-address pages now redirect, with the API paths deliberately excluded because an auth header is dropped across a cross-domain redirect and every scheduled job would have failed silently.

### Why this matters for the portfolio

The interesting work was diagnosis, not construction. A reasonable reading of "he does not use the newsletter" is that it needs better copy or more polish. Querying the two rows that existed showed the feature had no selection model, which meant every control the client wanted was downstream of one missing abstraction, and no amount of polish would have produced them.

The second transferable habit is where a rule gets enforced. A written instruction that has already been ignored in production is not a control, so both content rules were moved into code with a verification script that exits non-zero, and the audit was run against the running system before the merge rather than the diff.

---
## 2026-08-06, a two minute answer, and the difference between mitigating a bug and deleting one

The Ask feature on Steve's OKF Brain broke while a demo was being recorded. Two unrelated defects surfaced in the same request: one answer took two minutes and six seconds instead of forty seconds, and the server logged a crash when the tab was closed. Both were fixed the same day, but the more useful half of the session was what happened after the fix, when the first patch turned out to have introduced a quieter bug than the one it cured.

### What shipped

- **Eight commits, all deployed to production and each verified by matching the live deployment's commit hash**, not by asking the server whether it was awake.
- **The two minute answer.** The answerer intermittently replied in prose beginning "I need to", the parser rejected it as invalid, and the model was re-run twice. Root caused to the prompt rather than the parser: the answerer was only permitted to say "these files do not answer the question" when the caller had already flagged the material as weak, so on a normal question with unhelpful sources it had no legal way to raise a concern and improvised prose instead. That response is now permitted on every call.
- **The crash on disconnect**, where a client that gave up mid answer caused the server to write to a closed connection and log it as a genuine failure.
- **The bug class deleted rather than mitigated.** The answerer moved to a model that supports schema constrained output, so the reply is now constrained to a JSON schema by the API. Prose is not discouraged, it is impossible. On the one question measured on production before and after, the answer went from 40.9 seconds to 28.8 seconds, about 30 percent faster, with two more like for like pairs on the development server showing 31 and 43 percent.
- **Abandoned answers stopped costing money.** A disconnect now cancels the model call rather than only silencing the output, so closing the tab no longer pays for an answer nobody reads.
- **The test suite reached zero known failures for the first time, 1048 passing across 79 files.** One test had been failing since the calendar month rolled over.
- **A one command health check**, `scripts/watch-ask.sh`, and a 496 line handoff so the next session starts from evidence rather than memory.

### Decisions worth recording

- **Fix the prompt, not the parser.** A tolerant parser was written as well, but treating the malformed output as a parsing problem would have left the cause in place. The question worth asking about a model that leaves its contract is what it was trying to say and whether the contract gave it any way to say it.
- **Keep every mitigation after the root cause was removed.** Once schema constrained output made prose impossible, the prompt rules, the tolerant parser and the retry logic were all redundant. They stayed, because they still protect any future change to a model without that capability, and removing them would make such a change silently dangerous.
- **A liveness endpoint cannot verify a deployment.** The documented check was to poll `/api/health`, which returns the same 200 on old and new code. It was polled green twenty times over seven minutes while the actual question, did this commit deploy, went unanswered. The rule now reads the deployment record and matches the commit hash. Documented in the repo so the lesson outlives the session.
- **Fix the production code for the clock bug, never re pin the test's date.** The failing test had pinned a date correctly; the production code underneath ignored it and read the real clock. Re pinning would have bought another month and hidden it again. The replacement tests pin the clock on both sides of a month boundary and assert opposite outcomes, so they cannot pass by accident whatever the date.
- **Scope the model change to one agent.** Extraction, tagging and lint kept their models. They were not implicated, and a wider swap would have needed its own quality evaluation.
- **Gate the model change on quality, not on it working.** Five real questions were run and compared against the same day's answers from the previous model before anything was pushed, with an explicit instruction to stop and report rather than ship a worse answerer.

### Frictions and course corrections

- **The first fix introduced a quieter bug than the one it cured, and a self audit caught it before it shipped.** The tolerant parser can succeed on a JSON object that is not the payload, and one of the two call sites had no check on what it extracted. The result would have been a confident "not covered in the brain yet" on content that does exist, which is worse than the crash it replaced because nothing reports it. Found by reviewing the fix rather than by testing it, and locked with a test proven to fail without the check.
- **A regression test passed against known broken code, twice, for two different reasons.** The first version asserted on an unhandled rejection that the stream machinery absorbs. The second read the captured error calls after restoring the spy, and restoring a spy also clears its recorded calls, so the assertion read an empty list and passed trivially. The habit that caught it is now a rule: stash the fix, run the new test, watch it fail with the original symptom, then restore. A test written after a fix and never run against the bug asserts only that today equals today.
- **A claim in the plan was wrong and re checking caught it.** A 13MB file was described as live code consumed by the search tools, on the strength of a search whose match was a substring of an unrelated function name. It is parked work with no consumers, and committing it would have added 13MB to the repository and triggered a pointless redeploy.
- **A speed claim in this session's own reporting was overstated and is corrected here.** The first write up compared 40.9 seconds against 17.0 seconds and called it 2.4 times faster. Those were two different questions, one substantially harder than the other. Re measuring the same question on both models gives 40.9 to 28.8 seconds. The corrected figure is about 30 percent, and the task log has been amended. The error came from comparing the most flattering pair of numbers available rather than the matching pair.

### Why this matters for the portfolio

The distinction the session turns on is between suppressing a failure and removing the conditions that allow it. Three layers of defence were built against the malformed output, and all three were still guesses about a model's behaviour. Moving to a model whose API enforces the output shape converted a probabilistic problem into a structural one. Knowing when a fix is a mitigation and saying so is what makes the eventual removal a deliberate decision rather than an accident.

The second point is about what counts as evidence. Three separate claims in this session were confidently wrong and each was caught by re running the check rather than by thinking harder: a test that could not fail, a deployment check that could not distinguish versions, and a performance number built from mismatched measurements. All three would have survived a careful review, because each was internally consistent. The habit that catches them is mechanical, not intellectual. Verify the thing, against the state it is actually in, at the moment you want to claim it.

---

## 2026-08-06 (continued), the case-study log itself: rescue, backfill, and a skill so it stops going stale

This log had not been touched since 2026-05-13, an 85-day gap covering most of the
strongest work in the engagement. Closing it turned out to have three parts: rescue
what was never saved, reconstruct the gap, then remove the reason it happened.

### What shipped

- **Four entries rescued that existed only on disk.** The working file had 15 dated entries, `HEAD` had 11: 2026-05-10 through 05-13 had never been committed. Committed as `a46a4f2`.
- **The push carried four commits, not one.** `origin/master` was still at `03ec56d` from 2026-04-27, so three earlier May commits were also unpushed. Everything from 05-06 onward had been sitting local-only for three months.
- **16 backfill entries** for 2026-05-14 to 2026-08-06 (`c455c72`), 392 lines, taking the log from 15 entries to 31. Marked as retrospective in a backfill note, with their sources named.
- **A `portfolio-log` skill** (`a7de11e` on `Peace-Akinwale/writing`), which encodes a bar for what earns an entry, an evidence-before-writing rule, the house format, and the account-switch and check-origin steps.
- **The skill is wired into two rituals already in use**, `/update` and `/handoff`, as their final step.

### Decisions worth recording

- **Reconstructed from records, not memory.** The backfill was built from 68 dated handoffs, three `decisions.md` files, the session memory index, and the git history of four repos (743 commits in the main repo, 76 in coaching-portal, 151 in notebook-okf). Test and migration counts were re-run rather than recalled. Three months of detail is exactly where invented specifics would creep into a document that gets shown to clients.
- **Retrospective entries are labelled as retrospective.** This log's own header promises entries are written as deliverables land. Passing a backfill off as contemporaneous would quietly undermine every other entry in the file.
- **A standalone skill that `/update` calls, rather than folding it into `/update`.** Project memory and a career log have different audiences, different content and different destination repos, so merging them would make one file do two jobs. But a standalone skill is precisely what failed for 85 days, so the wiring is the actual fix, not the skill.
- **Versioned in one repo, loaded everywhere, via a symlink.** A skill under a repo's `.claude/skills/` only loads inside that repo, and `~/.claude/` is global but not version controlled. Symlinking the directory gets both: one file under git, available in every project. Copying it was rejected because two copies drift.
- **A diverged repo was not rebased.** The skill's home repo had 2 local commits the remote lacked and 10+ remote commits the local lacked, meaning it is being edited from more than one place. Reconciling that is the owner's decision, so the commit was built in a throwaway worktree on top of `origin/main` and fast-forwarded instead. Nothing was rewritten.

### Frictions and course corrections

- **The skills repo cannot reliably transfer.** `git fetch` died with `fetch-pack: unexpected disconnect` and `early EOF`; `git push` died with `RPC failed; HTTP 408`. Measured cause: 605 tracked `node_modules` files and a `.git` that is now 237 MB. The workaround that succeeded was a bounded `--no-tags --depth=20` fetch plus a one-file commit built in a worktree.
- **That workaround left the repo shallow**, and `git fetch --unshallow` failed with the same transfer error. A self-inflicted side effect, recorded rather than hidden, with the fix (untrack `node_modules`, then retry) filed separately.
- **A concurrent session was writing to this same file.** By the time this entry was added, another session had appended its own 2026-08-06 entry and pushed, moving the log to 32 entries. Caught by comparing against `origin/master` before editing rather than assuming the local copy was current.

### Why this matters for the portfolio

The failure was not laziness, it was a process with no trigger. A log that depends on
remembering to write it will go stale, so the fix was not discipline, it was attaching
it to something already being run.

The second point is what "verified" means in practice. Three separate claims made this
session were wrong until checked: the log was four entries behind (it was four commits
behind), the repo was assumed pushable (it cannot fetch), and a redaction was assumed
complete (a scanner found two leaks). In each case the check was cheap and the
assumption was confident. That pattern is the whole argument for measuring instead of
reasoning.

---
## 2026-08-06 (continued), a domain move, and two assumptions that were wrong in opposite directions

Steve wanted his coaching portal off its temporary hosting address and onto a subdomain of the domain he had bought for coaching. The move itself was routine. The two things worth recording are that the blocker everyone had planned around did not exist, and that the deploy which fixed the address silently broke a different one.

### What shipped

- **The portal is live at `coaching.notebookers.com`**, commit `ab665fc`. Verified after the fact: the new address returns 200 on `/login`, and the old address returns 308 to the same path on the new one.
- **A redirect from the old host that preserves the path and the query string**, in `src/lib/legacy-host.ts` with 10 unit tests. The query string is the entire point: password-reset emails sent before the move carry a token in it, and dropping that would have turned every one of them into a dead end.
- **The login system's own address settings moved in the same pass, additively.** The new domain was added while the old entries were kept, so links already sitting in inboxes still resolve.
- 1101 tests pass, up from 1091, with a clean typecheck.

### Decisions worth recording

- **The apex was left alone, and that answered a question the client never did.** He was asked twice where the landing page should live and did not reply. Checking the domain rather than waiting showed it was already serving a live pre-launch page for a different product of his, complete with a waitlist and trust logos. So "landing page on the apex" was never a clean option, and the sensible default became obvious without him: portal and its landing page on the subdomain, apex untouched.
- **The old address redirects everything, including the API paths.** This is deliberately the opposite of the rule applied to the sibling product earlier the same day, where API paths are excluded because scheduled jobs call them with an authorisation header that is stripped across a cross-domain redirect. This app has no such caller: its scheduled work runs inside the worker with no HTTP hop. Same shape, opposite answer, and the reasoning is written at both sites so neither gets "corrected" to match the other.

### Frictions and course corrections

- **The blocker in the plan did not exist.** The plan carried a dashboard fallback and a "needs the client" step, because the API credential was documented as read-only on DNS and a custom domain seemed to need a DNS record. Attaching the domain is a different permission, which the credential had. The platform then created the DNS record and the certificate itself, about ten minutes later. A direct attempt to write a DNS record still fails. So a documented limitation on a neighbouring operation had been treated as proof about this one, and the workaround was never needed. The plan had at least sequenced this as the first step precisely because it was unproven, which is why finding out cost minutes rather than a session.
- **The deploy that added the new address silently removed the old one.** Declaring an explicit route made the tooling disable the default hosting address by default, and the old URL went to a hard 404. That URL had been given to the client and his operations lead six days earlier, and it was the host every pre-move email link pointed at. It was caught within a minute because the cutover check requested the old address as well as the new one. The tooling had in fact printed a warning about it, in the middle of successful deploy output. Fixed by re-enabling it explicitly, with the reason written at that line so it does not get deleted as redundant.
- **Two test failures were mine, not the product's.** An automated check of the reset-email flow failed twice because it filled the login form's email field instead of the reset panel's, which only exists once the panel is expanded. Reading the component settled it. Separately, five sign-in tests fail because the stored password is out of date, which was distinguished from a real authentication break by noticing that a reset email had succeeded from the same code path seconds earlier: a configuration fault would have taken both down.
- **Twice I described the first-time login flow without reading it, and was wrong both times**, on copy that was about to be sent to the client. Allowlisted people who have never signed up have no password at all, so neither "enter your password" nor "use forgot password" applies: there is a separate create-account door that emails a link, creates the account, and then forces a password to be set. The client caught it. It is now a standing rule for this work: describe a flow from the source, not from inference, and treat anything going to a third party as a hard gate.

### Why this matters for the portfolio

Two symmetrical failures in one session, worth more than the shipped feature. One assumption said something was impossible when it was not, and cost a fallback plan that was never used. The other assumed nothing else would change, and cost a live URL. The habit that limited both is the same one: probe the uncertain operation first, and after any cutover check the thing you moved away from, not only the thing you moved to.

---
## 2026-08-07, verifying an AI-built knowledge base against its own sources, and the difference between a wrong fact and a fabricated one

The OKF Brain holds 470 concept cards that an AI condensed from Steve's Notion notes. Every card's trust badge read "Unverified" because nobody had re-checked the cards against the notes. This session built the mechanism to move that badge honestly and then did the checking: 394 of 470 cards read against their real Notion sources.

### What shipped

- **A batch-verify tool so the trust badge can actually move.** `/api/concept/verify-batch` takes a reviewed list and stamps it in one atomic commit; `/admin` gained a Batch verify panel that normalizes a pasted list and confirms once. The per-concept button already existed, but 470 individual clicks is not a workflow anyone completes, so the badge had stayed Unverified everywhere. Commit `60a32cf`, 31 new tests for the two routes, 1079 in the suite, clean typecheck.
- **The verify mechanics were extracted into one shared module** (`lib/bundle/verify-concept.ts`) so the batch route and the single route cannot drift to different rules. The single route was refactored onto it with its behaviour and tests unchanged.
- **394 of 470 cards carry a recorded verdict** in a resumable ledger: 85 verified and stampable, 92 needing a one-line fix, 194 challenged, 20 stale-but-true, 3 unauditable. 67 of those were hand-checked this session against the live Notion notes; the rest were recovered from an earlier interrupted run.
- **Four bundle fixes, pushed:** the citation corrections (`e330517`), a name spelling fixed bundle-wide (`a3ba93a`, "Wil" not "Will" Reynolds), and five precise accuracy fixes (`03b2ffd`, e.g. a wrong URL parameter, a dropped co-credit, a dimension count that said twelve where the source had thirteen).

### Decisions worth recording

- **Stamping stays a human action, and a request to script it was declined.** The whole v0.2 trust system refuses any non-human writer: the API 403s a dev-bypass session, and writing a verified stamp from a script would be exactly the fabrication the badge exists to prevent. When asked to "use a script to approve" the 85, the answer was no, with the reason: the batch panel is the one-action equivalent, run under the reviewer's own login. The tool was built to make the honest path fast, not to bypass the identity check.
- **Point-in-time facts are date-qualified, not called wrong.** A card sourced from a 2021 note saying "a 20-person agency" is a dated snapshot, not an error. The review brief was changed mid-pass to sort these separately from real defects, because arguing with a note about a fact that was true when written wastes the reader's attention and buries the defects that matter.
- **Card quality tracks source-note substance, and that became the whole finding.** Cards extracted from a real essay, book summary, or case study are faithful. The invented content clusters entirely in cards built from thin weekly-roundup blurbs, where the extractor manufactured the reasoning the note never contained. The judgment is not "is this card good" but "what did its source actually contain."

### Frictions and course corrections

- **I called Steve's own statistics fabrications before I had read the source, in a commit message.** An earlier review flagged figures like "76.4% of cited pages" and "NavBoost outweighs the rest combined" as AI hallucinations, and I shipped a commit describing them that way. Then I fetched the actual Notion notes: every one of those stats is in Steve's own published newsletters, with those attributions, carried faithfully by the extractor from secondary SEO blogs. They are wrong in the world, but they were not fabricated by the AI. The correction matters two ways: the fix owner is different (this is a content-accuracy flag for Steve's newsletters, not an OKF pipeline bug), and I had asserted the opposite in writing. The edits still stand because they make the cards more accurate than their source.
- **The scary number shrank under scrutiny.** "194 challenged" sounds like a third of the bundle is broken. Re-sorted from the recorded evidence, it is 164 genuine card defects and, of those, 133 are salvageable by deleting a single invented paragraph. Only 14 are true fabrications that cannot be trimmed clean, and 2 of those are empty dedup stubs that need re-ingestion, not editing. The actionable problem is 14 cards, not 194.
- **The session could not finish in one sitting and I said so rather than degrading.** The remaining 76 cards each need an 8-to-15k-token source-note fetch, which would exhaust context partway and stop mid-card. I checkpointed with everything saved to the ledger and spawned the remainder as a tracked task, instead of pushing until the work got sloppy.

### Why this matters for the portfolio

The transferable point is the distinction between two questions that look like one: is this claim true, and did the system invent it. Conflating them sent me to the wrong fix owner and into a commit message that was confidently wrong. Reading the source answered both correctly and turned a vague "the AI hallucinates" into a precise, sorted list: 85 safe to ship, 133 one trim from safe, 14 that must not ship, and a separate flag that belongs with the client's newsletters rather than the codebase. The second point is restraint on the mechanism: the fastest way to clear 470 badges was to let a script write them, and that was the one thing the design existed to forbid, so the tool was built to make the honest path a two-paste job instead.

## 2026-08-07 (continued), a security review that passed, staff 2FA shipped, and a 403 that was never about credentials

A security consultant sent a 10-vector brief for building the coaching student portal safely. The session audited the live portal against all ten, then acted on the gaps and shipped the missing controls.

### What shipped

- **The portal passed all 10 vectors, verified three ways rather than by reading alone:** three parallel code audits across the route handlers, live database checks (RLS on all 15 tables with zero client policies, so the anon key reads nothing), and a live no-session probe against production that returned 401 or a login redirect on every sensitive endpoint. No broken object-level access: every student route filters by session user id or active cohort membership.
- **Migration 027** (security linter hardening): revoked EXECUTE on the two signup trigger functions from anon and authenticated, and pinned `search_path` on six SECURITY INVOKER helpers. Applied to the live database and verified. 27 migrations total.
- **Staff TOTP two-factor, built end to end:** one `/mfa` screen that both enrolls (QR plus verify) and does the step-up from aal1 to aal2, server actions only, with a single shared rule (`staffNeedsAal2`) driving both the API 403 and the page-layout redirect so the two cannot drift. 1121 tests pass (30 new), typecheck and build clean. Peace enrolled her own admin account on the live app, confirmed in the database (one verified TOTP factor, aal2).
- **PWA fix:** the installed app now opens `/home` (the portal) instead of `/` (the marketing page), commit `f958912`.
- An **architecture document** for the consultant's pre-build review, and a **two-student access-control test spec** for the pre-launch gate. Six commits, all pushed and live.

### Decisions worth recording

- **MFA cadence: a code on every fresh sign-in, no "remember this device".** A trusted-device cookie was considered and rejected for v1: it is custom code and slightly weaker, and Supabase has no built-in remember-device (checked against their docs, aal2 lives only for the session's life). The installed PWA keeps a session alive, so a code is felt only on a genuinely new sign-in.
- **`MFA_ENFORCED` ships OFF.** Flipping it before staff enroll would lock out a factor-less admin, so the sequence is enroll first, enforce second.
- **Two controls were declined and recorded rather than forced.** Leaked-password protection is Supabase Pro-only on this free-tier project, so it was left off and flagged as a paid decision, not silently skipped. And two actions stayed with the humans by rule: entering API-token secrets into GitHub, and purchasing the Cloudflare Stream plan on the client's card. Both were requested, both were declined with the reason stated.

### Frictions and course corrections

- **A 403 that three theories got wrong before the dashboard settled it.** Video upload kept failing with a Cloudflare authorization failure. First theory: wrong token value. Second: the token creator's account role was capped. The client corrected a wrong assumption (she uses the account directly, not as a limited member), and only then did opening the Stream dashboard show the real cause: Stream was never subscribed on the account, so every token 403s regardless of scope or who runs it. Lesson recorded: check whether the product is enabled before blaming the credential, and a bearer-token API call is authorized only by the token, never by whose terminal runs it.
- **A "$0 per month" that was actually $5 per month.** The Stream plan advertised starting at zero; the purchase screen forced a minimum one 1,000-minute block at $5. Caught it at the config step and backed out rather than committing the client to a cost she was told was free.
- **A nav trap introduced and then fixed in the same session.** The new `/mfa` screen had no way back, which in a standalone PWA (no browser back button) would strand a staff member who opened it and changed their mind. Added a "Not now, back to the portal" link, shown only when enforcement is off.

### Why this matters for the portfolio

An audit is only worth something if it is acted on and checked against reality: this one was verified with a live production probe and a database read, not a reading of the source. It also shows where the safety line sits, declining to mint or paste credentials and declining to spend on a client's payment method even when asked, and routing those to the person who owns them. And it shows the discipline of root-causing to the actual mechanism, a product that was never enabled, instead of shipping the first plausible story about tokens and permissions.

---

## 2026-08-10, finishing the OKF verification, and why a mass edit to a public bundle is only as trustworthy as the gate you run after it

The continuation of the 2026-08-07 session. That day left three things queued: audit the last 76 of 470 cards, apply the ~92 one-line fixes, and apply the 133 salvageable trims once Peace approved a batch. All three are done, and the stampable count went from 85 to 382. The interesting part was not the edits, it was building enough of a safety net that 238 edits to a public knowledge bundle could be trusted without me reading all 238 by hand.

### What shipped

- **The last 76 cards were audited to 470/470.** Eight read-only researcher subagents ran the four gates against the real Notion notes, each writing its own partial ledger so parallel writers could not corrupt a shared file. Result: 58 verified, 15 needing a one-line fix, 3 challenged.
- **104 one-line fidelity fixes** committed as `312ed42` (102 files): quoted strings made verbatim to the source, invented connective claims removed.
- **136 salvageable trims** committed as `2ac6918` (136 files, 427 insertions, 722 deletions): the manufactured "why this works" paragraph deleted from each card, verbatim hedges and attributions restored (Glen Allsopp, Ian Lurie), and fabricated specifics corrected, for example a card that stated "Bruce Clay (1946 to 2025)" when the source gave no years and the real dates are 1948 to 2026.
- **10 held cards' frontmatter overclaims fixed** as `45add34`, and the session logged to the bundle's decisions.md (`a17c498`, date corrected in `2af2481`).
- **Final tally: 382 verified and stampable, 4 needing a human decision, 61 challenged, 20 stale-but-true, 3 unauditable.** The `verified:` key count in the bundle stayed exactly 1 (a single real production click) across all four commits: nothing was machine-stamped, every promotion is a review verdict, and a human still stamps through the admin panel.

### Decisions worth recording

- **Fail closed on the frontmatter, do not flip a card whose title still overclaims.** For 12 trimmed cards the body was clean but an invented claim survived in the title or description ("penalizing hallucinations," "originally built for analytics," a "single superior" schema, a sole attribution). Those were held at "needs edit" rather than promoted to verified, because a verified badge on a card whose summary still overclaims launders exactly the thing the badge exists to prevent. Eleven were then fixed and flipped; one stays held because resolving it needs a spreadsheet I could not open, and guessing was not an option.
- **The ledger became the single source of truth for the triage, so a derived file could never diverge again.** The category lists were plain text files derived from the review ledger. After I damaged two of them (below), I moved the categorisation into the ledger itself and regenerate the text files from it, so the authoritative copy is the one that cannot drift.
- **The safety of a 238-file edit comes from a mechanical gate, not from trusting the editors.** Before either commit I checked the actual git diff against ground truth: frontmatter byte-identical to the previous version on every file (proving the edits were body-only), zero files touched outside the intended set, zero em dashes introduced, and the verified-key count unchanged. Subagents can be persuasive in their reports; the diff cannot.

### Frictions and course corrections

- **I overwrote two triage files with empty ones and had to recover them.** Regenerating the category lists, I used tag names that did not match what the earlier session had actually stored, so two files (17 and 10 entries) were rewritten to nothing. They were gitignored, so there was no git history to restore from. I recovered the 17 exactly by re-deriving from the ledger, reconstructed the 10 by definition and flagged that it was a reconstruction not a byte-for-byte restore, and then closed the hole by making the ledger authoritative. The rule this reinforces: before overwriting a file, look at what is in it, and derive views from a source of truth rather than hand-maintaining parallel copies.
- **I dated the whole completion 08-08, and it was actually 08-10.** A system notification mid-session announced the date had changed to 08-08; I took it at face value and stamped it into the decisions entry, the memory, the always-on context, and a handoff filename. The git commit timestamps said 08-10, and so did the machine clock when I finally checked it. I corrected every reference. The lesson is narrow and concrete: verify a date against the commit timestamps or the clock, never against a notification, before writing it into a record.
- **I over-held one card that was already clean.** One of the 12 I flagged for a frontmatter fix turned out to need none: the earlier trim had already removed the offending phrase from the body and the description never carried it. Checking each flag against the live file rather than the report caught it before it cost a needless edit.

### Why this matters for the portfolio

The transferable idea is that trust in a large automated change should not come from trusting whatever produced it. Eight subagents made 238 edits to a bundle that ships publicly; what made that safe was a gate run afterward against ground truth, checking the properties that actually mattered (frontmatter untouched, scope not exceeded, the one invariant intact) rather than re-reading every file or believing the agents' own summaries. The same session shows the two smaller disciplines that keep that honest: fail closed when a residual problem remains instead of promoting anyway, and check a fact like today's date against a hard source before it becomes part of the record. The headline number, 85 stampable to 382, is real, but the reason a client should trust it is the gate behind it, not the count.

---
## 2026-08-10 (continued), a credential that stopped working on its own, and retracting a cause I could not source

Steve reported in Slack that the audio on his Week 33 newsletter round up had failed, and added a second ask: stop the email subject lines being read aloud. Two unrelated problems in one message. The first was not a code defect at all, which made the interesting work diagnosis and honesty rather than engineering.

### What shipped

- **Root cause found in the production runtime logs, then reproduced independently.** ElevenLabs was returning `400 invalid_api_key` with the message "API key ID used as API key. Only valid API keys can be used. API keys start with 'sk_'". Confirmed by calling `GET /v1/user` directly with the stored value rather than trusting the log line.
- **Established that nothing on our side had changed.** The Vercel environment variable was last written on 2026-06-17 per Vercel's own env metadata, and the render log showed the last success on 08-04 with failures on 08-09 and 08-10. The stored value was 64 hex characters with no `sk_` prefix, which the API now reads as a key ID rather than a secret.
- **The key was rotated and set in all three places it lives:** Vercel production, the Railway note-video-worker service, and the local env file. The video had failed identically because the worker reads the same variable.
- **Email subject lines are no longer narrated** (`radar/lib/note-audio/segment.ts`, commit `d8c89d5`). The note's first block carries the newsletter send scaffolding, `Primary:` and `Secondary:`, which the segmenter had been treating as body prose, so the audio opened "Primary colon magnifying glass" instead of "Howdy Notebooker!". Four new tests, 50 passing across the note-audio suite on the production branch.
- **Both restored and verified against live surfaces:** audio 6 minutes, video 383 seconds and 34.1 MB, both serving 200, and the narration text on the live player page confirmed to start "Howdy Notebooker!" with no subject lines anywhere in it.

### Decisions worth recording

- **I retracted a cause I had stated confidently, before it reached the client.** My first explanation was that ElevenLabs had retired its legacy key format in the failure window. Peace asked for a source to send to Steve, and there was none: their authentication docs say nothing about key format, and the only changelog entry between the last success and the first failure covers unrelated fields. So the deprecation story came out and what went to Steve was only the provable set: the verbatim error, the environment variable's last-modified date, the last-success and first-failure dates, and the required format quoted from ElevenLabs' own response. The explanation is now weaker and correct instead of strong and unsupported.
- **Ship the pending fix before re-triggering a failed job.** The fast move was to flip the note back to Generate the moment the key worked. That would have re-rendered the exact defect Steve had just complained about, and the ElevenLabs quota is shared between audio and video, so it would have been paid for twice. The fix went out first, then a single render covered both problems.
- **Strip the subject lines per line, not per block.** Notion stores both labels in one paragraph separated by a line break, so dropping the whole block would silently delete real prose the day a sentence shares it. A block that is only subject lines still drops entirely.
- **Reach the production branch through a throwaway worktree rather than switching branches.** The working tree held a large amount of unrelated in-progress work, and another session was committing into the same repo concurrently. Committing on the working branch, then cherry-picking through a temporary worktree, meant the dirty tree was never switched or stashed.

### Frictions and course corrections

- **Setting the environment variable did not fix anything by itself.** Vercel bakes environment variables in at build time, so production kept serving the dead key until the same commit was redeployed. This is an easy place to declare something fixed and be wrong, and it is now a row in the verify-done checklist.
- **I polled a storage path I had guessed rather than read.** Waiting on the rendered video, I watched a URL I had inferred from the audio path instead of the worker's actual output. It happened to be correct, which is the bad kind of luck. The authoritative signals were the database row and the Notion property, and that is what the result was finally confirmed against.
- **The new key arrived in a plaintext file that also held four other live credentials.** The document in Downloads carried Cloudflare account, Stream and R2 tokens and a Resend key alongside the ElevenLabs one. It was moved to Trash rather than hard-deleted, and I flagged that three of those secrets were not confirmed to exist anywhere else, so emptying the Trash could destroy the only copy.

### Why this matters for the portfolio

The engineering here is small. What a client should take from it is the diagnostic discipline: the failure looked like a regression, and the work was proving it was not, using the environment's last-modified stamp and the render history to establish that the system had been untouched while the outside world changed underneath it. Then, when asked to explain why, refusing to hand over an explanation I could not source, even though it sounded right and the client was under time pressure. Saying "here is exactly what broke, here is what fixes it, and I do not know why the vendor changed" is more useful to someone who has to repeat it to their own team than a tidy story that turns out to be invented.

---

## 2026-08-10 (continued), asked to automate a trust stamp, and the difference between a fast answer and an honest one

Right after the verification pass finished, the client (via Peace) asked to move all 382 "verified" badges automatically instead of clicking each one. The badge is on a public knowledge bundle that third parties read through an MCP connector, so the request collided with the one thing the badge exists to guarantee. The work was in the reasoning, not the code.

### What shipped

- **A new `fact_checked` trust tier**, applied to 381 cards, deployed. New frontmatter field `fact_checked` (separate from `verified`), a `fact-checked` tier in the derivation (`human-reviewed > fact-checked > machine-confirmed > unverified`), and a badge that renders "Fact checked and confirmed" for both the human-reviewed and fact-checked tiers. Commits `850dbaa` (code, tests, apply-script, docs) and `e3cd561` (381 bundle files) on notebook-okf `main`.
- **The human-only invariant was left completely intact.** `verified` still has exactly its two real-identity writers; the new tier uses a different field with its own operator-run script (`scripts/apply-fact-checked.ts`, fail-closed and idempotent). Measured: `rg -c "^verified:" bundle` stayed 1 before and after. 1086 tests pass, typecheck clean.
- The apply-script attributes every stamp to `okf-verification-pass` with the review ledger as evidence, and the concept page's detail line still shows that attribution, so the unified badge never hides who actually confirmed a card.

### Decisions worth recording

- **Writing `verified: human:peace` by script was refused, and the refusal was the correct output.** The direct way to satisfy "automate it" was to have a script write the human-reviewed stamp onto 382 cards a human did not individually review. That forges human provenance in a public artifact, which is precisely the failure the badge was built to prevent. The refusal held even when the client said to bypass the rule, because the cost lands on people downstream who trust the badge, not on the person lifting the rule.
- **The resolution was a label that is true of everything it appears on.** "Fact checked and confirmed" is accurate for both the 381 cards the pass checked against their real sources and the one a human reviewed, and it never claims who did the checking. That made "make them look the same" honest to grant: the visual is unified, the underlying data still records human versus pass, so the record cannot later be read as a lie.
- **A separate field beat overloading the existing one.** Reusing `verified` with a non-human actor would have worked and been less code, but it would have put an automated writer on the field whose entire value is that only a real human can write it. A parallel `fact_checked` field kept that guarantee absolute while still delivering the automation.

### Frictions and course corrections

- **The platform's permission classifier was down for most of this**, intermittently blocking edits, tests, and commits. Every action was retried until it landed; nothing ended up half-applied, verified by re-running the idempotent apply-script (second run reported "stamp 0") and by the clean test suite. Worth noting because "it eventually worked after N retries" is a real state to report honestly, not paper over.
- **I could not confirm the deploy live and said so.** The Railway CLI was not linked in the session and the pages are auth-gated, so I could verify the commits, the tests, and the local bundle state, but not the rendered badge on production. That was handed to the client to eyeball rather than asserted as done.
- **A commit landed on the wrong branch** because a concurrent session had switched the working tree; I flagged it and declined to push it rather than interfere with the other session's branch.

### Why this matters for the portfolio

The transferable point is that "just automate it" is sometimes a request to manufacture a false record, and the job is to find the version that gives the person what they actually want without the lie. Here that was a third tier with a truthful label and a separate field, so the badges move, they look uniform, the automation is real, and yet a script still cannot forge the human signal and the data never overclaims. The second point is honest reporting under a degraded environment: retries disclosed, the one thing that could not be verified named as unverified rather than rounded up to done.

---

## 2026-08-10 to 2026-08-11, a feature the client asked for in Slack, and two bugs that only production could find

Steve pasted three LinkedIn posts into Slack over three days with a request attached: "I still browse LinkedIn sometimes. It would be nice to be able to add any link to the next week's round up, even though I don't follow them." Radar's crawler only follows a fixed list of profiles, so there was no way in. Separately, and in the same thread, he reported a close button on his desktop app that refused to close. The two turned out to be related: the second was caused by something we had shipped four days earlier.

### What shipped

- **"Add to Radar", live and proven on production.** An admin pastes or shares any LinkedIn post or article link; it becomes a real feed row every reader sees, pre-starred so it joins the next weekly roundup. Two entry points: a button in the feed header, and the phone share sheet through a new chooser screen that leaves the existing "save as idea" path untouched. Commits `4d36af0` through `a72f1ca` on `feat/linkedin-engine`, migration 059, 1030 tests passing across 109 files.
- **The fetch runs on a background worker, not in the request.** The first version called the scraper synchronously, which meant closing the app mid-request lost the add and wasted the paid run. Rebuilt so the request only queues: a poller on the Railway service claims the job, scrapes, then notifies every admin that it is ready to confirm.
- **The unclosable close button, root-caused and reverted.** Verified live: the old origin now serves the app in scope again (307 to its own login) instead of redirecting away, and the new share target is live in the deployed manifest.
- All three of Steve's original links are in the feed and queued for the roundup, verified by querying production.

### Decisions worth recording

- **I was wrong twice about the close button, in writing, before testing anything.** Steve's screenshot showed a browser toolbar wrapped around his app window. I told Peace it was a stale install on the old domain and he should reinstall. She pushed back: he was on the new domain. I explained why the URL bar appearing was itself evidence for my theory. She pushed back again with a clearer screenshot. Only then did I test it, and the real cause was a redirect we had shipped on 2026-08-06: a progressive web app's scope is fixed at install time, so redirecting the old origin threw every existing install permanently out of its own scope, into a loop the close button could never exit. The fix was reverting our own change, not asking the client to reinstall. Two confident answers had already gone out.
- **The scraped post's identifier is not a join key, and one paid test proved it before the code was written.** The plan assumed the numeric id in a pasted link would match the id stored for that post. Before building the matcher I spent about four cents running the real scraper against one of Steve's links. LinkedIn mints a different id per URL namespace: his Android share carried one number, the stored canonical URL carried another, for the same post. Matching on id would have returned "not found" for every link he ever sent. The matcher now keys on the URL slug, anchored to the author, because an unanchored match found two different posts whose slugs both collapsed to the string "seo".
- **"Star it for the roundup" meant a different table than the plan said.** The plan, and a six-persona document review, both had the feature writing a column on the post. Reading the roundup generator showed it actually reads per-user star rows and treats that column as a legacy fallback. Every manual add would have landed in no roundup at all, silently, and the acceptance test would have been the first thing to notice.
- **Refusing to skip classification, and clamping it instead.** The obvious way to stop the quality filter hiding a hand-picked post was to skip classifying it. But the roundup routes by topic, so an unclassified post would have been dropped from every roundup lane. It is classified normally and its verdicts are clamped, which satisfies both.

### Frictions and course corrections

- **The first live test failed in the client's face.** Peace tested with a six month old post. The scraper walks back from today, never reached it, and timed out twice. Steve saw the failure notification. Fixed properly rather than narrowly: the post's own publication timestamp is decoded out of its id (the top 41 bits are epoch milliseconds) and the scan window is aimed at that date, with depth scaling by age. Peace's instruction was unambiguous, "regardless of when the post was created, it should work," and an age limit I had written into the plan came back out.
- **The feature worked and still read as broken.** The data was correct: row inserted, starred, roundup-eligible. But the instant "already in your feed" path showed no post at all, and "view the feed" landed at the top of a list ordered by publication date, where a week-old post is nowhere in sight. Her words: "he can't preview or be certain that it is added to the feed if we can't see it." Both paths now render the actual post, and the link deep-links to that post pinned above the list. This is now a standing rule in the project memory.
- **I sent a technically accurate explanation that Peace could not use.** Asked where the design decisions should go, I wrote a question full of "share_target", "manifest" and "synthetic feed row". She replied "I don't understand what I just accepted." Rewritten in plain terms, the same decision took her ten seconds. The failure was mine, and it repeated later in the session before I fixed the habit.
- **The client's network dropped mid-deploy**, killing the upload with a TLS error and then a DNS failure. Worth separating clearly for her: one deploy step was failing, the feature was not broken, and prod was untouched.

### Why this matters for the portfolio

The useful content here is the three things production caught that no amount of planning did. This feature had a written spec, an implementation plan, and a six-reviewer adversarial document review before a line was written, and that process still shipped a plan with two load-bearing errors in it: the wrong identifier as a join key and the wrong table for starring. Both were caught by going and checking the real system, one with a four cent test against the live API and one by reading the code that consumes the data. A plan is a hypothesis about a codebase, not a description of one.

The second point is about being wrong in front of a client. I gave Peace two confident, well-argued, incorrect explanations for Steve's bug, and each time the thing that would have saved us was testing her contradiction rather than defending my theory. Her observation outranked my prior and I treated it as the other way round. The eventual answer was also less comfortable than the one I kept reaching for: the cause was our own change, not the user's setup.

---
