/**
 * Every string and figure on the Beranda page.
 *
 * The numbers are real — building numbers on Jl. Dr. Susilo, actual room types
 * and rents, the 2008 founding date. The brand brief is explicit that figures
 * must be real and consistent, because inconsistent claims read as fraud in
 * this market. Never substitute placeholders here.
 *
 * Photos are the exception: the brief forbids stock photography and expects
 * real Kostella images. The four shipped here are stand-ins from the design
 * bundle, and two properties share one file.
 */
import { routes } from '../routes'
import type { Status } from './types'

export const nav = [
  { label: 'Cari kamar', href: routes.pencarian, muted: false },
  { label: 'Kawasan', href: routes.kawasan, muted: false },
  { label: 'Biaya', href: routes.biaya, muted: false },
  { label: 'Untuk pemilik kos', href: routes.franchise, muted: true },
] as const

/**
 * The hero speaks to the renter, not about the operator.
 *
 * Ownership is what makes these promises true, but it is not what the reader
 * wants — a student hunting for a room does not care who holds the deed. They
 * care about not wasting an afternoon on a room that was taken last week. So
 * the pain leads and the mechanism stays out of the frame entirely; it still
 * carries the franchise block and the property pages, where owners and parents
 * actually go looking for it.
 */
export const hero = {
  eyebrow: 'Kos di Jakarta, Bandung, dan Bali',
  heading: 'Tidak ada lagi survei kamar yang sudah terisi.',
  lead: 'Setiap kamar di sini dicek tiap hari. Kalau masih tampil, berarti memang masih bisa kamu ambil.',
  chipPrompt: 'Kamu kuliah atau kerja di mana?',
  budgetPrompt: 'Budget maksimal per bulan',
  /**
   * A room, not the shared lounge. The lounge read as a café and its orange
   * cast fought the palette the brief caps at two non-neutrals. A facade would
   * suit the brand better still, but the only one on hand is 500px wide and
   * would break up full-bleed — a high-resolution facade is an asset request.
   *
   * Rendered as a decorative CSS background, not an <img>: it carries no
   * information a screen reader needs, and it is a placeholder from the design
   * bundle rather than a real Kostella room, so naming it would be false.
   */
  photo: { src: '/images/kamar-standard.jpg' },
} as const

/**
 * The budget control.
 *
 * Cost is the brand's second claim, so the search starts from what you can pay
 * rather than from a map. The range brackets the real rents (Rp1.550.000 to
 * Rp2.100.000) with enough room either side that both ends of the slider mean
 * something: drag it down far enough and you genuinely run out of rooms.
 */
export const budget = {
  min: 1_200_000,
  max: 3_000_000,
  step: 50_000,
  initial: 2_100_000,
} as const

export type AreaChip = {
  label: string
  /** Areas without inventory get the designed empty state, not a blank list. */
  nearest?: string
}

export const areaChips: AreaChip[] = [
  { label: 'Trisakti/Untar' },
  { label: 'Kelapa Gading', nearest: 'Trisakti/Untar' },
  { label: 'Setiabudi', nearest: 'Trisakti/Untar' },
  { label: 'Kebayoran', nearest: 'Trisakti/Untar' },
  { label: 'Bandung', nearest: 'Trisakti/Untar' },
  { label: 'Nusa Dua', nearest: 'Trisakti/Untar' },
]

export type VacantRoom = {
  building: string
  room: string
  type: string
  /** Numeric so the budget filter compares figures, not formatted strings. */
  rent: number
  vacancy: string
  area: string
}

