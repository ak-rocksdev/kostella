/**
 * What is owed, and to whom.
 *
 * Money moves in two directions here and the records keep them apart, because
 * a screen that mixes them makes "Rp 2,4 juta" ambiguous:
 *
 *   penghuni → Kostella   sewa dan listrik      piutang
 *   Kostella → PLN        invoice per meteran   utang
 *
 * **Rent is derived, never stored.** The nineteen current tenants have over two
 * hundred past periods between them, every one reconstructible from a move-in
 * date and an agreed rent. Storing them would mean two hundred records before
 * anybody has done anything, growing by nineteen a month. Only what a manager
 * adds is stored: extra charges, and payments.
 *
 * That creates one hazard, handled below: rent derives from `agreedRent`, so
 * raising a sitting tenant's rent would rewrite settled months into arrears.
 * A payment freezes the total it was made against.
 *
 * EVERY RECORD BELOW IS INVENTED. Offsets, not dates — see `tenancies.ts`.
 */

import { addDays, addMonths, daysBetween, parseDate } from '@/lib/dates'
import { SEED_BUILDINGS } from './buildings'
import { isCurrent, type Tenancy } from './tenancies'

/* ── Records ─────────────────────────────────────────────────────────────── */

/**
 * What PLN charged one room's meter for one calendar month, and whether
 * Kostella has paid it.
 *
 * There is a meter per room, so PLN invoices per room and nothing is split — a
 * tenant's electricity *is* their room's invoice. What is recorded is the
 * rupiah, not the meter number.
 *
 * A PLN API would replace the typing, not this shape.
 */
export type PlnBill = {
  /** `362/212/2026-08`, so a room-month cannot be recorded twice. */
  id: string
  building: string
  room: string
  /** `2026-08`. */
  month: string
  amount: number
  /** When Kostella paid PLN. Absent means Kostella still owes it. */
  paidOn?: string
}

export type ChargeKind = 'sewa' | 'listrik' | 'tamu' | 'denda' | 'lainnya'

/** Anything a tenant owes. Rent ones are derived; the rest are stored. */
export type Charge = {
  id: string
  /** The tenancy, never the room — history follows the person. */
  tenancy: string
  kind: ChargeKind
  /** `2026-08` for electricity; the period's first day for rent. */
  period: string
  amount: number
  dueOn: string
  /**
   * The days covered, where it is not a whole month.
   *
   * Set only where somebody left mid-month — the one case a room-month carries
   * two charges. Ordinary months leave it empty and never show a split.
   */
  days?: { from: number; to: number }
  /** The amount was estimated at handover, before PLN invoiced. */
  estimated?: boolean
  /** Required for `lainnya`. An unlabelled charge is the hidden fee the public
   *  site says does not exist. */
  note?: string
}

export type Payment = {
  id: string
  /** The charge settled. Rent ids are derived — see `rentChargeId`. */
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
   * tenancy's agreed rent, so raising it would otherwise rewrite every past
   * bill and turn settled months into a shortfall. Three seeded tenants pay
   * below their room's asking price precisely because rents have moved.
   */
  totalThen: number
}

export const CHARGE_LABEL: Record<ChargeKind, string> = {
  sewa: 'Sewa',
  listrik: 'Listrik',
  tamu: 'Tamu menginap',
  denda: 'Denda',
  lainnya: 'Lainnya',
}

/* ── Periods ─────────────────────────────────────────────────────────────── */

/** `2026-08` for any date in that month. */
export const monthOf = (iso: string) => iso.slice(0, 7)

/** First day of a `2026-08`. */
export const monthStart = (month: string) => `${month}-01`

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

/** "Agustus 2026" */
export function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return `${MONTHS[m - 1]} ${y}`
}

