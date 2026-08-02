import {
  CalendarClock,
  DoorOpen,
  ImageOff,
  UsersRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { daysBetween, formatDate, relativeDays } from '@/lib/dates'
import { formatRupiah } from '@/lib/format'
import { daysUntilDue } from '@/lib/content/management/tenancies'
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
/**
 * How much warning a rent reminder gets.
 *
 * Three days. Seven was the first choice and was wrong for a monthly kos: with
 * nineteen tenants due across a month, a seven-day window holds four or five at
 * any moment and never empties, which turns the list into wallpaper. H-3 is
 * also the reminder a kos actually sends.
 */
const DUE_SOON_DAYS = 3

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

    /* Tenants. Nothing below is possible without today, so the whole block
       waits for the browser rather than guessing from the build date. */
    if (today) {
      for (const room of building.rooms) {
        if (room.incoming && !room.tenant) {
          items.push({
            id: `${building.number}-held-${room.room}`,
            tone: 'muted',
            icon: CalendarClock,
            // Named and dated. "1 kamar dibooking" told a manager nothing they
            // could act on; a name and a date is something they can prepare for.
            title: `${room.incoming.name} masuk ${formatDate(room.incoming.movedIn)}`,
            detail: `${name} · kamar ${room.room} · belum menghasilkan sewa`,
            href,
          })
        }

        const tenant = room.tenant
        if (!tenant) continue

        /* Two people in one room. Happens when a replacement's move-in arrives
           and nobody confirmed the previous tenant out — the prompt below was
           ignored long enough for the dates to overlap. */
        if (room.conflict) {
          items.push({
            id: `${building.number}-conflict-${room.room}`,
            tone: 'attention',
            icon: UsersRound,
            title: `Dua penghuni tercatat di kamar ${room.room}`,
            detail: `${name} · ${tenant.name} belum dikonfirmasi keluar, ${room.conflict.name} sudah masuk ${formatDate(room.conflict.movedIn)}`,
            href,
          })
          continue
        }

        /* A leaving date that has arrived. The room is still occupied and stays
           that way until somebody confirms — this is the prompt to do it, and
           the reason a date alone never frees a room. */
        if (tenant.leavingOn && daysBetween(tenant.leavingOn, today) >= 0) {
          const late = daysBetween(tenant.leavingOn, today)
          items.push({
            id: `${building.number}-leaving-${room.room}`,
            tone: 'attention',
            icon: DoorOpen,
            title: `Kontrak ${tenant.name} sudah habis`,
            detail: `${name} · kamar ${room.room} · ${
              late === 0 ? 'hari ini' : relativeDays(-late)
            } — kamar masih terhitung terisi sampai keluarnya dikonfirmasi`,
            href,
          })
          continue
        }

        /* Rent falling due. Three days, not seven: nineteen tenants spread
           across a month put roughly two in a three-day window and five in a
           seven-day one, and a list that is never short stops being read. */
        const due = daysUntilDue(tenant, today)
        if (due <= DUE_SOON_DAYS) {
          items.push({
            id: `${building.number}-due-${room.room}`,
            tone: 'muted',
            icon: CalendarClock,
            title: `${tenant.name} jatuh tempo ${relativeDays(due)}`,
            detail: `${name} · kamar ${room.room} · ${formatRupiah(tenant.agreedRent)}`,
            href,
          })
        }
      }
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
