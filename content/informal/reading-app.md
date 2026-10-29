## Portfolio summary

I built a private app an agency uses to follow SEO and AEO trends. Its founder kept checking LinkedIn and saving posts across task lists. The app gathered public posts into one feed to review, with audio digests for listening instead of reading. Starred posts fed newsletter notes that the founder could edit before sending them to the publishing system.

## Case study

### Get recurring research out of the social feed

The founder runs an SEO agency and two newsletters, and their research happened in the gaps of the day. In their words, LinkedIn was "on the home screen of my phone," and they were "opening it 10 times a day."

Every useful post went into one of three Google Tasks lists to come back to later. By June 2026 those lists held 714 saved items.

They wanted "a way to totally replace" that process. It had to follow the people they trust and let them work through those posts "in a condensed and manageable way." They also prefer listening to long articles over reading them.

I'd been building a different tool until June 10, 2026. It was an engine that drafted LinkedIn posts. On a call that day, the founder said drafting wasn't the problem. The checking and saving was.

I wrote up the new requirements from the call and shipped its first version that same night. The post engine's infrastructure stayed and went to work for the new app.

### Review collected posts in one feed

The app crawls about 190 people's public posts every day. It also follows selected YouTube and X accounts and industry news feeds. The top of the feed says what the crawl did, so the founder knows how much is waiting before they start.

[[img]]

The founder can go through posts in one place and star the ones worth using. Off-topic updates are hidden by default, with a “Show everything” switch to see what got left out. Feedback helps tune the feed. That gives the founder a research queue to work through on purpose, instead of reopening LinkedIn to check what's new.

### Listen to digests and newsletter notes

The founder likes listening. So I added audio versions of the weekly LinkedIn and industry-news digests. They can catch up without reading every collected post. Newsletter notes also got narrated and short-video versions, so the same edited material can go out in another format.

### From a star to a newsletter note

Starring a post does two things. It clears the post from the unread list, and it adds it to that week's newsletter note. On the Roundups screen, starred posts wait under "Building now." There the founder can reorder them or top them with a note.

[[img]]

The app drafts a newsletter note from three chosen posts and the founder's own commentary, sticking to the limit they picked. The founder edits it before sending it to the publishing system as a draft. So their research picks become the starting point for the newsletter, and they don't have to collect the same links again.

### Rules that protect the account

I set account-protection rules before writing any code. The app holds no LinkedIn login or cookies. There's no way to post or comment from it. Engagement stays with the founder, through links they open themselves. Public posts come through a third-party data service that doesn't need the founder's account.

Two smaller rules came from watching the app in use. The feed only refreshes when asked, so posts don't jump around while you're reading. And a separate check stops generated newsletter copy from promising agency services, so an automated draft can't make commitments the founder hasn't approved.

### Everything the app makes, in one place

As more outputs got added, I brought them together in a shared Library. The founder can get back to a digest or find a newsletter draft without remembering which part of the app made it. The Library also links to related research tools, including AI Docs Watch.

[[img]]

### What the build delivered

I turned the founder's requests into one connected reading and publishing workflow, and directed AI coding agents through the build. It gave them a place to review collected research and turn chosen posts into newsletter drafts. Teammates get reader accounts.
