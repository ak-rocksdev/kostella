# Kostella Beranda — implementation design

Date: 2026-07-29
Source: Claude Design handoff bundle, `project/ui_kits/beranda/index.html`
Design project: `f6d153c9-2903-473c-b028-06c983837969` (Kostella Design System)

## Goal

Recreate the Beranda (homepage) prototype as production code: Next.js App Router,
TypeScript, Tailwind v4. Visual output matches the desktop-1440 prototype exactly;
below 1440 the page reflows using the design system's own mobile rules.

The prototype is HTML/CSS/JS built in a design tool. Its internal structure is not
binding — only its visual output is. Two parts are tool scaffolding and are dropped:
`image-slot.js` (a drag-to-fill placeholder that becomes a plain image) and the
browser-side Babel + CDN React setup.

## Scope

In scope:

- The Beranda page: Header, Hero, ProofBar, Kawasan, Biaya, CaraSewa, Franchise, Footer.
- The seven design-system components Beranda uses: Button, Chip, Badge/StatusBadge,
  Eyebrow, PropertyCard, ReceiptTable, ProofBar.
- Responsive behavior down to 360px.

Out of scope:

- The other three screens (`pencarian`, `detail`, `dashboard`) and the components only
  they use (FloorGrid, RoomCell, Input, MetricCard).
- Any backend, CMS, booking flow, or form submission.

## Design system adherence

The design system is the authority. Values come from `project/tokens/*.css` and the
rules from `project/readme.md`. Nothing is invented.

### Non-negotiable rules carried over from the brand readme

1. **Numbers are the identity.** Property and room numbers render in Archivo Expanded
   (`font-stretch: 125%`, weight 700). This requires loading Archivo as a variable font
   with the `wdth` axis, not a static weight.
2. **Max two non-neutral colors per screen** — plum plus one contextual status color.
3. **Status is never conveyed by color alone.** Every status badge carries text.
4. **Near-zero elevation.** Separation comes from 1px `--line` rules and surface shifts.
   One shadow only: `--shadow-max`. No gradients, no glassmorphism.
5. **Exactly three motion rules** exist in the system. Beranda uses one: property-card
   photo hover zoom, `scale(1.03)` over 400ms ease-out. No new motion is added.
6. **Sentence case everywhere** except eyebrows (uppercase, 12px, `0.08em` tracking).
7. **Copy is Indonesian**, informal-respectful "kamu" for tenants, formal "Anda" for
   owners. No emoji, no exclamation marks, no superlatives.
8. **Icons** are Lucide, 1.5px stroke, 20px. Never colorful icons or cut-out PNGs.

### Token mapping

`app/globals.css` restates the three token files inside Tailwind v4's `@theme`, so the
design system's own names become utilities. The token file remains the single place a
value is edited.

| Token source | Value | Utility |
| --- | --- | --- |
| `--stone` | `#EDECE7` | `bg-stone` |
| `--paper` | `#FFFFFF` | `bg-paper` |
| `--ink` | `#16171A` | `text-ink` |
| `--ink-soft` | `#5E5F62` | `text-ink-soft` |
| `--line` | `#D9D7D0` | `border-line` |
| `--plum` | `#57182F` | `bg-plum` / `text-plum` |
| `--plum-soft` | `#F3E7EA` | `bg-plum-soft` |
| `--available` | `#2E7D52` | `bg-available` |
| `--held` | `#B4531E` | `text-held` |
| `--occupied` | `#9A9892` | `text-occupied` |
| `--radius-badge` | `4px` | `rounded-badge` |
| `--radius-card` | `12px` | `rounded-card` |
| `--shadow-max` | `0 1px 2px rgba(22,23,26,0.06)` | `shadow-max` |

