# Visual reference

Extracted from `app/globals.css` and `app/layout.tsx` on 2026-09-05, then extended with the agreed target system. Every colour, font, spacing step and radius used in the redesign comes from the **Target** tables. No new values without logging them in `decisions.md`.

## Colour

### Before (extracted)

| Token | Light | Dark |
|---|---|---|
| `--background` | `#f8f0e3` | `#1d1814` |
| `--foreground` | `#130f0d` | `#f5ecdf` |
| `--muted` | `#efe2cd` | `#29211b` |
| `--muted-foreground` | `#5f5449` | `#c7b29c` |
| `--border` | `#d2bea0` | `#49382d` |
| `--accent` | `#64734f` | `#97a57d` |
| `--accent-foreground` | `#ffffff` | `#171411` |
| `--accent2` / `--orange` | `#b55e3d` | `#d38561` |
| `--navy` (alias of foreground) | `#130f0d` | `#f5ecdf` |

Stray hexes outside the token system: `#f0e1cf`, `#1e1814`, `#d2bea6`, `#7d6a57`, `#c8b293`, `#e9d7c3`, `#4d4138`, `#16a34a` (code blocks and copy button), `#0A66C2` (testimonials page), `#fff` on every CTA, `bg-green-500` availability dot.

### Target

Six roles plus one secondary accent. Olive owns links, rules, and the primary action. Terracotta is reserved for the redline marks and one emphasis per page.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--background` | `#f5f4ef` | `#141413` | page ground (cool paper / near-black) |
| `--surface` | `#fbfaf7` | `#1b1b19` | article ground, raised panels |
| `--foreground` | `#171614` | `#ebe8e0` | ink |
| `--muted` | `#eae8e1` | `#232320` | quiet fills |
| `--muted-foreground` | `#5d5b54` | `#a6a399` | secondary ink, tinted from foreground |
| `--border` | `#cac7bc` | `#34332e` | hairlines |
| `--accent` | `#64734f` | `#97a57d` | olive: links, rules, primary action |
| `--accent-foreground` | `#ffffff` | `#141413` | ink on accent |
| `--accent-2` | `#a1502d` | `#d38561` | brick: redline marks, one emphasis per page. Darkened from `#b55e3d` (4.12:1) to clear 4.5:1 on paper as text |
| `--ok` | `#3f7a4a` | `#7fb58a` | availability dot only |

Contrast targets, measured on the render: body ink on ground ≥ 4.5:1, muted ink on ground ≥ 4.5:1, olive text on ground ≥ 4.5:1 at 14px bold or larger, borders ≥ 1.5:1.

## Typography

| Role | Family | Weights | Notes |
|---|---|---|---|
| Display / headings | Syne (`--font-heading`) | 400, 600, 700, 800 | 700 for chapter titles, 800 only at display size |
| Text | DM Sans (`--font-body`) | 400, 500, 600, 700 | body 400, labels 600 |
| Article prose | DM Sans | 400 | Georgia stack retired |

Scale (fluid):

| Step | Size | Tracking | Line height |
|---|---|---|---|
| display | `clamp(2.75rem, 7vw, 5.5rem)` | `-0.03em` | 0.98 |
| h1 | `clamp(2.25rem, 5vw, 3.5rem)` | `-0.025em` | 1.05 |
| h2 | `clamp(1.75rem, 3.5vw, 2.5rem)` | `-0.02em` | 1.1 |
| h3 | `clamp(1.25rem, 2.2vw, 1.5rem)` | `-0.01em` | 1.2 |
| lede | `1.25rem` | 0 | 1.5 |
| body | `1rem` (16px) | 0 | 1.7 |
| prose | `1.125rem` | 0 | 1.8, measure 65ch |
| small | `0.875rem` | 0 | 1.6 |
| label | `0.6875rem` (11px) | `0.14em`, uppercase | 1 |

`text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

## Spacing

4px base. Steps used: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section block padding is fluid: `clamp(4rem, 10vw, 8rem)`. Content gutter: `clamp(1.25rem, 4vw, 2.5rem)`. Container max: `72rem` (`max-w-6xl`); prose max: `65ch`.

More space above a heading than below it.

## Radius

Three values only.

| Token | Value | Used for |
|---|---|---|
| `--radius-sm` | `4px` | images, code blocks, inputs |
| `--radius-md` | `10px` | panels, dropdown |
| `--radius-full` | `9999px` | pills, avatars, toggle |

Retired: `rounded-lg`, `rounded-xl`, `rounded-[1.5rem]`, `rounded-[1.6rem]`, `rounded-[1.1rem]`, `rounded-[0.95rem]`, inline `20px` / `15px`.

## Motion

- `transform`, `opacity`, `clip-path` only. Never width, height, margin, padding, top, left. Never `transition: all`.
- Ease: `cubic-bezier(0.23, 1, 0.32, 1)`. UI transitions 120 to 200ms. Entrances: opacity 0 to 1 with a 14px rise over 600ms, staggered 40 to 70ms.
- Scroll-driven: `animation-timeline: view()` with `@supports` fallback to the final state. `prefers-reduced-motion: reduce` keeps opacity, drops movement.
- Hover motion gated to `(hover: hover) and (pointer: fine)`.

## Browser surfaces

Selection colour, caret colour, focus ring (2px accent, 2px offset), scrollbar, `tabular-nums` on anything counted.
