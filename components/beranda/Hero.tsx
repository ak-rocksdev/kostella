'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow, SectionEyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'
import { areaChips, hero, vacantRooms, type VacantRoom } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

/** Availability, stated as a date. Green reinforces it; the words carry it. */
function VacancyPill({ children }: { children: string }) {
  return (
    <span className="rounded-badge bg-available px-2 py-[3px] font-mono text-[11px] font-medium whitespace-nowrap text-white">
      {children}
    </span>
  )
}

function VacantRoomRow({ room, first }: { room: VacantRoom; first: boolean }) {
  return (
    <Link
      href={routes.detail}
      aria-label={`Kamar ${room.room} ${room.type} di Kostella ${room.building}, ${room.price} per bulan, ${room.vacancy}`}
      className={cn(
        'flex items-center gap-2.5 py-2.5 font-mono text-[13px] text-ink',
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
        {room.price}
      </span>
      <span aria-hidden>
        <VacancyPill>{room.vacancy}</VacancyPill>
      </span>
    </Link>
  )
}

/**
 * The page opens on inventory, not atmosphere: the rooms that are genuinely
 * empty today, listed with their prices. That claim is the whole brand, so it
 * sits above the fold beside the headline rather than further down the page.
 */
export function Hero() {
  const [selectedArea, setSelectedArea] = useState<string>(areaChips[0])

  return (
    <section className="overflow-hidden bg-stone">
      <div className="wrap grid gap-12 pt-14 pb-14 sm:pt-22 sm:pb-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <SectionEyebrow>{hero.eyebrow}</SectionEyebrow>

          <h1 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.015em] text-balance">
            {hero.heading}
          </h1>

          <p className="mt-5 mb-9 max-w-[500px] text-[17px] leading-[1.65] text-ink-soft">
            {hero.intro}
          </p>

          <p id="pilih-kawasan" className="mb-3 text-[15px] leading-[1.6] font-semibold">
            {hero.chipPrompt}
          </p>
          <div
            role="group"
            aria-labelledby="pilih-kawasan"
            className="flex max-w-[520px] flex-wrap gap-2"
          >
            {areaChips.map((chip) => (
              <Chip
                key={chip}
                selected={selectedArea === chip}
                onClick={() => setSelectedArea(chip)}
              >
                {chip}
              </Chip>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={routes.pencarian} size="lg">
              Lihat kamar kosong
            </Button>
            <Button href={routes.survei} variant="secondary" size="lg">
              Jadwalkan survei
            </Button>
          </div>
        </div>

        {/* At lg the photo bleeds past the column and the availability card
            overlaps it. Below that the two stack in normal flow. */}
        <div className="relative lg:min-h-[520px] lg:self-stretch">
          <div className="relative aspect-3/2 overflow-hidden rounded-card border border-line lg:absolute lg:-top-6 lg:-right-12 lg:bottom-[120px] lg:left-[72px] lg:aspect-auto">
            <Image
              src={hero.photo.src}
              alt={hero.photo.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-6 rounded-card border border-line bg-paper p-5 shadow-float lg:absolute lg:right-12 lg:bottom-0 lg:left-0 lg:mt-0">
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <Eyebrow>{hero.availability.eyebrow}</Eyebrow>
              <span className="flex items-center gap-1.5 font-mono text-[12px] text-ink-soft">
                <span aria-hidden className="size-[7px] rounded-full bg-available" />
                {hero.availability.updated}
              </span>
            </div>
            <ul className="flex flex-col">
              {vacantRooms.map((room, i) => (
                <li key={`${room.building}-${room.room}`}>
                  <VacantRoomRow room={room} first={i === 0} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
