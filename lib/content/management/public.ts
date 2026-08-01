/**
 * The bridge between what a manager controls and what a visitor sees.
 *
 * The split is deliberate. Management owns **operational truth** — which rooms
 * exist, what they cost, whether they are free, what the building offers. The
 * public content files keep **presentation and location** — photographs, walking
 * distances, marketing copy — none of which a manager edits in phase 1.
 *
 * So a public record is its own presentation fields with the operational ones
 * overlaid. One source per fact, no duplication to drift.
 *
 * A public record with no management counterpart passes through untouched. That
 * is not a fallback for tidiness: Beranda lists buildings **2C** and **360**
 * while the search screen and footer list **2A3** and **361**, a contradiction
 * inherited from the design bundle. Passing through leaves it visible instead of
 * quietly resolving it in one direction and hiding the question from the client.
 */
import type { Property } from '../beranda'
import type { SearchResult } from '../pencarian'
import {
  buildingName,
  cheapestFree,
  coverPhoto,
  facilityLabel,
  occupancy,
  tenancyLabel,
  type Building,
} from './buildings'
import type { Status } from '../types'
import { formatRupiah } from '../../format'

/**
 * What a visitor is told about availability.
 *
 * A blocked room is simply absent — a renter does not need to know a room is
 * under repair, only that it cannot be taken. `occupancy()` already excludes
 * them, so this needs no special case.
 *
 * `held` at building level means "nothing free, but something is moving": the
 * public badge reads "Sisa 1" rather than "Penuh", which is true and useful.
 */
function publicStatus(building: Building): { status: Status; count?: number } {
  const o = occupancy(building)
  if (o.free > 0) return { status: 'available', count: o.free }
  if (o.held > 0) return { status: 'held' }
  return { status: 'occupied' }
}

const facilityLabels = (b: Building) => b.facilities.map(facilityLabel)

/** A Beranda property card, with live rent, availability and facilities. */
export function liveProperty(base: Property, building?: Building): Property {
  if (!building) return base

  const { status, count } = publicStatus(building)
  const cheapest = cheapestFree(building)

  return {
    ...base,
    name: buildingName(building),
    // The cover a manager chose. Falls back to the bundle's stock image only
    // where a building has no photographs yet.
    photo: coverPhoto(building)?.src ?? base.photo,
    tenancy: tenancyLabel[building.tenancy],
    facilities: facilityLabels(building),
    // Falls back to the base figure when nothing is free: a card still has to
    // state a price, and the last known one beats an empty space.
    priceFrom: cheapest ?? base.priceFrom,
    status,
    count,
  }
}

/** A search result, with live rent, vacancy, facilities and tenancy. */
export function liveResult(base: SearchResult, building?: Building): SearchResult {
  if (!building) return base

  const o = occupancy(building)
  const { status } = publicStatus(building)
  const cheapest = cheapestFree(building)

  return {
    ...base,
    name: buildingName(building),
    // The cover a manager chose. Falls back to the bundle's stock image only
    // where a building has no photographs yet.
    photo: coverPhoto(building)?.src ?? base.photo,
    tenancy: building.tenancy,
    facilities: facilityLabels(building),
    rent: cheapest ?? base.rent,
    vacant: o.free,
    // Lettable, not total: a room withdrawn for repair is not one of the rooms
    // a visitor is choosing between, so "3 dari 8" would be counting a door
    // they cannot open.
    total: o.lettable,
    status,
  }
}

export const findLive = (buildings: Building[], number: string) =>
  buildings.find((b) => b.number === number)

/**
 * The public floor grid for one building.
 *
 * Blocked rooms are rendered as unavailable rather than hidden. Removing them
 * would leave a hole in the numbering and quietly shrink the building; a
 * visitor's question is only "can I take it", and the answer is no either way.
 * The manager's grid is the one that says *why*.
 */
export function publicFloors(building: Building) {
  return building.floors.map((label) => ({
    label,
    rooms: building.rooms
      .filter((r) => r.floor === label)
      .map((r) => ({
        room: r.room,
        type: r.type,
        price: formatRupiah(r.rent),
        status: (r.blocked ? 'occupied' : r.status) as Status,
      })),
  }))
}

/**
 * The public gallery for one building.
 *
 * Empty until a manager adds something, and the caller keeps its own fallback
 * for that — a property with no photographs should show the bundle's stock
 * rather than an empty frame.
 */
export const publicGallery = (building: Building | undefined) =>
  building?.photos.map((p) => ({ src: p.src, label: p.label })) ?? []

/** One room's live figures, or undefined where the building is not managed. */
export const liveRoom = (building: Building | undefined, room: string) =>
  building?.rooms.find((r) => r.room === room)
