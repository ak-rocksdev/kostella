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
import { kostellaName } from '../naming'
import {
  currentTenantOf,
  incomingTenantOf,
  seedTenancies,
  type Tenancy,
} from './tenancies'

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

export const facilityLabel = (id: FacilityId) => FACILITIES.find((f) => f.id === id)?.label ?? id

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

/** A room as written in the seed: no status, because nothing stores one. */
export type SeedRoom = {
  room: string
  floor: string
  type: string
  /**
   * The asking price for whoever takes this room next.
   *
   * NOT what the person living in it pays — that is `Tenancy.agreedRent`, set
   * when they moved in. Raising this must not re-price a sitting tenant.
   */
  rent: number
  /**
   * Withdrawn from letting. Deliberately not a status: a blocked room is still
   * occupied-or-not underneath, and merging the two loses that.
   */
  blocked?: Blocked
}

export type RoomState = SeedRoom & {
  /**
   * Derived from tenancies at merge time. Never stored, never set.
   *
   * Phase 1 had a manager toggle this directly, which meant a room could be
   * marked taken with nobody in it. Occupancy is now a consequence of somebody
   * living there.
   */
  status: Status
  /** Living here now. Present exactly when `status` is 'occupied'. */
  tenant?: Tenancy
  /** Moving in later. Sets 'held' on an empty room; on an occupied one it is
   *  the replacement lined up behind a tenant who has given notice. */
  incoming?: Tenancy
}

/** A building as written in the seed, before tenancies decide its rooms. */
export type SeedBuilding = Omit<Building, 'rooms'> & { rooms: SeedRoom[] }

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
const KOSTELLA_362: SeedBuilding = {
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
    { room: '304', floor: 'Lantai 3', type: 'Pojok', rent: 2_100_000 },
    { room: '205', floor: 'Lantai 2', type: 'Superior', rent: 1_950_000 },
    { room: '208', floor: 'Lantai 2', type: 'Superior', rent: 1_950_000 },
    { room: '211', floor: 'Lantai 2', type: 'Standard', rent: 1_650_000 },
    { room: '212', floor: 'Lantai 2', type: 'Superior', rent: 1_950_000 },
    { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000 },
    { room: '105', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000 },
    { room: '107', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000 },
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
const PLACEHOLDERS: SeedBuilding[] = [
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
      { room: '201', floor: 'Lantai 2', type: 'Standard', rent: 1_550_000 },
      { room: '202', floor: 'Lantai 2', type: 'Standard', rent: 1_550_000 },
      { room: '203', floor: 'Lantai 2', type: 'Superior', rent: 1_850_000 },
      { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 1_550_000 },
      { room: '102', floor: 'Lantai 1', type: 'Standard', rent: 1_550_000 },
      { room: '103', floor: 'Lantai 1', type: 'Standard', rent: 1_550_000 },
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
      { room: '201', floor: 'Lantai 2', type: 'Standard', rent: 1_650_000 },
      { room: '202', floor: 'Lantai 2', type: 'Standard', rent: 1_650_000 },
      { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000 },
      { room: '102', floor: 'Lantai 1', type: 'Standard', rent: 1_650_000 },
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
      { room: '101', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000 },
      { room: '102', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000 },
      { room: '103', floor: 'Lantai 1', type: 'Pojok', rent: 2_100_000 },
    ],
  },
]

/* Two districts away from Grogol, so the naming rule is visible rather than
   theoretical: these carry no house number in their name because nothing else
   shares their district, while the four Grogol buildings keep theirs.
   PRODUCT.md confirms the portfolio spans Jakarta, Bandung and Bali; which
   districts, and what is in them, is invented. */
const OTHER_DISTRICTS: SeedBuilding[] = [
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
      { room: '201', floor: 'Lantai 2', type: 'Superior', rent: 2_400_000 },
      { room: '202', floor: 'Lantai 2', type: 'Superior', rent: 2_400_000 },
      { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 2_100_000 },
      { room: '102', floor: 'Lantai 1', type: 'Standard', rent: 2_100_000 },
      { room: '103', floor: 'Lantai 1', type: 'Standard', rent: 2_100_000 },
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
      { room: '201', floor: 'Lantai 2', type: 'Standard', rent: 1_400_000 },
      { room: '202', floor: 'Lantai 2', type: 'Standard', rent: 1_400_000 },
      { room: '101', floor: 'Lantai 1', type: 'Standard', rent: 1_400_000 },
      { room: '102', floor: 'Lantai 1', type: 'Standard', rent: 1_400_000 },
    ],
  },
]

