# HOMATZ Design Tokens

**Extracted from:** Approved baseline pages (HomePage.tsx, KitchenCategoryPage.tsx, ProductPage.tsx) and theme.css
**Date:** 2026-03-31

All values below are the authoritative reference for new pages, templates, and components. Do not deviate from these without explicit approval.

---

## 1. Colours

### Page Backgrounds

| Token | Tailwind Class | Hex / Value | Usage |
|---|---|---|---|
| Page background | `bg-white` | `#ffffff` | Default page background, card surfaces |
| Light section background | `bg-gray-50` | `#f9fafb` | Alternating sections (benefits, featured families, best sellers) |
| Dark section background | `bg-gray-900` | `#111827` | Trade CTA strips, B2B apply section |

### Text Colours

| Token | Tailwind Class | Hex / Value | Usage |
|---|---|---|---|
| Primary text | `text-gray-900` | `#111827` | Headings, labels, body emphasis |
| Secondary text | `text-gray-600` | `#4b5563` | Body paragraphs, descriptions |
| Muted text | `text-gray-500` | `#6b7280` | Eyebrow labels, nav items (inactive), supporting copy |
| Muted light | `text-gray-400` | `#9ca3af` | Placeholder text, icon colour |
| Inverted text | `text-white` | `#ffffff` | Text on dark backgrounds |
| Dark bg secondary text | `text-gray-300` | `#d1d5db` | Supporting text on gray-900 backgrounds |
| Dark bg muted text | `text-gray-400` | `#9ca3af` | Eyebrow on dark backgrounds |

### Accent Colours (Yellow)

| Token | Tailwind Class | Hex / Value | Usage |
|---|---|---|---|
| Primary accent | `bg-yellow-500` | `#eab308` | Primary CTA buttons, badge pills, pricing notice strip |
| Accent hover | `bg-yellow-400` | `#facc15` | Hover state on yellow CTA buttons |
| Accent background | `bg-yellow-50` | `#fefce8` | Soft highlight for B2B pricing notice box |
| Accent border | `border-yellow-200` | `#fef08a` | Border of pricing notice box |

### Borders

| Token | Tailwind Class | Hex / Value | Usage |
|---|---|---|---|
| Light border | `border-gray-100` | `#f3f4f6` | Card borders, section dividers, header border-b |
| Standard border | `border-gray-200` | `#e5e7eb` | Input borders, MOQ notice box border, selector borders |
| Muted border | `border-gray-300` | `#d1d5db` | Secondary badge borders |
| Dark border (on dark) | `border-white` | `#ffffff` | CTA outline buttons on dark backgrounds |

### CSS Custom Property Tokens (from theme.css)

| Variable | Value | Role |
|---|---|---|
| `--background` | `#ffffff` | Base page background |
| `--foreground` | `oklch(0.145 0 0)` ≈ `#1a1a2e` | Base foreground text |
| `--primary` | `#030213` | Primary colour (near-black) |
| `--muted` | `#ececf0` | Muted surface |
| `--muted-foreground` | `#717182` | Muted text |
| `--destructive` | `#d4183d` | Error / destructive actions |
| `--border` | `rgba(0,0,0,0.1)` | Component borders |
| `--radius` | `0.625rem` (10px) | Base border radius |

---

## 2. Typography

### Font Family

No custom font is declared. The codebase uses the system / browser default sans-serif stack via Tailwind's base. Tailwind v4 default font stack applies: `ui-sans-serif, system-ui, sans-serif`.

> **Note:** No Google Fonts or custom font import exists in `fonts.css` (it only imports slick-carousel CSS). Any future font choice should be declared in `fonts.css`.

### Font Sizes (Tailwind scale used in approved pages)

| Element | Tailwind Class | Approx px | Weight | Tracking |
|---|---|---|---|---|
| Page h1 (hero titles) | `text-5xl` | 48px | Default (300–400) | `tracking-tight` |
| Section h2 | `text-4xl` | 36px | Default | `tracking-tight` |
| Sub-section h2 | `text-3xl` | 30px | Default | `tracking-tight` |
| Card title / h3 | `text-lg` | 18px | Default | `tracking-tight` |
| Eyebrow label | `text-xs` | 12px | Default | `tracking-widest` |
| Body paragraph | `text-lg` | 18px | Default | Normal |
| Body secondary | `text-base` | 16px | Default | Normal |
| Small / meta text | `text-sm` | 14px | Default | Normal or `tracking-wide` |
| Button / badge text | `text-xs` to `text-sm` | 12–14px | Default | `tracking-wide` or `tracking-widest` |

