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

export type BuildingPhoto = {
  id: string
  /** A path under /images for seeded photos, a data URL for added ones. */
  src: string
  /** What the photograph shows. Printed under the gallery on the public page. */
  label: string
}

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
  /** The real house number. Still the identity — see `buildingName`. */
  number: string
  street: string
  /** Short, and the word the building is named after: 'Grogol', 'Sudirman'. */
  district: string
  city: string
  /**
   * The building's photographs, cover first.
   *
   * An array rather than one facade, because the public detail page runs a
   * gallery and a manager needs to decide which frame leads it. Empty is a
   * legitimate state and the UI says so.
   */
  photos: BuildingPhoto[]
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
  district: 'Grogol',
  city: 'Jakarta Barat',
  photos: [
    { id: '362-depan', src: '/images/tampak-depan.jpg', label: 'Tampak depan' },
    { id: '362-superior', src: '/images/kamar-superior.jpg', label: 'Kamar Superior' },
    { id: '362-standard', src: '/images/kamar-standard.jpg', label: 'Kamar Standard' },
    { id: '362-mandi', src: '/images/kamar-mandi.jpg', label: 'Kamar mandi dalam' },
    { id: '362-bersama', src: '/images/ruang-bersama.jpg', label: 'Ruang bersama' },
  ],
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

   Kostella operates 31 buildings and has named one in detail. These are
   modelled so the panel has more than a single row to manage and so the
   building switcher does something. Addresses, rents, room lists, facilities
   and tenancy are all mine.

   THE PHOTOGRAPHS ARE THE SAME FIVE STAND-INS, REUSED. They come from the
   design bundle and show no Kostella building — three are Cove's own product
   photography, watermark included. Distributing them across buildings asserts
   nothing new: the whole set was already a placeholder. It exists so the panel
   can be demonstrated with its populated state rather than a wall of grey.
   Replace per building when the client supplies real images.
   ══════════════════════════════════════════════════════════════════════════ */
const PLACEHOLDERS: Building[] = [
  {
    number: '351',
    street: 'Jl. Dr. Susilo 2 No. 351',
    district: 'Grogol',
    city: 'Jakarta Barat',
    floors: ['Lantai 2', 'Lantai 1'],
    facilities: ['kamar-mandi-dalam', 'ac', 'dapur-bersama'],
    tenancy: 'campur',
    photos: [
      { id: '351-standard', src: '/images/kamar-standard.jpg', label: 'Kamar Standard' },
      { id: '351-bersama', src: '/images/ruang-bersama.jpg', label: 'Ruang bersama' },
      { id: '351-mandi', src: '/images/kamar-mandi.jpg', label: 'Kamar mandi dalam' },
    ],
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
    district: 'Grogol',
    city: 'Jakarta Barat',
    floors: ['Lantai 2', 'Lantai 1'],
    facilities: ['ac', 'wifi', 'laundry'],
    tenancy: 'putri',
    photos: [
      { id: '360-superior', src: '/images/kamar-superior.jpg', label: 'Kamar Superior' },
      { id: '360-standard', src: '/images/kamar-standard.jpg', label: 'Kamar Standard' },
    ],
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
    district: 'Grogol',
    city: 'Jakarta Barat',
    floors: ['Lantai 1'],
    facilities: ['kamar-mandi-dalam', 'ac', 'parkir-motor'],
    tenancy: 'campur',
    photos: [
      { id: '2A3-bersama', src: '/images/ruang-bersama.jpg', label: 'Ruang bersama' },
      { id: '2A3-standard', src: '/images/kamar-standard.jpg', label: 'Kamar Standard' },
      { id: '2A3-mandi', src: '/images/kamar-mandi.jpg', label: 'Kamar mandi dalam' },
      { id: '2A3-depan', src: '/images/tampak-depan.jpg', label: 'Tampak depan' },
    ],
    placeholder: true,
    rooms: [
      { room: '101', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000, status: 'occupied' },
      { room: '102', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000, status: 'occupied' },
      { room: '103', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000, status: 'occupied' },
    ],
  },
]

/* Two districts away from Grogol, so the naming rule is visible rather than
   theoretical: these carry no house number in their name because nothing else
   shares their district, while the four Grogol buildings keep theirs.
   PRODUCT.md confirms the portfolio spans Jakarta, Bandung and Bali; which
   districts, and what is in them, is invented. */
const OTHER_DISTRICTS: Building[] = [
  {
    number: '18',
    street: 'Jl. Setiabudi Tengah No. 18',
    district: 'Setiabudi',
    city: 'Jakarta Selatan',
    floors: ['Lantai 2', 'Lantai 1'],
    facilities: ['kamar-mandi-dalam', 'ac', 'wifi', 'laundry'],
    tenancy: 'campur',
    /* One photo, so the list shows a building part-way through being filled in
       — the state most of the client's 31 will actually be in. */
    photos: [{ id: '18-superior', src: '/images/kamar-superior.jpg', label: 'Kamar Superior' }],
    placeholder: true,
    rooms: [
      { room: '201', floor: 'Lantai 2', type: 'Superior', rent: 2_400_000, status: 'occupied' },
      { room: '202', floor: 'Lantai 2', type: 'Superior', rent: 2_400_000, status: 'available' },
      { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 2_100_000, status: 'occupied' },
      { room: '102', floor: 'Lantai 1', type: 'Standard', rent: 2_100_000, status: 'occupied' },
      { room: '103', floor: 'Lantai 1', type: 'Standard', rent: 2_100_000, status: 'held' },
    ],
  },
  {
    number: '7',
    street: 'Jl. Ir. H. Juanda No. 7',
    district: 'Dago',
    city: 'Bandung',
    floors: ['Lantai 2', 'Lantai 1'],
    facilities: ['ac', 'wifi', 'dapur-bersama', 'parkir-motor'],
    tenancy: 'putri',
    photos: [],
    placeholder: true,
    rooms: [
      { room: '201', floor: 'Lantai 2', type: 'Standard', rent: 1_400_000, status: 'available' },
      { room: '202', floor: 'Lantai 2', type: 'Standard', rent: 1_400_000, status: 'available' },
      { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 1_400_000, status: 'occupied' },
      { room: '102', floor: 'Lantai 1', type: 'Standard', rent: 1_400_000, status: 'occupied' },
    ],
  },
]

export const buildings: Building[] = [KOSTELLA_362, ...PLACEHOLDERS, ...OTHER_DISTRICTS]

export const findBuilding = (number: string) => buildings.find((b) => b.number === number)

/** Full address line, so the two halves are never joined two different ways. */
export const areaLabel = (b: Building) => `${b.district}, ${b.city}`

/**
 * The building's name, derived rather than typed.
 *
 * Named after its district — `Kostella Sudirman` — with the house number kept
 * **only where the district holds more than one building**. Four buildings sit
 * on one street in Grogol, so there the number is the sole distinguishing fact
 * and dropping it would leave four identical names; elsewhere it is noise.
 *
 * Derived means adding a building in a new district renames nothing, and adding
 * a second building to a district renames both — correctly, and without anyone
 * remembering to.
 *
 * This reverses the source brief, which said buildings are identified by house
 * number "never by invented names". Reversed at the client's direction on
 * 2026-08-01; PRODUCT.md records it.
 */
export function buildingName(building: Building, all: Building[] = buildings): string {
  const sharing = all.filter((b) => b.district === building.district).length
  return sharing > 1
    ? `Kostella ${building.district} ${building.number}`
    : `Kostella ${building.district}`
}

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

/** The frame that leads: the public card, the search result, the gallery. */
export const coverPhoto = (b: Building) => b.photos[0]

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
