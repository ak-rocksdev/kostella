# Management phase 1 — buildings & rooms

Date: 2026-08-01
Roadmap: `docs/management/ROADMAP.md`
Held to: `docs/management/GUIDELINES.md`
Source: `project/ui_kits/dashboard/Dashboard.jsx` (building switcher, floor grid)

## Goal

Build the data spine of the management panel and the first screen that reads
it: the list of buildings Kostella operates, and for a selected building, its
rooms and their states.

Every later phase points at a room — a tenant occupies one, a bill is raised
for one, a report aggregates them. Getting this record right first means the
rest attaches to something real instead of being invented alongside it.

## Scope

In scope:

- `lib/content/management/buildings.ts` — the building and room records, and
  the functions that derive counts from them.
- `/management/buildings` — list of buildings with per-building occupancy.
- `/management/buildings/[number]` — one building: floor grid, room table,
  and the actions the bundle's dashboard specifies (mark occupied, set price,
  block for maintenance).
- `BuildingSwitcher` — the `362 ▾` control from the design, usable from every
  management screen later.
- `MetricCard` — the one design-system primitive this phase needs that does not
  exist yet. Source: `project/components/core/MetricCard.jsx`.
- The management shell: header, navigation, and the prototype notice.
- Room state changes persisted to `localStorage` and reflected on the public
  screens.

Out of scope, and why:

- Tenants, bills, contracts, reports, owner view — later phases, each with its
  own spec.
- Authentication. There is no backend; a login form would imply one.
- Adding or deleting buildings. Kostella's 31 buildings are a fact of the
  business, not something managed from a pitch prototype.

## Data model

```ts
// lib/content/management/buildings.ts

export type RoomState = {
  room: string
  type: string          // Standard | Superior | Pojok
  rent: number          // rupiah per month, numeric so totals derive
  status: Status        // available | held | occupied — reused from public
  floor: string         // 'Lantai 1'
  blocked?: BlockReason // set when withdrawn from availability
}

export type BlockReason = { since: string; note: string }

export type Building = {
  number: string        // '362' — the real house number, the identity
  street: string
  area: string
  floors: string[]      // ordered top-down, matching the public floor grid
  rooms: RoomState[]
  placeholder?: true    // invented; see GUIDELINES > Figures
}
```

Derived, never stored — one function each, so no screen can disagree with
another:

```ts
occupancy(building)      // { occupied, held, available, blocked, total }
monthlyPotential(b)      // sum of rent across lettable rooms
monthlyBooked(b)         // sum of rent across occupied rooms
cheapestRent(b)
```

`Status` is imported from `lib/content/types.ts` — the same three values the
public floor grid and property cards already use. A fourth state is *not*
added for blocked rooms; `blocked` is a separate flag, because a blocked room
is still occupied-or-not underneath and conflating them would lose that.

### Sources

Building 362's rooms are the only ones the client has confirmed: types, rents
and room numbers are already in `lib/content/detail.ts` and are moved, not
retyped. Every other building's rooms are invented and carry `placeholder`.

Room 362/205's `held` status stays as data rather than being derived from a
booking, for the same reason it is data on the public side: what makes a room
"held" is a booking in progress, which these figures do not show.

## Screens

### `/management/buildings` — list

Four `MetricCard`s across the top, all derived from the building set:
buildings operated, rooms total, rooms free now, monthly booked vs potential.

Then one row per building: number as the marker badge, street, occupancy as a
fraction with the availability green, cheapest rent, and a link into it.

Sorted by vacancy descending — the building with rooms to fill is the one a
manager opens first. The current order in the source array is not meaningful
and must not be relied on. (*The search screen once claimed "urut jarak
terdekat" over an unsorted list.*)

### `/management/buildings/[number]` — one building

- `BuildingSwitcher` in the header, so moving between buildings never needs a
  trip back to the list.
- The **floor grid**, the same `FloorGrid` component the public detail page
  renders — not a copy. Blocked rooms get a hatched overlay and the word
  "diblokir"; status is never carried by colour alone.
- Selecting a room reveals its actions, exactly the three the bundle specifies:
  **Tandai terisi** · **Atur harga** · **Blokir untuk perbaikan**.
- A room table beneath: room, floor, type, rent, status, and — where blocked —
  since when and why.

### Actions

Each writes to `localStorage` under one key, and the public screens read it on
mount so a change made here shows there.

| Action | Effect |
|---|---|
| Tandai terisi / kosong | toggles `status` between occupied and available |
| Atur harga | sets `rent`; the public detail page and search results follow |
| Blokir untuk perbaikan | sets `blocked` with a date and note; the room leaves public availability but stays in the manager's count |

A blocked room disappearing from the public site while remaining visible to the
manager is the clearest single demonstration of why the two sides are one
system.

### Prototype notice

A single line in the management shell, always visible:

> Prototipe — perubahan tersimpan di browser ini saja.

Not a dismissible toast. A client who sees this screen must not leave believing
their data persists.

## Public side

`lib/content/beranda.ts`, `pencarian.ts` and `detail.ts` currently hold room
and building figures directly. They start reading the management records
instead, so there is one source of truth rather than two that agree by
coincidence.

This is the phase's main risk: it touches three shipped screens. Mitigated by
doing it as the last step, after the management screens read correctly, and by
verifying every public route before and after.

## Verification

Recorded in this file when the phase ships, not asserted in advance.

1. `npx tsc --noEmit`, `npm run lint`, `npm run build` clean.
2. Every derived figure cross-checked against the room records by hand once —
   occupancy, potential, booked, cheapest.
3. In the browser at 390px and 1440px: both management screens, plus `/`,
   `/pencarian` and `/detail` still correct.
4. The loop end to end: block a room in the panel, then load `/pencarian` in the
   same browser and confirm it is gone; unblock, confirm it returns.
5. Keyboard: the floor grid, the switcher and the room table all reachable and
   operable without a mouse, with visible focus.
6. Contrast measured on the blocked-room treatment and the status text.

## Invented in this phase

To be put to the client in one message, per GUIDELINES:

- Rooms, types and rents for every building except 362.
- The 31-building total is real (PRODUCT.md); the individual buildings beyond
  the Grogol cluster are not, and only a representative few are modelled.
- "Blokir untuk perbaikan" comes from the bundle's design. Whether Kostella
  actually withdraws rooms for maintenance, and what they call it, is unknown.
- Floor labels beyond 362's three are assumed.
