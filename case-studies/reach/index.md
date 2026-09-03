# Reach, personal product: case study log

A running log of the build of Reach, Peace's own computer-use agent (a Claude Code session on her Mac, fed tasks by a custom channel server, with a web app, an API, a Claude Code skill and an Electron overlay). Updated as deliverables land. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Peace Akinwale (own product). Modelled on Dan Shipper's "Hands" at Every, rebuilt to run on a Claude Max subscription instead of an API key.
- **Stack:** Bun channel server (MCP), Next.js 16 web app on Railway (`reach.peaceakinwale.com`), Supabase (shared portfolio project, `reach_` prefix, RLS owner-only), Electron overlay, a `/reach` Claude Code skill with a Node CLI, Playwright over CDP for browser-internal pages.
- **Method:** spec, then four plans, executed with subagent-driven development (fresh implementer per task, scoped re-review after every fix round, whole-plan review per plan), with a decisions log and per-task ledgers.
- **Repo:** `Peace-Akinwale/reach`, branch `reach/plan-1-foundation-and-channel`.

---

## 2026-09-03, the Mac day: three plans reviewed and shipped, a pre-launch audit, and a first live task that stopped one permission short

Written the same day, from the repo's decisions log, the four ledgers, and the session handoff. The Windows PC had built and unit-tested everything on 2026-09-02; this was the first day on the machine that actually hosts Reach.

### What shipped

- Three whole-plan reviews (web, overlay, Mac host and hardening) and their fix waves, all re-reviewed clean. Test counts at the end of the day: channel 108, web 213, overlay 148, skill 12 (481 total; the day started at 92 + 99 + 93 + 12).
- Six production deploys attempted on Railway, four succeeded (one failed on a build-step path, one was the region move); the web service now runs in EU West (Amsterdam) only, matching the database's region.
- A landing page at the root of the domain for signed-out visitors, phone layout as a plain vertical scroll after the owner rejected the swipe version on her phone.
- A pre-launch security sweep with evidence (anon key reads nothing, service-role functions denied to anon, no secrets in git, a real task driven through the production API with a throwaway token that was then deleted and rejected) and an adversarial completeness audit (3 blockers, 9 should-fix, 6 nice-to-have).
- The audit's real blocker fixed and deployed: when the Mac is offline, Stop on a running task used to write an event nobody would read, and one stuck row blocked every future task; it now cancels the row directly and the button says so ("Force stop").
- The Mac host actually running for the first time: Homebrew and tmux installed, the LaunchAgents loaded, the personal Max login completed, the channel registered, `computer-use` and the Playwright driver connected, and a task posted from the website reaching the model.

### Decisions worth recording

- **Screenshots pause during a login handoff.** The spec said capture every 4 seconds while a task is running or paused. The audit pointed out that "paused" is exactly when the owner types a password or a 2FA code in front of the screen, and those frames were being uploaded. Ruled to stop capture on `needs_you` and resume on Continue; the owner confirmed.
- **An expired permission tells the session "no".** The channel's one-hour ceiling on an unanswered permission prompt used to expire the row and say nothing to the session, whose prompt stayed open; the pickup check then failed the stuck task and every task after it. Fixed by sending a deny on any expiry, and the web app's own ten-minute expiry was raised to the same sixty minutes so the two halves stop disagreeing.
- **A launcher that exits successfully cannot be kept alive.** The host's LaunchAgent used `KeepAlive`, which never restarted a dead session (the launcher itself exits 0 once tmux is up) and crash-looped when tmux was missing. Replaced with a 60-second watchdog that is a no-op while the session is healthy.
- **Mixed commits accepted rather than rewritten.** Four implementers sharing one git index swept each other's staged files into their commits three times. History was left as is because rewriting it under live agents risked more than a misattributed message costs; every later dispatch carried the pathspec-only commit form.
- **The build session never completes a sign-in.** The Chrome on the Mac is signed into a company Claude organisation. When the host's OAuth needed a browser, the owner did it in a private window on her personal account; the build session drove everything else in the terminal over tmux but not that.

### Frictions and course corrections

- **The repo arrived broken by the copy.** `node_modules` copied from Windows were empty directories, and the package manager quietly pulled two npm-managed packages into its own lockfile. Fixed by scoping the workspace to the one package that uses it.
- **The first host launch died instantly.** The launcher piped the interactive session's output through `tee`; with no terminal on stdout, Claude Code fell into non-interactive print mode. Reproduced with two probes (piped dies, unpiped waits), then fixed by logging through tmux instead of a pipe.
- **The first sign-in landed on the wrong account.** The OAuth picker offered the owner's Console organisation next to her Max subscription on the same email; the host came up billing an API account, with no computer use. Caught by reading the session's own status line, fixed with a second `/login`, and written into the setup guide as the trap it is.
- **The first task never reached the model.** The session's binary auto-updated during startup and the channel connected as a plain MCP server; its log said "Channel notifications skipped". The channel claimed the task and took screenshots for five minutes while the model saw nothing. A restart registered the channel; the status line ("Channels: Listening") is now the documented check after every launch.
- **A working theory was wrong and said so.** Supabase's data API stalled from the Mac while the auth endpoint answered. The owner's VPN was the obvious suspect and she disconnected it; the stall continued, and the storage endpoint returned a 544, so it was the provider's edge, not her network. The record says which.
- **A reviewer caught a regression the fix had introduced.** Bounding a cron parameter turned "no parameter" into "one task per run" because `Number(null)` is `0`, an integer. An existing test caught it before it shipped.
- **The day ended one permission short.** The live task reached the model and stopped at the macOS Accessibility prompt; the owner paused before granting it. Everything was switched off cleanly (task cancelled with a reason, host row offline, agents unloaded), and the resume steps are in the repo.

### Why this matters for the portfolio

- The cheapest place to find a launch defect is on the machine that will run the product, one day before it matters. Four of the day's most consequential bugs (the pipe, the wrong account, the lost channel registration, the missing PATH entry) were invisible to 481 passing tests and obvious in the first ten minutes of a real run.
- Reviews earn their cost when they have a fresh pair of eyes and a bounded scope. Every fix round here got a scoped re-review, and three of those re-reviews found a defect that the fix itself had introduced.
- An audit that runs before the owner does is a different product from one that runs after she reports a problem. The completeness audit's one real blocker (a stuck task jamming the queue forever) is the kind of thing that is discovered at midnight otherwise.
- Saying "the VPN was not the cause" after having suggested it was costs nothing and keeps the log honest. A confidently wrong specific is the one failure mode a client remembers.

---
