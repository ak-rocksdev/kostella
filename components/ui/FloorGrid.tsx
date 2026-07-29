'use client'

import { cn } from '@/lib/cn'
import type { Status } from '@/lib/content/types'

/**
 * Status is carried three ways at once — fill, border, and pattern — so it never
 * depends on colour alone: taken cells are grey with faded text, held cells are
 * hatched, and only vacant cells are filled solid.
 *
 * Square corners on purpose. These read as a floorplan, not as buttons.
 */
const cells: Record<Status, string> = {
  available: 'border-2 border-available bg-available text-white',
  held: 'border border-held text-held bg-[repeating-linear-gradient(45deg,#fff_0_4px,#F5E3D7_4px_8px)]',
  occupied: 'border border-line bg-occupied-soft text-occupied-faded',
}

export type Room = {
  room: string
  status: Status
  type?: string
  price?: string
}

type RoomCellProps = Room & {
  selected?: boolean
  compact?: boolean
  onSelect?: (room: Room) => void
}

export function RoomCell({ room, status, type, price, selected, compact, onSelect }: RoomCellProps) {
  const label = { available: 'tersedia', held: 'dibooking', occupied: 'terisi' }[status]

  return (
    <button
      type="button"
      aria-pressed={onSelect ? selected : undefined}
      aria-label={`Kamar ${room}${type ? `, ${type}` : ''}${price ? `, ${price}` : ''} — ${label}`}
      disabled={!onSelect}
      onClick={onSelect ? () => onSelect({ room, status, type, price }) : undefined}
      className={cn(
        'flex flex-col items-start gap-0.5 rounded-none text-left font-mono',
        compact ? 'min-w-16 px-2.5 py-2' : 'min-w-27 px-3.5 py-3',
        onSelect ? 'cursor-pointer' : 'cursor-default',
        selected && 'outline-2 outline-offset-2 outline-plum',
        cells[status],
      )}
    >
      <span aria-hidden className="text-[15px] font-medium">
        {room}
      </span>
      {!compact && type && (
        <span aria-hidden className="font-body text-[11px] font-medium">
          {type}
        </span>
      )}
      {!compact && price && (
        <span aria-hidden className="text-[11px]">
          {price}
        </span>
      )}
    </button>
  )
}

export type Floor = { label: string; rooms: Room[] }

type FloorGridProps = {
  floors: Floor[]
  selectedRoom?: string
  onSelect?: (room: Room) => void
  compact?: boolean
  /** Stagger the cells in, 40ms per cell. Used on first paint of a property. */
  animate?: boolean
}

export function FloorGrid({ floors, selectedRoom, onSelect, compact, animate }: FloorGridProps) {
  return (
    <div className="flex flex-col gap-4">
      {floors.map((floor, floorIndex) => (
        <div
          key={floor.label}
          className="grid items-start gap-2 sm:grid-cols-[90px_1fr] sm:gap-5"
        >
          <h3 className="text-eyebrow text-ink-soft uppercase sm:pt-3">{floor.label}</h3>
          <ul className="flex flex-wrap gap-2">
            {floor.rooms.map((room, roomIndex) => (
              <li
                key={room.room}
                style={
                  animate
                    ? {
                        animation: 'kst-cell-in 300ms ease-out both',
                        animationDelay: `${(floorIndex * 4 + roomIndex) * 40}ms`,
                      }
                    : undefined
                }
              >
                <RoomCell
                  {...room}
                  compact={compact}
                  selected={selectedRoom === room.room}
                  onSelect={onSelect}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function FloorGridLegend() {
  const items: Array<[Status, string]> = [
    ['available', 'tersedia'],
    ['held', 'dibooking'],
    ['occupied', 'terisi'],
  ]

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map(([status, label]) => (
        <li key={status} className="flex items-center gap-2 text-[13px] text-ink-soft">
          <span aria-hidden className={cn('inline-block size-3.5', cells[status])} />
          {label}
        </li>
      ))}
    </ul>
  )
}
