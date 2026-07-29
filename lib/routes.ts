/**
 * Link targets in one place.
 *
 * The Beranda design links out to the search and property-detail screens.
 * Those exist in the design bundle but are not built yet, so they resolve to
 * `#`. Building them is a single edit here.
 */
export const routes = {
  pencarian: '#',
  detail: '#',
  franchise: '#franchise',
  kawasan: '#kawasan',
  biaya: '#biaya',
  whatsapp: '#',
  survei: '#',
} as const
