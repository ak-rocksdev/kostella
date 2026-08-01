/**
 * Search results for Grogol — the four properties near Trisakti/Untar.
 *
 * Every field a filter reads is a number or an enum. This file used to store
 * display strings ("Rp1.650.000", "12 menit jalan kaki ke Trisakti", "3 dari 8
 * kamar kosong"), which no filter can compare against; the strings are now
 * derived from the figures at the bottom of this file, so a card and a filter
 * can never disagree about the same building.
 */
import { formatRupiah } from '../format'
import type { Status } from './types'

export const context = {
  area: 'Trisakti/Untar',
  sort: 'urut jarak terdekat',
}

export type Tenancy = 'putri' | 'putra' | 'campur'

/** On a card, where it reads as a sentence about the building. */
export const tenancyLabels: Record<Tenancy, string> = {
  putri: 'Khusus putri',
  putra: 'Khusus putra',
  campur: 'Campur',
}

/** In the filter, where the group's legend already supplies "tipe penghuni". */
export const tenancyShort: Record<Tenancy, string> = {
  putri: 'Putri',
  putra: 'Putra',
  campur: 'Campur',
}

export type SearchResult = {
  number: string
  street: string
  tenancy: Tenancy
  facilities: string[]
  /** Minutes on foot to `nearest`. Numeric so distance can be compared. */
  walkMinutes: number
  nearest: string
  /** Cheapest monthly rent in the building, in rupiah. */
  rent: number
  /** Rooms free right now. 0 means the building is full. */
  vacant: number
  /**
   * Rooms in the building. Optional because the client stated it for two
   * buildings only — the label falls back to "sisa N kamar" rather than
   * inventing a denominator.
   */
  total?: number
  /**
   * Kept as data rather than derived from `vacant`. A building with rooms free
   * is "available" and a full one is "occupied", but what makes 360 "held"
   * rather than available is a booking in progress, which is not visible in
   * these figures. Guessing a rule here would put a wrong colour on a fact.
   */
  status: Status
  photo: string
  /** Only 362 has a detail screen; the rest have no data behind them yet. */
  hasDetail: boolean
}

const unsorted: SearchResult[] = [
  {
    number: '362',
    street: 'Jl. Dr. Susilo 2 No. 362, Grogol',
    tenancy: 'putri',
    facilities: ['Kamar mandi dalam', 'AC', 'Wifi'],
    walkMinutes: 12,
    nearest: 'Trisakti',
    rent: 1_650_000,
    vacant: 3,
    total: 8,
    status: 'available',
    photo: '/images/tampak-depan.jpg',
    hasDetail: true,
  },
  {
    number: '351',
    street: 'Jl. Dr. Susilo 2 No. 351, Grogol',
    tenancy: 'campur',
    facilities: ['Kamar mandi dalam', 'AC', 'Dapur bersama'],
    walkMinutes: 14,
    nearest: 'Trisakti',
    rent: 1_550_000,
    vacant: 5,
    total: 12,
    status: 'available',
    photo: '/images/kamar-standard.jpg',
    hasDetail: false,
  },
  {
    number: '360',
    street: 'Jl. Dr. Susilo 2 No. 360, Grogol',
    tenancy: 'putri',
    facilities: ['AC', 'Wifi', 'Laundry'],
    walkMinutes: 12,
    nearest: 'Trisakti',
    rent: 1_650_000,
    vacant: 1,
    status: 'held',
    photo: '/images/kamar-superior.jpg',
    hasDetail: false,
  },
  {
    number: '2A3',
    street: 'Jl. Dr. Susilo 2A No. 3, Grogol',
    tenancy: 'campur',
    facilities: ['Kamar mandi dalam', 'AC', 'Parkir motor'],
    walkMinutes: 10,
    nearest: 'Untar',
    rent: 2_100_000,
    vacant: 0,
    status: 'occupied',
    photo: '/images/ruang-bersama.jpg',
    hasDetail: false,
  },
]

/**
 * Nearest first — the order `context.sort` has been promising all along.
 *
 * It was not true. The header said "urut jarak terdekat" while the array ran
 * 12, 14, 12, 10 minutes in source order, because distance was a display string
 * nothing could sort on. Sorted here rather than by hand in the literal, so a
 * new building lands in the right place on its own.
 */
export const results = [...unsorted].sort((a, b) => a.walkMinutes - b.walkMinutes)

/* ── Derived labels ────────────────────────────────────────────────────────
   Every string a card prints comes from the figures above. */

export const priceLabel = (result: SearchResult) => formatRupiah(result.rent)

export const walkLabel = (result: SearchResult) =>
  `${result.walkMinutes} menit jalan kaki ke ${result.nearest}`

export function availabilityLabel(result: SearchResult) {
  if (result.vacant === 0) return 'penuh'
  if (result.total) return `${result.vacant} dari ${result.total} kamar kosong`
  return `sisa ${result.vacant} kamar`
}

/* ── Filter facets ─────────────────────────────────────────────────────────
   All three are derived from the results, so a facet can never offer an option
   that reaches nothing, and a new building brings its own options with it. */

/**
 * The facets, built from whatever the buildings currently offer.
 *
 * A function, not a constant, because a manager can now change what a building
 * offers. Ticking Laundry has to move its chip from one building to two — the
 * filter itself changes, not just a row of text — and a value computed once at
 * module load could never do that.
 *
 * Facilities every building has are dropped: an "AC" chip that narrows nothing
 * is one more control to read for no answer. It returns on its own the day a
 * building without AC exists. Tenancies work the same way, so "khusus putra" is
 * not offered while nothing is — a filter guaranteed to return nothing is a
 * dead end dressed as a choice.
 */
export function buildFacets(rows: SearchResult[]) {
  return {
    facilities: [...new Set(rows.flatMap((r) => r.facilities))]
      .filter((facility) => rows.some((r) => !r.facilities.includes(facility)))
      .sort((a, b) => a.localeCompare(b, 'id')),
    tenancies: [...new Set(rows.map((r) => r.tenancy))],
  }
}

export type Facets = ReturnType<typeof buildFacets>

/** Walking-time brackets, in minutes. */
export const walkFacet = [10, 15]

/**
 * The area-level empty state from the design bundle.
 *
 * NOT rendered. It used to sit permanently under the results, so the page
 * showed "Belum ada kamar kosong di Setiabudi" beneath four Grogol properties
 * on every visit. It belongs to an area this screen never represents; kept here
 * because the copy is designed and will be needed when area switching is built.
 */
export const areaEmptyState = {
  heading: 'Belum ada kamar kosong di Setiabudi.',
  body: 'Yang terdekat ada di Kebayoran, 15 menit.',
  cta: 'Lihat Kebayoran',
}

/**
 * Landmarks shown alongside the results. The building pins are derived from the
 * results themselves, so the list and the map can never disagree about which
 * properties exist. Coordinates live in `geography.ts`.
 */
export const mapLandmarks = ['Trisakti', 'Untar', 'Terminal Grogol']