`#451325` (the primary button's hover state) is the one color in the prototype with no
token. It is added to the theme as `--color-plum-deep` rather than left as a magic value.

Typography loads through `next/font/google`: Archivo (variable, `wdth` + `wght` axes),
Plus Jakarta Sans (400/500/600), IBM Plex Mono (400/500). A `.numeral` utility packages
the Archivo Expanded treatment, which appears in seven places across the page.

## Architecture

```
app/
  layout.tsx            fonts, <html lang="id">, metadata
  page.tsx              Beranda composition — Server Component
  globals.css           Tailwind import + @theme tokens + base layer
components/
  ui/                   design-system primitives
    Button.tsx  Chip.tsx  Badge.tsx  Eyebrow.tsx
    PropertyCard.tsx  ReceiptTable.tsx  ProofBar.tsx
    SectionEyebrow.tsx  Icon.tsx
  beranda/              page sections, 1:1 with the prototype's functions
    Header.tsx  Hero.tsx  Kawasan.tsx  Biaya.tsx
    CaraSewa.tsx  Franchise.tsx  Footer.tsx  FooterMap.tsx
lib/
  content.ts            all copy and data, typed
  routes.ts             link targets in one place
public/images/          the four photos the page uses
```

`project/` is left untouched as the read-only design reference.

### Server and client boundary

The prototype is entirely client-rendered because it runs Babel in the browser. That is
an artifact of the medium, not a requirement. In the port, hover behavior implemented as
JavaScript event handlers becomes CSS, with identical values:

- Button darken on hover → `hover:bg-plum-deep`
- Chip border on hover → `hover:border-ink-soft`
- Property photo zoom → `group-hover:scale-[1.03]` with `duration-400 ease-out`
- `PropertyCard`'s `onClick` → a wrapping `Link`, which is also correct semantics

Only two components need `"use client"`: **Hero** (the chip selection is real state) and
**FooterMap** (Leaflet touches the DOM). Everything else is a Server Component. The
rendered result is identical; the shipped JavaScript is much smaller.

### The Leaflet map

`FooterMap` is a client component loaded with `dynamic(..., { ssr: false })`. It keeps the
prototype's configuration: view `[-6.1645, 106.7890]` at zoom 16, CARTO light tiles,
scroll-wheel zoom off, and plum `divIcon` markers for buildings 362, 361, 351, and 2A3.
Leaflet's stylesheet is imported in the component rather than as a CDN link.

Per the ui_kits readme, prototype maps are labeled "peta konsep". The real caption from
the design is kept: "Lokasi perkiraan — alamat pasti dikirim saat jadwal survei
dikonfirmasi."

## Responsive design

Desktop 1440 is the reference and is matched exactly at `lg` and above. The design system
specifies 96px desktop / 56px mobile section padding; that is the only responsive rule the
source provides, so the rest follows from it conservatively.

| Section | Desktop | Below `lg` (1024px) | Below `md` (768px) |
| --- | --- | --- | --- |
| Header | wordmark, 4 nav links, button | same | wordmark + button; nav links hidden |
| Hero | `1.1fr 1fr` grid, image frame absolutely positioned with the availability card overlapping it | stacked: 3:2 photo, then availability card in flow | same, H1 scales down |
| ProofBar | 4 columns, left-border dividers | 4 columns | 2×2 grid, borders on both axes |
| Kawasan | 4 cards | 2 cards | 1 card |
| Biaya | `1fr 1.1fr` grid | stacked, receipt below | same |
| CaraSewa | 4 steps, left-border dividers | 2×2, dividers adapt | 1 column, top-border dividers |
| Franchise | text + 140px outlined "31" | "31" scales down | "31" hidden |
| Footer | map + contact, `1.1fr 1fr` | stacked | stacked, address list 1 column |

The H1 uses `clamp(2rem, 5vw, 3.25rem)` so it never wraps awkwardly between breakpoints.

**Header at mobile:** the design provides no mobile navigation pattern. Rather than
invent a hamburger menu that the design system has no vocabulary for, the four nav links
are hidden below `md` and the wordmark plus the primary action remain. This is the one
decision not derivable from the source, and it is deliberately the smallest one available.

## Accessibility

Kept faithful to the design while closing the gaps a prototype leaves open. None of these
change the visual output.

- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, and `<section>` elements with
  accessible names where a heading does not already provide one.
- Keyboard focus: a visible `focus-visible` ring in plum on every interactive element.
  The prototype has none.
- The room list in the hero card renders as links whose accessible name states the room,
  type, price, and availability, rather than reading as four disconnected fragments.
- The Franchise section's 140px outlined "31" is decorative — the sentence beside it
  already states the number — so it is `aria-hidden`.
- The map container carries a label; the caption beneath it is associated with it.
- Chip selection uses `aria-pressed`, since the chips are a filter, not navigation.
- `prefers-reduced-motion` disables the card photo zoom.
- Contrast is verified as adequate in the source palette: white on `--available`
  (`#2E7D52`) is 5.0:1, and `--ink-soft` on `--stone` is above 6:1. No token is altered.

## Content

All copy and data live in `lib/content.ts`, typed, using the real figures from the brand
brief — never placeholders. This includes the four hero rooms, the six area chips, the
four Grogol properties with their distances and statuses, the receipt rows for room 105,
the four rental steps, the proof bar figures, and the four building addresses.

The prototype's cross-page links (`../pencarian/index.html`, `../detail/index.html`) point
to screens outside this scope. They resolve to `#` through `lib/routes.ts`, so wiring them
up later is a single-file edit.

## Verification

- `npx tsc --noEmit` — no type errors.
- `npm run build` — production build succeeds.
- `npm run lint` — clean.
- Manual read-through of each section against the prototype source, value by value:
  spacing, font sizes, colors, and border treatments.

Screenshots are not part of verification; the bundle README states the source specifies
everything needed and asks that the prototypes not be rendered unless requested.

## Risks

- **Archivo's `wdth` axis.** The expanded numerals are the brand's identity. If
  `next/font/google` cannot load the axis, the fallback is self-hosting the variable font
  file. This is checked first, because a failure here changes the visual result.
- **CARTO tiles** are an external runtime dependency. Acceptable for a concept build; a
  production site would use its own tile provider.
- **Photos are placeholders.** The brand brief forbids stock photos and expects real
  Kostella photography. The four images ship from the bundle as-is.

## Hero redesign — budget-led search

Added after the first build, at the client's request: guide visitors toward a
search driven by budget, and let the photo run full width.

**The problem with the ported hero.** It described the brand's claim and then
offered two buttons. The area chips held state but led nowhere, the left column
ran out before the right one did — leaving dead space — and the photo sat boxed
inside a column, cropped awkwardly.

**The thesis now.** Every competitor opens its search with a location box.
Kostella can open with money, because it owns its buildings and therefore knows
every rent exactly. So the hero asks for a budget, and the inventory answers
immediately. The claim is demonstrated rather than asserted — something an
aggregator reselling other people's listings could not show.

**Structure.** One frame. The building runs full width directly beneath the
navbar and the argument sits on it: eyebrow, headline, and intro on the left,
the budget panel as an opaque paper card on the right.

Kostella owns and runs every room, so the honest thing to open with is the place
itself. The headline states the claim and the control lets you test it in the
same view.

**Results do not appear in the hero.** An earlier pass previewed the matching
rooms on the photo; that was cut. Setting a budget sends you to the search
screen with the figure already applied, and a hero that answers its own question
gives the visitor two places to read the same list. The guidance that lived on
that card — what to do when nothing matches — moved into the panel, so nobody
gets stranded on a figure that returns nothing.

**Text over photography.** The scrim runs left to right (`ink/90` → `ink/70` →
`ink/35`), weighted to where the type sits so the right-hand side still reads as
a photograph rather than an even wash. Type over it is solid `--stone`, never
translucent: against a blown-out photo, alpha eats the contrast, and the
system's inverse-secondary grey (`#9A9892`) falls to about 2.4:1 and is unusable
here. Solid stone holds 5.6:1 in the worst case, so the wording survives whatever
photograph is dropped in later. Hierarchy comes from size and weight instead.

**The signature** is the budget figure itself, set in Archivo Expanded at
`clamp(1.75rem, 4vw, 2.25rem)` — the same treatment as the building plates. The
visitor's own number joins the brand's numeral language. That is the one bold
element; everything around it stays quiet.

**The slider** is a real `<input type="range">` so arrow keys, Home/End, and
screen readers work without reimplementation. Its track and fill are drawn as
elements behind a transparent native track, because the system forbids gradients
and a gradient is the usual way to fill a range track.

**Empty states are designed, not accidental.** Two can occur, and each states
the way out inline in the panel rather than leaving a dead end:

- Budget below every rent → "Termurah Rp1.550.000 di gedung 351", with a control
  that raises the budget to exactly that figure.
- An area with no inventory → "Belum ada kamar kosong di Bandung", with a control
  that switches to the nearest area that has some.

With no match the primary action becomes "Lihat semua kamar" rather than
counting to zero, and the "n dari m" line is suppressed when the area holds
nothing, since "0 dari 0" says nothing.

The vacant-room list grew from four entries to six so the budget filter visibly
does something. Rents stay on the brief's real tiers (Standard Rp1.650.000,
Superior Rp1.950.000, Pojok Rp2.100.000) and are stored numerically, so the
filter compares figures rather than parsing formatted strings.

