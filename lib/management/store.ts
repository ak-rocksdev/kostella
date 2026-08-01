/**
 * Where the management panel's changes live.
 *
 * The site is a static export — no backend, no database. Changes are held in
 * `localStorage`: enough to demonstrate the whole loop in one browser, and
 * nothing more. Every screen that writes here says so on its face.
 *
 * The seed records in `lib/content/management/buildings.ts` are never mutated.
 * This module stores *overrides* on top of them, so resetting is deleting one
 * key rather than reconstructing a starting state.
 */
import {
  buildings as SEED,
  type Building,
  type Blocked,
  type BuildingPhoto,
  type FacilityId,
  type RoomState,
  type TenancyId,
} from '@/lib/content/management/buildings'
import type { Status } from '@/lib/content/types'

/**
 * One key, one version. A stored blob whose version does not match is
 * discarded and reseeded — never migrated.
 *
 * Migrating prototype data buys nothing; silently reading a stale shape is how
 * a demo breaks mid-presentation after a deploy. Discarding is loud,
 * predictable and recoverable, which is the right trade here and the wrong one
 * once this stops being a prototype.
 */
const KEY = 'kostella.management.v1'
const VERSION = 1

export type AuditAction =
  | 'status'
  | 'rent'
  | 'block'
  | 'unblock'
  | 'facility'
  | 'tenancy'
  | 'photo-add'
  | 'photo-remove'
  | 'photo-cover'
  | 'photo-label'

export type AuditEntry = {
  id: string
  /** ISO timestamp — when it was recorded. */
  at: string
  actor: string
  building: string
  /** Absent for building-level changes such as facilities. */
  room?: string
  action: AuditAction
  /** Human-readable, so the log stays legible without re-deriving anything. */
  from: string
  to: string
  /** Required for rent, block and unblock — the change an auditor cannot
   *  otherwise resolve. */
  note?: string
  /** For status: the date the change takes effect, which is not always today.
   *  Phase 4 bills from this. */
  effectiveFrom?: string
}

type RoomOverride = Partial<Pick<RoomState, 'status' | 'rent'>> & {
  /** `null` means explicitly unblocked, distinct from "not overridden". */
  blocked?: Blocked | null
}

type BuildingOverride = Partial<Pick<Building, 'facilities' | 'tenancy' | 'photos'>>

type Stored = {
  version: number
  actor: string
  /** Keyed "362/211". */
  rooms: Record<string, RoomOverride>
  /** Keyed "362". */
  buildings: Record<string, BuildingOverride>
  log: AuditEntry[]
}

/**
 * Who is acting. There is no authentication, so there is no real user — this
 * is chosen, not verified, and the UI says as much.
 *
 * It exists because an audit log with a single anonymous user proves nothing.
 * Switching actor and making a second change is what shows the log doing its
 * job.
 */
export const ACTORS = ['Pengelola 362', 'Pengelola Grogol', 'Kantor Pusat'] as const

const empty = (): Stored => ({
  version: VERSION,
  actor: ACTORS[0],
  rooms: {},
  buildings: {},
  log: [],
})

function readRaw(): Stored {
  if (typeof window === 'undefined') return empty()
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return empty()
    const parsed = JSON.parse(raw) as Stored
    // Wrong version, or a blob that is not the shape we expect: start over.
    if (parsed?.version !== VERSION) return empty()
    return { ...empty(), ...parsed }
  } catch {
    // Corrupt JSON, or storage blocked entirely. Neither is worth an error
    // screen in a prototype; the panel simply starts from the seed.
    return empty()
  }
}

/* ── Subscription ─────────────────────────────────────────────────────────
   An external store, read through `useSyncExternalStore`. That hook exists for
   exactly this: it takes a separate server snapshot, so the first client render
   matches the server HTML and React swaps in the real value after hydration
   rather than throwing a mismatch.

   `getSnapshot` must return a referentially stable value or React re-renders
   forever, hence the module-level cache. */

