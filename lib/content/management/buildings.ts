/**
 * Buildings, rooms, and everything derived from them.
 *
 * This is the spine of the management panel and, from phase 1 on, of the public
 * screens too. A tenant occupies a room, a bill is raised for a room, a report
 * aggregates rooms — so this record has to be right before anything attaches to
 * it.
 *
 * Nothing here is a display string. Rents are numbers, statuses are enums,
 * facilities are ids. Labels are derived at the edge, which is what stops two
 * screens stating the same fact differently.
 */
import type { Status } from '../types'

/* ── Facilities ───────────────────────────────────────────────────────────
   A fixed list, stored by id. Not tidiness: `facilityFacet` on the search
   screen groups its filter chips with `new Set(...)`, which matches by exact
   string. Free text would let "WiFi" and "Wifi" become two chips, each
   matching half the buildings, with no error raised anywhere.

   Adding a genuinely new facility is a code change. That friction is correct
   for something that reshapes a public filter.

   CAUTION: these six were reverse-engineered from the public data. What
   Kostella actually offers and advertises is unconfirmed, and this is the list
   a renter filters on. */
export const FACILITIES = [
  { id: 'kamar-mandi-dalam', label: 'Kamar mandi dalam' },
  { id: 'ac', label: 'AC' },
  { id: 'wifi', label: 'Wifi' },
  { id: 'dapur-bersama', label: 'Dapur bersama' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'parkir-motor', label: 'Parkir motor' },
] as const

export type FacilityId = (typeof FACILITIES)[number]['id']

export const facilityLabel = (id: FacilityId) =>
  FACILITIES.find((f) => f.id === id)?.label ?? id

/* ── Tenancy ──────────────────────────────────────────────────────────────
   One id, two labels. Beranda used to store "Khusus putri" while the search
   screen stored "putri" — one fact in two shapes, free to drift. */
export type TenancyId = 'putri' | 'putra' | 'campur'

/** On a card, where it reads as a sentence about the building. */
export const tenancyLabel: Record<TenancyId, string> = {
  putri: 'Khusus putri',
  putra: 'Khusus putra',
  campur: 'Campur',
}

/** In a filter, where the group's legend already supplies "tipe penghuni". */
export const tenancyShort: Record<TenancyId, string> = {
  putri: 'Putri',
  putra: 'Putra',
  campur: 'Campur',
}

/* ── Records ──────────────────────────────────────────────────────────────*/

export type Blocked = {
  /** ISO date the room was withdrawn. */
  since: string
  note: string
}

export type RoomState = {
  room: string
  floor: string
  type: string
  /** Rupiah per month. Numeric so every total derives rather than being typed. */
  rent: number
  status: Status
  /**
   * Withdrawn from letting. Deliberately not a fourth status: a blocked room
   * is still occupied-or-not underneath, and merging the two loses that.
   */
  blocked?: Blocked
}

export type Building = {
  /** The real house number. Kostella names buildings by number, never by name. */
  number: string
  street: string
  area: string
  /** Top floor first, so the grid reads like a building elevation. */
  floors: string[]
  rooms: RoomState[]
  facilities: FacilityId[]
  tenancy: TenancyId
  /**
   * INVENTED — address, rents, room list and facilities are all mine, not
   * Kostella's. Delete the whole record to remove it; every figure on every
   * screen is derived, so nothing else needs touching.
   */
  placeholder?: true
}

/* ── Seed ─────────────────────────────────────────────────────────────────*/

/**
 * 362 is the only building the client has confirmed. Its rooms, types and
 * rents come from the brief and were previously in `lib/content/detail.ts`;
 * they are moved here rather than retyped, so there is one copy.
 *
 * 205 stays `held` as data rather than being derived from a booking, for the
 * same reason it is data on the public side: what makes a room held is a
 * booking in progress, which these figures do not show.
 */
const KOSTELLA_362: Building = {
  number: '362',
  street: 'Jl. Dr. Susilo 2 No. 362',
  area: 'Grogol, Jakarta Barat',
  floors: ['Lantai 3', 'Lantai 2', 'Lantai 1'],
  facilities: ['kamar-mandi-dalam', 'ac', 'wifi'],
  tenancy: 'putri',
  rooms: [
    { room: '304', floor: 'Lantai 3', type: 'Pojok', rent: 2_100_000, status: 'occupied' },
    { room: '205', floor: 'Lantai 2', type: 'Superior', rent: 1_950_000, status: 'held' },
    { room: '208', floor: 'Lantai 2', type: 'Superior', rent: 1_950_000, status: 'occupied' },
    { room: '211', floor: 'Lantai 2', type: 'Standard', rent: 1_650_000, status: 'available' },
    { room: '212', floor: 'Lantai 2', type: 'Superior', rent: 1_950_000, status: 'occupied' },
    { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000, status: 'occupied' },
    { room: '105', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000, status: 'available' },
    { room: '107', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000, status: 'occupied' },
  ],
}

/* ══════════════════════════════════════════════════════════════════════════
   EVERYTHING BELOW IS INVENTED. DELETE BEFORE THIS REACHES ANYONE REAL.

   Kostella operates 31 buildings and has named one in detail. These three are
   modelled so the panel has more than a single row to manage and so the
   building switcher does something. Addresses, rents, room lists, facilities
   and tenancy are all mine.
   ══════════════════════════════════════════════════════════════════════════ */
