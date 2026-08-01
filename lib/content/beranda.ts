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
/* No cycle: detail.ts does not import this file. */
import { defaultRoom, property, receiptFor, rooms } from './detail'

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

/**
 * Six steps across the real range, so every option reaches some inventory.
 *
 * Shared by the hero's search bar and the search screen's budget filter: the
 * figure a visitor picks on Beranda has to be one the other screen can also
 * offer, or carrying it across would land on a value the control cannot show.
 */
export const budgetSteps = Array.from(
  { length: 7 },
  (_, i) => budget.min + i * ((budget.max - budget.min) / 6),
)

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
  /**
   * ═══ INVENTED. MUST BE REPLACED BEFORE THIS GOES ANYWHERE PUBLIC. ═══
   *
   * Set on the four buildings added on 2026-07-31 so the area section reads at
   * full length for the pitch. The client has 31 buildings and named four; the
   * other four here — their addresses, rents, tenancy, facilities and vacancy
   * counts — were written by me and are not claims Kostella has made.
   *
   * To remove them: delete every property carrying this flag. Nothing else
   * needs touching. The area's vacancy figure is derived from the counts that
   * remain, so it returns to the client's real 7 on its own.
   */
  placeholder?: true
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
  properties: Property[]
}

/**
 * Rooms a visitor can actually take in this area, right now.
 *
 * Derived rather than stored. The client's figure for Grogol is 7, which is
 * exactly the sum of the vacancy counts on the buildings they confirmed — a
 * held room reads "Sisa 1" on its badge but is spoken for, so it is not
 * counted. Deriving it means the headline number and the cards can never drift
 * apart, and pulling the placeholder buildings restores the real figure without
 * anyone having to remember to edit it.
 */
export function vacantRoomsIn(area: Area): number {
  return area.properties.reduce(
    (total, property) => total + (property.status === 'available' ? (property.count ?? 0) : 0),
    0,
  )
}

export const areas: Area[] = [
  {
    name: 'Grogol',
    nearby: 'dekat Trisakti & Untar',
    blurb:
      'Semua gedung kami di sini berdiri di Jl. Dr. Susilo, sekitar satu kilometer dari Trisakti dan Untar. Angka kamar kosongnya dicek ulang tiap hari.',
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

      /* ══════════════════════════════════════════════════════════════════════
         EVERYTHING BELOW THIS LINE IS INVENTED. DELETE BEFORE LAUNCH.

         Added 2026-07-31 at the client's request so the area section reads at
         full length in the pitch deck. Kostella operates 31 buildings and has
         named four of them; these four are my fabrication — addresses, rents,
         tenancy, facilities and vacancy counts alike. They are plausible, which
         is exactly what makes them dangerous: nothing on the rendered page
         marks them as unreal.

         Replacing them needs, per building: number, street, area, tenancy,
         facilities, cheapest monthly rent, status, vacant-room count, photo.
         Deleting them instead is safe and complete — the area's vacancy figure
         is derived by vacantRoomsIn() and returns to the client's 7 by itself.
         ══════════════════════════════════════════════════════════════════════ */
      {
        number: '358',
        street: 'Jl. Dr. Susilo 2 No. 358',
        area: 'Grogol, Jakarta Barat',
        distances: ['Trisakti 1 km', 'Central Park 0,3 km'],
        tenancy: 'Campur',
        facilities: ['Kamar mandi dalam', 'AC', 'Wifi'],
        priceFrom: 1_600_000,
        status: 'available',
        count: 3,
        photo: '/images/kamar-standard.jpg',
        placeholder: true,
      },
      {
        number: '355',
        street: 'Jl. Dr. Susilo 2 No. 355',
        area: 'Grogol, Jakarta Barat',
        distances: ['Trisakti 1,2 km', 'Terminal Grogol 0,3 km'],
        tenancy: 'Khusus putra',
        facilities: ['AC', 'Wifi', 'Dapur bersama'],
        priceFrom: 1_500_000,
        status: 'available',
        count: 4,
        photo: '/images/ruang-bersama.jpg',
        placeholder: true,
      },
      {
        number: '364',
        street: 'Jl. Dr. Susilo 2 No. 364',
        area: 'Grogol, Jakarta Barat',
        distances: ['Untar 1 km', 'Central Park 0,2 km'],
        tenancy: 'Khusus putri',
        facilities: ['Kamar mandi dalam', 'AC', 'Laundry'],
        priceFrom: 1_700_000,
        status: 'available',
        count: 2,
        photo: '/images/tampak-depan.jpg',
        placeholder: true,
      },
      {
        number: '2A',
        street: 'Jl. Dr. Susilo 2A',
        area: 'Grogol, Jakarta Barat',
        distances: ['Untar 0,8 km', 'Terminal Grogol 0,4 km'],
        tenancy: 'Campur',
        facilities: ['Kamar mandi dalam', 'AC', 'Parkir motor'],
        priceFrom: 1_850_000,
        status: 'held',
        photo: '/images/kamar-superior.jpg',
        placeholder: true,
      },
    ],
  },
]

