/**
 * Link targets in one place.
 *
 * Beranda, Pencarian, and Detail are built and link to each other. Everything
 * still pointing at `#` is a screen the design does not specify yet — survey
 * booking, the rental application, the partnership page. They stay honest
 * placeholders rather than invented flows.
 */
export const routes = {
  beranda: '/',
  pencarian: '/pencarian',
  /** One property only. Per-property routing needs data for the other thirty. */
  detail: '/detail',

  // In-page anchors on Beranda.
  kawasan: '/#kawasan',
  biaya: '/#biaya',
  franchise: '/#franchise',

  // Not designed yet.
  survei: '#',
  ajukanSewa: '#',
  kemitraan: '#',
  whatsapp: '#',
  kawasanLain: '#',
} as const
