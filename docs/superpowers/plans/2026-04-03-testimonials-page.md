# Testimonials Page - Implementation Plan

**Date:** 2026-04-03
**Spec:** `docs/superpowers/specs/2026-04-03-testimonials-page-design.md`
**Goal:** Ship a standalone `/testimonials` page with 5 full LinkedIn recommendations, 2 screenshot testimonials, a closing CTA, and small discovery links from existing site surfaces without changing the existing testimonial content on Home or Services.

---

## File Map

### New files

```
app/testimonials/page.tsx
docs/superpowers/plans/2026-04-03-testimonials-page.md
public/images/testimonials/adam-heitzman-highervisibility.png
public/images/testimonials/melissa-malec-jabra.png
```

### Files to modify

```
app/page.tsx
app/services/page.tsx
components/Footer.tsx
components/Header.tsx
```

---

## Task 1: Build the Standalone Page

- [ ] Create `app/testimonials/page.tsx`
- [ ] Add page metadata:
  - Title: `Client Testimonials | Peace Akinwale`
  - Description: `Read what clients say about working with Peace Akinwale - B2B SaaS content writer for product-led software companies.`
  - Canonical: `https://peaceakinwale.com/testimonials`
- [ ] Add hero section with:
  - Eyebrow: `Client testimonials`
  - H1: `What my clients say`
  - Intro copy describing LinkedIn recommendations and direct feedback
- [ ] Add LinkedIn recommendations section:
  - Render 5 full-width stacked cards
  - Use the full quotes exactly as approved
  - Preserve the highlighted phrases with `<strong className="text-foreground font-semibold">`
  - Show photo, name, role, company, and date
  - Add `View on LinkedIn` badge linking to `https://www.linkedin.com/in/peaceakinwale/`
- [ ] Add direct feedback section:
  - Render 2 screenshot cards in a 2-column desktop grid
  - Use Adam Heitzman / HigherVisibility attribution
  - Use Melissa Malec / Jabra (via Spicy Margarita) attribution
- [ ] Add CTA section matching the site's existing CTA patterns

## Task 2: Add Discovery Links Only

- [ ] Update `app/page.tsx`
  - Add `See all testimonials ->` below the existing testimonials grid
  - Match the small uppercase underlined link style already used on the page
- [ ] Update `app/services/page.tsx`
  - Add the same `See all testimonials ->` link below the existing testimonials section
- [ ] Update `components/Footer.tsx`
  - Add `Testimonials` under the Work column
- [ ] Update `components/Header.tsx`
  - Add `Testimonials` to the mobile menu only
  - Keep desktop header nav unchanged

## Task 3: Add Screenshot Assets

- [ ] Create `public/images/testimonials/`
- [ ] Copy:
  - `C:\Users\HP\Desktop\Picture museum\Adam's first comment on our work.png`
  - `C:\Users\HP\Desktop\Picture museum\Full Feedback from Melissa Malec on hybrid work schedule piece.png`
- [ ] Rename them to:
  - `adam-heitzman-highervisibility.png`
  - `melissa-malec-jabra.png`

## Task 4: Verify

- [ ] Run a production build
- [ ] Confirm:
  - `/testimonials` renders without layout breakage
  - Home and Services only gain the new discovery link
  - Testimonials appears in footer and mobile nav, but not desktop header nav
  - Screenshot cards load from `public/images/testimonials/`