/** Cheapest first, so raising the budget adds rooms to the bottom of the list. */
export const vacantRooms: VacantRoom[] = [
  { building: '351', room: '302', type: 'Standard', rent: 1_550_000, vacancy: 'kosong hari ini', area: 'Trisakti/Untar' },
  { building: '362', room: '105', type: 'Standard', rent: 1_650_000, vacancy: 'kosong hari ini', area: 'Trisakti/Untar' },
  { building: '362', room: '211', type: 'Standard', rent: 1_650_000, vacancy: 'kosong 1 Agu', area: 'Trisakti/Untar' },
  { building: '351', room: '108', type: 'Superior', rent: 1_950_000, vacancy: 'kosong 3 Agu', area: 'Trisakti/Untar' },
  { building: '362', room: '205', type: 'Superior', rent: 1_950_000, vacancy: 'kosong 1 Agu', area: 'Trisakti/Untar' },
  { building: '2A3', room: '108', type: 'Pojok', rent: 2_100_000, vacancy: 'kosong 5 Agu', area: 'Trisakti/Untar' },
]

export type Property = {
  number: string
  street: string
  area: string
  distances: string[]
  /** Who the building takes. Only 362's is confirmed by the brief. */
  tenancy: string
  /**
   * Shown as tags on the card.
   *
   * CAUTION: the brief specifies facilities for building 362 only. The values
   * for 351, 360, and 2C were authored by the designer in the search screen and
   * carried across for consistency — they read as fact on the page and need the
   * owner's confirmation before this goes anywhere public.
   */
  facilities: string[]
  /** Cheapest monthly rent in the building, in rupiah. */
  priceFrom: number
  status: Status
  /** Vacant-room count, shown on the badge. Only meaningful when available. */
  count?: number
  photo: string
}

export type Area = {
  name: string
  nearby: string
  /**
   * Two sentences beside the card track. Every claim here is derived from the
   * distances already listed on the cards — no new fact is introduced, because
   * a paragraph is exactly where an unchecked one would slip in unnoticed.
   */
  blurb: string
  vacantRooms: number
  properties: Property[]
}

export const areas: Area[] = [
  {
    name: 'Grogol',
    nearby: 'dekat Trisakti & Untar',
    blurb:
      'Semua gedung kami di sini berdiri di Jl. Dr. Susilo, sekitar satu kilometer dari Trisakti dan Untar. Angka kamar kosongnya dicek ulang tiap hari.',
    vacantRooms: 7,
    properties: [
      {
        number: '362',
        street: 'Jl. Dr. Susilo 2 No. 362',
        area: 'Grogol, Jakarta Barat',
        distances: ['Trisakti 1 km', 'Central Park 0,2 km'],
        tenancy: 'Khusus putri',
        facilities: ['Kamar mandi dalam', 'AC', 'Wifi'],
        priceFrom: 1_650_000,
        status: 'available',
        count: 2,
        photo: '/images/tampak-depan.jpg',
      },
      {
        number: '351',
        street: 'Jl. Dr. Susilo 2 No. 351',
        area: 'Grogol, Jakarta Barat',
        distances: ['Trisakti 1,1 km', 'Terminal Grogol 0,3 km'],
        tenancy: 'Campur',
        facilities: ['Kamar mandi dalam', 'AC', 'Dapur bersama'],
        priceFrom: 1_550_000,
        status: 'available',
        count: 5,
        photo: '/images/kamar-standard.jpg',
      },
      {
        number: '360',
        street: 'Jl. Dr. Susilo 2 No. 360',
        area: 'Grogol, Jakarta Barat',
        distances: ['Trisakti 1 km', 'Terminal Grogol 0,2 km'],
        tenancy: 'Khusus putri',
        facilities: ['AC', 'Wifi', 'Laundry'],
        priceFrom: 1_650_000,
        status: 'held',
        photo: '/images/kamar-superior.jpg',
      },
      {
        number: '2C',
        street: 'Jl. Dr. Susilo 2C',
        area: 'Grogol, Jakarta Barat',
        distances: ['Untar 0,9 km', 'Central Park 0,4 km'],
        tenancy: 'Campur',
        facilities: ['Kamar mandi dalam', 'AC', 'Parkir motor'],
        priceFrom: 1_750_000,
        status: 'occupied',
        photo: '/images/ruang-bersama.jpg',
      },
    ],
  },
]

