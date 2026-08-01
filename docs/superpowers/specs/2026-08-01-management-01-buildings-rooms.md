# Management phase 1 — buildings & rooms

Date: 2026-08-01
Revised: 2026-08-01 after self-review (see *Revision notes* at the end)
Roadmap: `docs/management/ROADMAP.md`
Held to: `docs/management/GUIDELINES.md`
Source: `project/ui_kits/dashboard/Dashboard.jsx` (building switcher, floor grid)

## Goal

Build the data spine of the management panel and the screens that read it: the
buildings Kostella operates, the rooms inside them, and a record of every
change anyone makes to either.

Every later phase points at a room — a tenant occupies one, a bill is raised
for one, a report aggregates them. Getting this record right first means the
rest attaches to something real instead of being invented alongside it.

**Every change is logged.** A kos operator with several buildings and several
managers needs to answer "who marked 211 occupied, and when" and "why is this
tenant's rent different from the quote". Those questions arrive as disputes,
after the fact, and are unanswerable unless the record was kept at the time.

## Scope

In scope:

- `lib/content/management/buildings.ts` — building and room records, and the
  functions that derive every count from them.
- `lib/management/store.ts` — the `localStorage` layer: schema version,
  changes, audit log, reset.
- `/management/buildings` — the buildings list with per-building occupancy.
- `/management/buildings/[number]` — one building: floor grid, room table,
  actions, and the selected room's own history.
- `/management/activity` — the audit log across all buildings, filterable.
- `BuildingSwitcher` — the `362 ▾` control from the design.
- `MetricCard` — the one design-system primitive this phase needs that does not
  exist yet. Source: `project/components/core/MetricCard.jsx`.
- The management shell: header, navigation, actor selector, prototype notice.
- Public screens read the same records, so a change here shows there.

Out of scope, and why:

- Tenants, bills, contracts, reports, owner view — later phases, each with its
  own spec.
- Authentication. There is no backend; a login form would imply one. The actor
  is chosen, not authenticated — see *Actor* below.
- Adding or deleting buildings. Kostella's 31 buildings are a fact of the
  business, not something managed from a pitch prototype.
- CSV export of the log. Exports belong with phase 5 (reports), where there
  will be more than one thing worth exporting.
- A separate page per room. The panel on the building page carries everything a
  room has; a route for it would be a click with nothing new behind it.

## Data model

```ts
// lib/content/management/buildings.ts

export type RoomState = {
  room: string          // '211'
  floor: string         // 'Lantai 2'
  type: string          // Standard | Superior | Pojok
  rent: number          // rupiah per month, numeric so totals derive
  status: Status        // available | held | occupied — reused from public
  /** Set when withdrawn from letting. Not a fourth status: a blocked room is
   *  still occupied-or-not underneath, and merging the two loses that. */
  blocked?: { since: string; note: string }
}

export type Building = {
  number: string        // '362' — the real house number, the identity
  street: string
  area: string
  floors: string[]      // ordered top-down, matching the public floor grid
  rooms: RoomState[]
  placeholder?: true    // invented; see GUIDELINES > Figures
}
```

### Occupancy, defined

Left ambiguous in the first draft — the same failure the guidelines warn about,
in the document that states the rule. Two readers would have produced two
numbers. Stated once here, implemented once, read everywhere:

```
total      = rooms.length
blocked    = rooms with `blocked` set
lettable   = total − blocked            ← the denominator
occupied   = status 'occupied' and not blocked
held       = status 'held' and not blocked      (booked, not yet moved in)
free       = status 'available' and not blocked
occupancy% = occupied / lettable
```

A **held** room is neither occupied nor free: it earns nothing yet and cannot
be offered. It is reported on its own, never folded into either side.

A **blocked** room leaves the denominator entirely. Counting a room under
repair against a manager's occupancy would penalise them for maintenance.

Derived, never stored — one function each, so no screen can disagree:

```ts
occupancy(building)     // the shape above
monthlyPotential(b)     // sum of rent across lettable rooms
monthlyBooked(b)        // sum of rent across occupied rooms
cheapestRent(b)         // across free rooms only
```

### Audit log

```ts
export type AuditEntry = {
  id: string
  at: string                // ISO timestamp, when it was recorded
  actor: string             // who — see Actor below
  building: string          // '362'
  room?: string             // absent for building-level changes
  action: 'status' | 'rent' | 'block' | 'unblock'
  from: string              // human-readable previous value
  to: string
  /** Required for `rent`, `block` and `unblock`. A price change without a
   *  stated reason is the one an auditor cannot resolve later. */
  note?: string
  /** For `status`: the date the change takes effect, which is not always
   *  today. Phase 4 bills from this, so it is captured now rather than
   *  retrofitted onto entries that no longer have it. */
  effectiveFrom?: string
}
```

Append-only. Entries are never edited or deleted; an incorrect change is
corrected by making another change, which is itself logged. That is what makes
it an audit trail rather than a status field with a date on it.

### Actor

There is no authentication, so there is no real user. The shell carries a
selector — *Anda masuk sebagai:* — over a short list of fictional roles
(`Pengelola 362`, `Pengelola Grogol`, `Kantor Pusat`), persisted in
`localStorage`.

This is honest about what it is and still makes the log mean something during a
demo: switch actor, make a change, and the log shows two different people
acting on the same building. That is the point an internal audit trail has to
make, and it cannot be made with a single anonymous user.

### Storage

```ts
const KEY = 'kostella.management.v1'
```

One key, one version. On load, an entry whose version does not match the
current one is **discarded, not migrated**, and the panel starts from the
seeded records.

