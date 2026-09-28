# Aloud (personal audio-reader PWA), personal product: case study log

A running log of Aloud, Peace's own audio-reader: paste a link, a PDF, an EPUB or text and hear it narrated, with a synced reading view, highlights and a weekly recap. Updated as deliverables land. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Peace Akinwale (own product; invite-only for family).
- **Stack:** Next.js 16 App Router PWA (`Peace-Akinwale/aloud`, `aloud.peaceakinwale.com`) on Railway as one long-lived Node process, Supabase (schema `aloud`, private storage bucket), OpenAI TTS. Built June 2026; moved from Vercel to Railway August 2026.
- **Method:** a root `decisions.md` read before every session, dated handoffs in `docs/plans/handoffs/`, a bug-hunt pass before anything is called shipped, deploy by push to `main`.

---

## 2026-09-28, one "wtf" about a button became a day of product work: verbatim narration, narration that finishes on its own, a follow-along reader, and a bug hunt that caught the regression the rewrite had introduced

One session; the fourteen commits span 16:05 to 18:44 WAT by their timestamps, with the docs and this entry after. Written the same evening from the session, `decisions.md` (eight dated entries) and the handoff (`HANDOFF_verbatim-read-mode_2026-09-28.md`, 529 lines). Fourteen commits, 41 files changed (+2,101 / -374), all live; the live service worker reports the final commit `2ff0f23`.

### What shipped

