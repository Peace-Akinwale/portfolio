## Portfolio summary

Reach is a personal tool. When an AI coding session hits a step that only works on my Mac's screen, like a signed-in browser or an extension's own page, it hands the step to a Claude Code session on the right Mac and gets the result back. It runs on my Claude subscription, not an API key, starts only when a task is waiting, and stops for anything that needs a password.

## Case study

### Cloud coding sessions stall on steps that need a real Mac

Coding sessions in the cloud kept stalling on steps that need a real Mac, like loading an extension to test it or checking a page while signed in. Each time, I was the handoff. "Anytime I am working in any session, and the typical Claude model can't use computer use for some tasks, I can delegate it to Reach."

The idea came from a demo by Dan Shipper. My version had one hard constraint. It runs on my Claude subscription. If a design needed an API key, it was the wrong design.

### A normal Claude Code session is the hands, and it stops for passwords

**An unmodified Claude Code session is the hands.** The website takes the task and the Mac runs it, in a normal Claude Code session that receives tasks through a channel. Nothing is billed per call.

**Sign-ins stop for me.** I wanted Reach to handle chores like signing a command-line tool in. I drew a line. Device codes and consent screens are fine, but typing a password or a two-factor code stops the task and asks me. The overlay on my screen shows when it's waiting.

[[img]]

**Start only when needed.** The first host ran all the time. It restarted itself while paused and sat on a warning for about 34 hours while the watchdog reported it as running. "Reach should only start when it is needed. Not turned on by default." A launcher now checks the queue every 30 seconds, starts a session when there's a task, and stops it after 15 idle minutes.

**One Mac per task, chosen by me.** I have two Macs. "Each Mac should have its own config." When a task is sent, I pick the Mac, rather than letting the first free one grab it or waking both.

**Cut the hosting bill.** The website deploys from GitHub and sleeps when idle, which moved it under Railway's cheapest allowance and ended hand-deploys.

### Two real tasks ran end to end, and the first click still hasn't

It ran its first two real tasks end to end. One returned the Mac's system version, and one loaded an extension into the Chrome profile Reach drives.

The instructions the session receives were being cut at 2,048 characters, and the cut removed the line "Never type passwords or secrets. Never complete a sign-in." I rewrote them to 1,787 characters and added a test that fails if they grow past the limit. A host on the other Mac later uploaded about 650 screenshots on a single task while the database struggled.

[[img]]

Reach has 462 tests across its parts. It hasn't yet driven a click through computer use, because the Mac's accessibility permission has never been granted to it. I'm its only user.
