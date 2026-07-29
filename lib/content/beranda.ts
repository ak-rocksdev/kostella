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

export const hero = {
  eyebrow: 'Milik & dikelola sendiri sejak 2008',
  heading: 'Kos yang kamarnya kami kelola sendiri.',
  intro:
    '31 gedung di Jakarta, Bandung, dan Bali. Kamar yang tampil di sini benar-benar kosong hari ini.',
  chipPrompt: 'Kamu kuliah atau kerja di mana?',
  photo: { src: '/images/ruang-bersama.jpg', alt: 'Ruang bersama di salah satu gedung Kostella' },
  availability: {
    eyebrow: 'Kosong sekarang',
    updated: 'diperbarui hari ini',
  },
} as const

export const areaChips = [
  'Trisakti/Untar',
  'Kelapa Gading',
  'Setiabudi',
  'Kebayoran',
  'Bandung',
  'Nusa Dua',
] as const

export type VacantRoom = {
  building: string
  room: string
  type: string
  price: string
  vacancy: string
}

export const vacantRooms: VacantRoom[] = [
  { building: '362', room: '205', type: 'Superior', price: 'Rp1.950.000', vacancy: 'kosong 1 Agu' },
  { building: '362', room: '105', type: 'Standard', price: 'Rp1.650.000', vacancy: 'kosong hari ini' },
  { building: '351', room: '302', type: 'Standard', price: 'Rp1.550.000', vacancy: 'kosong hari ini' },
  { building: '2A3', room: '108', type: 'Pojok', price: 'Rp2.100.000', vacancy: 'kosong 5 Agu' },
]

export const proofPoints = [
  { value: '2008', label: 'tahun berdiri' },
  { value: '31', label: 'gedung dikelola sendiri' },
  { value: '340', label: 'kamar' },
  { value: '14 bln', label: 'rata-rata lama tinggal' },
]

export type Property = {
  number: string
  street: string
  distances: string[]
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
  vacantRooms: number
  properties: Property[]
}

export const areas: Area[] = [
  {
    name: 'Grogol',
    nearby: 'dekat Trisakti & Untar',
    vacantRooms: 7,
    properties: [
      {
        number: '362',
        street: 'Jl. Dr. Susilo 2 No. 362',
        distances: ['Trisakti 1 km', 'Central Park 0,2 km'],
        priceFrom: 1_650_000,
        status: 'available',
        count: 2,
        photo: '/images/tampak-depan.jpg',
      },
      {
        number: '351',
        street: 'Jl. Dr. Susilo 2 No. 351',
        distances: ['Trisakti 1,1 km', 'Terminal Grogol 0,3 km'],
        priceFrom: 1_550_000,
        status: 'available',
        count: 5,
        photo: '/images/kamar-standard.jpg',
      },
      {
        number: '360',
        street: 'Jl. Dr. Susilo 2 No. 360',
        distances: ['Trisakti 1 km', 'Terminal Grogol 0,2 km'],
        priceFrom: 1_650_000,
        status: 'held',
        photo: '/images/kamar-superior.jpg',
      },
      {
        number: '2C',
        street: 'Jl. Dr. Susilo 2C',
        distances: ['Untar 0,9 km', 'Central Park 0,4 km'],
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
