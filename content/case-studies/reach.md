---
title: "Reach: hands on my Mac for AI agents that can't reach it"
kind: built
status: "personal tool, two Macs"
date: 2026-09-27
summary: "Reach is a personal tool I built so my AI coding sessions stop waiting on me. When a session hits a step that only works on my Mac's screen, like an app setting, a signed-in browser, an extension's own page or a device sign-in code, it hands the task to Reach. Reach starts a Claude Code session on the selected Mac. Its dedicated browser handles the tested workflows; broader desktop-app control remains the next step."
notion_url: https://app.notion.com/p/403992da7a5781c28d08f130a8388772
notion_last_edited: 2026-10-24T17:30:10.579Z
tags:
  - "agents"
  - "automation"
related:
  - "aloud"
  - "contentdb"
---

### Hand computer tasks to a session on the right Mac

An AI coding session can reach a step that requires a browser on my Mac, such as loading an extension for testing. I built Reach to pass that step to a local session and return the result, reducing the manual handoff between the coding conversation and the computer. A video demonstration inspired the idea; I designed my own implementation.


### Send a task to the Mac that can run it


A session submits the outcome it needs and selects the Mac. Reach queues the work and starts a local Claude Code session when needed. It closes idle sessions after 15 minutes, so the computer does not keep an agent running between tasks.

The local session uses the tools available on that Mac, with tested browser workflows running in a dedicated Chrome profile. It returns the result to the requesting session so the original work can continue without me relaying the outcome.

A status page and small overlay show what the session is doing. I can interrupt it or provide a requested approval without having to reconstruct the task from a terminal log.


### Pause for passwords and sign-in

The safety rules came first, because the tool acts on a real computer with real accounts:

- **It never types a password**, completes a sign-in, solves a CAPTCHA or handles a two-factor code. It calls for me instead.
- **Screenshots pause while it waits for me**, because that's exactly when I'm typing a password. An early review caught frames being uploaded at that moment, and I made the pause a rule.
- **The local channel the overlay talks to needs a token** and refuses requests from web pages, so a site open in the browser can't send it commands.
- **It runs on my own subscription**, with no API keys, and only on my Macs.


### Keep local sessions from running unnecessarily

- **Wake only when needed.** The first version ran around the clock and once sat for 34 hours stuck on a startup warning. Reach now starts a session only for a queued task and accepts that one known warning itself, narrowly.
- **One Mac per task.** With two Macs, waking both for every task wasted a startup. Each task now names its Mac, and each Mac runs one task at a time.
- **A dedicated browser for automation.** The browser automation I was using couldn't open extension pages or Chrome's own settings, and Chrome refuses remote control of a person's main profile. Reach uses a separate Chrome profile it can drive fully, and it reloads the extensions I'm testing every time it starts.
- **Keep safety instructions within the available space.** An instruction-length limit had cut off the password-handling rule. I shortened the instructions and added a length check so that rule would remain in the context the session received.

### What the build delivered

I built Reach over two days in early September and a third in late September, directing AI coding agents through a written spec, four plans and review passes. It runs on two Macs, and its completed tasks so far include reading a Mac's system version and loading a browser extension into its own Chrome profile. That dedicated browser has done the most real work: I've used it for recording AI search sessions for research and for testing browser extensions I build.

The next step is completing workflows inside desktop apps. That still requires the appropriate macOS accessibility access and end-to-end verification. The demonstrated browser work provides a useful handoff already, without claiming the broader desktop workflow is finished.
