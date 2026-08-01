# Management phase 3 — tenants & contracts

Date: 2026-08-01
Roadmap: `docs/management/ROADMAP.md`
Held to: `docs/management/GUIDELINES.md`
Decisions taken with the client's stand-in on 2026-08-01, recorded inline below.

## Goal

The panel knows nineteen rooms are occupied and cannot name a single person in
one of them. This phase makes a room's occupancy a consequence of a tenancy
record rather than a flag someone set.

Today, in `components/management/RoomActions.tsx`:

```ts
const next = room.status === 'occupied' ? 'available' : 'occupied'
```

A manager marks a room taken without saying who took it, when they arrived, or
until when. So the question a manager actually asks each morning — whose
agreement runs out this week — has no answer here.

## The structural decision

**Room status is derived from tenancies. It is no longer set directly.**

Chosen over the cheaper alternative, which was to hang a tenant record off a
room that already carried its own status. Two sources for one fact drift: a room
flagged occupied with nobody in it, a tenant attached to a room flagged free,
and nothing in the system objecting to either.

It also matches the rule this project has followed since phase 1 — every figure
is derived, never typed twice — and `store.ts` already anticipates it, carrying
`effectiveFrom` on status changes with the comment *"Phase 4 bills from this"*.
Billing needs to know **who** is being billed, not merely that a door is shut.

```
tenancy not ended, moved in already   → room occupied
tenancy not ended, moves in later     → room held
no tenancy                            → room available
```

`blocked` stays orthogonal, exactly as phase 1 set it up: a blocked room is
still occupied-or-not underneath.

**Cost, stated plainly.** `RoomActions`, `setStatus` and phase 1's seeded room
statuses are rewritten. Deferring it to phase 4 costs more, because billing
would then be built on the model that has to change.

### Moving out is an event, not a date

`endsOn` passing does **not** free the room.

This is the one place the obvious model is dangerous. If a contract's end date
silently returned the room to the available pool, a manager who had not yet got
round to renewing would see a free room and could let it to someone else while
its occupant was still living there.

So a contract that runs past its end date makes the tenancy **overdue** and
leaves the room occupied. The manager must say which happened: renew, or record
the move-out. Only `Catat keluar` frees the room, from the date it is given.

```
booked    movedIn is in the future
active    movedIn has passed, endsOn has not
overdue   endsOn has passed, neither renewed nor ended   ← room STAYS occupied
ended     a move-out was recorded                        ← room free from that date
```

The first three are derived from dates. `ended` is stored, because it is the
only one that reports something a person did.

**Why arrival and departure are not treated alike.** A booked tenancy becomes
active on its move-in date without anyone confirming it, while a contract's end
date frees nothing. That asymmetry is deliberate, and it follows from which
mistake costs more.

A tenant who fails to arrive leaves a room showing occupied when it is empty:
revenue lost, but the manager walks past the door and sees it. A room freed by
a date alone shows available while somebody is asleep in it, and the next
person is shown around it. The second error is the one worth engineering
against, so only the safe direction is automatic.

`Konfirmasi masuk` therefore exists for the tenant who arrives **early**: it
moves the move-in date to today. `Batalkan` handles the one who never arrives —
it ends the tenancy with a reason and returns the room, rather than deleting the
record, because the log is append-only and a booking that fell through is
something someone will ask about.

## Scope

In scope:

- `lib/content/management/tenancies.ts` — the record, seeded for all 21
  currently-occupied and held rooms.
- Store actions: `tenancy-start`, `tenancy-extend`, `tenancy-end`, each written
  to the same append-only audit log as every other change.
- Room status derived from tenancies, replacing `setStatus`.
- `/management/tenants` — the list.
- Tenant actions on the building page's room panel.
- Two new `attention.ts` rules: contract ending soon, and contract overdue.

Out of scope, and why:

- **Billing.** Phase 4. Rent owed, paid and short-paid needs its own records.
- **Deposit.** Left out on the client's instruction, 2026-08-01, and there is a
  contradiction to settle before it can be added: the public site states
  *"1× sewa dibayar di awal"* and *"0 biaya tersembunyi"* since the deposit row
  was removed from the receipt, while the roadmap lists deposit as part of a
  contract. Both cannot be true. The panel will not claim a charge the site says
  does not exist.
- **Identity documents.** Real kos operators photograph a KTP. This repository
  is public and has no backend. Not now, and not as a prototype.
