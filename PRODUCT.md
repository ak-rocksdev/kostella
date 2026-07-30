# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Students and young workers** — primary. Choosing a room, often for the first
time and often from another city. Their fear is picking wrong: a room that turns
out smaller than the photos, or a price that grows after they move in.

**Parents** — co-deciders and usually the payers. Their fear is fraud and an
unsafe building. They want legitimacy, full addresses, and firm house rules.

**Kos owners** — partnership prospects for the franchise offer. Their fear is a
sloppy operation; they need visible proof the system is real before handing over
a building.

## Product Purpose

Kostella is an Indonesian kos (boarding-house) operator that owns and manages
every room it lists. The site's job is to let someone find a room that is
genuinely empty, understand exactly what it will cost, and arrange to see it.

**Success for this build is winning the project.** It is pitch material, not a
production deployment — the standard is that the work is convincing and
internally consistent, not that it is connected to live systems.

## Positioning

Kostella owns and operates every building. It is not an aggregator reselling
other people's listings (Mamikos) and not a manager of property it does not own
(Cove, Rukita). That ownership is the mechanism behind two claims a neighbouring
product could not truthfully copy:

1. **Which rooms are genuinely empty today.** Kostella holds the inventory, so
   availability is a fact it owns rather than a field a landlord forgot to update.
2. **Exactly what you will pay.** It sets every rent and every rule, so the full
   cost can be shown before anyone asks.

Every design and product decision serves one of those two claims.

## Operating Context

**Confirmed scale:** 31 buildings, 340 rooms, operating since 2008. Average
tenure 14 months. Jakarta, Bandung, and Bali.

**Documented cluster:** Grogol, Jakarta Barat, along Jl. Dr. Susilo. Buildings
are identified by their real house numbers — 362, 361, 360, 351, 2A3, 2C — never
by invented names. Rooms are numbered the same way.

**Documented building (362):** Khusus putri. Standard Rp1.650.000, Superior
Rp1.950.000, Pojok Rp2.100.000. Rooms 101/105/107 on floor one, 205/208/211/212
on floor two, 304 on floor three.

**Tenancy is monthly.** A kos is rented by the month — one month is the shortest
term there is. Rents are always quoted per month, and nothing on the site should
imply nightly or short-stay booking.

**Money rules that apply across buildings:** rent quoted per month; deposit
Rp1.500.000, refundable in full on move-out; electricity metered separately; rent
paid between the 1st and 16th of each month; a second occupant sharing the room
adds Rp400.000 per month; motorbike parking free. Late payment incurs a penalty
per the tenancy agreement.

A resident hosting a guest overnight is charged Rp100.000 for that night. This is
a house rule for residents, not a rate anyone can book against.

**Contact:** 0812 8000 0362, 08.00–21.00 WIB daily.

## Capabilities and Constraints

**Built:** Beranda (`/`), Hasil pencarian (`/pencarian`), Detail properti 362
(`/detail`). Next.js App Router, TypeScript, Tailwind v4. Entirely static — no
backend, no authentication, no CMS.

**Confirmed for later design:** rental application (*ajukan sewa*), online
payment, and the operator dashboard.

**Explicitly undecided:**

- **Survey scheduling (*jadwalkan survei*).** The most prominent call to action
  on the site — it appears in five places — but it was not confirmed as in scope
  when capabilities were reviewed. Its destination does not exist yet.
- **Online payment approval.** The user intends to design it, but the source
  brief (§11) records the owner's approval in principle as still outstanding.
  Designing it does not mean it has been agreed to.

**Scope limits in the current build:**

- The detail screen covers building 362 only. Per-property routing needs data for
  the other thirty; all property cards and search results lead to 362.
- Search covers Grogol only, while the site offers six area chips. The other five
  areas resolve to a designed empty state.
- Filter and area chips hold selection state but do not filter results.
- The operator dashboard exists as a design in the handoff bundle but has no
  entry point from any public screen.

## Brand Commitments

**Standing visual preference, set by the client on 2026-07-30.** Kostella is to
sit alongside international co-living products — Cove, Habyt, Hmlet — and their
craft level is the bar: disciplined typography, generous space, photography
carrying the page, a mature component system. This is a deliberate reversal of
the source brief, which listed Cove's look among the directions to avoid and
positioned Kostella away from co-living operators. The client was shown that
conflict and chose this anyway. Execute it fully; do not reintroduce the older
direction by halves.

The two claims in **Positioning** are unaffected. They are product truth, not a
look, and they survive any visual world.

- **Name:** Kostella. Where a mark is needed, the wordmark is set in Archivo 600.
  The existing logo asset predates this system and its colour is unconfirmed.
- **Language:** Indonesian throughout. Informal-respectful "kamu" for tenants;
  formal "Anda" for owners and partnership prospects.
- **Case:** sentence case everywhere except eyebrows and labels.
- **Tone:** calm, factual, confident. No emoji, no exclamation marks, no
  marketing superlatives. Honesty presented with confidence reads as
  professionalism.
- **Figures must be real and consistent.** Never "+200 kost". In a market whose
  central fear is fraud, a figure that disagrees with itself is a red flag.
- **Rules competitors bury are surfaced.** Late fees, the second-occupant charge,
  and the overnight-guest rate appear in the cost table rather than in fine print.
- **Numbers are the identity.** Buildings and rooms are shown by their real
  numbers, set large — the visual system is built on an 18-year-old numbering
  scheme, not on a logo.
- **Photography must be real Kostella images.** Stock photography is forbidden.
  People appear only in shared areas, never in rooms.

## Evidence on Hand

- **Source brief:** `project/uploads/brief-arahan-visual-kostella.md` — the full
  visual direction brief, in Indonesian.
- **Design system and four screen prototypes:** `project/` — a read-only handoff
  bundle exported from claude.ai/design. Tokens, components, and the Beranda,
  Pencarian, Detail, and Dashboard screens.
- **Logo:** `project/assets/kostella-logo.png` (243×124).
- **Implementation record:** `docs/superpowers/specs/` — what was built, which
  design-system rules it holds to, and where it knowingly departs from the
  prototypes.

**Absences that future work must not fabricate:**

- **The photographs are placeholders.** The five images in `public/images/` come
  from the handoff bundle and are not Kostella properties; two properties share
  one file. They must not be presented as the real buildings.
- **No social proof exists.** There are no testimonials, reviews, ratings, star
  counts, press mentions, or named customers. None may be invented.
- **Landmark distances are unverified.** "Central Park 0,2 km" from building 362
  is measurably wrong — the mall is roughly 1,5 km away — and was left off the
  walking-radius map for that reason. The distances stated in copy still need the
  owner's confirmation.
- **Room-level data exists for building 362 only.**

## Product Principles

1. **Lead with inventory, not atmosphere.** Where a competitor opens with a photo
   carousel, Kostella opens with what is actually free. The proof is the pitch.
2. **State the whole cost before it is asked for.** Every charge appears in one
   place, including the ones that are easier to leave out.
3. **One number, used everywhere.** A figure that appears on two screens must
   agree with itself, and must be derived rather than restated where possible.
4. **Availability is never communicated by colour alone.** Status always carries
   a word, and often a pattern as well.
5. **An empty result is an invitation, not a dead end.** Whenever the answer is
   "nothing", the interface says what to do instead — and offers the control that
   does it.

## Accessibility & Inclusion

No product-specific standard was established with the client. The implementation
targets WCAG 2.1 AA contrast and keyboard operability throughout, which the
audience justifies independently: parents are co-deciders and often older, and
this is a mobile-first market where the site will frequently be read outdoors on
a phone.
