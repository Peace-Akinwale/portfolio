---
title: "Build a course portal around the instructor’s workflow"
date: 2026-10-25
standfirst: "What I learned building a members’ portal for an eight-week course: which parts of the instructor’s process the software should leave alone."
notion_url: https://app.notion.com/p/403992da7a578152abc6e58249ea4db7
notion_last_edited: 2026-10-24T17:26:40.213Z
tags:
  - "Building"
  - "Tools"
---

The instructor already had a way of preparing course material that they liked. They could write a session page using their own tools. What they needed was a reliable way to deliver that material to students.

Recordings lived separately from the pages. Links shared during calls ended up in chat, and students had to ask where to find things. Each new group also needed its own setup.

I used AI coding agents to build a portal around that workflow. The work gave me a useful question to ask before building an internal tool. Which parts of the existing process should the software leave alone?

## Keep the instructor’s publishing workflow

The instructor specifically said they did not want a content management system. Building an editor would have introduced another tool to learn and another place to maintain the same material.

I kept their existing session pages and built the delivery around them. Students could access the material through the portal, while the instructor continued preparing it in the way they already knew.

That choice gave the project a clearer scope. I could spend time on access and course delivery instead of recreating a writing environment the instructor had not asked to replace.

It is worth asking this early when someone requests a custom tool. A familiar process can be valuable even when the tools around it are awkward. Replacing the whole process may create work for the person you were trying to help.

## Make the next cohort easier to set up

A folder of course pages would have brought the material together, but it would still have left the instructor managing each student’s access manually. The portal needed to know which cohort a student belonged to and which weeks they could open.

I tied the release schedule to the cohort’s start date. The instructor could copy a previous group and set a new start date, with the release calendar calculated from there. They would not need to enter every date again before another course began.

The copying process also had to account for files stored outside the database. Copying a session record did not necessarily copy its attachments. I made the portal identify files it could not bring across so the instructor could fix those specific gaps before students encountered them.

The useful result was a repeatable setup process with visible exceptions. The instructor could reuse the course without assuming every part of the copy had succeeded.

## Check who can enter without creating another support problem

The portal checked access against the approved student list. That check needed to apply regardless of how someone signed in, so I put it at the database layer.

I also removed open password signup. Someone typing an approved email address should not be able to claim that account without showing they control the inbox. Starting account creation from an email link provided that check.

These decisions matter because a student portal creates work whenever access is confusing or unreliable. The instructor needs to know that enrolled students can enter and that removing someone actually removes their access. I checked those paths in the running portal rather than relying only on isolated tests.

## Build within the limits the instructor will actually have

The hosting plan limited how much work a request could perform. I reduced unnecessary server requests, including changing one screen from eight requests to one. Static files no longer needed to pass through the server.

The point was to make the portal fit the available hosting budget, rather than leave the instructor with a tool that immediately needed a more expensive plan.

That became the pattern for the build. Preserve the working habits that matter, then remove the recurring work around them. AI helped me write the implementation, but I still had to decide what the instructor should be able to do without my help.

For this portal, that meant publishing in a familiar way and preparing another cohort without rebuilding the course. Those are the outcomes I would use to judge whether the custom tool earned its place.
