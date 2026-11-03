---
title: "Reach: hands on my Mac for AI agents that can't reach it"
name: "Reach"
blurb: "When an AI coding session needs my Mac’s screen, it hands the job to Reach and gets the result back."
kind: built
status: "me, on two Macs"
date: 2026-09-27
summary: "Reach is a personal tool I built so my AI coding sessions stop waiting on me. Some steps only work on my Mac's screen, like a signed-in browser or an extension's own page. When a session hits one, Reach starts a Claude Code session on the Mac I pick. Its dedicated browser handles the workflows I've tested. Desktop apps come next."
voice: informal
notion_url: https://app.notion.com/p/403992da7a5781c28d08f130a8388772
notion_last_edited: 2026-10-30T23:42:22.799Z
tags:
  - "agents"
  - "automation"
related:
  - "aloud"
  - "contentdb"
---

### Hand computer tasks to a session on the right Mac

Coding sessions get stuck on steps that need a browser on my Mac, like loading an extension to test it. I built Reach to pass that step to a local session and send the result back. That cuts out the manual handoff between the coding conversation and the computer. A video demo gave me the idea, and I designed my own version.

![reach 02 how it works](images/reach/reach-02-how-it-works.png)

*The diagram shows the task handoff and the point where the owner is asked to take over.*

### Send a task to the Mac that can run it

![reach 04 overlay needs you demo](images/reach/reach-04-overlay-needs-you-demo.png)

*Scripted demonstration of the sign-in handoff. The flight task illustrates the interface; it is not evidence of a booking.*

A session says what outcome it needs and picks the Mac. Reach queues the work and starts a local Claude Code session when it's needed. It closes idle sessions after 15 minutes, so the computer isn't keeping an agent running between tasks.

The local session uses whatever tools that Mac has, and the tested browser workflows run in a dedicated Chrome profile. It sends the result back to the session that asked, so the original work can carry on without me relaying anything.

A status page and a small overlay show what the session is doing. I can stop it or give an approval it asks for without piecing the task back together from a terminal log.



### Pause for passwords and sign-ins

I set the safety rules first, because the tool acts on a real computer with real accounts.

- **It never types a password** or completes a sign-in. It won't touch a CAPTCHA or a two-factor code either, and calls me instead.
- **Screenshots pause while it waits for me**, because that's when I'm typing a password. An early review caught frames being uploaded at that moment, and I made the pause a rule.
- **The local channel the overlay talks to needs a token** and refuses requests from web pages. A site open in the browser can't send it commands.
- **It runs on my own subscription** with no API keys, and only on my Macs.



### Keep local sessions from running when they don't need to

- **Wake only when needed.** The first version ran around the clock, and once sat stuck on a startup warning for 34 hours. Reach now starts a session only for a queued task. It accepts that one known warning itself, and no other.
- **One Mac per task.** With two Macs, waking both for every task wasted a startup. Now each task names its Mac, and each Mac runs one task at a time.
- **A dedicated browser for automation.** The browser automation I was using couldn't open extension pages or Chrome's own settings, and Chrome won't let anything remote-control a person's main profile. So Reach uses a separate Chrome profile it can drive without those limits, and it reloads the extensions I'm testing every time it starts.
- **Keep the safety instructions inside the space available.** A limit on instruction length had cut off the password rule. I shortened the instructions and added a length check, so that rule always makes it into what the session receives.

### What the build delivered

I built Reach from a written spec and four plans, directing AI coding agents through the build and its review passes. That took two days in early September and a third in late September.

It runs on two Macs. The tasks it's finished so far include reading a Mac's system version and loading a browser extension into its own Chrome profile. That dedicated browser has done the most real work. I've used it to record AI search sessions for research and to test the browser extensions I build.

The next step is finishing workflows inside desktop apps. That still needs the right macOS accessibility access and testing from start to finish. The browser work already makes for a useful handoff, and I'm not claiming the wider desktop workflow is done.
