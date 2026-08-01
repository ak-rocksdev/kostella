# Management phase 2 — daily dashboard

Date: 2026-08-01
Roadmap: `docs/management/ROADMAP.md`
Held to: `docs/management/GUIDELINES.md`
Source: `project/ui_kits/dashboard/Dashboard.jsx` — the one screen the handoff
bundle designs for the internal side.

## Goal

The screen a manager opens in the morning. `/management` currently redirects to
the buildings list; it becomes the answer to "what needs me today".

## Two problems the bundle's design does not anticipate

Both are stated here because resolving them means departing from the client's
mockup, and a departure should be arguable rather than quiet.

**It duplicates the building page.** The bundle's dashboard is scoped to one
building — switcher, floor grid, room actions — which is roughly seventy per
cent of `/management/buildings/[number]`, built in phase 1. The bundle was drawn
before that page existed. Building both as designed would give the panel two
screens that mostly do the same thing.

*Resolution.* The dashboard opens on **every building the manager covers**, and
keeps the bundle's switcher to narrow to one. Per-building depth — the floor
grid, photos, facilities — stays on the building page, one click away. The
dashboard answers "where do I go", the building page answers "what do I change".

**It shows bills, and there are none.** The bundle's dashboard carries a table
of rent due, tenants and penalties. Tenants are phase 3 and billing is phase 4.

*Resolution.* Phase 2 shows only what the records can support. Inventing a bills
table now and replacing it in phase 4 is the retrofit this project has already
paid for once — the effective date on a status change was nearly left out the
same way. The bills table lands on this screen in phase 4, when it can read real
records.

## Scope

In scope:

- `lib/content/management/surveys.ts` — the survey record, seeded.
- Survey actions in the store: confirm, complete, cancel, each logged.
- `/management` — the dashboard.
- `SurveyList` — today's viewings, with the actions the bundle specifies.
- `AttentionList` — what is not right across the portfolio.

Out of scope, and why:

- The bills table — phase 4, above.
- Creating a survey from the public site. `Jadwalkan survei` is the most
  prominent call to action on the public site and it goes nowhere, so wiring it
  to this record would close the loop the room grid already demonstrates. It is
  also a booking flow PRODUCT.md records as unconfirmed scope, so it is named
  here and not assumed.
- A date picker. The dashboard is today's; other days are a report.

## Surveys

```ts
export type SurveyStatus = 'baru' | 'dikonfirmasi' | 'selesai' | 'batal'

export type Survey = {
  id: string
  building: string
  /** The room they asked about, where they named one. */
  room?: string
  /** ISO datetime. The dashboard shows today's; the record keeps the rest. */
  at: string
  name: string
  /** Masked. See GUIDELINES > Personal data — this repository is public. */
  phone: string
  status: SurveyStatus
  note?: string
}
```

Names are obviously fictional and phone numbers are masked (`0812 xxxx 3456`).
The bundle's mockup carries "Nadia Putri — 0812 3456 7890" verbatim; that cannot
ship in a public repository.

Actions, each writing an audit entry like every other change:

| Action | From | To |
|---|---|---|
| Konfirmasi | baru | dikonfirmasi |
| Tandai selesai | dikonfirmasi | selesai |
| Batalkan (reason required) | any | batal |

A cancellation requires a reason for the same argument as a price change: it is
the entry someone asks about later.

## Screens

### `/management` — dashboard

**Today, dated.** The bundle puts the date in the header; it belongs to the
screen, since this is the only screen that is about today.

**Portfolio strip.** The same `PortfolioBar` the buildings list uses — buildings,
rooms, free, booked against potential. Reused rather than restated, so the two
screens cannot disagree.

**Survei hari ini.** Time, name, masked phone, which building and room, and the
action its status allows. Empty is the common case on a quiet day and says so.

**Perlu perhatian.** The screen's reason to exist. Derived, never stored:

- rooms blocked for maintenance, and since when
- buildings with no photographs — the public card falls back to a house number
- rooms held but not moved in
- buildings at zero occupancy

