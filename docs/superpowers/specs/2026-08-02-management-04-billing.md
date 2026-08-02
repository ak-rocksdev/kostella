# Management phase 4 — bills and payments

Date: 2026-08-02
Roadmap: `docs/management/ROADMAP.md`
Held to: `docs/management/GUIDELINES.md`

## Goal

Phase 3 answers *when* rent falls due. This answers *whether it came in* — and
keeps the answer against the tenant, so a room changing hands never merges two
people's financial histories.

The client's framing, 2026-08-02: payment history is kept **per tenant per room
they actually occupy**, so financial history and bills — electricity and other
facilities included — are traceable.

## What may be charged is already decided

Not by this spec. `receiptFor()` in `lib/content/detail.ts` commits Kostella, on
its own public pages, to exactly this:

| Line | | |
|---|---|---|
| Sewa bulanan | fixed | from the tenancy's `agreedRent` |
| Listrik | "dihitung terpisah" | a typed amount — see below |
| Tamu menginap | Rp 100.000 per malam | an event, not a monthly line |
| Parkir motor | gratis | never a line at all |

Beside a headline reading **"0 biaya tersembunyi"**.

So the panel may not offer a charge type the site never disclosed. A `lainnya`
line exists for the case the client names something missing, and it requires a
description for that reason — an unlabelled "other" charge is the hidden fee
that headline denies.

### Electricity, corrected 2026-08-02

**There is a meter per room, not per building.** So PLN invoices per room and
nothing is split — a tenant's electricity *is* their room's PLN invoice. The
question of a split rule, asked and half-answered twice, does not exist.

What is recorded is the rupiah, not the meter number. Kostella pays PLN
manually, so the record has to hold both directions of the same money:

```
Listrik kamar 362/212 · Agustus 2026
  Tagihan PLN            Rp 230.000   ← utang: Kostella → PLN
  Dibayar ke PLN         8 September
  Ditagihkan ke          Putri Maharani
  Dibayar penghuni       belum         ← piutang: penghuni → Kostella
```

A PLN API would replace the typing, not the shape: `jumlah, periode, kamar`
stays the same whether a manager types it or a feed fills it. Nothing here
needs rebuilding if one ever arrives.

**An empty room still owes PLN.** The meter is billed whether or not anyone
lives there, and there is nobody to charge. That cost is invisible today; here
it shows up on its own, as a PLN bill with no tenant against it. Nine rooms are
free across six buildings.

### Leaving mid-month

The client's case, and it decides where this lives: rent is paid in full for
the month regardless, but electricity has to be settled — *"pasti akan
ditagih"*.

The problem is not how but **when**. A tenant leaves on the 12th; August's PLN
invoice arrives on the 5th of September. By the time the amount is known the
person is gone, there is no deposit to hold it back from, and no next month's
rent to deduct it from. The money is lost.

So it belongs to **`Catat keluar`**, not to the monthly billing screen. The only
moment collection is certain is while they are still standing there.

The field is pre-filled with a pro-rata estimate from the last known bill —
`12/31 × Rp 214.000` — and can be overwritten, which is what a manager who read
the meter at handover will do. It is **not** mandatory: forcing it produces a
typed-in number that gets the form past, which is worse than an empty one. It is
prominent, and declining it is a logged choice with a reason.

**A room-month can therefore carry more than one tenant charge**, each covering
its own days. Ordinary months carry one, and a manager never sees the split
unless it happens.

When the real invoice arrives and the estimate was short, the difference is
Kostella's — too small to chase somebody who has moved out. It is shown rather
than absorbed silently.

## Periods are derived, not stored

The nineteen current tenants have **201 past billing periods** between them,
averaging eleven each. Storing a bill per period would mean 201 records before
anyone has done anything, growing by nineteen a month, all of them reconstructible
from a move-in date and an agreed rent.

So they are not stored. A tenancy's periods derive from `movedIn`, exactly as
its due dates already do, and each period carries a rent line derived from
`agreedRent`. **Only what a manager adds is stored**: extra lines, and payments.

```
periode      movedIn + n bulan, sampai hari ini      diturunkan
baris sewa   agreedRent                              diturunkan
baris lain   listrik, tamu menginap, denda           disimpan
pembayaran   tanggal, jumlah, cara                   disimpan
status       dihitung dari jumlah baris vs bayar     diturunkan
```

This is the rule the project has followed since phase 1 — every figure is
derived, never typed twice — applied to the largest record set yet. It also
means a manager who changes an agreed rent sees past bills recompute, which is
**wrong** and is handled: a stored payment freezes the amount it was made
against. See *Frozen once paid*.

## The records

Three stored types. Rent is not among them — it derives.

```ts
/** What PLN charged one room's meter for one calendar month, and whether
 *  Kostella has paid it. This is a payable: money leaving. */
export type PlnBill = {
  /** `362/212/2026-08` — one per room per month, so it cannot be duplicated. */
  id: string
  building: string
  room: string
  /** `2026-08`. */
  month: string
  amount: number
  /** When Kostella paid PLN. Absent means Kostella still owes it. */
  paidOn?: string
}

/** Anything charged to a tenant that is not their rent. A receivable. */
export type Charge = {
  id: string
  /** The tenancy, never the room — history follows the person. */
  tenancy: string
  kind: 'listrik' | 'tamu' | 'denda' | 'lainnya'
  /** `2026-08` for electricity; the period start for the rest. */
  period: string
  amount: number
  dueOn: string
  /**
   * Which days this covers, when it is not the whole month.
   *
   * Only set where somebody left mid-month, which is the one case a room-month
   * carries two charges. Ordinary months leave it empty and never show a split.
   */
  days?: { from: number; to: number }
  /** True where the amount was estimated at handover, before PLN invoiced. */
  estimated?: boolean
  /** Required for `lainnya`: an unlabelled charge is the hidden fee the public
   *  site says does not exist. */
  note?: string
}

export type Payment = {
  id: string
  /** The charge settled. Rent charges have derived ids — see `rentChargeId`. */
  charge: string
  /** ISO date received, not when it was typed in. */
  paidOn: string
  amount: number
  method: 'transfer' | 'tunai'
  note?: string
  /**
   * What the charge totalled when this payment was accepted.
   *
   * Frozen deliberately, and only rent needs it: rent derives from the
   * tenancy\'s agreed rent, so raising it would otherwise rewrite every past
   * bill. See below.
   */
  totalThen: number
}
```

