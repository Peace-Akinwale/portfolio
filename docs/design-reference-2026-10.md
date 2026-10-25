# Design reference, October 2026 rebuild

Extracted from the two prototypes Peace chose on 23 Oct 2026 (`prototypes/2026-10-21-three-directions/seam.html` for the homepage, `dated.html` for /portfolio) and her brief of 25 Oct 2026 (fonts). Supersedes `docs/design-reference.md` (the adire palette) for the whole site once the rebuild ships.

## Colours (from seam.html, two grounds)

| Token | Paper (writing, default ground) | Night (building, dark ground) |
|---|---|---|
| ground | `#EFEAE0` | `#151A3A` |
| ground-2 (panels, code) | `#E6E0D3` | `#1C2248` |
| ink (text) | `#17150F` | `#ECEBF4` |
| ink-soft (meta, captions) | `#5E584B` | `#AEB0C8` |
| rule (hairlines) | `#CFC7B6` | `#2E355E` |
| accent (links on hover, active marks, buttons) | `#B5411D` | `#F0683A` |

Dark mode = the night column as the page ground; the split sections keep both grounds in both modes (paper half, night half). Contrast: ink on ground 14.9:1 (paper), 13.6:1 (night); accent on paper 5.3:1; night-accent on night 6.1:1.

## Type

| Role | Family | Source | Settings |
|---|---|---|---|
| Display (h1, h2, big dates, question headings) | Sprat (variable: wdth 100–200, wght 10–200) | `app/fonts/sprat/Sprat-Variable.woff2`, OFL 1.1, `LICENSE.txt` beside it | `font-weight` 90–130; `font-variation-settings "wdth" 100` default, 125 for short display lines; line-height 1.0–1.05; `letter-spacing -0.01em` |
| Long-form body (articles, case-study prose, pull quotes) | Newsreader (variable: wght 200–800, opsz 6–72) | `app/fonts/newsreader/Newsreader-Variable*.woff2`, OFL 1.1, `LICENSE.txt` beside it | 18px/1.6 body, `font-optical-sizing: auto`; italics from the italic file |
| Interface (nav, labels, buttons, cards, captions, meta) | DM Sans | `next/font/google` (self-hosted at build by Next) | 14–17px, weights 400/500/600 |

Sprat is never used below 22px and never for running text. Newsreader never for nav or buttons.

## Spacing and shape

- Base 4px. Scale used: 4, 8, 12, 16, 20, 24, 32, 40, 52, 64, 80.
- Gutter `clamp(18px, 4vw, 56px)`. Prose measure `62ch` (articles `66ch`).
- Radii: 0 on sections and buttons (square, editorial); 2px on images; 999px on filter pills only.
- Rules are 1px `rule`; blockquotes carry a 3px accent left border.

## Motion

Section halves widen on hover/focus (`grid-template-columns` transition .35s); the question nav tracks the section in view; the month rail tracks the month in view. All of it off under `prefers-reduced-motion`, and the split never applies under 760px.
