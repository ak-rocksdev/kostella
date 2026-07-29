'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { photos, property } from '@/lib/content/detail'
import { routes } from '@/lib/routes'

/**
 * The property opens on its number, set over the photo at 110px.
 *
 * Two thumbnails show what comes next rather than the whole strip — the point
 * is to suggest there is more, not to become a filmstrip.
 */
export function HeroGallery() {
  const [active, setActive] = useState(0)
  const upcoming = [1, 2].map((offset) => (active + offset) % photos.length)

  return (
    <section className="wrap pt-6">
      <div className="grid gap-3 lg:h-[480px] lg:grid-cols-[2fr_1fr]">
        <div className="relative aspect-3/2 overflow-hidden rounded-card bg-photo-bg lg:aspect-auto">
          <Image
            src={photos[active].src}
            alt={photos[active].label}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
          {/* Keeps the number and caption legible over any photo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-55% to-ink/45"
          />
          <span className="absolute top-5 left-7 rounded-badge bg-plum px-3 py-[5px] text-[12px] font-semibold text-white">
            {property.tenancy}
          </span>
          <div className="pointer-events-none absolute bottom-4 left-7 flex items-baseline gap-5">
            <span
              aria-hidden
              className="numeral text-[clamp(3.5rem,10vw,6.875rem)] leading-[0.85] tracking-[-0.02em] text-white [text-shadow:0_2px_16px_rgba(22,23,26,0.35)]"
            >
              {property.number}
            </span>
            <span className="text-[14px] font-medium text-white [text-shadow:0_1px_6px_rgba(22,23,26,0.5)]">
              {photos[active].label} · {active + 1}/{photos.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {upcoming.map((index, position) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className="relative aspect-3/2 cursor-pointer overflow-hidden rounded-card bg-photo-bg lg:aspect-auto lg:flex-1"
            >
              <Image
                src={photos[index].src}
                alt={`Lihat ${photos[index].label}`}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover"
              />
              {position === 1 && (
                <span className="absolute right-3 bottom-3 rounded-badge bg-ink/72 px-3 py-1.5 text-[12px] font-medium text-white">
                  Lihat semua foto
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-1 pt-5">
        <h1 className="text-[21px] leading-[1.3] font-semibold">{property.address}</h1>
        <p className="text-[14px] leading-[1.6] text-ink-soft">{property.distances}</p>
        <div className="ml-auto">
          <Button href={routes.survei} size="sm">
            Jadwalkan survei
          </Button>
        </div>
      </div>
    </section>
  )
}
