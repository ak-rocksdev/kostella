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

Provisional until the first build settles them; `app/globals.css` is the source
of truth and this file is updated to match once the build lands.
