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

## 2026-09-25, Reach resumed: on demand, on two Macs, and a first task done end to end

Written the same day, from the repo's git log, `decisions.md`, and the test and live checks run in the session. Reach had been paused since 2026-09-03. A morning diagnosis found the host half-restarting itself and stuck on a startup prompt; the owner said to fix it if possible, then said Reach should only run when needed, then that it had to run on her MacBook Air as well as the Pro.

### What shipped

- **On-demand host.** The Mac's launcher checks Supabase every 30 s. It starts the host session only for a queued task, answers Claude Code's development-channels warning itself, and stops the host after 15 idle minutes. It never stops a session someone is attached to, and it never starts or stops anything while Supabase cannot be read.
- **Multi-host.** Every task names its Mac. The database allows one active task per Mac instead of one overall, and the claim function takes the Mac. Each Mac gets its own id and label from setup. The website has a Mac picker and a status pill per Mac. The CLI defaults to the Mac it runs on and takes `--host`.
- **Migration 0006** applied to the live shared database after a read-only review of the live catalog. Its verification queries confirmed the rename, the backfill, the per-Mac index and the function's grants. A rollback script was written and reviewed; it has not been needed.
- **Reach Chrome follows the host.** It opens when the host wakes and closes on the idle stop, but only if the launcher opened it, so a copy another session is borrowing is left alone. The login-time agent that kept it open is gone.
- **Unpacked extensions without the folder picker.** Reach loads an extension into Reach Chrome over Chrome's DevTools protocol and reloads a per-Mac list on every launch.
- **A channel fix:** the host's instructions were 2,510 characters against Claude Code's 2,048 limit. The cut had been dropping the stop rule and the never-type-passwords rule. They are now 1,787, with a test that fails past the limit.
- **Live, on the MacBook Air:** the first end-to-end task (it reported "macOS 27.0 (build 26A428)"). Then Reach loaded the owner's own Fanout Notebook 0.1.0 into Reach Chrome and confirmed it on `chrome://extensions` with no errors.
- **Tests at the end of the day:** channel 114, web 247 (plus `tsc` and a production build), skill 16, launcher 66 checks, setup identity 14, extension loader 5 against a real headless Chrome. The launcher and setup suites are the repo's first shell tests.

### Decisions worth recording

- **Pressing a warning on the owner's behalf became a standing yes, but a narrow one.** The docs confirmed there is no setting to pre-accept the warning for a home-built channel on a personal plan. So the choice was a host that parks unseen (it had sat for 34 hours) or one that answers for her. She chose to have it answered. It fires only when the bottom of the screen is exactly that dialog, naming only Reach's channel. It fires once per session, and every other startup question (folder trust, a new MCP server, a login) is named in the log and left for her.
- **Picking the Mac per task beat "whichever is free".** Waking both Macs for every task and letting one claim it was rejected, because it spends a start-up for nothing. The Mac picker, plus a default of the Mac the CLI runs on, keeps each Mac's queue its own.
- **Cost was checked before building, because she asked.** She worried a 30-second check would add to her Railway bill. It runs on the Mac, not Railway. It reads Supabase, whose free plan has unlimited API requests, and the reads come to under 90 MB of the 5 GB monthly egress.
- **A measurement overruled the write-ups.** Two sources said Chrome's `Extensions.loadUnpacked` needs a pipe connection and an extra flag. On throwaway profiles it worked over the plain debugging port with neither. The same test showed the extension is not saved in the profile, which is why the per-Mac reload list exists.
- **The build session did not handle credentials.** The host's login code, the security prompt for a new MCP server, and the Accessibility grant were all left to the owner, even when she was tired of being asked.

### Frictions and course corrections

- **The first fix was the wrong shape.** The morning's fix made the launcher report "waiting at the warning" honestly. An hour later the owner ruled that Reach must not run by default at all, which replaced that fix with the on-demand launcher.
- **Three independent reviews raised 18 findings on code that passed every test.** Sixteen were fixed and two were written down as accepted limits. The launcher's Enter-press matched text anywhere on screen, so a printed copy of the warning above a live permission dialog would have approved the permission. It would also have pressed again every 30 s. A copied settings file would have made both Macs claim the same identity. A leftover marker could have closed someone else's browser. Each fix got a test, and eight deliberate breakages of the launcher were each caught by one.
- **A tool refused, and the refusal stood.** The session's safety classifier blocked a probe that launched Claude Code with the "dangerous" channel flag. The test fixture came from a real capture instead, and the first live launch was left to the owner's own background job.
- **The live run found what tests could not.** The Air's host login had expired, and it was on the API account, not the Max plan. After re-login, the session sat on a "press Enter to continue" screen, so two tasks timed out behind it. The site also served a cached landing page to a browser that had visited signed out. All three are recorded as follow-ups.
- **A Mac folder picker is out of reach for every driver.** Reach got as far as Chrome's Load unpacked button and stopped. Playwright sees only page content, and computer use treats browser-owned windows as look-only. That limit is what led to the DevTools route.

### Why this matters for the portfolio

- Asking the owner the right question beat guessing her intent. "Should it press Enter?" turned into "should it be on at all?", which was the real requirement and changed the design.
- A capability claim from the web is a hypothesis until it is measured. The one experiment that contradicted two write-ups also uncovered the persistence gap the design then had to handle.
- Tests that pass are a floor, not a verdict. The independent reviews and the first live run each found defects that 462 passing tests and checks did not.

---