/** Days in the calendar month `2026-08`. */
export function daysInMonthOf(month: string): number {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

/**
 * Every rent period this tenancy has reached, newest first.
 *
 * A kos pays in advance, so a period beginning on the 17th falls due on the
 * 17th. Periods run from the move-in anniversary, clamped to short months by
 * `addMonths` exactly as the due date already is.
 */
export function rentPeriods(tenancy: Tenancy, today: string): string[] {
  const out: string[] = []
  let start = tenancy.movedIn
  // Guard: a tenancy that has not begun has no periods.
  while (daysBetween(start, today) >= 0) {
    out.push(start)
    start = addMonths(start, 1)
    if (out.length > 600) break // 50 years; a seed error would otherwise hang
  }
  return out.reverse()
}

/** Deterministic, so a payment can point at a charge nothing stores. */
export const rentChargeId = (tenancy: string, period: string) => `sewa:${tenancy}:${period}`

/** The rent charge for one period, derived from the tenancy. */
export function rentCharge(tenancy: Tenancy, period: string): Charge {
  return {
    id: rentChargeId(tenancy.id, period),
    tenancy: tenancy.id,
    kind: 'sewa',
    period,
    amount: tenancy.agreedRent,
    dueOn: period,
  }
}

/* ── Status ──────────────────────────────────────────────────────────────── */

export type ChargeStatus = 'lunas' | 'kurang' | 'terlambat' | 'belum'

export type Settlement = {
  charge: Charge
  /** The frozen total where a payment exists, otherwise the live amount. */
  total: number
  paid: number
  outstanding: number
  status: ChargeStatus
  /** Days past due. Zero or negative where it is not yet due. */
  lateBy: number
  payments: Payment[]
}

export function settle(charge: Charge, payments: Payment[], today: string): Settlement {
  const mine = payments.filter((p) => p.charge === charge.id)
  // Frozen once paid: the earliest payment fixes what was owed, so a later
  // rent change cannot turn a settled month into arrears.
  const total = mine.length ? Math.min(...mine.map((p) => p.totalThen)) : charge.amount
  const paid = mine.reduce((n, p) => n + p.amount, 0)
  const outstanding = Math.max(0, total - paid)
  const lateBy = daysBetween(charge.dueOn, today)

  const status: ChargeStatus =
    paid >= total ? 'lunas' : paid > 0 ? 'kurang' : lateBy > 0 ? 'terlambat' : 'belum'

  return { charge, total, paid, outstanding, status, lateBy, payments: mine }
}

/* ── Electricity, as a sequence ──────────────────────────────────────────── */

/**
 * Where a room-month's electricity has got to.
 *
 * Four steps, in the order the money actually moves, because a manager's
 * question is never "what is the status" but "what is stuck". The label names
 * the step rather than a state, so no legend is needed.
 */
export type PowerStage =
  | 'belum-dicatat' // PLN has not invoiced, or nobody has entered it
  | 'utang-pln' // recorded, Kostella has not paid PLN
  | 'tanpa-penghuni' // paid, and there is nobody to charge — a cost, not a task
  | 'belum-ditagih' // Kostella paid, nothing charged to the tenant
  | 'menunggu-bayar' // charged, the tenant has not paid
  | 'selesai'

export const POWER_STAGE_LABEL: Record<PowerStage, string> = {
  'belum-dicatat': 'Belum dicatat',
  'utang-pln': 'Belum dibayar ke PLN',
  'tanpa-penghuni': 'Kamar kosong',
  'belum-ditagih': 'Belum ditagihkan',
  'menunggu-bayar': 'Menunggu bayar penghuni',
  selesai: 'Selesai',
}

export type PowerMonth = {
  building: string
  room: string
  month: string
  bill?: PlnBill
  /** Usually one. Two where somebody left mid-month. */
  charges: Charge[]
  chargedTotal: number
  /** PLN's figure minus what was charged on. Positive means Kostella absorbs
   *  it — an empty room, or a share nobody was billed for. */
  gap: number
  stage: PowerStage
}

export function powerMonth(
  building: string,
  room: string,
  month: string,
  bills: PlnBill[],
  charges: Charge[],
  payments: Payment[],
  tenancies: Tenancy[],
  today: string,
): PowerMonth {
  const bill = bills.find((b) => b.id === plnBillId(building, room, month))
  const inRoom = new Set(
    tenancies.filter((t) => t.building === building && t.room === room).map((t) => t.id),
  )
  const mine = charges.filter(
    (c) => c.kind === 'listrik' && c.period === month && inRoom.has(c.tenancy),
  )
  const chargedTotal = mine.reduce((n, c) => n + c.amount, 0)
  const allPaid =
    mine.length > 0 && mine.every((c) => settle(c, payments, today).status === 'lunas')

  /* An empty room is not a pending task. Labelling it "belum ditagihkan" says
     somebody forgot to bill; there is nobody to bill, and the money is simply
     Kostella's. Saying so is the whole reason the PLN side is recorded. */
  const occupied = tenancies.some(
    (t) => t.building === building && t.room === room && isCurrent(t, today),
  )

  const stage: PowerStage = !bill
    ? 'belum-dicatat'
    : !bill.paidOn
      ? 'utang-pln'
      : mine.length === 0
        ? occupied
          ? 'belum-ditagih'
          : 'tanpa-penghuni'
        : allPaid
          ? 'selesai'
          : 'menunggu-bayar'

  return {
    building,
    room,
    month,
    bill,
    charges: mine,
    chargedTotal,
    gap: (bill?.amount ?? 0) - chargedTotal,
    stage,
  }
}

export const plnBillId = (building: string, room: string, month: string) =>
  `${building}/${room}/${month}`

/**
 * What to charge somebody leaving part-way through a month.
 *
 * Pro-rata from their last known bill, because PLN has not invoiced this month
 * yet and will not until after they have gone. A manager who read the meter at
 * handover types the real figure over it; this exists so nobody is doing
 * arithmetic in their head at the door.
 *
 * Returns null where there is no previous bill to work from — a tenant leaving
 * in their first month — because a guess from nothing is worse than an empty
 * field a manager fills deliberately.
 */
export function estimatePower(
  building: string,
  room: string,
  leavingOn: string,
  bills: PlnBill[],
): { amount: number; basis: PlnBill; days: number } | null {
  const month = monthOf(leavingOn)
  const previous = bills
    .filter((b) => b.building === building && b.room === room && b.month < month)
    .sort((a, b) => b.month.localeCompare(a.month))[0]
  if (!previous) return null

  const days = parseDate(leavingOn).getDate()
  const amount = Math.round((previous.amount * days) / daysInMonthOf(month) / 1000) * 1000
  return { amount, basis: previous, days }
}

/* ── Seed ────────────────────────────────────────────────────────────────── */

/**
 * A settled history for everyone, with three deliberate exceptions so every
 * status is visible on the day this is demonstrated.
 *
 * A state that never appears cannot be judged — the tenant list shipped an
 * urgency scale nothing triggered, one phase ago.
 */
export function seedBilling(
  tenancies: Tenancy[],
  today: string,
): { bills: PlnBill[]; charges: Charge[]; payments: Payment[] } {
  const bills: PlnBill[] = []
  const charges: Charge[] = []
  const payments: Payment[] = []
  const living = tenancies.filter((t) => isCurrent(t, today))

  // Rooms that demonstrate a state rather than the happy path.
  const LATE = living[0]?.id // rent unpaid and past due
  const SHORT = living[1]?.id // paid part of the rent
  const OWED_TO_PLN = living[2] // recorded, Kostella has not paid PLN

  let n = 0
  const id = (p: string) => `${p}-seed-${(n += 1)}`

  for (const t of living) {
    const periods = rentPeriods(t, today)

    periods.forEach((period, index) => {
      const isOpen = index === 0

      /* Rent. Every closed period settled, on or about its due date. The open
         one is left for the exceptions below to shape. */
      if (!isOpen) {
        payments.push({
          id: id('pay'),
          charge: rentChargeId(t.id, period),
          paidOn: addDays(period, index % 3),
          amount: t.agreedRent,
          method: index % 4 === 0 ? 'tunai' : 'transfer',
          totalThen: t.agreedRent,
        })
      } else if (t.id === SHORT) {
        payments.push({
          id: id('pay'),
          charge: rentChargeId(t.id, period),
          paidOn: addDays(period, 1),
          amount: Math.round(t.agreedRent / 2 / 1000) * 1000,
          method: 'transfer',
          note: 'Dibayar sebagian, sisanya menyusul gajian',
          totalThen: t.agreedRent,
        })
      } else if (t.id !== LATE) {
        payments.push({
          id: id('pay'),
          charge: rentChargeId(t.id, period),
          paidOn: period,
          amount: t.agreedRent,
          method: 'transfer',
          totalThen: t.agreedRent,
        })
      }
    })

    /* Electricity, for the three calendar months behind the current one. PLN
       has not invoiced the current month yet, which is the ordinary state and
       the reason the billing screen has anything to show. */
    for (let back = 1; back <= 3; back += 1) {
      const month = monthOf(addMonths(monthStart(monthOf(today)), -back))
      if (daysBetween(t.movedIn, `${month}-28`) < 0) continue

      const amount = 140_000 + ((n * 17) % 12) * 8_000
      const bill: PlnBill = {
        id: plnBillId(t.building, t.room, month),
        building: t.building,
        room: t.room,
        month,
        amount,
        // One building's most recent month is recorded but unpaid, so the
        // payable side of the screen has something on it.
        paidOn: back === 1 && t.id === OWED_TO_PLN?.id ? undefined : addDays(`${month}-28`, 8),
      }
      if (!bills.some((b) => b.id === bill.id)) bills.push(bill)

      if (bill.paidOn) {
        const charge: Charge = {
          id: id('chg'),
          tenancy: t.id,
          kind: 'listrik',
          period: month,
          amount,
          dueOn: addDays(`${month}-28`, 10),
        }
        charges.push(charge)
        // All settled except the most recent month, which is the work.
        if (back > 1) {
          payments.push({
            id: id('pay'),
            charge: charge.id,
            paidOn: addDays(charge.dueOn, 1),
            amount,
            method: 'transfer',
            totalThen: amount,
          })
        }
      }
    }
  }

  /* Two states the happy path never reaches, and both are the point of
     recording the PLN side at all. */

  // Paid to PLN, never charged on. The gap column exists to catch this: it is
  // money Kostella spent and simply forgot to bill.
  const forgotten = living[3]
  if (forgotten) {
    const month = monthOf(addMonths(monthStart(monthOf(today)), -1))
    const bill = bills.find(
      (b) => b.building === forgotten.building && b.room === forgotten.room && b.month === month,
    )
    if (bill) {
      const i = charges.findIndex(
        (c) => c.tenancy === forgotten.id && c.kind === 'listrik' && c.period === month,
      )
      if (i >= 0) charges.splice(i, 1)
    }
  }

  // Empty rooms. The meter runs whether or not anyone lives there and there is
  // nobody to charge — a cost that is invisible today and shows here on its own.
  const taken = new Set(living.map((t) => `${t.building}/${t.room}`))
  for (const b of SEED_BUILDINGS) {
    for (const room of b.rooms) {
      if (taken.has(`${b.number}/${room.room}`)) continue
      const month = monthOf(addMonths(monthStart(monthOf(today)), -1))
      const bill: PlnBill = {
        id: plnBillId(b.number, room.room, month),
        building: b.number,
        room: room.room,
        month,
        // Lower than an occupied room: a fridge left running, a corridor light.
        amount: 40_000 + ((n += 1) % 5) * 6_000,
        paidOn: addDays(`${month}-28`, 8),
      }
      if (!bills.some((x) => x.id === bill.id)) bills.push(bill)
    }
  }

  return { bills, charges, payments }
}
