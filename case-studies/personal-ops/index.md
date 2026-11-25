# Personal ops system (Blue + ops dashboard), personal product: case study log

A running log of Peace's own operations system: Blue, a Telegram assistant that captures, reminds and answers, and the ops dashboard, a Next.js PWA over the same database for tasks, clients and invoices. Updated as deliverables land. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Peace Akinwale (own product).
- **Stack:** Blue is Node 22 + Fastify + pg-boss + Telegraf with a Claude agent loop and honesty guards (`Peace-Akinwale/telegram-agent`). The dashboard is Next.js 16 App Router (`Peace-Akinwale/ops-dashboard`, `ops.peaceakinwale.com`). Both run on Railway (Hobby) against one Supabase database (schema `blue`, separate roles per app).
- **Method:** a decisions log per repo (dashboard D1 to D67, Blue D1 to D61 as of this entry), CI on Blue, live checks after every deploy.

---

## 2026-09-25, a deploy that never fired, a Railway bill cut at the root, and an assistant tested on how it is asked

Written the same day, from the git logs of `ops-dashboard`, `telegram-agent` and `reach`, their decisions logs (dashboard D66 to D67, Blue D60 to D61), Railway's deployment records and `railway usage`, and checks run in the session. It started as "my push did not deploy" and turned into a cost cut, a deploy overhaul across four apps, and a test for how the assistant answers.

### What shipped

- **The missing deploy, root-caused.** The dashboard's Railway service had no source repository. Every deploy since July had been a manual upload, and the "auto-deploys on push" line in the repo's own instructions described the sibling service (Blue). After the owner connected the repo, commit `ac80a6a` went live about a minute later. The proof was the live `sw.js` cache key changing from a 3 September timestamp to the commit hash.
- **Railway cost, traced to memory.** At the time of writing: $8.49 used and $11.09 estimated against the $5 Hobby allowance. The per-service breakdown put nearly all of it on memory held by always-on services. Two unused services were stopped, Serverless was turned on for three web apps, and the dashboard's every-minute push loop was removed. The effect on the bill is not measured yet.
- **Every active service now deploys from GitHub:** the dashboard, Blue, Aloud's web app and daily job (the job now builds from its own one-file folder instead of the whole app), and Reach's web app (a monorepo subfolder on a feature branch, with Node pinned to 22).
- **Blue knows the invoice it kept forgetting.** The Kairos Labs terms came from the owner's Gmail: send on the 1st for the previous month, to finance@kairoslabs.co (the .com address had swallowed a July invoice), cc the founder, net 30. They became a permanent memory, plus two reminders at 10:00 Lagos on the last day of the month and on the 1st.
- **A knowledge eval for the assistant.** `scripts/eval-knowledge.mjs` runs paraphrased questions through the real agent path against live data, with every write tool stubbed and nothing sent. It checks for facts a correct answer must contain and for wrong claims it must not make. Result after fixes: 41 of 42 answers passed across three full runs of 14 questions.
- **Blue's CI is green again.** It had failed on 7 consecutive pushes, from 2026-07-28 to 2026-09-08. Tests at the end of the day: 493 passing (485 at the start of the session, plus 8 new).

### Decisions worth recording

- **Deleting the push loop beat porting it.** The owner asked for the every-minute notification check to move into Blue. The database showed 0 push subscriptions and no delivery since 2026-09-08. Moving it would have been about 150 lines, a new dependency and three new secrets for a channel that reached nobody. She chose deletion. Telegram already carried the same reminders.
- **Reach deploys from its feature branch, not `main`.** `main` held only a docs commit from 2026-09-02, so connecting it would have deployed a broken site. Before connecting, a diff confirmed zero web files had changed between the live build and the branch head.
- **No invented numbers in the assistant's memory.** The emails did not state a Kairos rate. Blue says so and points to the last invoice rather than guessing.
- **A redesign was sketched, then dropped.** A scroll-driven sketch of the Reach landing page was built and fixed after the owner's first look. She then dropped the redesign: it is a page only she ever sees.

### Frictions and course corrections

- **"Serverless is on" was reported before it was true.** The setting saved, but `railway service redeploy` reuses the previous deployment's saved configuration. A 16-minute idle test caught two apps that never slept. Fresh deploys fixed it. Network logs confirmed the dashboard's database calls stopped at the new deploy, and the first request after sleep took 0.95 s against 0.77 s warm.
- **The first GitHub build of Reach failed.** A config file in the subfolder switched the builder to one whose default Node (18) is older than the framework requires. Pinning Node 22 fixed it. The failed build never replaced the running site.
- **Keyword scoring passed wrong answers.** The first eval run scored 12 of 12 on facts, yet the replies called 1 October "tomorrow" on 25 September, dated the last invoice a month late, called a 10:00 reminder "evening", and pulled another client's hourly rate into an answer. The "evening" came from the session's own naming: the job was called `kairos-invoice-eve`. Fixes: a spelled-out calendar line in the system prompt, a clearer memory, a renamed job, and checks for wrong claims as well as missing facts.
- **A date given to the owner was wrong.** The session said Blue's CI had been red since 8 September. The CI history shows 28 July. It was corrected in the decisions log.
- **The local environment pointed at a retired database.** The eval had to run with the live service's variables (`railway run`) to see the new memory.

### Why this matters for the portfolio

- A fix is not done when the setting saves. It is done when the running system shows it: the deployment's own configuration, the sleep state, the network log.
- An assistant is only as good as its worst paraphrase. Testing many phrasings, and failing replies for wrong claims rather than only for missing facts, found errors that a keyword pass let through.
- Data changed the plan. Zero subscribers turned a port into a deletion, and a docs-only `main` branch changed which branch goes live.