### Line Heights

| Usage | Class | Value |
|---|---|---|
| Body paragraphs | `leading-relaxed` | 1.625 |
| Base (theme.css) | — | `1.5` (all headings, labels, buttons) |

### Font Weights

| Usage | Class / Value |
|---|---|
| Most headings & UI | `font-light` (300) — used on logo; headings use default weight |
| Logo wordmark | `font-light` |
| Medium weight | `font-weight-medium: 500` (CSS var, theme.css) |
| Normal weight | `font-weight-normal: 400` (CSS var, theme.css) |

---

## 3. Spacing

### Container

| Token | Value | Usage |
|---|---|---|
| Max container width | `max-w-[1400px]` | All page sections |
| Horizontal padding | `px-8` (32px) | All section containers |
| Narrow container | `max-w-4xl` | Enquiry form, about section, support blocks, CTA sections |

### Section Padding

| Context | Tailwind Class | px value |
|---|---|---|
| Standard section | `py-24` | 96px top + bottom |
| Large CTA sections | `py-32` | 128px top + bottom |
| Compact section (intro strip) | `py-8` | 32px top + bottom |
| Trade utility strip | `py-12` | 48px top + bottom |
| Hero section | `py-20` or `py-16` | 80px or 64px |
| Breadcrumb bar | `py-6` | 24px top + bottom |

### Gaps

| Context | Tailwind Class | Value |
|---|---|---|
| Grid gap (cards) | `gap-6` | 24px |
| Grid gap (benefits, larger) | `gap-8` | 32px |
| Hero grid gap | `gap-16` | 64px |
| Content grid gap | `gap-16` | 64px |
| Button group gap | `gap-4` | 16px |
| Selector button gap | `gap-3` | 12px |
| Image collage gap | `gap-4` | 16px |

### Card Padding

| Context | Tailwind Class | Value |
|---|---|---|
| Benefit cards | `p-8` | 32px all sides |
| Support block | `p-10` | 40px all sides |
| B2B notice boxes | `p-4` | 16px all sides |

---

## 4. Card Styling

| Property | Value / Class |
|---|---|
| Background | `bg-white` |
| Border | `border border-gray-100` |
| Border radius | None — all cards and buttons are **square/sharp** (no `rounded-*`) |
| Shadow | None — no `shadow-*` used in approved pages |
| Hover (cards) | No card-level hover in base; FeaturedProductCard may have hover defined in component |

> The design language is deliberately flat and sharp-edged. No rounded corners, no drop shadows on content cards.

---

## 5. Buttons / CTAs

### Button Styles

| Style | Classes | Usage |
|---|---|---|
| Primary (dark fill) | `px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm tracking-wide` | Primary actions (Request Catalogue, Contact Us, Apply) |
| Primary (yellow fill) | `px-8 py-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors text-sm tracking-wide` | B2B apply, login to view pricing, key trade CTA |
| Secondary (white fill) | `px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm tracking-wide` | Secondary CTA on dark backgrounds |
| Outline (dark border) | `px-8 py-4 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors text-sm tracking-wide` | Secondary/ghost CTA on light backgrounds |
| Outline (white border) | `px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide` | Ghost CTA on dark backgrounds |
| Outline (light) | `px-8 py-4 border-2 border-gray-200 text-gray-900 hover:border-gray-400 transition-colors text-sm tracking-wide` | Low-emphasis action (download spec sheet) |
| Small (inline strip) | `px-6 py-3 border-2 border-gray-900 text-xs tracking-wide` | Trade utility strip buttons |

### Button Properties (all)

- Border radius: **none** (sharp corners — no `rounded-*`)
- Text transform: all caps (`tracking-wide` + uppercase text content by convention)
- Font size: `text-sm` (14px) or `text-xs` (12px) for utility buttons
- Transition: `transition-colors`
- Icon + label pattern: `flex items-center gap-2` with `w-4 h-4` Lucide icon

