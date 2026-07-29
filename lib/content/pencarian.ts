/**
 * Search results for Grogol — the four properties near Trisakti/Untar.
 *
 * Availability is stated as a fraction ("3 dari 8 kamar kosong") rather than a
 * badge, because at this stage the reader is comparing buildings and needs to
 * know how much choice each one leaves them.
 */
import type { Status } from './types'

export const context = {
  area: 'Trisakti/Untar',
  sort: 'urut jarak terdekat',
  resultsLabel: '4 properti · Grogol',
}

export const filters = [
  'Putri',
  'Campur',
  'Kamar mandi dalam',
  'AC',
  'Bisa pasutri',
  '< Rp2 juta',
] as const

/** Preselected so the results read as a filtered set, not a raw dump. */
export const defaultFilters = ['Putri']

export type SearchResult = {
  number: string
  street: string
  tenancy: string
  facilities: string[]
  walk: string
  price: string
  availability: string
  status: Status
  photo: string
  /** Only 362 has a detail screen; the rest have no data behind them yet. */
  hasDetail: boolean
}

export const results: SearchResult[] = [
  {
    number: '362',
    street: 'Jl. Dr. Susilo 2 No. 362, Grogol',
    tenancy: 'Khusus putri',
    facilities: ['Kamar mandi dalam', 'AC', 'Wifi'],
    walk: '12 menit jalan kaki ke Trisakti',
    price: 'Rp1.650.000',
    availability: '3 dari 8 kamar kosong',
    status: 'available',
    photo: '/images/tampak-depan.jpg',
    hasDetail: true,
  },
  {
    number: '351',
    street: 'Jl. Dr. Susilo 2 No. 351, Grogol',
    tenancy: 'Campur',
    facilities: ['Kamar mandi dalam', 'AC', 'Dapur bersama'],
    walk: '14 menit jalan kaki ke Trisakti',
    price: 'Rp1.550.000',
    availability: '5 dari 12 kamar kosong',
    status: 'available',
    photo: '/images/kamar-standard.jpg',
    hasDetail: false,
  },
  {
    number: '360',
    street: 'Jl. Dr. Susilo 2 No. 360, Grogol',
    tenancy: 'Khusus putri',
    facilities: ['AC', 'Wifi', 'Laundry'],
    walk: '12 menit jalan kaki ke Trisakti',
    price: 'Rp1.650.000',
    availability: 'sisa 1 kamar',
    status: 'held',
    photo: '/images/kamar-superior.jpg',
    hasDetail: false,
  },
  {
    number: '2A3',
    street: 'Jl. Dr. Susilo 2A No. 3, Grogol',
    tenancy: 'Campur',
    facilities: ['Kamar mandi dalam', 'AC', 'Parkir motor'],
    walk: '10 menit jalan kaki ke Untar',
    price: 'Rp2.100.000',
    availability: 'penuh',
    status: 'occupied',
    photo: '/images/ruang-bersama.jpg',
    hasDetail: false,
  },
]

/**
 * An empty result is a dead end unless it offers a way out, so the design pairs
 * the "nothing here" line with the nearest alternative and a way to reach it.
 */
export const emptyState = {
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