---

## 2026-11-09, a Disk IO warning traced to a job queue logging in again on every poll

Written the same day, from `telegram-agent` commit `a769089`, Blue's decisions log (D64), Railway's deployment records and Supabase's connection logs read in the session. It started as a Supabase email warning that the shared database was running out of its Disk IO budget.

### What shipped

- **The cause, found in the connection logs.** Blue's job queue (pg-boss 12) builds its own Postgres pool and kept the driver's 10-second idle default. Its workers poll every 120 seconds, so both connections closed between polls and every poll logged in again through Supabase's session pooler: about 150 queue logins an hour on the smallest free instance (0.5 GB of memory), shared by five apps. From about 13:40 UTC the database stopped answering logins.
- **The fix, one setting.** `src/jobs/boss.ts` now holds pooled connections for 5 minutes, above the 120-second poll, with a comment tying the two numbers together. pg-boss forwards extra options to the pool, but its TypeScript type omits them, so the option rides on a widened type rather than a cast.
- **Measured after the deploy** (Supabase pooler logs, per 5 minutes, 15:25 to 15:40 UTC): queue logins went from 6 to 22 down to 0; all logins from 10 to 35 down to 4 to 6; login timeouts from 7 to 29 down to 0.

### Decisions worth recording

- **Only Blue was changed.** The investigation also found Reach polling the same database every 30 seconds. The owner approved the Blue fix alone, so Reach was left as it was.
- **No plan upgrade.** The decisions log already records that the owner won't pay for a bigger instance (D59), so the fix had to come from using the free one better.

### Frictions and course corrections

- **The first deploy of the fix failed.** The database was so starved that Blue's startup could not get a connection. The project had to be restarted from the Supabase dashboard before a redeploy of the same commit succeeded.
- **The browser kept landing on the wrong Mac.** The Chrome extension is installed on two machines under one device ID, and only one was signed in to Supabase, so actions randomly hit a sign-in page until retried.
- **Disk IO itself is not yet confirmed.** The dashboard's Disk IO charts would not load after the restart. Fewer logins should mean less IO, but that is an inference until the daily chart shows it.

### Why this matters for the portfolio

- A vague platform warning was traced to one line by reading the provider's own logs, not by guessing at queries or upgrading the plan.
- Library defaults are part of the design. A sensible driver default became the main load on a small database once it met a slow poll.
- The report separates what was measured (logins, timeouts) from what is still expected (the Disk IO budget).

---

## 2026-11-25, the Disk IO warnings traced to memory, not queries, and a database move that cost five minutes of someone else's API

Written the same day, from `telegram-agent` commits `276e14a` to `d7357c8` (D65), `ops-dashboard` commits `4056065` to `05ee39f` (D70), the Supabase dashboard, Gmail and Supabase's logs read in the session. The 9 November fix had cut the logins, but the Disk IO emails kept coming: 24 October, 2, 9, 17 and 24 November.

### What shipped

- **The real cause, read off the dashboard.** On the smallest free instance (about 477 MB of memory), memory commitment sat at about 1.5 GB, flagged severe, and swap was 383 MB and about 94 percent full at 02:00, when almost nothing runs. Swapping is what spends the IO budget. The daily chart showed the budget at 99 percent on 23 November and 39 percent on 24 November.
- **Blue and the ops dashboard moved to a second free project.** Two schemas copied with pg_dump 17 and checked row for row: 74 tables, 32,470 rows, identical. Railway variables were set without deploying, a final copy was taken, then both services were redeployed on the new database.
- **Nothing written during the switch was lost.** A per-table comparison by primary key found no row only in the old copy; every row that differed was newer on the new side.
- **The dashboard's Aloud pane now reads across projects** through its own two-connection pool (`app/lib/aloud-db.ts`), because Aloud stayed where it was.
- **A new bug-hunt pattern (C174)** for the outage below.

### Decisions worth recording

- **No plan upgrade, again.** Pro plus the next compute size would have fixed the memory directly for about 25 dollars a month. The owner declined, so the free answer was to split the load across the two free projects the plan allows.
- **The first target was impossible.** The owner chose a paused project, but the free plan allows two active projects and both slots were taken, so the second slot's project became the target instead.
- **Credentials never entered the conversation.** New database passwords were generated into a private file and handed to Postgres as SCRAM hashes, and Railway values were piped from that file. When a command would have printed them, the agent's own safety check blocked it and the approach was changed.

### Frictions and course corrections

- **The agent's own cleanup caused an outage.** Dropping the old schema took down the other project's whole Data API for about five minutes (13:08 to 13:13 UTC): the API's schema list, set as a role override, still named the dropped schema, so every request returned 503. The owner noticed it as a failed Google sign-in on Aloud. Supabase's own logs showed the sign-in itself had succeeded and the profile lookup after it had failed. Service came back with an empty placeholder schema, then the override was edited to drop only that name.
- **The first restore was refused.** `pg_restore --clean` cannot drop a partitioned job-queue table, so the whole transaction rolled back; the schemas were recreated empty and restored again.
- **Builds failed twice on a font download**, not on the change. Each retry of the same commit succeeded, and the previous build kept serving meanwhile.
- **A wrong claim, corrected the same day.** The agent said the dashboard's handoff overstated its tests; on rereading, the line described Blue's suite, which passes 493 tests.

### Why this matters for the portfolio

- The second look at the same warning found a different cause than the first. The fix that worked on 9 November was real, but it addressed a symptom of a box too small for what it runs.
- A migration checked row for row, with the old copy backed up before it was deleted, is what makes a move like this safe on free infrastructure.
- The outage, its cause and the rule it produced are recorded in both repos and in a reusable pattern, not just fixed and forgotten.

---

