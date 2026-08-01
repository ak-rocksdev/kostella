# Management phase 3 — tenants

Date: 2026-08-01
Roadmap: `docs/management/ROADMAP.md`
Held to: `docs/management/GUIDELINES.md`

**Second draft.** The first modelled a kos like an apartment lease — fixed
terms, expiry dates, a renewal button — and was rejected in review before any
code was written. What was wrong and what replaced it is in *Rejected in review*
at the end, because the reasoning is the useful part.

## Goal

The panel knows nineteen rooms are occupied and cannot name one person in any
of them. This phase makes occupancy a consequence of a tenant record.

Today, in `components/management/RoomActions.tsx`:

```ts
const next = room.status === 'occupied' ? 'available' : 'occupied'
```

A room is marked taken without saying who took it.

## How a kos actually works

Everything below follows from one fact, and the first draft got it wrong.

**A kos tenancy has no end date.** A tenant pays monthly and stays as long as
they keep paying. There is usually no signed term at all. What recurs is not the
agreement — it is the payment.

So the date a manager works from is the **due date**: move in on the 17th, pay
on the 17th of every month, indefinitely. That derives from the move-in date and
nothing else. It needs no renewal, no extension, and no upkeep.

```
movedIn: 17 Juni  →  jatuh tempo 17 Juli, 17 Agustus, 17 September, …
```

Clamped to the last day of shorter months, so a 31st move-in falls due on the
30th in November and the 28th in February.

Multi-month terms exist elsewhere in the market because they carry a discount.
Kostella offers none — confirmed 2026-08-01 — so they are not modelled. If that
changes, a commitment period is added then, for the reason that will actually
have caused it.

### The split with phase 4

| | Answers | Needs |
|---|---|---|
| **Phase 3** | "Sinta jatuh tempo 17 Agustus" | the move-in date |
| **Phase 4** | "Sinta belum bayar periode 17 Agt – 17 Sep" | payment records |

The due *date* is derivable now. Whether it was *paid* is billing.

## Room status is derived from tenants

```
room has a current tenant                     → occupied
no current tenant, someone moving in later    → held
neither                                       → available
```

`blocked` stays orthogonal, as phase 1 set it up.

**Invariant: a room has at most one current tenant.** Starting a tenancy on a
room that already has one is refused, unless the sitting tenant has given notice
and the new move-in falls after their leaving date. That exception is not an
edge case to tolerate — it is the most valuable state in the phase, and it is
covered below.

`setStatus` is removed. `RoomActions` and phase 1's seeded room statuses are
rewritten to follow.

### Only a person frees a room, never a date

A date passing must never return a room to the available pool.

If it did, a room whose occupant had not got round to leaving — or who changed
their mind, which is common — would show as free, and the next visitor would be
shown around it. Marking a room occupied when it is empty costs a month's rent,
and the manager notices on their next walk past the door. Marking it free while
somebody is asleep in it lets the same room twice.

Only the safe direction is automatic:

- A **booked** tenancy becomes current on its move-in date by itself.
- A **leaving date** frees nothing. It raises "seharusnya keluar hari ini —
  konfirmasi" and waits.

### Notice, and the replacement

The most useful thing a kos manager can know is that a room is about to come
free, because that is their lead time to fill it.

```
1 Agt   Sinta memberi tahu akan keluar 31 Agt   → leavingOn = 31 Agt
                                                  kamar TETAP terisi
        kamar boleh menerima penghuni masuk ≥ 1 Sep
20 Agt  Rian dicatat masuk 2 Sep                → terisi, dan ada pengganti
31 Agt  "Sinta seharusnya keluar hari ini"      → pengelola konfirmasi
                                                  endedOn = 31 Agt, kamar kosong
2 Sep   Rian jadi penghuni saat ini             → kamar terisi lagi
```

A tenant who changes their mind is one action away: notice is cancellable while
they are still there.

## The record

No status field. Status is computed from dates on every read, like occupancy.

```ts
export type Tenancy = {
  id: string
  building: string            // "362"
  room: string                // "211"

  /** Obviously fictional. GUIDELINES > Personal data — this repo is public. */
  name: string
  /** Masked, as surveys already store one: "0812 xxxx 3456". */
  phone: string

  /**
   * Guardian, and not optional.
   *
   * 362 is khusus putri and parents phone the manager — the seeded surveys
   * already carry "Orang tua calon penyewa B". A kos that cannot reach a
   * tenant's family in an emergency has a real problem, so the form requires
   * this rather than offering it.
   */
  guardianName: string
  guardianPhone: string

  /** "Mahasiswa Untar", "Karyawan". Kos let by this and are asked it. */
  occupation: string

  /** ISO date. The due date derives from this and only this, forever. */
  movedIn: string

  /**
   * What this tenant pays. NOT the room's rent.
   *
   * A room's `rent` is the asking price for whoever takes it next; raising it
   * must not silently re-price somebody already living there. `cheapestFree()`
   * already treats it that way for the public page — it only ever reads free
   * rooms.
   *
   * Whether Kostella raises rent on sitting tenants is unknown (2026-08-01).
   * The assumption is the safe one: it does not, unless a manager changes this
   * figure deliberately, which is its own logged action.
   */
  agreedRent: number

  /** Announced departure. Frees nothing on its own. */
  leavingOn?: string
  /** Confirmed departure. The room is free from this date. */
  endedOn?: string

  note?: string
}
```

