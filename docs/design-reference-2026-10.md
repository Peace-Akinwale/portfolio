# Design reference, October 2026 rebuild

Extracted from the two prototypes Peace chose on 23 Oct 2026 (`prototypes/2026-10-21-three-directions/seam.html` for the homepage, `dated.html` for /portfolio) and her brief of 25 Oct 2026 (fonts). Supersedes `docs/design-reference.md` (the adire palette) for the whole site once the rebuild ships.

## Colours (one family, 28 Oct 2026)

Replaced the paper/night and stone/green palettes on 28 Oct 2026 (decisions.md). One hue family, sky to ink blue, does every ground on the site, light and dark, and marigold is the only accent. The method came from re-reading thejasminejade.com: her colour works because every ground is one family at several values plus one warm accent, not because of the hue. The study with the three candidates is `prototypes/2026-10-21-three-directions/palette.html`; Peace chose C.

| Token | Sky (light mode, every page) | Ink (dark mode, and the homepage's night half) |
|---|---|---|
| ground | `#D9E4EC` | `#0F2334` (the homepage's night half is `#1E3F5A` in both modes) |
| ground-2 (panels, pills, muted) | `#C9D8E3` | `#16304A` |
| ground-3 (tag washes, strips) | `#B9CFDE` | `#1E3F5A` |
| card | `#F3F7FA` | `#0A1826` (night half: `#16304A`) |
| ink (text) | `#0D1E2C` | `#E6EEF4` |
| ink-soft (meta, captions) | `#3F5B70` | `#A4B9C9` |
| rule (hairlines) | `#B6C8D5` / strong `#93ACBE` | `#243E55` / strong `#335170` |
| accent (links, buttons) | `#1E3F5A` | `#B9CFDE` (night half: marigold) |
| marigold (highlights, tags on the night half, the one warm accent) | `#F2B33A` on `#1C1500` text | same |
| marigold wash (the `.hl` marker) | `#F7DFA3` | `#4A3A12` |

Contrast: ink on sky 13.9:1; ink-text on ink 13.6:1; accent on sky 7.6:1; marigold-ink on marigold 11.5:1. The tokens live in `app/globals.css` (`--sky-*`, `--ink-*`, `--marigold`) and `app/informal.css` (`--sun`, `--card`). The old names (`--stone`, `--paper`, `--night`) are aliases of the new ones.

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
