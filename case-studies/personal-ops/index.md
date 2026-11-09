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
