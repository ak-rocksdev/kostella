'use client'

import { useSyncExternalStore } from 'react'
import { isoDate } from '@/lib/dates'

/**
 * Today, or `null` until the browser has said so.
 *
 * The site is a static export: its HTML is generated once, at build time, and
 * served unchanged for weeks. Anything rendered from "now" therefore disagreed
 * with the browser the moment the two fell on different days — React threw
 * error #418, hydration failed, and it did so precisely when someone opened the
 * panel to demonstrate it rather than while it was being built.
 *
 * Proven rather than assumed: shifting the browser's clock five days forward
 * before the bundle loaded turned a clean console into #418 on the dashboard.
 *
 * So the server renders no date at all. `null` is what the build genuinely
 * knows, the first client render agrees with it, and the real date arrives on
 * the next paint — which is exactly what `useSyncExternalStore`'s third
 * argument is for, and the same mechanism the store already uses.
 *
 * Callers must handle `null`. Reserve the space the date will occupy so the
 * layout does not jump when it arrives.
 */

// Today changes at most once while a tab is open. Subscribing to nothing is
// honest: this store has no events, and returning the same string on every
// call keeps React from re-rendering.
const subscribe = () => () => {}

// Value-stable within a day, so React's identity check passes; crossing
// midnight in an open tab re-renders once, which is correct.
const getSnapshot = (): string | null => isoDate(new Date())

const getServerSnapshot = (): string | null => null

export function useToday(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