- **Two people to a room.** The receipt's "Orang kedua" row was removed at the
  client's request, so one tenancy holds one room.
- **Contract PDFs.** Not prototype work.

## The record

Note what the record does **not** carry: a status field. Status is computed from
the dates on every read, the same way occupancy is. Storing it would be the
second source of truth this phase exists to remove.

```ts
export type TenancyStatus = 'booked' | 'active' | 'overdue' | 'ended'

export type Tenancy = {
  id: string
  building: string          // "362"
  room: string              // "211"
  /** Obviously fictional. See GUIDELINES > Personal data — this repo is public. */
  name: string
  /** Masked: "0812 xxxx 3456", matching how surveys already store one. */
  phone: string
  /** ISO date. */
  movedIn: string
  /** Whole months. 1 is the real case; the rest are input convenience. */
  months: number
  /** Derived from movedIn + months, never typed — an extension cannot produce
   *  an end date that disagrees with the duration that caused it. */
  endsOn: string
  /** Stored only when a move-out is recorded. Frees the room from this date. */
  endedOn?: string
  note?: string
}
```

`endsOn` is written into the record on every start and extension rather than
recomputed at read time, so the log can quote the figure that was true when the
change was made. It is still never typed by hand.

### Duration

Kostella lets monthly. The control defaults to **1 bulan** and offers 3, 6 and
12 plus a custom number of months, which is convenience at the point of entry
rather than a claim that Kostella sells those terms. If it turns out to be
monthly only, three options are deleted and nothing else moves.

## Screens

### `/management/tenants`

Current tenancies only — booked, active and overdue. Past ones are not a second
list: `RoomHistory` already shows a room's audit entries, and every start,
extension and move-out writes one, so a room's history is where somebody looks
for it.

**Sorted by contract end, nearest first.** That ordering is the reason to open
the page each morning; alphabetical or by-room would make it a filing cabinet.

Each row: name, building and room, moved-in date, ends-on date with days
remaining, and status. Masked phone with a `tel:` link, since calling is what a
manager does with this screen.

Scoped by the same `Select` the dashboard uses. Overdue rows sort above
everything and carry the attention tone.

Empty state names the check rather than the absence.

### Building page — room panel

Actions replace phase 1's single toggle:

| Room | Actions |
|---|---|
| Available | Catat penghuni masuk |
| Held (moving in later) | Konfirmasi masuk lebih awal · Batalkan |
| Occupied | Perpanjang kontrak · Catat keluar |
| Occupied, overdue | Perpanjang kontrak · Catat keluar, with the overdue notice |

`Catat penghuni masuk` opens a form: name, phone, move-in date, duration. A room
can no longer be marked occupied without all four.

`Catat keluar` asks for the date and a reason, for the same argument as a price
change: it is the entry someone asks about later.

The room's current tenant is shown wherever the room is, so a manager reading
the floor grid can see who is behind a door without leaving the page.

### Dashboard

Two rules join `attention.ts`:

- **Contract ending soon** — within **7 days**. Not 30: with monthly terms every
  tenant would qualify at once and the list would say nothing. Seven days
  produces a handful at a time, which is a worklist.
- **Contract overdue** — past its end date, neither renewed nor ended. Attention
  tone, sorted first.

The existing "N kamar dibooking, belum masuk" rule gains a name and a date, so
it reads "Dina masuk 4 Agustus" rather than a bare count.

## Verification

To be run against built code before this is called done.

1. `tsc`, `lint`, `build` clean.
2. Room status is genuinely derived: recording a move-in flips the public search
   result and the floor grid without anything setting a status.
3. A contract past its end date leaves the room occupied. Confirmed by moving a
   seeded date into the past and checking the room does not return to the
   available pool anywhere — panel, `/pencarian`, or Beranda.
4. `Catat keluar` with a future date keeps the room occupied until that date.
5. Every action writes an audit entry with actor, timestamp and reason.
6. Occupancy figures still cross-check by hand against the room records.
7. Contrast measured on any new tone; touch targets measured at 390px, with the
   viewport actually resized rather than the window — see GUIDELINES.

## Invented in this phase

- **21 people.** Names, phone numbers, move-in dates and contract durations for
  every occupied and held room. Names are obviously fictional and phones are
  masked. None of it is a claim Kostella has made.
- That a kos tenancy has these four states, and that a manager wants a
  seven-day warning. Both are guesses about how Kostella actually works.
- That `Catat keluar` requires a reason. Consistent with the rest of the panel,
  but nobody asked for it.