### One figure this corrects

`monthlyBooked()` sums the *room's* rent for occupied rooms. It should sum what
the tenants actually agreed to pay. Until now those were the same number because
no tenant existed; from this phase they can differ, and the current sum answers
"what these rooms are advertised at" rather than "what is coming in".

The dashboard's "Terisi bulan ini" figure may therefore move. Expected, and
checked by hand in verification.

## Scope

In scope:

- `lib/content/management/tenancies.ts` — the record and 21 seeded tenants.
- Store actions, each writing to the same append-only audit log:
  `tenancy-start`, `tenancy-notice`, `tenancy-notice-cancel`, `tenancy-end`,
  `tenancy-rent`.
- Room status derived from tenants; `setStatus` removed.
- `/management/tenants`.
- Tenant actions on the building page's room panel.
- Two `attention.ts` rules: due soon, and a leaving date reached.
- Store `VERSION` 1 → 2, so anyone's local demo edits are discarded on first
  load. The existing version check already does this deliberately.

Out of scope, and why:

- **Billing.** Phase 4.
- **Deposit.** The client's instruction, and there is a contradiction to settle
  first: the public site says *"1× sewa dibayar di awal"* and *"0 biaya
  tersembunyi"* since the deposit row left the receipt, while the roadmap lists
  deposit as part of a contract. The panel will not charge what the site says
  does not exist.
- **Prepayment terms and discounts.** None offered, confirmed 2026-08-01.
- **Identity documents.** Real kos photograph a KTP. Public repository, no
  backend. Not even as a mock.
- **Two people to a room.** "Orang kedua" was removed from the receipt at the
  client's request.
- **Vehicle registration.** Real — buildings list "Parkir motor" — but nothing
  in this phase would act on it.

## Screens

### `/management/tenants`

Current tenants only. Past ones are not a second list: `RoomHistory` already
shows a room's audit entries and every action here writes one.

**Sorted by next due date, nearest first.** That ordering is why it gets opened
in the morning. Rows carrying a leaving date sort above everything with the
attention tone — a room about to come free is worth more than a payment that is
merely near.

Each row: name, building and room, occupation, since when, next due date with
days remaining, agreed rent. The guardian sits in the row's detail rather than
the row itself — it is wanted in an emergency, not while scanning.

Contact is **WhatsApp, not a phone call**. `wa.me` is how a kos manager reaches
a tenant in Indonesia; a `tel:` link would be the wrong verb. Numbers are
masked, so the link is inert in the prototype and says so.

Scoped by the same `Select` the dashboard uses.

### Building page — room panel

| Room | Actions |
|---|---|
| Available | Catat penghuni masuk |
| Held (moving in later) | Konfirmasi masuk lebih awal · Batalkan |
| Occupied | Catat pemberitahuan keluar · Ubah sewa penghuni · Catat keluar |
| Occupied, notice given | Catat keluar · Batalkan pemberitahuan |

`Catat penghuni masuk` requires name, phone, guardian name, guardian phone,
occupation, move-in date and rent. Rent is pre-filled from the room's asking
price. A room can no longer be marked occupied without all of it.

`Catat keluar` takes a date and a reason from a short list — pindah kerja,
lulus, pulang kampung, pindah kos, lainnya — with an optional note. A required
free-text box would be friction on something done dozens of times a year; a
list still answers the question an auditor asks.

The room's current tenant is shown wherever the room is, so the floor grid
answers "who is behind that door" without leaving the page.

### Dashboard

- **Jatuh tempo dalam ≤ 3 hari.** Three, not seven: nineteen tenants across a
  month put roughly two in a three-day window and four or five in a seven-day
  one. Two is a worklist; five every day is wallpaper. H-3 is also the usual
  reminder in a kos.
- **Leaving date reached, not confirmed.** Attention tone, sorted first.

The existing "N kamar dibooking, belum masuk" rule gains a name and a date —
"Rian masuk 4 Agustus" rather than a bare count.

## Seeded data

21 tenants, one per occupied and held room, matching what the records already
show: 19 occupied + 2 held.

