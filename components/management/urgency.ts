import { CalendarClock, DoorOpen, TriangleAlert, type LucideIcon } from 'lucide-react'
import { relativeDays } from '@/lib/dates'

/**
 * How loud a row is allowed to be.
 *
 * Three steps, and colour tracks **urgency rather than category** — a departure
 * and a due date at the same distance read alike, because to a manager they are
 * the same amount of "not yet".
 *
 * The first version had two tones and seeded data in which the second never
 * occurred: every row on the demo screen rendered the same grey. A distinction
 * that never distinguishes is not a distinction, which is the same reason an
 * "empty rooms are the expensive ones" line was cut from the occupancy work.
 *
 * Colour never carries it alone. Every level puts a word in the chip.
 */
export type Level = 'late' | 'now' | 'soon'

export const LEVEL: Record<Level, { chip: string; mark: string; icon: string; ring?: string }> = {
  /* Something is already wrong. The only level that marks the whole card. */
  late: {
    chip: 'bg-held-soft text-held',
    mark: 'text-held',
    icon: 'bg-held-soft text-held',
    ring: 'ring-1 ring-held/50',
  },
  /* Today or tomorrow — the panel's action colour, because it is an action. */
  now: {
    chip: 'bg-plum/10 text-plum',
    mark: 'text-plum',
    icon: 'bg-plum/10 text-plum',
  },
  /* Days away. Deliberately quiet: if everything shouts, nothing does. */
  soon: {
    chip: 'bg-stone text-ink-soft',
    mark: 'text-ink-soft',
    icon: 'bg-stone text-ink-soft',
  },
}

export type Urgency = {
  level: Level
  /** Short, for a chip in a dense row. */
  chip: string
  icon: LucideIcon
}

/** Where a row sits, given what is true about it. */
export function urgencyOf({
  overdueBy,
  leaving,
  due,
}: {
  /** Days since a leaving date passed unconfirmed, if it has. */
  overdueBy?: number
  /** Announced a departure that has not arrived yet. */
  leaving?: boolean
  /** Days until rent falls due. */
  due?: number | null
}): Urgency {
  if (overdueBy !== undefined) {
    return {
      level: 'late',
      chip: overdueBy === 0 ? 'Keluar hari ini' : `Terlewat ${overdueBy} hari`,
      icon: TriangleAlert,
    }
  }
  if (leaving) return { level: 'soon', chip: 'Akan keluar', icon: DoorOpen }
  if (due === null || due === undefined)
    return { level: 'soon', chip: 'Belum masuk', icon: CalendarClock }
  return {
    level: due <= 1 ? 'now' : 'soon',
    chip: relativeDays(due),
    icon: CalendarClock,
  }
}