export const biaya = {
  eyebrow: 'Transparansi biaya',
  heading: 'Yang kamu bayar, tanpa kejutan.',
  body: 'Semua biaya tercantum sebelum kamu survei. Deposit kembali penuh saat keluar, listrik dihitung sesuai pemakaian, dan tidak ada biaya lain yang muncul belakangan.',
  stats: [
    { value: '0', label: 'biaya tersembunyi' },
    { value: '100%', label: 'deposit kembali' },
  ],
  example: 'Contoh: Kostella 362 · kamar 105 · Standard',
  rows: [
    { label: 'Sewa bulanan', value: 'Rp 1.650.000' },
    { label: 'Deposit (dikembalikan)', value: 'Rp 1.500.000' },
    { label: 'Listrik', value: 'dihitung terpisah', soft: true },
    { label: 'Parkir motor', value: 'gratis', soft: true },
  ],
  total: { label: 'Bayar di awal', value: 'Rp 3.150.000' },
} as const

/** Icon keys map to lucide components in the section that renders them, so the
 *  icon set stays tree-shakeable and this file stays free of JSX. */
export type StepIcon = 'search' | 'calendar' | 'document' | 'key'

export const caraSewa = {
  eyebrow: 'Cara sewa',
  aside: 'Dari cari sampai masuk, bisa dalam satu hari.',
  steps: [
    {
      number: '01',
      title: 'Cari',
      body: 'Pilih kawasan, lihat kamar yang benar-benar kosong.',
      icon: 'search' as StepIcon,
    },
    {
      number: '02',
      title: 'Jadwalkan survei',
      body: 'Datang lihat kamarnya. Ditemani pengelola gedung.',
      icon: 'calendar' as StepIcon,
    },
    {
      number: '03',
      title: 'Ajukan sewa',
      body: 'Isi data, pilih tanggal masuk.',
      icon: 'document' as StepIcon,
    },
    {
      number: '04',
      title: 'Bayar dan masuk',
      body: 'Bayar di awal, terima kunci di hari yang sama.',
      icon: 'key' as StepIcon,
    },
  ],
}

/** The franchise block addresses owners, so the copy switches to formal "Anda". */
export const franchise = {
  eyebrow: 'Punya kos?',
  body: 'Kami mengelola 31 gedung. Kami juga bisa mengelola milik Anda.',
  cta: 'Pelajari kemitraan',
  numeral: '31',
} as const

export const footer = {
  mapEyebrow: 'Gedung kami di Grogol',
  mapCaption: 'Lokasi perkiraan — alamat pasti dikirim saat jadwal survei dikonfirmasi.',
  addressEyebrow: 'Alamat gedung',
  addressNote:
    'Grogol, Jakarta Barat · + 27 gedung lain di Jakarta, Bandung, dan Bali.',
  buildings: [
    { number: '362', street: 'Jl. Dr. Susilo 2 No. 362' },
    { number: '361', street: 'Jl. Dr. Susilo 2 No. 361' },
    { number: '351', street: 'Jl. Dr. Susilo 2 No. 351' },
    { number: '2A3', street: 'Jl. Dr. Susilo 2A No. 3' },
  ],
  contactEyebrow: 'Hubungi kami',
  phone: '0812 8000 0362',
  verified: 'terverifikasi',
  hours: 'Jam operasional 08.00–21.00 WIB, setiap hari',
  contactCta: 'Chat lewat WhatsApp',
  disclaimer: 'Konsep — bukan situs final',
  copyright: '© Kostella 2026',
} as const

/** Neighbourhood level with a walking radius, never a national map with 5 pins. */
export const grogolMap = {
  center: [-6.1645, 106.789] as [number, number],
  zoom: 16,
  markers: [
    { label: '362', position: [-6.1636, 106.7884] as [number, number] },
    { label: '361', position: [-6.164, 106.7892] as [number, number] },
    { label: '351', position: [-6.1652, 106.7898] as [number, number] },
    { label: '2A3', position: [-6.1659, 106.788] as [number, number] },
  ],
}