Migrating prototype data is work that buys nothing; silently reading a stale
shape is how a demo breaks mid-presentation after a deploy. Discarding is loud,
predictable, and recoverable — which is the right trade for a prototype and the
wrong one for a real product, a distinction worth remembering when this stops
being a prototype.

`Atur ulang data demo` in the shell clears the key and reloads. Needed in
practice: without it, the second pitch of the day starts from whatever the
first one left behind.

### Sources

Building 362's rooms are the only ones the client has confirmed — types, rents
and room numbers already exist in `lib/content/detail.ts` and are **moved, not
retyped**. Every other building's rooms are invented and carry `placeholder`.

Room 362/205 stays `held` as data rather than being derived from a booking, for
the same reason it is data on the public side: what makes a room held is a
booking in progress, which these figures do not show.

## Screens

### `/management/buildings` — list

Four `MetricCard`s, every one derived: buildings operated · rooms total · rooms
free now · booked vs potential this month.

One row per building: number as the marker badge, street, occupancy as a
fraction in the availability green, held and blocked counts where non-zero,
cheapest free rent, link into the building.

Sorted by **free rooms descending** — the building with rooms to fill is the
one a manager opens first. The source array order is not meaningful and must
not be relied on. (*The search screen once claimed "urut jarak terdekat" over
an unsorted list.*)

### `/management/buildings/[number]` — one building

- `BuildingSwitcher` in the header, so moving between buildings never needs a
  trip back to the list.
- The **floor grid** — the same `FloorGrid` component the public detail page
  renders, not a copy. Blocked rooms get a hatched overlay and the word
  "diblokir"; status never depends on colour alone.
- Selecting a room opens a panel: its figures, the three actions, and **its
  last five changes** read straight from the audit log. A manager asking "why
  is this room still blocked" gets the answer without leaving the screen.
- A room table beneath: room, floor, type, rent, status, blocked-since.

### Actions

| Action | Captures | Logged as |
|---|---|---|
| Tandai terisi / kosong | effective date (defaults today) | `status`, with `effectiveFrom` |
| Atur harga | new rent, **reason (required)** | `rent`, from → to, with note |
| Blokir untuk perbaikan | **reason (required)**, since date | `block` |
| Buka blokir | **reason (required)** | `unblock` |

A required reason on price and block is the difference between a log that
answers questions and one that only records that something happened.

### `/management/activity` — audit log

Newest first. Each row: time, actor, building, room, what changed from → to,
and the note. Filterable by building and by action type.

Empty state names what will appear here rather than saying "no data" — the log
is empty on a fresh demo, which is exactly when a client is looking at it.

### Prototype notice

One line in the shell, always visible, not dismissible:

> Prototipe — perubahan tersimpan di browser ini saja.

A client must not leave this screen believing their data persists.

## Public side

`lib/content/beranda.ts`, `pencarian.ts` and `detail.ts` hold room and building
figures directly today. They start reading the management records instead, so
there is one source of truth rather than two that agree by coincidence.

This is the phase's main risk: it touches three shipped screens. Mitigated by
doing it last, after the management screens read correctly, and by verifying
every public route before and after.

A **blocked room vanishing from the public site while still counted by the
manager** is the single clearest demonstration that the two sides are one
system. Verify it explicitly.

## Verification

Recorded here when the phase ships, not asserted in advance.

1. `npx tsc --noEmit`, `npm run lint`, `npm run build` clean.
2. Every derived figure cross-checked by hand once against the room records —
   occupancy, held, blocked, potential, booked, cheapest. Specifically: a
   building with a blocked room shows a *higher* occupancy% than the same
   building with that room merely empty.
3. In the browser at 390px and 1440px: all three management screens, plus `/`,
   `/pencarian` and `/detail` still correct.
4. The loop end to end: block a room, load `/pencarian` in the same browser,
   confirm it is gone; unblock, confirm it returns; confirm both appear in the
   log with actor, timestamp and reason.
5. Change actor, make a second change, confirm the log distinguishes them.
6. Bump the schema version by hand with data present; confirm the panel resets
   cleanly instead of erroring.
7. `Atur ulang data demo` returns every screen to its seeded state.
8. Keyboard: floor grid, switcher, room panel, log filters all operable without
   a mouse, with visible focus.
9. Contrast measured on the blocked-room treatment and the status text.

## Invented in this phase

To be put to the client in one message, per GUIDELINES:

- Rooms, types and rents for every building except 362.
- The 31-building total is real (PRODUCT.md); the individual buildings beyond
  the Grogol cluster are not, and only a representative few are modelled.
- "Blokir untuk perbaikan" comes from the bundle's design. Whether Kostella
  withdraws rooms for maintenance, and what they call it, is unknown.
- Floor labels beyond 362's three.
- The actor list. Who actually operates this — one manager per building, one
  per area, or a central office — is unknown and changes who the log is for.
- Whether a rent change needs approval from anyone before it takes effect. The
  design has none, so this does not either, but for an operator with franchise
  partners that is a plausible requirement.

## Revision notes

The first draft was reviewed and found short in five places, recorded so the
same gaps are checked for in later phases:

1. **No audit trail at all** — three mutating actions and no record of who,
   when, or from what value. The client had to name it.
2. **Occupancy left undefined** with respect to blocked and held rooms — the
   exact failure `GUIDELINES.md` cites the mockup's "8/11" for, in the document
   that states the rule.
3. **No schema version on stored data**, so a deploy that changed the shape
   would have broken a demo already in progress.
4. **No way to reset the demo**, so a second pitch would start from the first
   one's leftovers.
5. **Actions captured no reason and no effective date**, while `blocked` alone
   captured both. Phase 4 bills from the effective date and would have had to
   retrofit it.
