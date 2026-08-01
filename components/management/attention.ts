import { CalendarClock, DoorOpen, ImageOff, Wrench, type LucideIcon } from 'lucide-react'
import { daysBetween } from '@/lib/dates'
import {
  buildingName,
  coverPhoto,
  occupancy,
  type Building,
} from '@/lib/content/management/buildings'

/**
 * What is not right, derived on every render.
 *
 * This is the dashboard's reason to exist. A manager already knows which
 * buildings they run; what they cannot hold in their head is which room has
 * been under repair for three weeks, or which building is still showing a house
 * number to visitors because nobody uploaded a photograph.
 *
 * Nothing here is stored. An item appears because the records say so and
 * disappears when they stop — a flag that had to be cleared by hand would drift
 * from the thing it describes.
 *
 * CAUTION: which of these a manager actually wants flagged is invented. It is
 * the one question worth putting to them about this screen.
 */

export type Attention = {
  id: string
  /** Amber for something to fix, plain for something merely worth knowing. */
  tone: 'attention' | 'muted'
  /** Names the kind of problem. One icon for all of them said only "problem",
   *  and a wrench beside a missing photograph said something untrue. */
  icon: LucideIcon
  title: string
  detail: string
  href: string
}

/**
 * `today` is passed in rather than read from the clock. This module renders on
 * the server too, where "now" is build time — see `lib/management/today.ts` for
 * the hydration failure that caused. `null` means the browser has not reported
 * a date yet, and every day count is simply left off that first paint.
 */
export function attentionItems(buildings: Building[], today: string | null): Attention[] {
  const items: Attention[] = []

  for (const building of buildings) {
    const name = buildingName(building, buildings)
    const href = `/management/buildings/${building.number}`
    const o = occupancy(building)

    for (const room of building.rooms) {
      if (!room.blocked) continue
      const days = today ? Math.max(0, daysBetween(room.blocked.since, today)) : null
      items.push({
        id: `${building.number}-blocked-${room.room}`,
        tone: 'attention',
        icon: Wrench,
        title:
          days === null
            ? `Kamar ${room.room} diblokir`
            : `Kamar ${room.room} diblokir ${days > 0 ? `${days} hari` : 'hari ini'}`,
        detail: `${name} · ${room.blocked.note}`,
        href,
      })
    }

    if (!coverPhoto(building)) {
      items.push({
        id: `${building.number}-nophoto`,
        tone: 'attention',
        icon: ImageOff,
        title: 'Belum ada foto',
        detail: `${name} · kartu properti menampilkan nomor rumah`,
        href,
      })
    }

    if (o.held > 0) {
      items.push({
        id: `${building.number}-held`,
        tone: 'muted',
        icon: CalendarClock,
        title: `${o.held} kamar dibooking, belum masuk`,
        detail: `${name} · belum menghasilkan sewa`,
        href,
      })
    }

    if (o.lettable > 0 && o.free === o.lettable) {
      items.push({
        id: `${building.number}-empty`,
        tone: 'attention',
        icon: DoorOpen,
        title: 'Seluruh kamar kosong',
        detail: `${name} · ${o.free} kamar belum ada penghuni`,
        href,
      })
    }
  }

  // Things to fix first, then things merely worth knowing.
  return items.sort((a, b) => (a.tone === b.tone ? 0 : a.tone === 'attention' ? -1 : 1))
}
