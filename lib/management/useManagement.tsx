'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { Building } from '@/lib/content/management/buildings'
import * as store from './store'
import { useToday } from './today'

/**
 * The stored blob, read as an external store.
 *
 * `useSyncExternalStore` is the right tool rather than state-plus-effect: its
 * third argument is a separate server snapshot, so the server HTML and the
 * first client render agree and React swaps in the real value after hydration
 * instead of reporting a mismatch. It also subscribes to the `storage` event,
 * which means a change made in one tab reaches every other tab — a manager
 * marking a room taken while the public site is open beside it.
 */
function useStored() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
}

export function useManagement() {
  const stored = useStored()
  /* Room occupancy derives from tenancies, which are dated — so the merge needs
     to know what day it is. Null on the server, where the reference day stands
     in and produces the same arrangement. */
  const today = useToday()

  /** Returns false when the change could not be persisted — a full quota. */
  const apply = useCallback(
    (fn: (s: store.Stored) => store.Stored) => store.write(fn(store.getSnapshot())),
    [],
  )

  const buildings = useMemo(() => store.merge(stored, today), [stored, today])
  const surveys = useMemo(() => store.mergeSurveys(stored), [stored])
  const tenancies = useMemo(() => store.mergeTenancies(stored, today), [stored, today])
  const billing = useMemo(
    () => store.mergeBilling(stored, tenancies, today),
    [stored, tenancies, today],
  )

  return {
    buildings,
    surveys,
    tenancies,
    billing,
    today,
    log: stored.log,
    actor: stored.actor,
    apply,
    reset: store.reset,
  }
}

/**
 * The same records for the public screens, which never write.
 *
 * A visitor makes no changes, so this is read-only — it only has to reflect
 * what a manager did in this browser, which is the whole point of showing the
 * two sides together.
 */
export function useLiveBuildings(): Building[] {
  const stored = useStored()
  const today = useToday()
  return useMemo(() => store.merge(stored, today), [stored, today])
}
