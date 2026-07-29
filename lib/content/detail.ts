/**
 * Kostella 362 — the property detail screen.
 *
 * Real data from the brand brief: room numbers 101/105/107 on floor one,
 * 205/208/211/212 on two, 304 on three; 105 and 211 vacant, 205 held. The
 * receipt surfaces the rules competitors bury — second occupant Rp400.000,
 * overnight guest Rp100.000.
 *
 * The screen covers one property. Per-property routing needs data for the other
 * thirty, which the design does not specify.
 */
import type { Status } from './types'
import type { Floor } from '@/components/ui/FloorGrid'
import { formatRupiah } from '../format'

export const property = {
  number: '362',
  address: 'Jl. Dr. Susilo 2 No. 362, Grogol, Jakarta Barat',
  distances: 'Trisakti 1 km · Terminal Grogol 0,2 km · Central Park 0,2 km',
  tenancy: 'Khusus putri',
} as const

export type Photo = { src: string; label: string }

export const photos: Photo[] = [
  { src: '/images/kamar-superior.jpg', label: 'Kamar Superior' },
  { src: '/images/kamar-standard.jpg', label: 'Kamar Standard' },
  { src: '/images/kamar-mandi.jpg', label: 'Kamar mandi dalam' },
  { src: '/images/ruang-bersama.jpg', label: 'Ruang bersama' },
  { src: '/images/tampak-depan.jpg', label: 'Tampak depan' },
]

export type RoomDetail = {
  type: string
  /** Monthly rent in rupiah. Kept numeric so the receipt total can be derived
   *  rather than restated — the brief demands figures agree wherever they
   *  appear, and the prototype only special-cased room 205. */
  rent: number
  status: Status
  size?: string
  /** Only vacant rooms state a date. */
  vacancy?: string
  /** Index into `photos`. */
  photo: number
}

export const rooms: Record<string, RoomDetail> = {
  '101': { type: 'Standard', rent: 1_650_000, status: 'occupied', photo: 1 },
  '105': {
    type: 'Standard',
    rent: 1_650_000,
    status: 'available',
    size: '3×4 m',
    vacancy: 'kosong hari ini',
    photo: 1,
  },
  '107': { type: 'Standard', rent: 1_650_000, status: 'occupied', photo: 1 },
  '205': { type: 'Superior', rent: 1_950_000, status: 'held', photo: 0 },
  '208': { type: 'Superior', rent: 1_950_000, status: 'occupied', photo: 0 },
  '211': {
    type: 'Standard',
    rent: 1_650_000,
    status: 'available',
    size: '3×4 m',
    vacancy: 'kosong 1 Agustus',
    photo: 0,
  },
  '212': { type: 'Superior', rent: 1_950_000, status: 'occupied', photo: 0 },
  '304': { type: 'Pojok', rent: 2_100_000, status: 'occupied', photo: 0 },
}

/** Refundable in full on move-out. The brand's headline promise. */
export const deposit = 1_500_000

export const defaultRoom = '105'

/** Top floor first, so the grid reads like a building elevation. */
export const floors: Floor[] = [
  { label: 'Lantai 3', rooms: ['304'] },
  { label: 'Lantai 2', rooms: ['205', '208', '211', '212'] },
  { label: 'Lantai 1', rooms: ['101', '105', '107'] },
].map((floor) => ({
  label: floor.label,
  rooms: floor.rooms.map((room) => ({
    room,
    type: rooms[room].type,
    price: formatRupiah(rooms[room].rent),
    status: rooms[room].status,
  })),
}))

/** Shared fit-out, prefixed by the room's own size. */
export const roomSpec = 'AC · kamar mandi dalam · kasur 120 · meja & lemari'
export const defaultRoomSize = '3×4 m'

export const receiptNote =
  'Pembayaran tanggal 1–16 tiap bulan. Keterlambatan dikenakan denda sesuai perjanjian sewa.'

/**
 * The full cost of a room, including the rules competitors bury. What you pay
 * up front is rent plus deposit — derived, so it can never disagree with the
 * rent shown elsewhere on the page.
 */
export function receiptFor(roomNumber: string) {
  const room = rooms[roomNumber]

  return {
    rows: [
      { label: 'Sewa bulanan', value: formatRupiah(room.rent, { spaced: true }) },
      { label: 'Deposit (dikembalikan)', value: formatRupiah(deposit, { spaced: true }) },
      { label: 'Listrik', value: 'dihitung terpisah', soft: true },
      { label: 'Orang kedua', value: 'Rp 400.000 /bulan' },
      { label: 'Tamu menginap', value: 'Rp 100.000 /malam' },
      { label: 'Parkir motor', value: 'gratis', soft: true },
    ],
    total: {
      label: 'Bayar di awal',
      value: formatRupiah(room.rent + deposit, { spaced: true }),
    },
  }
}

export const houseRules = [
  { title: 'Jam tamu', body: 'Tamu diterima 08.00–21.00 di area bersama.' },
  { title: 'Pasangan', body: 'Khusus putri. Tamu laki-laki hanya di ruang tamu.' },
  {
    title: 'Kebersihan',
    body: 'Kamar dibersihkan penghuni; area bersama oleh petugas setiap hari.',
  },
  { title: 'Parkir', body: 'Motor gratis di halaman dalam. Mobil tidak tersedia.' },
]

/**
 * Landmarks pinned around the property, with a ten-minute walking radius.
 *
 * The design's schematic also carried "Indomaret" and "BCA". On a real map a
 * chain branch cannot be placed honestly without an actual address, so they are
 * left off rather than guessed at.
 *
 * "Central Park" is left off too: the mall is about 1,5 km away, so it falls
 * outside a ten-minute walking radius. The distance line above still repeats the
 * brief's "Central Park 0,2 km" — that figure needs confirming with the owner.
 * Coordinates live in `geography.ts`.
 */
export const surroundings = {
  caption:
    'Radius 10 menit jalan kaki. Lokasi perkiraan — alamat pasti dikirim saat jadwal survei dikonfirmasi.',
  places: ['Trisakti', 'Untar', 'Terminal Grogol', 'RS Royal Taruma'],
}
