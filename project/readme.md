# Kostella Design System

Kostella is an Indonesian kos (boarding-house) operator — 31 buildings in Jakarta, Bandung, and Bali, owner-operated since 2008. Unlike aggregators (Mamikos) or third-party managers (Cove, Rukita), Kostella owns and manages every room, so it can make two claims no competitor can: **which rooms are truly empty today**, and **exactly what you'll pay**. Every design decision serves those two claims.

Source: `uploads/brief-arahan-visual-kostella.md` (full visual direction brief, Indonesian) + `uploads/kostella-logo.png`. Purpose: win-the-project pitch material — 4 screens (Beranda, Hasil pencarian, Detail properti, Dashboard pengelola), not production spec.

## The big idea: Numbers (Nomor)

Kostella doesn't name its properties — it **numbers** them: 362, 361, 360, 351, 2A3, 2A5, 2C, 100 (real house numbers on Jl. Dr. Susilo). Rooms are numbered too: 101, 105, 205, 304. This 18-year-old real numbering system is the visual identity: numbers rendered big and bold, like building plates and room-door plaques.

**Signature element: the floor grid (kisi lantai).** Property pages open with a typographic grid of every room per floor with live status — not a photo carousel. It's a deliberate design risk: competitors open with photos; Kostella opens with inventory. Availability transparency is the differentiator, and to franchise owners it's visual proof the system is real.

## Audiences

- Students/workers: fear wrong choice, hidden fees → show real distances, total cost, honest photos.
- Parents (co-deciders, often payers): fear fraud, safety → legitimacy, full addresses, firm rules.
- Kos owners (franchise prospects): fear a sloppy system → a serious-looking dashboard.

## CONTENT FUNDAMENTALS

- **Language: Indonesian.** Informal-respectful "kamu" for tenants ("Kamu kuliah atau kerja di mana?"), formal "Anda" for owners/franchise ("Kami juga bisa mengelola milik Anda").
- **Sentence case everywhere** except eyebrows/labels (ALL CAPS, 12px, +0.08em tracking).
- **No emoji. No exclamation marks. No marketing superlatives.** Tone is calm, factual, confident — honesty presented with confidence reads as professionalism. Rules that competitors hide (late fees, second-person fee Rp400.000, guest rate Rp100.000/night) are surfaced, not buried.
- **Numbers must be real and consistent.** Never "+200 kost". If a figure is unconfirmed, state room count, not building count. In a market whose main fear is fraud, inconsistent claims are a red flag.
- Prices in mono, formatted `Rp1.950.000` (Indonesian dot separators). Availability lines like `3 dari 8 kamar kosong`, `kosong 1 Agustus`.
- Copy examples: eyebrow `MILIK & DIKELOLA SENDIRI SEJAK 2008`; H1 "Kos yang kamarnya kami kelola sendiri."; cost section "Yang kamu bayar, tanpa kejutan."; empty state gives a way out: "Belum ada kamar kosong di Setiabudi. Yang terdekat ada di Kebayoran, 15 menit."

## VISUAL FOUNDATIONS

- **Palette:** stone `#EDECE7` page bg (cool stone grey, not cream), paper white cards, ink `#16171A`, ink-soft `#5E5F62`, plum `#57182F` (brand/action), plum-soft `#F3E7EA`, line `#D9D7D0`. Status colors ONLY for availability, never decoration: available `#2E7D52`, held `#B4531E`, occupied `#9A9892`. **Max two non-neutral colors per screen** (plum + one contextual status). Deliberately avoids market-worn directions: blue (Mamikos), orange-red (Rukita), cheery pastels (Cove), and the cream+serif+terracotta AI-default look.
- **Type:** Archivo (display/numbers — Expanded width, 600–700 for numerals; signage face), Plus Jakarta Sans (body/UI 400/500/600), IBM Plex Mono (prices, room codes, cost tables — tabular figures make cost tables read like receipts, not marketing). All free on Google Fonts. Scale: hero number 96–140px/0.85 tight tracking; H1 44/1.1; H2 30/1.2; H3 21/1.3; body 16/1.65; small 14/1.6; eyebrow 12/1.4 +0.08em; big price 32 mono 500; room code 15 mono 500.
- **Spacing:** 4/8/12/16/24/32/48/64/96/128. Sections 96px desktop / 56px mobile. Content max 1200px; text columns max 640px.
- **Radii:** 4px badges+inputs, 12px cards, **0 for floor-grid room cells** (floorplan, not buttons).
- **Elevation:** almost none. Separation via 1px `--line` rules and surface shifts. Max one shadow: `0 1px 2px rgba(22,23,26,0.06)`. No gradients, no glassmorphism.
- **Status must never rely on color alone:** available = solid green fill + white numeral; held = diagonal hatch; occupied = grey fill + faded text.
- **Motion — exactly three:** floor-grid cells stagger in per floor (40ms delay); property-card photo hover zoom 1.03 / 400ms ease-out; cost-detail open/close height transition 250ms. No parallax, no letter-by-letter text, no moving backgrounds.
- **Hover/press:** subtle — photo zoom on cards; buttons darken slightly. Nothing bouncy.
- **Photography:** 3:2 hero, 4:5 grid cards, 1:1 thumbnails. One consistent light source, daylight, curtains open, room lights off. No extreme wide-angle (a 3×4 room must look 3×4). Uniform treatment: low contrast, slightly warm, lifted shadows. People only in shared areas, never in rooms. No stock photos.
- **Dark blocks:** the franchise section uses `--ink` background with `--stone` text — the only inverse surface.
- **Maps:** neighborhood level with walking radius, never a national map with 5 pins.