const SERVER_SNAPSHOT = empty()
let cached: Stored | null = null
const listeners = new Set<() => void>()

const emit = () => listeners.forEach((fn) => fn())

/** Fired when another tab writes. A manager changing a room in one tab and the
 *  public page updating in another is the demonstration, and it costs one
 *  listener. */
function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== KEY) return
  cached = null
  emit()
}

export function subscribe(fn: () => void) {
  listeners.add(fn)
  if (listeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage)
  }
  return () => {
    listeners.delete(fn)
    if (listeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage)
    }
  }
}

export function getSnapshot(): Stored {
  if (cached === null) cached = readRaw()
  return cached
}

export function getServerSnapshot(): Stored {
  return SERVER_SNAPSHOT
}

/**
 * Returns false when the change could not be persisted.
 *
 * It used to swallow the failure. That was tolerable while everything stored
 * here was a few bytes; a photograph can exhaust the ~5 MB `localStorage`
 * budget on its own, and a manager watching an image appear and then vanish on
 * reload deserves to be told at the time.
 *
 * The in-memory value is kept either way, so the current session stays coherent
 * even when the write fails.
 */
function write(next: Stored): boolean {
  cached = next
  emit()
  if (typeof window === 'undefined') return true
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
    return true
  } catch {
    // Quota exhausted, or storage blocked entirely by the browser.
    return false
  }
}

export function reset() {
  cached = empty()
  emit()
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* nothing to clear */
  }
}

/**
 * Seed records with stored overrides applied.
 *
 * An empty blob returns the seed untouched, which is what the server snapshot
 * produces — so the server HTML and the first client render agree.
 */
export function merge(stored: Stored): Building[] {
  return SEED.map((building) => {
    const b = stored.buildings[building.number]

    return {
      ...building,
      facilities: b?.facilities ?? building.facilities,
      tenancy: b?.tenancy ?? building.tenancy,
      photos: b?.photos ?? building.photos,
      rooms: building.rooms.map((room) => {
        const r = stored.rooms[`${building.number}/${room.room}`]
        if (!r) return room

        const merged: RoomState = { ...room }
        if (r.status) merged.status = r.status
        if (r.rent != null) merged.rent = r.rent
        // null is meaningful: unblocked. undefined means untouched.
        if (r.blocked !== undefined) {
          if (r.blocked === null) delete merged.blocked
          else merged.blocked = r.blocked
        }
        return merged
      }),
    }
  })
}

/* ── Mutations ────────────────────────────────────────────────────────────
   Each takes the current blob and returns the next one, appending exactly one
   audit entry. The log is append-only: a mistake is corrected by another
   logged change, never by editing or removing an entry. That is what makes it
   an audit trail rather than a status field with a date attached. */

let counter = 0
const entryId = (at: string) => `${at}-${(counter += 1)}`

function log(stored: Stored, entry: Omit<AuditEntry, 'id' | 'at' | 'actor'>): Stored {
  const at = new Date().toISOString()
  return {
    ...stored,
    log: [{ id: entryId(at), at, actor: stored.actor, ...entry }, ...stored.log],
  }
}

const roomKey = (building: string, room: string) => `${building}/${room}`

const statusLabel: Record<Status, string> = {
  available: 'kosong',
  held: 'dibooking',
  occupied: 'terisi',
}

export function setActor(stored: Stored, actor: string): Stored {
  return { ...stored, actor }
}

export function setStatus(
  stored: Stored,
  building: string,
  room: RoomState,
  status: Status,
  effectiveFrom: string,
): Stored {
  const key = roomKey(building, room.room)
  const next = {
    ...stored,
    rooms: { ...stored.rooms, [key]: { ...stored.rooms[key], status } },
  }
  return log(next, {
    building,
    room: room.room,
    action: 'status',
    from: statusLabel[room.status],
    to: statusLabel[status],
    effectiveFrom,
  })
}

