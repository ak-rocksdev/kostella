# Hasil pencarian and Detail properti — implementation notes

Date: 2026-07-29
Sources: `project/ui_kits/pencarian/`, `project/ui_kits/detail/`
Follows: `2026-07-29-beranda-implementation-design.md`

## Goal

Make the screens Beranda already links to reachable. Both are ported on the same
terms as Beranda: the design system is the authority, the prototype's visual
output is the target, and its internal structure is not binding.

## What was built

| Route | Screen | Entry points |
| --- | --- | --- |
| `/pencarian` | Search results, 60/40 list and map | Beranda nav, hero CTA, "Lihat semua kawasan", Detail's back link |
| `/detail` | Property 362 | Beranda property cards and hero room rows, a search result |

The Dashboard was left out. No public screen links to it and the design provides
no entry point, so making it reachable would mean inventing navigation the system
has no vocabulary for. That is a decision for the client, not a build detail.

## New shared components

- `FloorGrid` / `RoomCell` / `FloorGridLegend` — the signature element. Status is
  carried three ways at once (fill, border, hatch pattern) so it never depends on
  colour, and cells have square corners because they read as a floorplan rather
  than as buttons. Cells stagger in 40ms apart — motion rule two of the system's
  three.
- `LeafletMap` — one map component behind every map in the product.

## Maps

At the client's instruction, every map uses a real library. The two schematic
"peta konsep" surfaces in the prototypes were replaced with Leaflet, matching the
footer map that Beranda already had, and `FooterMap` was refactored onto the same
component. Coordinates live in `lib/content/geography.ts` so the buildings can
never drift between screens.

The maps frame themselves rather than trusting a fixed zoom: the surroundings map
fits its walking-radius circle, and the results map fits its markers. A fixed zoom
stacked the building plates on top of each other, because the properties sit
within a few hundred metres of one another.

**Two content consequences, both needing the owner's confirmation:**

1. The brief states "Central Park 0,2 km" from building 362. The mall is roughly
   1,5 km away. On a schematic map that passed unnoticed; on a real one it does
   not. Central Park is therefore not pinned on the walking-radius map, but the
   distance line still repeats the brief's figure. The brand's own rule is that
   figures must be real and consistent — this one is not.
2. The schematic also carried "Indomaret" and "BCA". A chain branch cannot be
   placed on a real map without an actual address, so they are left off rather
   than guessed at.

## Data corrections

The prototype computed a room's up-front total as
`room === '205' ? 'Rp 3.450.000' : 'Rp 3.150.000'`, which is right for room 205
but shows a Standard total for the other Superior rooms. Rents are now stored as
numbers and the total is derived as rent plus deposit, so the figures cannot
disagree with each other.

## Defects found and fixed

- **Every secondary button had an invisible border.** The base class set
  `border-transparent` and the variant set `border-line`; both target the same
  property, so CSS source order decided the winner rather than intent. The base
  now sets width only and each variant owns its colour. This was also wrong on
  Beranda, where it had gone unnoticed.
- **The search screen ended 24px below its last card.** The prototype's 24px
  padding applies all round; the bottom now takes the system's section padding
  (56px mobile, 96px desktop) so the page does not stop against the viewport
  edge.

## Typeface change: figures move from IBM Plex Mono to Archivo

The design system specifies IBM Plex Mono for prices, room codes, and receipts,
on the argument that tabular figures make cost tables read like receipts rather
than marketing. The client rejected the face and asked for a sans-serif with real
weight range.

Five candidates were measured in the browser, digit by digit, for tabular
support. All five align perfectly under `font-variant-numeric: tabular-nums`;
they differ only in their defaults (IBM Plex Sans is tabular out of the box,
Archivo nearly so, Inter and Manrope and Plus Jakarta Sans are proportional). So
alignment was never the deciding factor — any of them could do it.

The client then confirmed that figures only need to align in the receipt.

**Archivo was chosen over Inter**, which the client had suggested, because:

- It is already loaded. Archivo renders the brand's identity numerals — `362`,
  `31`, `2008` — so a price now speaks with the same voice as the building
  number it belongs to. Inter would have been a fourth family.
- The two roles are distinguished by width rather than by being unrelated fonts:
  Expanded (`wdth` 125, weight 700) for display numerals, normal width for
  figures. That is a typographic relationship rather than an accident.
- Inter is the most widely used UI face on the web and would read as a default.
  For a brand whose whole premise is not being like the aggregators, that is a
  real if subtle cost.

Dropping Plex Mono takes the app from three typefaces to two.

The token was renamed `--font-mono` → `--font-figure`, since it no longer points
at a monospaced face and the old name would have been a lie. `tabular-nums` is
applied in `ReceiptTable` and nowhere else.

## Known limitations

- **`/detail` is one property.** All four Beranda cards and every search result
  lead to 362, because the design specifies data for that building only.
  Per-property routing needs the other thirty.
- **`/pencarian` has one result set.** Beranda offers six area chips; the design
  provides results for Grogol.
- **Filter chips and area chips do not filter.** They hold selection state, as in
  the prototype. Confirmed with the client as out of scope at this stage.

## Verification

`tsc --noEmit`, `next build`, and `eslint` pass clean. No horizontal overflow
across twelve page/width combinations (360, 768, 1024, 1440 on all three routes).
The link graph was checked in the browser and is complete and bidirectional.
