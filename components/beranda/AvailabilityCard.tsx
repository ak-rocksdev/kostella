'use client'

import Link from 'next/link'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'
import { hero, type VacantRoom } from '@/lib/content/beranda'
import { formatRupiah } from '@/lib/format'
import { routes } from '@/lib/routes'

const MAX_VISIBLE = 4

/** Availability stated as a date. Green reinforces it; the words carry it. */
function VacancyPill({ children }: { children: string }) {
  return (
    <span className="rounded-badge bg-available px-2 py-[3px] font-figure text-[11px] font-medium whitespace-nowrap text-white">
      {children}
    </span>
  )
}

function RoomRow({ room, first }: { room: VacantRoom; first: boolean }) {
  return (
    <Link
      href={routes.detail}
      aria-label={`Kamar ${room.room} ${room.type} di Kostella ${room.building}, ${formatRupiah(room.rent)} per bulan, ${room.vacancy}`}
      className={cn(
        'flex items-center gap-2.5 py-2.5 font-figure text-[13px] text-ink',
        !first && 'border-t border-line',
      )}
    >
      <span aria-hidden className="numeral min-w-10 text-[17px]">
        {room.building}
      </span>
      <span aria-hidden className="truncate text-ink-soft">
        {room.room} · {room.type}
      </span>
      <span aria-hidden className="ml-auto font-medium whitespace-nowrap">
        {formatRupiah(room.rent)}
      </span>
      <span aria-hidden>
        <VacancyPill>{room.vacancy}</VacancyPill>
      </span>
    </Link>
  )
}

type EmptyReason =
  | { kind: 'area'; area: string; nearest: string }
  | { kind: 'budget'; cheapest: VacantRoom }

/** An empty result is an invitation to act, never a dead end. */
function EmptyState({ reason, onFix }: { reason: EmptyReason; onFix: () => void }) {
  const copy =
    reason.kind === 'area'
      ? {
          heading: `Belum ada kamar kosong di ${reason.area}.`,
          body: `Yang terdekat ada di ${reason.nearest}.`,
          action: `Lihat ${reason.nearest}`,
        }
      : {
          heading: 'Belum ada kamar di bawah budget itu.',
          body: `Yang termurah ${formatRupiah(reason.cheapest.rent)} di gedung ${reason.cheapest.building}.`,
          action: `Naikkan ke ${formatRupiah(reason.cheapest.rent)}`,
        }

  return (
    <div className="py-4">
      <p className="text-[15px] leading-[1.5] font-semibold">{copy.heading}</p>
      <p className="mt-1 text-[14px] leading-[1.6] text-ink-soft">{copy.body}</p>
      <button
        type="button"
        onClick={onFix}
        className="mt-3 cursor-pointer rounded-badge border border-line bg-paper px-3.5 py-[7px] text-[14px] font-semibold text-ink transition-colors duration-150 hover:border-ink-soft"
      >
        {copy.action}
      </button>
    </div>
  )
}

type AvailabilityCardProps = {
  rooms: VacantRoom[]
  area: string
  emptyReason: EmptyReason | null
  onFixEmpty: () => void
  className?: string
}

/**
 * The claim, made checkable. These are the rooms that are genuinely free right
 * now — filtered live by the budget set above, so the list is an answer to a
 * question the visitor just asked rather than a static brochure panel.
 */
export function AvailabilityCard({
  rooms,
  area,
  emptyReason,
  onFixEmpty,
  className,
}: AvailabilityCardProps) {
  const visible = rooms.slice(0, MAX_VISIBLE)
  const remaining = rooms.length - visible.length

  return (
    <div
      className={cn(
        'rounded-card border border-line bg-paper p-5 shadow-float',
        className,
      )}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <Eyebrow>
          {hero.availability.eyebrow} · {area}
        </Eyebrow>
        <span className="flex items-center gap-1.5 font-figure text-[12px] text-ink-soft">
          <span aria-hidden className="size-[7px] rounded-full bg-available" />
          {hero.availability.updated}
        </span>
      </div>

      {emptyReason ? (
        <EmptyState reason={emptyReason} onFix={onFixEmpty} />
      ) : (
        <>
          <ul aria-live="polite" className="flex flex-col">
            {visible.map((room, i) => (
              <li key={`${room.building}-${room.room}`}>
                <RoomRow room={room} first={i === 0} />
              </li>
            ))}
          </ul>
          {remaining > 0 && (
            <p className="border-t border-line pt-2.5 text-[13px] text-ink-soft">
              dan {remaining} kamar lain di bawah budget kamu
            </p>
          )}
        </>
      )}
    </div>
  )
}

export type { EmptyReason }
