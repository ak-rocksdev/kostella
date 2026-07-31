# Design

<!-- impeccable:design-schema 1 -->

## Direction contract

**THESIS.** Kostella shows rooms you can actually still take, and says exactly
what they cost. The surface owns that with clarity rather than with character:
this is the international co-living canon played straight, at Cove/Habyt/Hmlet
craft level, at the client's explicit direction. It refuses the previous world —
stone bands, hairline rules, near-zero elevation, and oversized Archivo Expanded
numerals — which read as austere rather than as somewhere you would want to live.

**OWN-WORLD.** A near-white ground with generous air; photography is the colour.
Content sits on white cards with 16px radii and soft three-layer elevation. One
saturated brand colour (plum) carries actions and nothing else. Neutrals are warm
greys, not the old cool stone. Controls are pill-shaped; facts are square tags.
Type is one clean geometric sans across two roles, with real scale steps and
generous line height.

**STORY.** A student arrives worried about wasting a trip on a room already
taken. They state a budget and an area, see how much of the inventory that
reaches, and go to the results with the figure already applied.

**FIRST VIEWPORT.** Headline and supporting line on a light ground, generous
top space. Directly beneath, a horizontal search bar — area, budget, action —
as one elevated pill-shaped row rather than a boxed panel. A wide rounded
photograph anchors the composition below it.

**FORM.** The category standard, taken deliberately. Two consecutive re-rolls
preceded it; the client then asked in plain words for the familiar path and
named the comparison set. Seed keys 39ac8395 and dcb6575e, both discharged.

## Durable rules

- **Colour strategy: Restrained.** Warm neutrals plus one saturated accent.
  Plum belongs to actions and active states only. Availability keeps the status
  greens and ambers, and never signals by colour alone.
- **Elevation is real.** Three-layer shadows with offset and soft blur. A resting
  step and a lifted step; nothing else. The previous "separation by 1px rule"
  ban is retired.
- **Radii.** 16px on cards and photographs, 999px on controls, 8px on tags.
- **Photography carries the page.** Large, warm, uncropped where possible. The
  images currently shipped are placeholders — see PRODUCT.md.
- **Motion.** Entrances are a single staggered reveal per section, driven from
  JavaScript so content is never hidden without it. Hover is a lift plus a slow
  photo scale sharing one easing. Nothing else animates.
- **Numbers stay, quietly.** Real building numbers remain the naming system,
  expressed as a refined marker rather than as display type dominating a photo.
- **Language and tone are unchanged.** Indonesian, "kamu" for tenants and "Anda"
  for owners, sentence case, no emoji, no superlatives, real figures.

## Tokens

`app/globals.css` is the source of truth; these are the values the build settled
on. All three screens — Beranda, Pencarian, Detail — run on them.

**Grounds.** One ground for every page: `--color-canvas: #fbfaf8`. White
(`--color-paper`) is reserved for cards, so anything white is something you can
act on. Banded sections were tried and dropped — alternating grounds competed
with the elevation for the same job. `--color-stone: #edece7` survives from the
previous world but has been demoted from page ground to the fill behind tags and
building-number markers. `--color-ink: #16171a` on the one dark panel.

**Brand and status.** `--color-plum: #57182f` on actions and active states only;
`--color-plum-soft: #f3e7ea` behind step numbers and the verified badge.
Availability keeps `--color-available` / `--color-held` / `--color-occupied`
and always carries a word beside the colour.

**Type.** `--font-body` (Plus Jakarta Sans) for everything read, `--font-figure`
(Archivo, normal width) for prices, phone numbers and building numbers. Section
headings run `clamp(2rem, 4–4.5vw, 2.75rem)` at 600 with `-0.015em` to `-0.025em`
tracking; body copy sits at 15–17px and 1.6–1.65 line height. The `numeral`
utility (Archivo Expanded 125%) is gone — the oversized identity numeral was the
previous world's signature, and every screen now sets building and room numbers
as a small marker in `--font-figure`.

The rule-and-caps section eyebrow is gone with it. `SectionLabel` replaces it
everywhere: 13px, semibold, `--color-ink-soft`, sentence case, separated from
what follows by space alone.

**Radii.** `--radius-card: 16px` on cards, photographs and panels;
`--radius-badge: 8px` on tags and number markers; `rounded-full` on every
control, pill and status badge.

**Elevation.** `--shadow-card` at rest and `--shadow-lift` on hover and keyboard
focus, both three-layer. The resting step is kept inside a 26px reach so it
survives the carousel's clip box. `--shadow-float` remains for the hero card.

**Rhythm.** Sections run `py-20 sm:py-28` inside `wrap` (1200px, 20/32px
gutters). The search screen uses `wrap-wide` (1376px) because it puts inventory
beside a map.