/**
 * The example receipt is the detail page's receipt for the same room, not a
 * second copy of it.
 *
 * It used to be typed out here. Both listed a Rp 1.500.000 deposit; when the
 * client had it removed from the room receipt on 2026-07-31, this one went on
 * claiming a deposit and a Rp 3.150.000 first payment while the detail page for
 * the very same room said Rp 1.650.000. For a brand whose entire position is
 * that its figures are right, that is the worst kind of bug — so the two are now
 * the same function call and cannot drift again.
 */
const contoh = receiptFor(defaultRoom)

export const biaya = {
  eyebrow: 'Transparansi biaya',
  heading: 'Yang kamu bayar, tanpa kejutan.',
  body: 'Semua biaya tercantum sebelum kamu survei. Listrik dihitung sesuai pemakaian, dan tidak ada biaya lain yang muncul belakangan.',
  /**
   * Both figures restate the receipt beside them rather than adding a claim.
   * The second one replaces "100% deposit kembali", which stopped being true of
   * this page the moment the deposit left the receipt.
   */
  stats: [
    { value: '0', label: 'biaya tersembunyi' },
    { value: '1×', label: 'sewa dibayar di awal' },
  ],
  example: `Contoh: Kostella ${property.number} · kamar ${defaultRoom} · ${rooms[defaultRoom].type}`,
  rows: contoh.rows,
  total: contoh.total,
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

const phone = '0812 8000 0362'

export const footer = {
  /**
   * One line of who Kostella is, for the reader who scrolled past everything
   * else. Every figure in it is from PRODUCT.md.
   */
  positioning:
    'Kos milik dan dikelola sendiri sejak 2008. 31 gedung di Jakarta, Bandung, dan Bali.',

  navLabel: 'Jelajahi',

  addressEyebrow: 'Gedung kami di Grogol',
  addressNote: '+ 27 gedung lain di Jakarta, Bandung, dan Bali.',
  addressCaption: 'Alamat pasti dikirim saat jadwal survei dikonfirmasi.',
  /**
   * CAUTION: this list and the property cards disagree, and have since the
   * design bundle was imported. Here and on the search screen the fourth and
   * fifth buildings are 361 and 2A3; the Beranda property cards call them 360
   * and 2C. lib/content/geography.ts holds coordinates for all five, so it is
   * not obvious which pair is the mistake. The client has to say.
   */
  buildings: [
    { number: '362', street: 'Jl. Dr. Susilo 2 No. 362' },
    { number: '361', street: 'Jl. Dr. Susilo 2 No. 361' },
    { number: '351', street: 'Jl. Dr. Susilo 2 No. 351' },
    { number: '2A3', street: 'Jl. Dr. Susilo 2A No. 3' },
  ],

  contactEyebrow: 'Hubungi kami',
  phone,
  /** E.164, derived from the printed number so the two cannot disagree. */
  phoneHref: `tel:+62${phone.replace(/\D/g, '').slice(1)}`,
  verified: 'terverifikasi',
  hours: '08.00–21.00 WIB, setiap hari',
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