## Outcome

Built and verified on 2026-07-29. `tsc --noEmit`, `next build`, and `eslint` all pass
clean, and the page renders with no console errors.

The Archivo risk did not materialise: `next/font/google` loads the `wdth` axis, and the
compiled CSS carries `font-stretch: 125%`. The expanded numerals are correct.

Two defects surfaced during verification and were fixed:

1. **Horizontal page overflow below 640px.** The CaraSewa dividers used a 28px negative
   inline margin to bleed past the content column, but the mobile gutter is 20px, so the
   grid pushed 8px past the viewport on each side. The bleed now applies only from `sm`
   up, where the 32px gutter absorbs it; at one column the steps sit flush and the rules
   span the column's full width. Verified with no horizontal overflow at 360, 390, 500,
   640, 768, 1024, 1280, and 1440.
2. **Map markers rendered as a single digit.** Leaflet's `DivIcon` defaults to a 12×12
   box, which clipped "362" to "3". The prototype passed `iconSize: null` to disable it;
   the port now clears the option so each plate sizes to its own label.

One deviation from the design system is carried over deliberately from the prototype: the
hero availability card uses `0 12px 32px rgba(22,23,26,0.10)`, a heavier shadow than the
system's "max one shadow" rule allows. It is named `--shadow-float` and commented rather
than left as a magic value, so the exception is visible.
