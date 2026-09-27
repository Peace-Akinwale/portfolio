# Design reference — peaceakinwale.com

Visual reference required by the design rules before any visual work. Tokens live in `app/globals.css`; `app/opengraph-image.tsx` mirrors them.

## Previous palette (until 2026-09-27)
Warm cream and brown with terracotta and sage. Retired because cream + terracotta is one of the most common looks on AI-generated sites.

| Token | Light | Dark |
|---|---|---|
| background | #f8f0e3 | #1d1814 |
| foreground | #130f0d | #f5ecdf |
| muted | #efe2cd | #29211b |
| muted-foreground | #5f5449 | #c7b29c |
| border | #d2bea0 | #49382d |
| accent | #64734f (sage) | #97a57d |
| accent2 | #b55e3d (terracotta) | #d38561 |

## Current palette — "adire" (from 2026-09-27)
Named after adire, the Yoruba indigo-dyed cloth: undyed cotton, indigo ink, and the lighter wash where the dye ran thin. One accent, no gradients.

| Token | Light | Dark | Use |
|---|---|---|---|
| background | #F7F7F3 cotton | #11142B night indigo | page |
| foreground | #15183A indigo ink | #ECEDF6 | headings, body emphasis |
| muted | #E8EAF3 wash | #1A1E3C | quiet surfaces |
| muted-foreground | #4B5070 | #A8ADCB | body copy, captions |
| border | #CED2E2 | #2D3259 | rules, inputs |
| accent | #2E3A87 indigo | #9FB0FF | links, primary button, focus ring |
| accent-foreground | #FFFFFF | #11142B | text on accent |
| accent2 | = accent | = accent | kept as an alias so old references don't break |

Blog posts keep a white reading page in both themes (`.reading-light`), using the light values above on #FFFFFF.

## Type (unchanged)
- Syne 700/800 — headings
- DM Sans 400/500/600/700 — interface and body
- Georgia — long-form article body and quotes

## Radius and spacing
- Radius: 6px for inputs and buttons, 12px for images and the few framed blocks. Pills only for the availability line.
- Spacing: Tailwind's 4px scale; sections use py-16 / sm:py-24.

## Rules for new work
- Sentence-case headings. No uppercase tracked labels above sections.
- No "→" appended to buttons, no middle-dot meta strings.
- One bold element per page. On the homepage it is the list of real article titles.
- Proof over claims: real titles, real screenshots, numbers that come from a source.