## ICONOGRAPHY

No icon set was provided in the sources. Rule from the brief: thin-line icons, 1.5px stroke, 20px, never colorful icons or cut-out PNGs. **Substitution (flagged): Lucide via CDN** matches the 1.5px-stroke/20px spec and is used sparingly in UI kits. Proof-bar and stats use no icons at all — just Archivo numerals + small labels. Unicode squares (■ ▨ □) serve as floor-grid legend glyphs. No emoji, ever.

Logo: `assets/kostella-logo.png` (243×124, grey oval "KOSTella" mark with www.kost-ella.com). Note: the existing logo is a grey embossed style that predates this system; the brief says to confirm logo color with the owner (item 11.2). Where a mark is needed on-brand, prefer the wordmark "Kostella" set in Archivo 600.

## Real data (use in mocks — never lorem ipsum)

- Kostella 362, Jl. Dr. Susilo 2 No. 362, Grogol, Jakarta Barat. Khusus putri.
- Types: Standard Rp1.650.000 · Superior Rp1.950.000 · Pojok Rp2.100.000
- Rooms — L1: 101, 105, 107 · L2: 205, 208, 211, 212 · L3: 304. Status: 105 & 211 kosong, 205 dibooking, rest terisi.
- Deposit Rp1.500.000 (refundable), electricity separate, pay the 1st–16th, 2nd person Rp400.000, overnight guest Rp100.000/night, free motorbike parking.
- Distances from 362: Trisakti 1 km · Terminal Grogol 0,2 km · Central Park 0,2 km.
- Search chips: Trisakti/Untar · Kelapa Gading · Setiabudi · Kebayoran · Bandung · Nusa Dua.
- Proof bar: since 2008 · 31 buildings · room count (confirm) · avg tenure.
- Dashboard: occupancy 8/11, unpaid bills, scheduled surveys; property picker `362 ▾`.

## Avoid (from the brief)

Luxe/Classic/Basic tiers · national-level maps · Mamikos-style exhaustive filters · cream+high-contrast-serif+terracotta · inconsistent claim numbers · stock photos · unlabeled concept mockups.

## Index

- `styles.css` → `tokens/colors.css`, `tokens/typography.css`, `tokens/layout.css`
- `assets/kostella-logo.png`
- `guidelines/` — foundation specimen cards (colors, type, spacing, motifs)
- `components/core/` — Button, Chip, Badge, StatusBadge, Input, RoomCell, FloorGrid, PropertyCard, ReceiptTable, MetricCard, Eyebrow, ProofBar
- `ui_kits/beranda/` · `ui_kits/pencarian/` · `ui_kits/detail/` · `ui_kits/dashboard/` — the 4 pitch screens
- `SKILL.md` — agent skill entry point

## Intentional additions

- Lucide CDN icons (no icon set in source; matches 1.5px/20px spec) — flagged for replacement.
- `Eyebrow`, `ProofBar` — small primitives extracted from repeated brief patterns.

## To confirm with owner (from brief §11)

1. Real building + room counts (one number, used everywhere). 2. Logo color — if plum clashes, adjust palette but keep the "numbers" direction. 3. Online payment approved in principle? 4. May the franchise page appear in the pitch?