const SEED_BUILDINGS: SeedBuilding[] = [KOSTELLA_362, ...PLACEHOLDERS, ...OTHER_DISTRICTS]

/**
 * Rooms with their occupancy worked out from who lives in them.
 *
 * The single place a room's status is decided. Every screen — the panel, the
 * search results, the landing page — reads the result, so none of them can
 * disagree about whether a room is free.
 *
 * A room holds at most one current tenant. Where a sitting tenant has given
 * notice, `incoming` is the replacement booked behind them: the room is still
 * occupied, and it already has its next occupant.
 */
export function withTenancies(
  seed: SeedBuilding[],
  tenancies: Tenancy[],
  today: string,
): Building[] {
  return seed.map((building) => ({
    ...building,
    rooms: building.rooms.map((room) => {
      const tenant = currentTenantOf(tenancies, building.number, room.room, today)
      const incoming = incomingTenantOf(tenancies, building.number, room.room, today)
      return {
        ...room,
        status: tenant ? 'occupied' : incoming ? 'held' : 'available',
        ...(tenant ? { tenant } : {}),
        ...(incoming ? { incoming } : {}),
      } satisfies RoomState
    }),
  }))
}

/**
 * A fixed day, only so the seed can be resolved without reading the clock.
 *
 * Every seeded date is an offset, so the scenario they describe — who is due
 * when, who has given notice — is identical whichever day it is resolved
 * against. This one is used for the server render, where there is no browser
 * to ask; the client re-resolves against the real date and lands on the same
 * arrangement. See `lib/management/today.ts`.
 */
export const REFERENCE_DAY = '2026-01-01'

export const buildings: Building[] = withTenancies(
  SEED_BUILDINGS,
  seedTenancies(REFERENCE_DAY),
  REFERENCE_DAY,
)

export { SEED_BUILDINGS }

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
  return kostellaName(building.district, building.number, sharing > 1)
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
/**
 * Rent actually coming in, at what each tenant agreed to pay.
 *
 * Not the rooms' asking prices. Those are what the next tenant would pay, and
 * summing them answered "what are these rooms advertised at" while claiming to
 * answer "what is coming in". Every occupied room has a tenant by construction;
 * the fallback exists only so a type does not have to be widened.
 */
export const monthlyBooked = (b: Building) =>
  b.rooms
    .filter((r) => !r.blocked && r.status === 'occupied')
    .reduce((sum, r) => sum + (r.tenant?.agreedRent ?? r.rent), 0)

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
  const lettable = each.reduce((n, o) => n + o.lettable, 0)
  const occupied = each.reduce((n, o) => n + o.occupied, 0)
  const booked = all.reduce((n, b) => n + monthlyBooked(b), 0)
  const potential = all.reduce((n, b) => n + monthlyPotential(b), 0)

  return {
    buildings: all.length,
    rooms: each.reduce((n, o) => n + o.total, 0),
    lettable,
    occupied,
    free: each.reduce((n, o) => n + o.free, 0),
    held: each.reduce((n, o) => n + o.held, 0),
    blocked: each.reduce((n, o) => n + o.blocked, 0),
    booked,
    potential,
    /* Weighted by actual rooms, not by averaging each building's percentage —
       a four-room building must not count as much as a twelve-room one.

       Rooms only. A revenue-share percentage was built here and removed: across
       plausible scenarios it stayed within two points of this one, because a
       kos portfolio's rents span 1,4 to 2,4 million rather than an order of
       magnitude. Two figures that always agree are noise dressed as insight.
       The rupiah are still reported, as rupiah, which is what a decision needs. */
    roomRate: lettable > 0 ? occupied / lettable : 0,
  }
}
