# Echo Dictation (local verbatim dictation app), personal product: case study log

A running log of Echo Dictation, Peace's own macOS dictation app: hold a key, speak, and the exact words are typed into whatever app is in front, transcribed on the Mac with no cloud service. Updated as deliverables land. Source material for the eventual portfolio case study.

---

## Engagement context

- **Client:** Peace Akinwale (own product, used daily on two Macs).
- **Stack:** Swift 6 SwiftPM menu-bar app (`Peace-Akinwale/echo-dictation`, private), on-device speech recognition (Parakeet through FluidAudio, Core ML), a small CTC model for checking names against the audio, SQLite History, signed in-app updates from GitHub Releases.
- **Product rules:** verbatim words (any stage that changes a word is guarded, logged and reversible in History), local only, no screen context, paste into the app in front with a clipboard fallback.
- **Method:** a decision log and a bugs-found record in the repo, a private 58-file test corpus and four real recordings replayed against the previous build before any change ships, and a written report for the reviewer.

---

## 2026-11-17 to 2026-11-18, from a reviewed handoff to two signed releases: five features, a noise-reduction bug found through a live test, and a hardening pass where the replay gate caught three of Claude's own fixes

Written on 2026-11-18 at the end of the session, from the repo's git log, `docs/CLAUDE_HANDOFF_REPORT.md`, `docs/BUGS_FOUND.md` (entries 40 to 44) and `docs/specs/DECISIONS.md`. 50 commits over the two days (29 on 17 November, 21 on 18 November), 63 files changed (+4,378 / -205) since v0.7.2.

### What shipped

- **v0.7.3** (published 18 November): spoken lists laid out as bullets with no word changed (a word-for-word guard checks every output), learning a name's spelling from an edit made after a paste, recovery of speech the recognizer silently skipped in long chunks, and an opt-in setting that removes repeated starts.
- **v0.7.4** (published 18 November, 13 commits after 0.7.3; 31 code, test and script files changed, +1,022 / -107):
  - Names the recognizer wrote as one invented word are now matched to the saved vocabulary against the audio. Names correctly written on the second test set went from 69 to 75 of 93; no other word changed.
  - Recording no longer ends because of a recognition error, a microphone change or a stalled device; the saved audio is transcribed afterwards instead. A shortcut press made while the previous dictation is still pasting starts the next one instead of being ignored.
  - Nine cases where a text stage could change or delete words the speaker meant (for example "the report is linked in the doc" becoming a product name) were reproduced as failing tests and fixed.
  - The updater keeps the previous version until the new one has started, and puts it back otherwise.
- Checks on the final build: 179 core and 8 app tests, 16 installer and update-helper tests, 5 evaluator tests. On the corpus, every gate matched or beat 0.7.3; three of the four real recordings came out word for word identical and the fourth recovered a dropped phrase. Stop-to-text stayed at 0.17 to 0.19 seconds on a 60-second file.
- Both releases verified on the copy downloaded back from GitHub: checksum, Ed25519 signature, code signature and certificate, and the update offer from every earlier version.

### Decisions worth recording

- **Ownership moved from reviewer to builder, with three limits kept.** Peace told Claude Code it owns the code and should fix and push without waiting for the separate reviewer. Publishing a release, the `main` branch and anything on the second Mac still need Peace's word each time, and both releases were published only after he said so.
- **A second voice in the room is not filtered, and the docs say so.** A live test with a film playing showed the film's dialogue transcribed alongside Peace's voice. Both Echo and a second model (Whisper, run offline) transcribed it, so it is a microphone problem, not a recognition one. Rejected: gating speech by loudness, which would also drop Peace's own quiet speech and breaks the verbatim rule.
- **Name repair only replaces a token that is not a word, and only with the audio's support.** The new matcher can never turn a real spoken word into a name. Thresholds were set from measured scores on the corpus and 62 of Peace's own dictations, with the rejected candidates recorded beside them.
- **When in doubt, the words stay.** Spoken corrections ("Monday, no, Tuesday") and "delete that" were narrowed so ordinary sentences that happen to contain those words are never edited.

### Frictions and course corrections

- **"Reduce background noise" recorded nothing.** The first live test with the setting on saved 1.1 seconds of silence from 13 seconds of speech. The fallback restarted the audio engine and then ignored the very notification that meant the engine had stopped. After the fix, Peace's whispered test passed and its diagnostics showed the real cause underneath: the noise filter delivered audio on 7 channels and Echo's own conversion to one channel turned it into zeros. That was reproduced without a microphone and fixed; Peace then chose to leave the setting off.
- **The replay gate caught three of Claude's own fixes.** Three changes suggested by a code review passed their new unit tests but were wrong on real recordings: requiring capitals stopped "open AI" becoming OpenAI, keeping a possessive produced "ChatGPT's agents" from a mishearing, and a stricter list rule removed a real bullet. All three were corrected before install. The lesson went into the build rules and into Peace's bug-hunt skill: a fix suggested from an invented sentence is re-checked on real data before it ships.
- **Not verified live:** recovery from a lost or changed microphone, the queued shortcut press and the updater's rollback are checked by reading and by tests only; they need hardware Claude does not drive. The report labels them that way.

### Why this matters for the portfolio

- A dictation tool is only useful if it can be trusted with everything said into it. The work here was mostly about the cases where it silently loses or changes words, found from real recordings and real use rather than assumed.
- Every claim was measured against the previous build on the same data, including the claims that turned out wrong. The entry records those, because the gate that caught them is the point.

---