Each row links to where it is fixed. If nothing qualifies, the list says so
plainly rather than hiding — a manager needs to know the check ran.

**Aktivitas terakhir.** The five newest audit entries, reusing `describe()`.

### Building switcher

Present, as the bundle specifies, with an "every building" option that is the
default. Narrowing filters the surveys, the attention list and the strip.

## Verification

Run on 2026-08-01 against the built code. All seven pass.

1. `tsc`, `lint`, `build` clean.
2. Every figure cross-checked by hand against the records once.
3. The attention list is genuinely derived: block a room on the building page,
   confirm it appears here; unblock it, confirm it leaves.
4. Survey actions write audit entries with actor, time and reason.
5. Narrowing to one building filters all three sections.
6. Empty states for both lists, at 390 and 1440.
7. Touch targets measured, not assumed. Contrast measured on any new tone.

### Results

Blocking room 351/201 on the building page put it at the top of the attention
list with its reason, and moved the strip — free rooms 9 to 8, potential
Rp 53,8 jt to Rp 52,2 jt. Unblocking removes it. Nothing is stored.

Narrowing scope to Kostella Grogol 362 filtered all four sections at once:
strip to its own figures, surveys from four to two, attention to its one held
room, recent changes to its own entries.

Confirming a survey wrote `362/211 · Survei baru → dikonfirmasi` with actor and
timestamp, and the activity screen's type filter gained a "Survei" chip.

At 390px: no horizontal scroll, and **no interactive element under 44px**.
Contrast on the new tones — Baru 13,3:1, Dikonfirmasi 5,0:1, attention icon
5,1:1.

## Invented in this phase

- Every survey: names, times, phone numbers, which room was asked about.
- That surveys have these four states. Kostella's actual process — whether a
  viewing is confirmed by phone, whether no-shows are tracked — is unknown.
- The attention rules. Which of these a manager actually wants flagged, and
  what else they watch for daily, is the one question worth asking them about
  this screen.

## Addendum, 2026-08-01 — occupancy as a figure

Requested after the phase landed: an owner must be able to read occupancy as a
percentage *and* a count, per building and for the whole portfolio.

The audit found percentage on one screen only — the building detail card — and
no portfolio rate anywhere. The panel could say how full one building was and
not how full the business was.

Now, from one function (`portfolio().roomRate`, `occupancy().rate`), in three
places that cannot disagree:

| Where | Reads |
|---|---|
| `/management` strip | `63%` · 19 dari 30 kamar · 6 gedung |
| `/management` scoped to 362 | `63%` · 5 dari 8 kamar · 1 gedung |
| `/management/buildings` strip | `63%` · 19 dari 30 kamar yang bisa disewakan |
| Each building row | `63%` · dari 8 kamar, over its bar |
| Building detail card | `63%` · 5 dari 8 kamar yang bisa disewakan |

Denominator is **lettable** — total minus blocked — everywhere. When anything is
blocked the figure says so, because 29 lettable sitting beside 30 total
otherwise reads as a miscount.

### Cut rather than shipped

A second rate, revenue occupancy (`booked / potential`), and a line reading
"the empty rooms are the expensive ones". The test set before building it was
that it fire on plausible data. It never did:

```
sekarang                 63% kamar   64% pendapatan   selisih  −1
Setiabudi kosong total   53% kamar   52% pendapatan   selisih  +1
Dago kosong total        57% kamar   59% pendapatan   selisih  −2
```

Kos rents span 1,4 to 2,4 million, not an order of magnitude, so the two rates
track. The rupiah are still on every strip — as rupiah, which is what a decision
needs.

### Verified

Portfolio 19/30 cross-checked against the six buildings summed by hand.
Blocking 351/201 moved the strip to 66% · 19 dari 29 · 1 diblokir and the row to
60% · dari 5 kamar, both correct, and unblocking restored them. Contrast 17,9:1
on the percentage and 6,4:1 on the count. No horizontal scroll at 390px.

**Not shown: trend.** Nothing stores history, so there is no honest
month-on-month arrow. It arrives with phase 5, or not at all.
