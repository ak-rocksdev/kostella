import { redirect } from 'next/navigation'

/**
 * The dashboard the design bundle specifies lands here in phase 2. Until then
 * the panel opens on the buildings list, which is the record everything else
 * attaches to.
 */
export default function ManagementIndex() {
  redirect('/management/buildings')
}
