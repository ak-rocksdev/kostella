/**
 * Dates, handled in one place and in local time.
 *
 * Two hazards this exists to close.
 *
 * **`new Date('2026-08-01')` is UTC midnight, not local midnight.** Read back
 * with local getters west of Greenwich it is the previous day. Every date in
 * this project is a calendar day someone in Jakarta means — a move-in, a due
 * date — so they are parsed by their parts and never through the string
 * constructor.
 *
 * **Month lengths.** `setMonth` on the 31st of a month rolls into the next one:
 * 31 March minus one month is 3 March, not 28 February. A tenant who moved in
 * on the 31st is due on the last day of a short month, so shifting a month
 * clamps rather than overflows.
 */

/** `YYYY-MM-DD` in local time. */
export function isoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/** Parses `YYYY-MM-DD` as local midnight. Never `new Date(iso)`. */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, days: number): string {
  const d = parseDate(iso)
  d.setDate(d.getDate() + days)
  return isoDate(d)
}

/** Days in the calendar month containing `year`/`month` (0-indexed month). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Shifts by whole months, clamping the day to the target month's length.
 *
 * `addMonths('2026-03-31', -1)` is `2026-02-28`, not `2026-03-03`.
 */
export function addMonths(iso: string, months: number): string {
  const d = parseDate(iso)
  const day = d.getDate()
  const target = new Date(d.getFullYear(), d.getMonth() + months, 1)
  target.setDate(Math.min(day, daysInMonth(target.getFullYear(), target.getMonth())))
  return isoDate(target)
}

/** Whole days from `from` to `to`. Negative when `to` is in the past. */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseDate(to).getTime() - parseDate(from).getTime()) / 86_400_000)
}

const LONG = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
const SHORT = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })

/** "17 Agustus 2026" */
export const formatDate = (iso: string) => LONG.format(parseDate(iso))

/** "17 Agt" — for a column where the year is already obvious. */
export const formatDateShort = (iso: string) => SHORT.format(parseDate(iso))

/** "hari ini", "besok", "3 hari lagi", "terlewat 2 hari". */
export function relativeDays(days: number): string {
  if (days === 0) return 'hari ini'
  if (days === 1) return 'besok'
  if (days === -1) return 'kemarin'
  return days > 0 ? `${days} hari lagi` : `terlewat ${Math.abs(days)} hari`
}