export function setRent(
  stored: Stored,
  building: string,
  room: RoomState,
  rent: number,
  note: string,
): Stored {
  const key = roomKey(building, room.room)
  const next = {
    ...stored,
    rooms: { ...stored.rooms, [key]: { ...stored.rooms[key], rent } },
  }
  return log(next, {
    building,
    room: room.room,
    action: 'rent',
    from: String(room.rent),
    to: String(rent),
    note,
  })
}

export function setBlocked(
  stored: Stored,
  building: string,
  room: RoomState,
  blocked: Blocked | null,
  note: string,
): Stored {
  const key = roomKey(building, room.room)
  const next = {
    ...stored,
    rooms: { ...stored.rooms, [key]: { ...stored.rooms[key], blocked } },
  }
  return log(next, {
    building,
    room: room.room,
    action: blocked ? 'block' : 'unblock',
    from: room.blocked ? 'diblokir' : 'aktif',
    to: blocked ? 'diblokir' : 'aktif',
    note,
  })
}

export function setFacilities(
  stored: Stored,
  building: string,
  before: FacilityId[],
  after: FacilityId[],
  changed: FacilityId,
  label: string,
): Stored {
  const next = {
    ...stored,
    buildings: {
      ...stored.buildings,
      [building]: { ...stored.buildings[building], facilities: after },
    },
  }
  return log(next, {
    building,
    action: 'facility',
    from: before.includes(changed) ? `${label}: ada` : `${label}: tidak ada`,
    to: after.includes(changed) ? `${label}: ada` : `${label}: tidak ada`,
  })
}

const photosOf = (stored: Stored, building: string) =>
  stored.buildings[building]?.photos ?? SEED.find((b) => b.number === building)?.photos ?? []

const withPhotos = (stored: Stored, building: string, photos: BuildingPhoto[]): Stored => ({
  ...stored,
  buildings: { ...stored.buildings, [building]: { ...stored.buildings[building], photos } },
})

export function addPhoto(stored: Stored, building: string, photo: BuildingPhoto): Stored {
  const before = photosOf(stored, building)
  return log(withPhotos(stored, building, [...before, photo]), {
    building,
    action: 'photo-add',
    from: `${before.length} foto`,
    to: `${before.length + 1} foto`,
    note: photo.label,
  })
}

export function removePhoto(stored: Stored, building: string, photo: BuildingPhoto): Stored {
  const before = photosOf(stored, building)
  return log(
    withPhotos(
      stored,
      building,
      before.filter((p) => p.id !== photo.id),
    ),
    {
      building,
      action: 'photo-remove',
      from: `${before.length} foto`,
      to: `${before.length - 1} foto`,
      note: photo.label,
    },
  )
}

/** Cover is simply first, so promoting one is a reorder rather than a flag. */
export function setCover(stored: Stored, building: string, photo: BuildingPhoto): Stored {
  const before = photosOf(stored, building)
  const next = [photo, ...before.filter((p) => p.id !== photo.id)]
  return log(withPhotos(stored, building, next), {
    building,
    action: 'photo-cover',
    from: before[0]?.label ?? '—',
    to: photo.label,
  })
}

export function setPhotoLabel(
  stored: Stored,
  building: string,
  photo: BuildingPhoto,
  label: string,
): Stored {
  const before = photosOf(stored, building)
  return log(
    withPhotos(
      stored,
      building,
      before.map((p) => (p.id === photo.id ? { ...p, label } : p)),
    ),
    { building, action: 'photo-label', from: photo.label, to: label },
  )
}

export function setTenancy(
  stored: Stored,
  building: string,
  from: string,
  tenancy: TenancyId,
  to: string,
): Stored {
  const next = {
    ...stored,
    buildings: { ...stored.buildings, [building]: { ...stored.buildings[building], tenancy } },
  }
  return log(next, { building, action: 'tenancy', from, to })
}

export type { Stored }
export { write }
