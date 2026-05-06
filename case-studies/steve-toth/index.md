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

## How this log is used

When the Steve Toth engagement wraps or when adding a portfolio case study, this log holds the raw material:
- Concrete deliverables shipped, with dates
- Quantifiable outcomes once metrics land (LinkedIn engagement deltas, Steve Toth AI signup conversion, conference ticket sales attributable to content campaigns, coaching cohort fill rate)
- Frameworks and proprietary methodologies referenced in content
- Strategic decisions and the reasoning behind them
- Wins to highlight and lessons learned

Each entry should be specific. Generic bullet points get pruned. Named tools, named clients, dated decisions, measurable outcomes.