- Every tap that opens another screen now responds at once: navigation buttons became prefetching links with a shared pending-state dimmer. The opening complaint was the library's Add button needing about five taps; the cause was a plain button calling the router with no prefetch and no feedback, waiting on an auth round trip plus a server render each time.
- Author integrity: links, PDFs, EPUBs and Word documents are narrated exactly as written. The AI "cleanup" that had been rewriting every paragraph now runs only on text Peace pastes herself. One function (`allowsRewrite`) is the gate.
- PDF text is read per page with positions instead of as one merged line. Repeating page headers and footers and page numbers are removed; headings are kept by font size; paragraphs are rebuilt from the layout. Measured on a generated 10-page book: the header went from being read 8 times to 0, and all 42 paragraphs came out exact, every word in order.
- Narration runs on the server for the whole item as soon as it is added, whether or not the app is open. Before this, only the first 2,800-word part of a long article was ever narrated; a 33-minute investigative piece "finished" at 18 minutes. After the change the same piece narrated to 32.2 minutes, and its 85-minute sibling completed with the app closed.
- Read mode: the spoken word is highlighted as it is read (timing estimated from each paragraph's measured audio length, no per-word timestamps exist), forward and back 15 seconds, and a Spotify-style panel that slides up from the bottom bar with the full controls and a speed picker.
- A reading view that keeps the original page: headings, lists, quotes, code, tables, and images with captions, for links and EPUBs, with the spoken word highlighted inside that layout. Images are copied into the private bucket (never hotlinked) and served through signed URLs. Verified on a real 5,191-word article: 34 images, 31 captions, every text/offset invariant holding across its three parts.
- A delete control beside every library card with a two-tap confirm.
- A bug-hunt round over the day's own work: three finders in parallel, every candidate re-verified against the code, the live database or a browser measurement before it counted. 23 findings fixed, 3 accepted and written down, shipped as one commit and deployed on the first try.
- The bug-hunt skill library gained three mechanisms (a stale per-render object captured by a long-lived loop; a filled entrance animation that traps fixed elements and beats inline transforms; a similarity key that normalises away the one thing that distinguishes two values). 147 patterns as of this entry, pushed to its repo.

### Decisions worth recording

- **Other people's writing is never rewritten by the model.** Peace's words: rewriting a link or a book "is scraping away the integrity of the author's text." This reversed a June decision that smoothness would come mainly from the cleanup pass. Only her own pasted text (and the AI-written weekly digest) may be adapted for speech.
- **Keep headings, remove the page header that repeats on every page.** A first reading of "don't strip page headers, they are important" kept everything; she corrected it the same hour ("PDF should not repeat page headers"). The fix is positional: a line is a running header only if the same text sits at the same top or bottom slot on at least three pages and 40 percent of pages, and lines set larger than the body are headings and never removed.
- **Narrate the whole item immediately, and accept the cost.** Every added item now spends its full length from the monthly cap right away. Rejected: leaving the open player screen as the driver, which stopped narration whenever she left the screen.
- **Estimated word timing, not paid alignment.** The narrator returns no word timestamps; spreading each paragraph's measured duration across its words by weight is free and usually within a word. Exact alignment stays available if she asks.
- **Reading blocks are stored as JSON in the storage bucket, not as HTML in the database.** The Supabase migration connection is currently unauthorised, so a design that needs no schema change shipped today; it also means no raw HTML is ever stored or rendered.
- **A control she asks for is always visible, never behind a mode.** The first delete cut hid the bin behind an Edit/Done toggle to protect a card grid from stray taps. Rejected outright ("I don't have to click Edit ... I see the Delete button beside the text"). The accepted version sits beside each card's text with a two-tap confirm.
- **The cap trade-off was explained, then fixed on her say-so.** Two items narrating in parallel could overshoot her monthly cap by about five minutes in the worst case. It was reported as accepted, she asked for the explanation, then said "fix it": the remaining minutes are now re-read before every paragraph.

### Frictions and course corrections

- **The first fix was built on stale code.** The laptop copy was 11 commits behind GitHub; a redesign had rewritten the very file being edited. The fix was pushed, never deployed, and had to be redone on the current code. The push itself failed first because the machine's default GitHub account is a client's, not Peace's.
- **The rewrite that fixed one bug introduced a worse one.** Moving narration to the server made the player's refresh loop capture a stale copy of the player object, so it never pulled in new paragraphs after playback began. Left alone, that would have re-created the exact "marked finished early" symptom the change was meant to fix. The adversarial reviewer found it by comparing the new loop with the one it replaced.
- **Two deploys misfired for platform reasons:** one Railway build failed with no readable logs (the Railway login on the laptop has expired), and one push produced no deployment at all. An empty commit and a docs commit re-triggered them; every deploy is now verified by the GitHub status and the live build id.
- **Two CSS claims were measured before being believed:** toasts were positioned 1,478 pixels down a long page instead of 631 because the page's entrance animation kept a transform, and the new sheet's drag-to-close moved 0 pixels because its own animation owned the transform. Both measured in a fixture before and after the fix.
- **Test fixtures lied twice:** a synthetic PDF with identical body lines on every page made real prose look like a running header, and a browser test mock crashed on a URL object and reported a phantom navigation. Both were harness faults, found before they became "bugs".
- **The dev server was serving June's stylesheet from a stale build cache,** which made the new panel look transparent until the cache was deleted.
- **One design change during the build:** the reading view first mapped a narrated chunk to the block it started in; a chunk that spans a list of short lines showed the highlight stuck on the first line. Rebuilt around a chapter-wide word index so the active block is whichever holds the spoken word.

### Why this matters for the portfolio

- **The owner's constraint shaped the architecture.** "Read it as the author wrote it" is a content-integrity rule; it changed the narration pipeline, the PDF extractor and the reading view, and it is enforced by one function rather than a convention.
- **A bug hunt on one's own day of work, before calling it done.** 23 fixes, including a regression the day's biggest change had introduced, found and shipped in the same session. The findings that could not be fixed were written down with the reason, not hidden.
- **Measure, do not argue.** Timing numbers, header counts, pixel positions and paragraph counts were run in fixtures; no claim in this entry rests on recollection. Two of the day's "bugs" turned out to be faults in the test harness and were dropped.
- **Corrections taken at face value.** Three course corrections from the owner (headers versus headings, no Edit mode, fix the cap) were acted on the same hour without defending the first cut.

---
