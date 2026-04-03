# Testimonials Page — Design Spec

**Date:** 2026-04-03
**Status:** Approved

---

## Overview

Add a dedicated `/testimonials` page to peaceakinwale.com. The page is a standalone social proof hub — it grows independently of all other pages. Existing pages (Home, Services, About) remain completely unchanged in their content and testimonial sections. The only modifications to existing files are:

1. Adding a "See all testimonials →" link on the Home and Services pages (after their existing testimonials sections)
2. Adding a "Testimonials" link in the Footer and mobile hamburger nav

---

## New Page: `/testimonials`

**File to create:** `app/testimonials/page.tsx`

### Page Metadata
- **Title:** `Client Testimonials | Peace Akinwale`
- **Description:** `Read what clients say about working with Peace Akinwale — B2B SaaS content writer for product-led software companies.`
- **Canonical:** `https://peaceakinwale.com/testimonials`

### Page Structure (top to bottom)

#### 1. Hero Section
- Background: `bg-background`, `border-b border-border`
- Label: `"Client testimonials"` — accent color, small uppercase tracking style (matches site pattern)
- H1: `"What my clients say"`
- Subtitle: `"Every testimonial here is from a client I've worked with directly — sourced from LinkedIn recommendations and direct feedback."`

#### 2. LinkedIn Recommendations Section
- Background: `var(--muted)`
- Section label: `"LinkedIn recommendations"` — muted uppercase label
- Layout: single-column, full-width stacked cards
- **5 cards** — each card contains:
  - Full quote in serif font (`var(--font-serif)`), italic, `text-muted-foreground`
  - Key phrase bolded in `text-foreground` (matching existing site pattern)
  - Divider line
  - Client photo (from `/images/clients/`) with initials fallback
  - Client name (bold), role · company · date
  - "View on LinkedIn" badge (LinkedIn blue, LinkedIn logo icon) — links to `https://linkedin.com/in/peaceakinwale` in a new tab

**The 5 testimonials:**

| Name | Role | Company | Date | Photo file |
|------|------|---------|------|-----------|
| Regine Garcia | Head of Content | ManyRequests | Feb 2026 | `regine-garcia.png` |
| Nathan Vander Heyden | Head of Marketing | Marker.io | Sep 2025 | `nathan-vander-heyden.jpg` |
| Lily Ugbaja | Fractional Content | Spicy Margarita | Oct 2025 | `lily-ugbaja.png` |
| Crista Siglin | Editor | Pangea.ai | Oct 2022 | `crista-siglin.png` |
| Olumide Akinlaja | Founder | Onigege Ara | Mar 2022 | `olumide-akinlaja.jpg` |

Full quote text for each testimonial — use exactly as written below, no truncation:

**Regine Garcia:**
"I've worked with Peace on content for ManyRequests, and he's one of the most thoughtful B2B SaaS content marketers I've collaborated with.

Peace specializes in product-led blog content, and it really shows in his work. He doesn't chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. His pieces are well-researched, structured with intent, and grounded in real use cases, which makes them genuinely useful.

What I appreciate most is his level of detail and care. He asks the right questions, challenges assumptions when needed, and consistently delivers content that aligns with the content strategy. For example, **his top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.**

If you're a software company or agency looking for a writer who understands B2B SaaS, product-led growth, and conversion-focused content, Peace is someone I'd highly recommend working with. 🔥"

**Nathan Vander Heyden:**
"I had a great experience working with Peace for a content project that spanned half a quarter.

I'm particularly impressed by his ability to follow briefs to a T, yet **adapt & reorganize information on the fly** based on what he knows about our ICP.

He also keeps to deadlines, and we never needed more than one round of feedback per article - and **none towards the end of our project!** I'll work with him again."

**Lily Ugbaja:**
"Peace was an absolute delight to work with. Always on time, super dependable, and consistently went above and beyond on every task. **He took feedback really fast and always came back stronger,** the kind of person who makes your work easier just by being on the team."

**Crista Siglin:**
"Peace does great work from the beginning of every assignment. He follows guidelines, is available and receptive to feedback, and implements edits swiftly and efficiently. He consistently works in this manner. **Every article of his that I have been assigned to edit of his has been well-written and well-researched.**"