### Selector Buttons (product variant selectors)

```
px-6 py-3 border-2 text-sm tracking-wide transition-colors
Active: border-gray-900 bg-gray-900 text-white
Inactive: border-gray-200 hover:border-gray-400
```

---

## 6. Grid / Layout

### Grid Patterns (approved pages)

| Context | Columns (desktop) | Columns (mobile) | Gap |
|---|---|---|---|
| Category cards (homepage) | `lg:grid-cols-5` | `grid-cols-2 md:grid-cols-3` | `gap-6` |
| B2B process steps | `md:grid-cols-5` | 1 column | `gap-8` |
| Benefits grid (homepage) | `lg:grid-cols-3` | `md:grid-cols-2` | `gap-8` |
| Subcategory grid | `lg:grid-cols-4` | `grid-cols-2 md:grid-cols-3` | `gap-6` |
| Featured product families carousel | `slidesToShow={3}` | — | `px-4` per slide |
| Benefits grid (category) | `lg:grid-cols-4` | `md:grid-cols-2` | `gap-8` |
| Best sellers carousel | `slidesToShow={5}` | — | `px-4` per slide |
| Hero (2-col) | `lg:grid-cols-2` | 1 column stacked | `gap-16` |
| Related categories | `md:grid-cols-3` | 1 column | `gap-6` |
| Variant cards | `md:grid-cols-3` | 1 column | `gap-8` |
| Related products carousel | `slidesToShow={5}` | — | `px-4` per slide |

### Image Treatment

| Context | Classes |
|---|---|
| Product images | `object-cover w-full h-full` inside `aspect-square overflow-hidden bg-gray-50` |
| Image collage | Two columns, first col normal, second col with `pt-8` offset |

---

## 7. Badges / Tags / Pill Labels

| Style | Classes | Usage |
|---|---|---|
| Yellow badge (trade) | `px-4 py-2 bg-yellow-500 text-gray-900 text-xs tracking-wide` | "PRICING VISIBLE AFTER APPROVAL" |
| Border badge | `px-4 py-2 border border-gray-300 text-gray-700 text-xs tracking-wide` | "MOQ & BULK ORDERING AVAILABLE" |
| Use case tag | `px-4 py-2 bg-white border border-gray-200 text-sm text-gray-700` | Use case chips on product pages |

---

## 8. Icon Usage

- Icon library: **Lucide React** (`lucide-react`)
- Standard icon size: `w-10 h-10` for feature/benefit cards
- Button icon size: `w-4 h-4`
- Support block icon: `w-12 h-12`
- Stroke width: `strokeWidth={1.5}` (thin/light style)
- Icon colour: `text-gray-900` on light backgrounds

---

## 9. Notice / Alert Boxes

| Type | Classes |
|---|---|
| B2B pricing notice (yellow tint) | `bg-yellow-50 border border-yellow-200 p-4` |
| MOQ / bulk notice (neutral) | `bg-gray-50 border border-gray-200 p-4` |
| Support block container | `bg-gray-50 border border-gray-200 p-10 text-center` |

---

## 10. Summary Quick Reference

```
Background:        bg-white / bg-gray-50 / bg-gray-900 (dark)
Primary text:      text-gray-900
Body text:         text-gray-600
Muted text:        text-gray-500
Accent:            bg-yellow-500 / #eab308 (CTAs, badges)
Container:         max-w-[1400px] mx-auto px-8
Section padding:   py-24 (standard) / py-32 (hero CTAs) / py-20 (hero)
Border radius:     NONE — all elements are sharp-cornered
Shadows:           NONE on content cards
Font:              System sans-serif (no custom font declared)
Heading h1:        text-5xl tracking-tight
Heading h2:        text-4xl tracking-tight
Body:              text-lg leading-relaxed text-gray-600
Eyebrow:           text-xs tracking-widest text-gray-500 (uppercase text)
CTA primary:       bg-gray-900 text-white px-8 py-4 text-sm tracking-wide
CTA accent:        bg-yellow-500 text-gray-900 px-8 py-4 text-sm tracking-wide
CTA outline:       border-2 border-gray-900 text-gray-900 px-8 py-4 text-sm tracking-wide
```