**Dates are relative to whenever the panel is opened**, following the pattern
and the reasoning already in `surveys.ts`: *"A fixed date would leave the screen
empty the day after this was written, which is exactly when someone
demonstrates it."* Fixed dates here would be worse than empty — every tenant
would read as long overdue at the pitch.

The seed must produce, on any day it is opened:

- two or three due within three days, the rest spread across the month
- a range of tenure, from a few weeks to over two years
- one tenant with notice given and a leaving date this month
- **one room with notice given *and* a replacement already booked** — the state
  this phase exists to make visible
- two rooms held, matching the two the records already show
- at least one tenant whose agreed rent is below the room's asking price, so the
  distinction is visible rather than merely described

## Verification

1. `tsc`, `lint`, `build` clean.
2. Status is genuinely derived: recording a move-in flips the floor grid, the
   occupancy figures, `/pencarian` and Beranda with nothing setting a status.
3. A leaving date reached frees nothing. Confirmed by moving a seeded date into
   the past and checking the room stays occupied on all four surfaces.
4. Confirming the departure frees it, from the date given.
5. A second tenancy on an occupied room is refused; on a room with notice given,
   one starting after the leaving date is accepted.
6. Due dates land correctly for a 31st move-in in a 30-day and a 28-day month.
7. Occupancy and revenue cross-checked by hand; any movement in "Terisi bulan
   ini" traced to agreed rents.
8. Every action writes an audit entry with actor, timestamp and reason.
9. Contrast measured on new tones. Touch targets at 390px with the **viewport**
   resized, not the window — GUIDELINES records why.

### Results, 2026-08-02

All nine pass. Three findings the checks produced, all fixed:

**A replacement could vanish.** With a booked tenant's move-in date reached
while the tenant they follow had never been confirmed out, two tenancies were
current on one room and the screen showed only the first. The second person
simply disappeared. `canStart` prevents *creating* that through the UI, but not
a manager ignoring the "seharusnya sudah keluar" prompt for two days. Both are
now shown, on the room and in the attention list, as the conflict it is.

**A swallowed space.** The conflict warning read "Penghuni Dbelum dikonfirmasi
keluar" — JSX drops whitespace around an expression at a line break.

**Twenty-three controls under the 44px floor.** Every tenant row's building link
was a flex item, so block-level, at 20px. Each card now carries one "Buka kamar"
target instead. A fourth navigation destination also pushed "Aktivitas" behind a
sideways scroll at 390px.

Measured, not assumed:

| Check | Result |
|---|---|
| Occupancy unchanged by the rewrite | 19/30, held 2, per building identical |
| Revenue corrected to agreed rents | Rp 34,6 jt → **Rp 34,3 jt** |
| Move-in propagates to the public site | 362 went 2 → 1 kamar kosong on `/pencarian` |
| Leaving date frees a room | Never — occupied at +9, +11, +20, +60 days |
| Confirmed departure frees it | On the date given, not before: 63% → 50% at +6 |
| Due date, 31st move-in | 31 Jan · 28 Feb · 30 Nov · **29 Feb 2028** |
| Second tenancy on an occupied room | Refused; accepted after a leaving date |
| Audit entry | Building, room, sentence, time, actor, reason |
| Contrast, conflict tone | 5,06:1 at 13px semibold |
| Controls under 44px at 390px | None |
| Console, clock +47 days | No errors |

## Invented in this phase

- **21 people** — names, phones, guardians, occupations, move-in dates and
  agreed rents. Fictional; phones masked. Not claims Kostella has made.
- That a kos wants a three-day reminder, and that notice outranks it.
- That a guardian contact is required rather than optional.
- The move-out reason list.
- That rent is not raised on sitting tenants. The safe reading of an unknown;
  worth confirming with the client.

## Rejected in review

The first draft gave every tenancy a fixed term with an `endsOn` and an
`overdue` state, and gave the manager a **Perpanjang** button.

Nineteen tenants on monthly terms is **228 renewals a year** — roughly one
falling due every single day, and `overdue` lit permanently for anyone who
missed a couple. It reproduced, in a worse form, the mistake the same document
had just corrected in a thirty-day warning threshold: a signal that fires
constantly is not a signal.

The cause was conceptual, not arithmetic. It modelled a kos as an apartment
lease. Once the tenancy is open-ended and the due date derives from the move-in
date alone, the renewal disappears, `endsOn` disappears, `overdue` disappears,
and a button leaves the interface.

Four other findings from the same review, all fixed above:

- a room could match both "occupied" and "held" with no precedence rule — which
  is exactly the notice-plus-replacement case, the phase's best feature sitting
  in the spec as an ambiguity
- rent lived only on the room, so phase 4 would have billed two-year tenants at
  today's asking price
- no guardian contact, in a kos that is khusus putri
- the draft called `endsOn` derived in one paragraph and stored in the next