**Olumide Akinlaja:**
"Akinwale is an excellent writer with a keen eye for details. He worked with me at Onigege Ara for about 2 years, where he executed many content writing and copywriting projects with great success.

He is an expert at article and blog writing, web content writing, product description writing, and creating compelling sales copies.

**He is loyal, dedicated, and boasts of an impressive work ethic. He is a great addition to any writing team.**"

> Bold phrases (marked with **) are rendered as `<strong className="text-foreground font-semibold">` — matching the existing pattern in `app/page.tsx` and `app/services/page.tsx`.

#### 3. Direct Feedback Section
- Background: `var(--muted)` (continuous with section above, separated by label only)
- Section label: `"Direct feedback"` — muted uppercase label
- Layout: 2-column grid on desktop, single column on mobile
- **2 screenshot cards** — each card contains:
  - Embedded screenshot image (top, inside card, slight background tint)
  - Client name (bold) + role · company below the image
  - No LinkedIn badge (these are email/message screenshots)

**Screenshot assets to copy** from `C:/Users/HP/Desktop/Picture museum/` to `public/images/testimonials/`:

| Source file | Destination | Attribution |
|------------|-------------|-------------|
| `Adam's first comment on our work.png` | `adam-heitzman-highervisibility.png` | Adam Heitzman · Managing Partner · HigherVisibility |
| `Feedback from Melissa Malec on hybrid work schedule piece.PNG` | `melissa-malec-jabra.png` | Melissa Malec · Content Lead · Jabra (via Spicy Margarita) |

#### 4. CTA Section
- Background: `bg-background`, `border-t border-border`
- "Currently accepting 2 new clients" pill badge (green dot, matches home page)
- H2: `"Ready to work together?"`
- Subtitle: `"Book a free 30-minute call. No commitment, no pressure — just a conversation about your content goals."`
- Two buttons (matching home page CTA style):
  - Primary: `"Book a free discovery call →"` → `https://calendly.com/akindayopeaceakinwale/30min` (new tab)
  - Secondary: `"Send a message"` → `/contact`

---

## Changes to Existing Files

### `app/page.tsx` — Home page
- **Where:** After the closing `</div>` of the testimonials grid (around line 313), still inside the testimonials `<section>`
- **What:** Add a `"See all testimonials →"` link styled to match the existing `"See full services and pricing →"` and `"Read all articles →"` links on the same page
- **Style:** `text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-4` in `var(--accent)` color
- **No other changes** to this file

### `app/services/page.tsx` — Services page
- **Where:** After the testimonials section ends
- **What:** Same "See all testimonials →" link as above
- **No other changes** to this file

### `components/Footer.tsx`
- **Where:** Under the "Work" nav column, after the "Career Pathway" link
- **What:** Add `<Link href="/testimonials">Testimonials</Link>` with the same styling as sibling links

### `components/Header.tsx`
- **Where:** `PRIMARY_LINKS` array — add after the existing links
- **What:** Add `{ href: '/testimonials', label: 'Testimonials' }` — this appears in the **mobile hamburger menu only** (the `lg:hidden` nav). Desktop header nav is left unchanged (stays clean).
- To achieve mobile-only: the `PRIMARY_LINKS` array drives both desktop `nav` (`hidden lg:flex`) and mobile nav (`lg:hidden`). To keep it out of desktop nav, we add it to the mobile section only — either by adding it to `SECONDARY_LINKS` or by rendering it separately in the mobile nav block.

> **Implementation note:** The cleanest approach is to add Testimonials to `SECONDARY_LINKS` (which currently only has Projects). This renders it in the mobile menu's secondary section (below the divider) without affecting the desktop header nav at all.

---

## Screenshot Asset Handling

- Copy both source screenshots to `public/images/testimonials/`
- Render with Next.js `<Image>` component or `<img>` tag with `loading="lazy"`
- On mobile: both screenshot cards stack to full width
- Max width of screenshot images: constrained to card width, `object-fit: contain` so full message is visible

---

## What This Spec Does NOT Change

- Home page hero testimonial quote (top of page)
- Home page testimonials grid (3 cards)
- Services page testimonials section (5 cards)
- About page content
- Any other existing page
- Header desktop nav links
- Any styling, component, or data structure on existing pages
