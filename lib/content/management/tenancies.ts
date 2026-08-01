/**
 * Who lives in which room.
 *
 * A kos tenancy has **no end date**. The tenant pays monthly and stays while
 * they keep paying; there is usually no signed term at all. What recurs is the
 * payment, not the agreement. So the only date a manager works from is the
 * **due date**, and that derives from the move-in date and nothing else — move
 * in on the 17th, due on the 17th, indefinitely, with no renewal to remember.
 *
 * An earlier draft of this phase gave every tenancy a fixed term and a
 * "Perpanjang" button. Nineteen tenants on monthly terms is 228 renewals a
 * year, roughly one falling due every single day. See the phase 3 spec.
 *
 * Multi-month terms exist in this market because they carry a discount.
 * Kostella offers none (confirmed 2026-08-01), so none are modelled.
 *
 * EVERY RECORD BELOW IS INVENTED. Names are deliberately not name-shaped and
 * numbers are masked, because this repository is public. A real deployment
 * replaces the whole array; nothing derives from the names.
 */

import { addDays, addMonths, daysBetween, isoDate, parseDate } from '@/lib/dates'

export type Tenancy = {
  id: string
  building: string
  room: string

  /** Obviously fictional. GUIDELINES > Personal data. */
  name: string
  /** Masked, as surveys already store one. */
  phone: string

  /**
   * Guardian, and required rather than optional.
   *
   * 362, 360 and 7 are khusus putri, and parents phone the manager — the
   * seeded surveys already carry "Orang tua calon penyewa B". A kos that
   * cannot reach a tenant's family in an emergency has a real problem.
   *
   * CAUTION: invented, and worth asking about. A karyawan renting alone may
   * not want to give one, in which case this becomes optional.
   */
  guardianName: string
  guardianPhone: string

  /** "Mahasiswa Untar", "Karyawan swasta". Kos let by this and ask it. */
  occupation: string

  /** ISO date. The due date derives from this and only this, forever. */
  movedIn: string

  /**
   * What this tenant pays, which is not the room's rent.
   *
   * A room's `rent` is the asking price for whoever takes it next. Raising it
   * must not silently re-price somebody already living there — `cheapestFree()`
   * already reads it that way for the public page, looking only at free rooms.
   *
   * CAUTION: whether Kostella raises rent on sitting tenants is unknown. The
   * assumption here is the safe one — it does not, unless a manager changes
   * this figure deliberately, which is its own logged action.
   */
  agreedRent: number

  /** Announced departure. Frees nothing on its own. */
  leavingOn?: string
  /** Confirmed departure. The room is free from this date. */
  endedOn?: string

  note?: string
}

/* ── Derived ─────────────────────────────────────────────────────────────── */

/**
 * The next date this tenant owes rent, given today.
 *
 * The day-of-month comes from the move-in and is clamped to short months by
 * `addMonths`, so a tenant who moved in on the 31st is due on the 30th in
 * November and the 28th in February. A due date landing on today is today's,
 * not next month's.
 */
export function nextDue(tenancy: Tenancy, today: string): string {
  const day = parseDate(tenancy.movedIn).getDate()
  const t = parseDate(today)
  const thisMonth = addMonths(isoDate(new Date(t.getFullYear(), t.getMonth(), 1)), 0)
  const candidate = clampDay(thisMonth, day)
  return daysBetween(today, candidate) >= 0 ? candidate : clampDay(addMonths(thisMonth, 1), day)
}

/** Sets the day of a first-of-month date, clamped to that month's length. */
function clampDay(firstOfMonth: string, day: number): string {
  const d = parseDate(firstOfMonth)
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  return isoDate(new Date(d.getFullYear(), d.getMonth(), Math.min(day, last)))
}

export const daysUntilDue = (tenancy: Tenancy, today: string) =>
  daysBetween(today, nextDue(tenancy, today))

/**
 * Over, as of `today`.
 *
 * Only `endedOn` ends a tenancy — a confirmed departure. `leavingOn` is an
 * announcement and deliberately does nothing here: a room freed by a date
 * alone shows available while somebody is still living in it, and the next
 * visitor is shown around it. See the phase 3 spec.
 */
export const hasEnded = (tenancy: Tenancy, today: string) =>
  tenancy.endedOn !== undefined && daysBetween(tenancy.endedOn, today) >= 0

/** Living there now. */
export const isCurrent = (tenancy: Tenancy, today: string) =>
  !hasEnded(tenancy, today) && daysBetween(tenancy.movedIn, today) >= 0

/** Moving in later — the room is held for them. */
export const isIncoming = (tenancy: Tenancy, today: string) =>
  !hasEnded(tenancy, today) && daysBetween(tenancy.movedIn, today) < 0