Rent charges are derived and carry a deterministic id, `sewa:<tenancy>:<period>`,
so a payment can point at one without it being stored.

### Frozen once paid

A charge with no payment recomputes freely — that is the point of deriving it.
A charge with a payment keeps the total it had when the payment was taken.

Without this, `Ubah sewa penghuni` — an action phase 3 already ships — silently
turns two years of settled months into a shortfall. Not hypothetical: three
seeded tenants pay below their room\'s current asking price precisely because
rents have moved.

### Status, derived

```
belum bayar    tidak ada pembayaran, dan jatuh temponya belum lewat
terlambat      tidak ada pembayaran, jatuh temponya sudah lewat
kurang bayar   ada pembayaran, jumlahnya di bawah total
lunas          jumlah pembayaran ≥ total
```

`kurang bayar` requires a note on the payment, for the same reason a price
change does: it is the entry somebody asks about later.

## Scope

In scope:

- `lib/content/management/billing.ts` — the records, the period derivation, the
  status derivation, and seeded history for the nineteen current tenants.
- Store actions, each writing to the audit log: `bill-line-add`,
  `bill-line-remove`, `payment-add`, `payment-remove`.
- `/management/billing` — what is owed.
- A tenant's own history, on the room page beneath them.
- One attention rule: rent overdue.

Out of scope, and why:

- **Deposit.** Still unanswered, and the public site says the first payment is
  one month's rent and nothing else. One line item and one refund path when the
  answer comes.
- **Reminders.** Sending anything is phase 5 at the earliest; the panel shows
  who to contact and the manager uses WhatsApp, as it does now.
- **Receipts or invoices as documents.** Not prototype work.
- **What common areas cost.** Storing the building's PLN invoice would show it
  — real money, currently invisible — but it is analysis, and it was withdrawn
  on the client's "jangan terlalu kompleks". Raised again at phase 5.
- **Reports and trends.** Phase 5.

## Screens

### `/management/billing`

Ordered by how overdue, most overdue first — the same principle as the tenant
list, and for the same reason: it is opened to work, not to browse.

Each row: tenant, building and room, the period, what is owed against what was
paid, and the status. The action is **Catat pembayaran**, inline, because
unlike a move-out it needs only a date, an amount and a method — sending a
manager to another screen for three fields is the friction that ends in nothing
being recorded.

Scoped by the same `Select` as every other management screen.

Above it, the same shape as the tenant list: what needs doing today, then the
register. Empty says the check ran.

### Room page — the tenant's history

Beneath the tenant, their own periods newest first: period, total, paid,
status. This is the "per tenant per room" the client asked for, and it stays
with the tenant rather than the room — the previous occupant's months are on
*their* record, reachable from the audit log, not mixed into the next
occupant's.

`Tambah biaya` adds a line to the open period. Electricity is the common case
and gets a labelled option rather than being typed as `lainnya`.

### Dashboard

One rule joins `attention.ts`: **rent overdue**, at the top with the attention
tone. The existing `jatuh tempo ≤ 3 hari` rule stays — it is the reminder
before, this is the chase after.

## Seeded data

Every current tenant gets a settled history: each past period paid in full, on
or near its due date. Then three deliberate exceptions, so every status is
visible on the day it is demonstrated — a state that never appears cannot be
judged, which this project learned when the tenant list shipped with an urgency
scale nothing triggered:

- one **terlambat** — a period past due with nothing paid
- one **kurang bayar** — paid short, with the reason on the payment
- one with an **electricity line** large enough to be worth seeing

Amounts follow the same offsets-not-dates rule as phase 3, so the demo stays
coherent whenever it is opened.

## Verification

1. `tsc`, `lint`, `build` clean.
2. Periods derive correctly from a move-in, including a 31st across short
   months — the same clamping phase 3 already proves.
3. Raising a sitting tenant's rent does **not** turn settled months into
   arrears, and does change the open one.
4. Recording a payment moves the status, the dashboard rule and the billing
   list together.
5. A part payment reads `kurang bayar` and requires its reason.
6. A tenant's history stays with the tenant when the room changes hands:
   record a move-out and a new move-in on 362/212, and confirm the new tenant's
   history is empty while the old one's is intact in the log.
7. Every action writes an audit entry with actor, timestamp and reason.
8. Totals cross-checked by hand for one tenant across three periods.
9. Contrast on any new tone; targets at a real 390px viewport; no console
   errors with the clock weeks ahead.

## Invented in this phase

- **Where the electricity amount is entered.** The client said only the amount
  is typed; this spec puts it on the tenant's period, not on the building. If a
  manager would rather enter one figure per building and have it split, this is
  the wrong shape — worth confirming before it is built.
- That a kos pays **in advance**: a period beginning the 17th is due the 17th.
- The payment methods, and that a part payment must say why.
- Every seeded payment.