const PLACEHOLDERS: Building[] = [
  {
    number: '351',
    street: 'Jl. Dr. Susilo 2 No. 351',
    area: 'Grogol, Jakarta Barat',
    floors: ['Lantai 2', 'Lantai 1'],
    facilities: ['kamar-mandi-dalam', 'ac', 'dapur-bersama'],
    tenancy: 'campur',
    placeholder: true,
    rooms: [
      { room: '201', floor: 'Lantai 2', type: 'Standard', rent: 1_550_000, status: 'available' },
      { room: '202', floor: 'Lantai 2', type: 'Standard', rent: 1_550_000, status: 'occupied' },
      { room: '203', floor: 'Lantai 2', type: 'Superior', rent: 1_850_000, status: 'available' },
      { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 1_550_000, status: 'occupied' },
      { room: '102', floor: 'Lantai 1', type: 'Standard', rent: 1_550_000, status: 'available' },
      { room: '103', floor: 'Lantai 1', type: 'Standard', rent: 1_550_000, status: 'occupied' },
    ],
  },
  {
    number: '360',
    street: 'Jl. Dr. Susilo 2 No. 360',
    area: 'Grogol, Jakarta Barat',
    floors: ['Lantai 2', 'Lantai 1'],
    facilities: ['ac', 'wifi', 'laundry'],
    tenancy: 'putri',
    placeholder: true,
    rooms: [
      { room: '201', floor: 'Lantai 2', type: 'Standard', rent: 1_650_000, status: 'occupied' },
      { room: '202', floor: 'Lantai 2', type: 'Standard', rent: 1_650_000, status: 'available' },
      { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000, status: 'occupied' },
      { room: '102', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000, status: 'occupied' },
    ],
  },
  {
    number: '2A3',
    street: 'Jl. Dr. Susilo 2A No. 3',
    area: 'Grogol, Jakarta Barat',
    floors: ['Lantai 1'],
    facilities: ['kamar-mandi-dalam', 'ac', 'parkir-motor'],
    tenancy: 'campur',
    placeholder: true,
    rooms: [
      { room: '101', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000, status: 'occupied' },
      { room: '102', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000, status: 'occupied' },
      { room: '103', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000, status: 'occupied' },
    ],
  },
]

export const buildings: Building[] = [KOSTELLA_362, ...PLACEHOLDERS]

export const findBuilding = (number: string) => buildings.find((b) => b.number === number)

/* ── Derived ──────────────────────────────────────────────────────────────
   Every count on every screen comes from here. Nothing stores a total.

   The definitions matter and were ambiguous in the spec's first draft, which
   is how the design bundle's own mockup ended up claiming "Okupansi 8/11" over
   a grid of eight rooms with five occupied. */

export type Occupancy = {
  total: number
  /** Withdrawn for maintenance. Outside the denominator entirely: counting a
   *  room under repair against a manager would penalise them for fixing it. */
  blocked: number
  /** total − blocked. The denominator. */
  lettable: number
  occupied: number
  /** Booked but not moved in. Neither occupied nor free — it earns nothing yet
   *  and cannot be offered, so it is reported on its own. */
  held: number
  free: number
  /** occupied / lettable, 0–1. Zero when nothing is lettable. */
  rate: number
}

export function occupancy(building: Building): Occupancy {
  const live = building.rooms.filter((r) => !r.blocked)
  const blocked = building.rooms.length - live.length
  const occupied = live.filter((r) => r.status === 'occupied').length

  return {
    total: building.rooms.length,
    blocked,
    lettable: live.length,
    occupied,
    held: live.filter((r) => r.status === 'held').length,
    free: live.filter((r) => r.status === 'available').length,
    rate: live.length ? occupied / live.length : 0,
  }
}

/** What the building would earn with every lettable room occupied. */
export const monthlyPotential = (b: Building) =>
  b.rooms.filter((r) => !r.blocked).reduce((sum, r) => sum + r.rent, 0)

/** What it earns as things stand. Held rooms are excluded — nobody is paying. */
export const monthlyBooked = (b: Building) =>
  b.rooms
    .filter((r) => !r.blocked && r.status === 'occupied')
    .reduce((sum, r) => sum + r.rent, 0)

/** Cheapest room a visitor could actually take. Null when none is free. */
export function cheapestFree(b: Building): number | null {
  const free = b.rooms.filter((r) => !r.blocked && r.status === 'available')
  return free.length ? Math.min(...free.map((r) => r.rent)) : null
}

/** Across the whole portfolio, for the buildings-list metrics. */
export function portfolio(all: Building[]) {
  const each = all.map(occupancy)
  return {
    buildings: all.length,
    rooms: each.reduce((n, o) => n + o.total, 0),
    free: each.reduce((n, o) => n + o.free, 0),
    held: each.reduce((n, o) => n + o.held, 0),
    blocked: each.reduce((n, o) => n + o.blocked, 0),
    booked: all.reduce((n, b) => n + monthlyBooked(b), 0),
    potential: all.reduce((n, b) => n + monthlyPotential(b), 0),
  }
}