/**
 * Everyone the records say is living in a room right now.
 *
 * Normally one. More than one means a replacement's move-in date arrived while
 * the tenant they were replacing had still not been confirmed out — a manager
 * who ignored the "seharusnya sudah keluar" prompt for a couple of days. Two
 * people are then booked into one room, which is a real conflict and gets
 * surfaced rather than quietly resolved: an earlier version returned the first
 * match and the replacement simply vanished from the screen.
 */
export const currentTenantsOf = (all: Tenancy[], building: string, room: string, today: string) =>
  all
    .filter((t) => t.building === building && t.room === room && isCurrent(t, today))
    // Earliest first, so the one actually sitting there leads.
    .sort((a, b) => daysBetween(b.movedIn, a.movedIn))

export const currentTenantOf = (all: Tenancy[], building: string, room: string, today: string) =>
  currentTenantsOf(all, building, room, today)[0]

export const incomingTenantOf = (all: Tenancy[], building: string, room: string, today: string) =>
  all.find((t) => t.building === building && t.room === room && isIncoming(t, today))

/** Announced a departure and still there. The manager's lead time to re-let. */
export const hasNotice = (tenancy: Tenancy, today: string) =>
  tenancy.leavingOn !== undefined && isCurrent(tenancy, today)

/**
 * Whether a tenancy may start on this room on this date.
 *
 * A room holds one current tenant. The exception is the whole point of the
 * phase: a tenant who has given notice can be followed by a replacement
 * booked for after they leave, which is how a kos fills a room without losing
 * a month.
 */
export function canStart(
  all: Tenancy[],
  building: string,
  room: string,
  movedIn: string,
  today: string,
): { ok: true } | { ok: false; reason: string } {
  const sitting = currentTenantOf(all, building, room, today)
  if (sitting) {
    if (!sitting.leavingOn) {
      return { ok: false, reason: `${sitting.name} masih menempati kamar ini` }
    }
    if (daysBetween(sitting.leavingOn, movedIn) <= 0) {
      return {
        ok: false,
        reason: `${sitting.name} baru keluar ${sitting.leavingOn}, tanggal masuk harus setelahnya`,
      }
    }
  }
  const booked = incomingTenantOf(all, building, room, today)
  if (booked) return { ok: false, reason: `${booked.name} sudah dijadwalkan masuk kamar ini` }
  return { ok: true }
}

/* ── Seed ────────────────────────────────────────────────────────────────── */

/**
 * Offsets, never dates — this module must not read the clock. A date computed
 * here would be baked into the static HTML at build time and disagree with the
 * browser on any later day. See `lib/management/today.ts`.
 *
 * `dueIn` places each tenant's monthly due date relative to today, and
 * `monthsHere` sets how long they have been in the building. Together they
 * give a move-in date that produces the intended due date on whatever day the
 * panel is opened.
 */
type Seed = {
  id: string
  building: string
  room: string
  name: string
  phone: string
  guardianName: string
  guardianPhone: string
  occupation: string
  /** Days from today until this tenant's next rent falls due. */
  dueIn: number
  /** How many whole months they have been here. */
  monthsHere: number
  agreedRent: number
  /** Days from today until they leave, for the one who has given notice. */
  leavingIn?: number
  /** Days from today until they move in. Set instead of dueIn/monthsHere. */
  movingInIn?: number
  note?: string
}

