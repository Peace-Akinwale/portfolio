---
title: "The success message was the bug: five lessons from building an AI-assisted reading tool"
notion_url: https://app.notion.com/p/404992da7a5781ce8b6cd42fb274dc33
exported_at: 2026-10-25T16:43:22.456Z
notion_last_edited: 2026-10-30T23:42:30.318Z
---

*Peace Akinwale*

One evening the app told its owner that a link he had pasted was now in his feed and in the week's roundup. A few minutes later I opened the roundup. The post was not there.

The link had reached the feed. The background worker that finished the job had skipped the step that made it available to the roundup, and the notification still described the whole job as done. The cause was one missing setting on that worker. Without it, the worker could not tell whose list to add the post to, and it read that as a normal mode instead of an error. It saved the post, skipped the roundup step and sent a cheerful message anyway.

I built the product with AI coding agents. It pulls useful industry posts into one feed, reads them out as audio digests, and lets one person turn the posts he selects, plus his own notes, into a weekly roundup he publishes. My job was to decide what deserved building, to check each result the way the person using it would, and to make the agents prove what they claimed. That false notification set the tone for the rest of the build. Five lessons came out of it:

1. A success message is a claim, so it needs proof.
2. A person's choices are instructions, not suggestions.
3. Finish the task where the person will look for it.
4. When the writing disappoints, check what the model actually received.
5. Healthy-looking is not the same as working.

## How it started: the brief changed in the first month

The first version generated posts. In a planning call, the client told me his own AI project, built on years of his writing, still produced better drafts than anything we had made. He did not want to scrap our work. He wanted it to scan industry news for him and give him somewhere to save ideas.

Then he showed me how he actually spent his time. He checked a social network about ten times a day, saving links into three queues he had to come back to. He also told me he learns by listening, not reading, and pastes articles into a text-to-speech tool. So the product became a feed of people he chose, an audio digest he could pause to dig into, and a place to save ideas. He said he had not hired me with a finished requirements document and was shaping it as he saw what helped. I wrote the requirements from the call so he could comment on them, and we kept the earlier infrastructure for a narrower job.

One constraint arrived with it. The network had warned him about automated activity before, so the product never touches his login and never posts for him. It surfaced only because I asked whether replies would go from the app.

## 1. A success message is a claim, so it needs proof

After the false notification, I did not want to fix one message. I asked what else in the system could say something untrue. An audit across the three products I maintain for the team found 27 places that could claim success without proof, plus three that blamed the wrong failure. All of them were fixed.

The repair changed how messages get written. Every step now reports whether it worked, why not, and whether retrying is safe. One place builds every notification and every confirmation screen from those reports. A step with no report reads as unverified, never as success. A test pins the rule: across every destination and outcome, "in the feed and in the roundup" appears only when both happened. We also restored eight adds that had lost their selection, with their original timestamps so none re-entered a roundup that had already gone out.

Two months later the same lesson came back from the other side. He tapped a star, saw a "Starred" confirmation, and watched the star disappear a second later. The screen had celebrated before the save landed, and the database had rejected the save. I traced the rejection to a change on the database service's side rather than ours, though I never pinned down which one. We fixed the write, and I confirmed the repair in production logs, not only in tests.

## 2. A person's choices are instructions, not suggestions

He chose three posts for a roundup. The app produced six and left out his own note.

I had designed the roundup to fill itself to six items so a quiet week would not look thin. That rule was wrong the moment he made a selection, because three deliberate picks became three picks plus three strangers. A second problem sat underneath it. Topics were assigned by a scheduled job, so a post he had starred seconds earlier had no topic yet and was filtered out before the writer ever saw it. We changed the roundup to use exactly what he picked, even if that was one post, and to assign topics at write time.

Then he told us his own number: three posts plus his own note, every week. We made that the rule, and his note became the first item, kept when he regenerates. When he asked us to stop generating roundups automatically, I switched it off and then swept the screens, because several still promised the roundup "writes itself every Monday." Refreshing follows the same rule: new material never moves what he is reading until he pulls to refresh.

The test I use now: does this default overrule something the person already decided?

## 3. Finish the task where the person will look for it

My first version of adding a link ran the fetch inside the request. If he closed the app mid-request, the add was lost and a paid scrape run was wasted. A background worker fixed that and created a new obligation: he had to be able to leave, come back and find the result.

The fast path for a post already in the system showed him nothing, and "view it in the feed" landed at the top of a list where a week-old post sits far below. I told the agent plainly that he cannot be sure it was added if he cannot see it. The success screen now shows the actual post, and new adds pin above the feed until he reads, rates or dismisses them. That state lives on the server, so it survives a reload or a reinstall.

Uncertainty needed the same care. He pasted his own scheduled post and the app refused, with nine look-alikes. Scheduled posts get their ID when created, not when published, so the decoded date was a day and a half early, and nine of his posts opened with the same hashtags. The app now reads the post's own public page first, and if it still cannot be certain, it shows him the candidates and he picks. An early trial had shown two unrelated posts collapsing to the same short slug, which would have starred a stranger's post. An ambiguous match should end in a person's choice, never a guess.

## 4. When the writing disappoints, check what the model received

A regenerated roundup lost an older note and its chat links. The notes were still stored. A code change had rewritten the function that calls the model and dropped the line that sends its system instructions, and for about two weeks the writer got only the bare request. I had the agent rebuild the exact prompt from the failing roundup's inputs and call the model twice. Without the instructions, both failures reproduced. With them, the note returned with its link, plus 38 inline links and a chat line for every item.

Another time he added a post that was only a headline and a shortened link. The add succeeded, and the writer had nothing but the headline. The shortened link does not redirect. It opens a notice page of 338 characters, with the real address buried inside. We extract that address and read the article, 9,862 characters in this case, at the moment of adding.

Instead of another request to sound more human, we compared our drafts with what he published. Across three weeks, 26 comparisons showed 12 patterns. Four appeared every week: he cut hedges and asides, kept theme lines concrete, credited analysis to its author, and let the closing line stand alone. I applied those four immediately. The patterns that were judgment calls waited for his review, because he had asked to look at them first.

## 5. Healthy-looking is not the same as working

When a hosting limit forced a move to a new host, I copied 56 settings across. Thirty-one arrived as encrypted text instead of values. The pages loaded and the health check passed. The login screen quietly fell back to a password form, and I noticed because I tried to sign in with Google and the option was gone.

A different report came as a one-line message: "I can't scroll down." On a short browser window, the audio and video player pages pinned their height to the window, so the play, speed and download controls sat below the fold with no scrollbar. Taller screens hid the problem, which is why it survived so long. Fixing the template would have changed nothing already published, because those pages are rendered once and stored. Sixty-one of them carried the flaw, 38 audio and 23 video. A script changed that one rule in each stored page and left alone any page where it did not find it, so I never guessed at a page I could not read.

Someone returning to a digest from weeks ago depends on work the system did then, so testing has to cover those pages, and it has to start from the user's first action: signing in or pressing play.

## What I asked of the agents

The agents wrote most of the code. My contribution was deciding what was worth building and refusing claims without evidence. When I asked for a design audit, the first pass mapped features from memory, and I sent it back to audit the real screens. During the star fix, separate sessions did the work while the lead session checked every claim against the production database and logs. A bug hunt was a required gate, and the one plausible edge case it left was written down instead of called clean.

That is the standard I want for the next thing I build. A person should be able to leave after finishing a task, confident that the product’s confirmation describes what actually happened.
