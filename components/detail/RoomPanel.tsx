'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { defaultRoomSize, photos, roomSpec, rooms } from '@/lib/content/detail'
import { formatRupiah } from '@/lib/format'
import { routes } from '@/lib/routes'

const statusTone = {
  available: 'text-available',
  held: 'text-held',
  occupied: 'text-ink-soft',
} as const

/**
 * What the selected room actually is, and what it costs.
 *
 * Only a vacant room can be surveyed or applied for, so the actions disable
 * themselves rather than leading somewhere that would reject you.
 *
 * Mounted with a key on the room number, so picking a different room resets the
 * photo choice without an effect.
 */
export function RoomPanel({ roomNumber }: { roomNumber: string }) {
  const room = rooms[roomNumber]
  const [chosenPhoto, setChosenPhoto] = useState<number | null>(null)
  const shown = chosenPhoto ?? room.photo
  const vacant = room.status === 'available'
  const statusLabel = room.vacancy ?? (room.status === 'held' ? 'dibooking' : 'terisi')

  return (
    <aside className="overflow-hidden rounded-card border border-line bg-paper shadow-max">
      <div className="relative aspect-3/2 bg-photo-bg">
        <Image
          src={photos[shown].src}
          alt={photos[shown].label}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex gap-1.5 border-b border-line px-3 py-2">
        {photos.slice(0, 4).map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Lihat ${photo.label}`}
            aria-pressed={shown === index}
            onClick={() => setChosenPhoto(index)}
            className={cn(
              'relative aspect-square flex-1 cursor-pointer overflow-hidden rounded-badge',
              shown === index && 'outline-2 outline-offset-1 outline-plum',
            )}
          >
            <Image src={photo.src} alt="" fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-mono text-[15px] font-medium">
            Kamar {roomNumber} · {room.type}
          </h2>
          <p className={cn('font-mono text-[13px] font-medium', statusTone[room.status])}>
            {statusLabel}
          </p>
        </div>

        <p className="mt-2 mb-1.5 font-mono text-[32px] leading-none font-medium">
          {formatRupiah(room.rent)}
          <span className="font-body text-[14px] font-normal text-ink-soft"> /bulan</span>
        </p>
        <p className="text-[13px] leading-[1.6] text-ink-soft">
          {room.size ?? defaultRoomSize} · {roomSpec}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <Button href={vacant ? routes.survei : undefined} size="lg" disabled={!vacant}>
            Jadwalkan survei
          </Button>
          <Button
            href={vacant ? routes.ajukanSewa : undefined}
            variant="secondary"
            disabled={!vacant}
          >
            Ajukan sewa
          </Button>
        </div>
      </div>
    </aside>
  )
}