const SEED: Seed[] = [
  // ── 362 Grogol · khusus putri ──────────────────────────────────────────
  {
    id: 't1',
    building: '362',
    room: '304',
    name: 'Penghuni A',
    phone: '0812 xxxx 4417',
    guardianName: 'Orang tua Penghuni A',
    guardianPhone: '0813 xxxx 9002',
    occupation: 'Karyawan swasta',
    dueIn: 2,
    monthsHere: 26,
    // Below the room's Rp2.100.000 asking price: she has been here since the
    // rent was last raised, and raising it under a sitting tenant is exactly
    // what agreedRent exists to prevent.
    agreedRent: 1_950_000,
    note: 'Sewa mengikuti harga saat masuk, belum pernah disesuaikan',
  },
  {
    id: 't2',
    building: '362',
    room: '208',
    name: 'Penghuni C',
    phone: '0857 xxxx 1180',
    guardianName: 'Orang tua Penghuni C',
    guardianPhone: '0811 xxxx 7345',
    occupation: 'Mahasiswa Untar',
    dueIn: 12,
    monthsHere: 8,
    agreedRent: 1_950_000,
  },
  {
    id: 't3',
    building: '362',
    room: '212',
    name: 'Penghuni D',
    phone: '0878 xxxx 6620',
    guardianName: 'Orang tua Penghuni D',
    guardianPhone: '0812 xxxx 3391',
    occupation: 'Mahasiswa Trisakti',
    dueIn: 20,
    monthsHere: 14,
    agreedRent: 1_950_000,
    // Gives notice, and 't22' below is already booked to follow her.
    leavingIn: 10,
    note: 'Lulus, pulang ke Semarang',
  },
  {
    id: 't4',
    building: '362',
    room: '101',
    name: 'Penghuni E',
    phone: '0813 xxxx 8874',
    guardianName: 'Orang tua Penghuni E',
    guardianPhone: '0857 xxxx 2213',
    occupation: 'Mahasiswa Untar',
    dueIn: 1,
    monthsHere: 5,
    agreedRent: 1_650_000,
  },
  {
    id: 't5',
    building: '362',
    room: '107',
    name: 'Penghuni F',
    phone: '0811 xxxx 5508',
    guardianName: 'Orang tua Penghuni F',
    guardianPhone: '0812 xxxx 6647',
    occupation: 'Mahasiswa Trisakti',
    dueIn: 25,
    monthsHere: 3,
    agreedRent: 1_650_000,
  },

  // ── 351 Grogol · campur ────────────────────────────────────────────────
  {
    id: 't6',
    building: '351',
    room: '202',
    name: 'Penghuni G',
    phone: '0812 xxxx 3060',
    guardianName: 'Orang tua Penghuni G',
    guardianPhone: '0813 xxxx 1174',
    occupation: 'Karyawan swasta',
    dueIn: 7,
    monthsHere: 11,
    agreedRent: 1_550_000,
  },
  {
    id: 't7',
    building: '351',
    room: '101',
    name: 'Penghuni H',
    phone: '0857 xxxx 9925',
    guardianName: 'Orang tua Penghuni H',
    guardianPhone: '0811 xxxx 4402',
    occupation: 'Mahasiswa Untar',
    dueIn: 18,
    monthsHere: 2,
    agreedRent: 1_550_000,
  },
  {
    id: 't8',
    building: '351',
    room: '103',
    name: 'Penghuni I',
    phone: '0878 xxxx 2237',
    guardianName: 'Orang tua Penghuni I',
    guardianPhone: '0812 xxxx 8890',
    occupation: 'Karyawan swasta',
    dueIn: 28,
    monthsHere: 30,
    agreedRent: 1_500_000,
    note: 'Penghuni terlama di gedung ini',
  },

  // ── 360 Grogol · khusus putri ──────────────────────────────────────────
  {
    id: 't9',
    building: '360',
    room: '201',
    name: 'Penghuni J',
    phone: '0813 xxxx 7715',
    guardianName: 'Orang tua Penghuni J',
    guardianPhone: '0857 xxxx 5563',
    occupation: 'Mahasiswa Untar',
    dueIn: 3,
    monthsHere: 6,
    agreedRent: 1_650_000,
  },
  {
    id: 't10',
    building: '360',
    room: '101',
    name: 'Penghuni K',
    phone: '0811 xxxx 6041',
    guardianName: 'Orang tua Penghuni K',
    guardianPhone: '0812 xxxx 2298',
    occupation: 'Mahasiswa Trisakti',
    dueIn: 15,
    monthsHere: 1,
    agreedRent: 1_650_000,
  },
  {
    id: 't11',
    building: '360',
    room: '102',
    name: 'Penghuni L',
    phone: '0812 xxxx 4482',
    guardianName: 'Orang tua Penghuni L',
    guardianPhone: '0878 xxxx 3316',
    occupation: 'Karyawan swasta',
    dueIn: 22,
    monthsHere: 19,
    agreedRent: 1_650_000,
  },

  // ── 2A3 Grogol · campur ────────────────────────────────────────────────
  {
    id: 't12',
    building: '2A3',
    room: '101',
    name: 'Penghuni M',
    phone: '0857 xxxx 8823',
    guardianName: 'Orang tua Penghuni M',
    guardianPhone: '0811 xxxx 9074',
    occupation: 'Karyawan swasta',
    dueIn: 9,
    monthsHere: 4,
    agreedRent: 2_100_000,
  },
  {
    id: 't13',
    building: '2A3',
    room: '102',
    name: 'Penghuni N',
    phone: '0878 xxxx 1159',
    guardianName: 'Orang tua Penghuni N',
    guardianPhone: '0813 xxxx 6628',
    occupation: 'Karyawan swasta',
    dueIn: 27,
    monthsHere: 9,
    agreedRent: 2_100_000,
  },
  {
    id: 't14',
    building: '2A3',
    room: '103',
    name: 'Penghuni O',
    phone: '0811 xxxx 3390',
    guardianName: 'Orang tua Penghuni O',
    guardianPhone: '0812 xxxx 7741',
    occupation: 'Mahasiswa Untar',
    dueIn: 13,
    monthsHere: 16,
    agreedRent: 2_100_000,
  },

  // ── 18 Setiabudi · Jakarta Selatan, kawasan kantor ─────────────────────
  {
    id: 't15',
    building: '18',
    room: '201',
    name: 'Penghuni P',
    phone: '0812 xxxx 5502',
    guardianName: 'Orang tua Penghuni P',
    guardianPhone: '0857 xxxx 4419',
    occupation: 'Karyawan swasta',
    dueIn: 5,
    monthsHere: 7,
    agreedRent: 2_400_000,
  },
  {
    id: 't16',
    building: '18',
    room: '101',
    name: 'Penghuni Q',
    phone: '0813 xxxx 2264',
    guardianName: 'Orang tua Penghuni Q',
    guardianPhone: '0811 xxxx 8837',
    occupation: 'Karyawan swasta',
    dueIn: 24,
    monthsHere: 22,
    agreedRent: 2_000_000,
    note: 'Sewa mengikuti harga saat masuk',
  },
  {
    id: 't17',
    building: '18',
    room: '102',
    name: 'Penghuni R',
    phone: '0878 xxxx 7708',
    guardianName: 'Orang tua Penghuni R',
    guardianPhone: '0812 xxxx 1145',
    occupation: 'Karyawan swasta',
    dueIn: 11,
    monthsHere: 3,
    agreedRent: 2_100_000,
  },

  // ── 7 Dago · Bandung, khusus putri ─────────────────────────────────────
  {
    id: 't18',
    building: '7',
    room: '101',
    name: 'Penghuni T',
    phone: '0857 xxxx 6693',
    guardianName: 'Orang tua Penghuni T',
    guardianPhone: '0813 xxxx 3352',
    occupation: 'Mahasiswa ITB',
    dueIn: 17,
    monthsHere: 13,
    agreedRent: 1_400_000,
  },
  {
    id: 't19',
    building: '7',
    room: '102',
    name: 'Penghuni U',
    phone: '0811 xxxx 4426',
    guardianName: 'Orang tua Penghuni U',
    guardianPhone: '0878 xxxx 9985',
    occupation: 'Mahasiswa Unpad',
    dueIn: 6,
    monthsHere: 2,
    agreedRent: 1_400_000,
  },

  // ── Moving in later. These two are the rooms the records already hold. ──
  {
    id: 't20',
    building: '362',
    room: '205',
    name: 'Penghuni B',
    phone: '0812 xxxx 7734',
    guardianName: 'Orang tua Penghuni B',
    guardianPhone: '0857 xxxx 2201',
    occupation: 'Mahasiswa Untar',
    movingInIn: 4,
    dueIn: 0,
    monthsHere: 0,
    agreedRent: 1_950_000,
  },
  {
    id: 't21',
    building: '18',
    room: '103',
    name: 'Penghuni S',
    phone: '0813 xxxx 5580',
    guardianName: 'Orang tua Penghuni S',
    guardianPhone: '0811 xxxx 6612',
    occupation: 'Karyawan swasta',
    movingInIn: 9,
    dueIn: 0,
    monthsHere: 0,
    agreedRent: 2_100_000,
  },

  // ── The replacement. 362/212 is occupied AND has someone booked behind
  //    the notice above — the state this phase exists to make visible. ────
  {
    id: 't22',
    building: '362',
    room: '212',
    name: 'Penghuni V',
    phone: '0878 xxxx 3308',
    guardianName: 'Orang tua Penghuni V',
    guardianPhone: '0812 xxxx 9917',
    occupation: 'Mahasiswa Untar',
    movingInIn: 12,
    dueIn: 0,
    monthsHere: 0,
    agreedRent: 1_950_000,
    note: 'Menggantikan Penghuni D',
  },
]

/**
 * The seed resolved against a given day.
 *
 * Takes `today` rather than reading the clock, for the reason at the top of
 * `Seed`. Given the same day it returns the same records, so the store can
 * merge overrides onto it without surprises.
 */
export function seedTenancies(today: string): Tenancy[] {
  return SEED.map(({ dueIn, monthsHere, leavingIn, movingInIn, ...rest }) => {
    const movedIn =
      movingInIn !== undefined
        ? addDays(today, movingInIn)
        : // Walk the intended due date back by however many months they have
          // been here, which lands on the day-of-month that reproduces it.
          addMonths(addDays(today, dueIn), -Math.max(1, monthsHere))

    return {
      ...rest,
      movedIn,
      ...(leavingIn !== undefined ? { leavingOn: addDays(today, leavingIn) } : {}),
    }
  })
}
