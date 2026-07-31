'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { photos, property } from '@/lib/content/detail'
import { routes } from '@/lib/routes'

/**
 * The property opens on its photographs.
 *
 * It used to open on its number instead, at 110px of Archivo Expanded over the
 * lead image, with a scrim underneath to keep it legible. In this world the
 * number is a marker beside the address and the photograph is left to do the
 * work — which also means the picture no longer needs darkening to survive it.
 *
 * Two thumbnails show what comes next rather than the whole strip — the point
 * is to suggest there is more, not to become a filmstrip.
 */
export function HeroGallery() {
  const [active, setActive] = useState(0)
  const upcoming = [1, 2].map((offset) => (active + offset) % photos.length)

  return (
    <section className="wrap pt-8">
      <div className="grid gap-3 lg:h-[480px] lg:grid-cols-[2fr_1fr]">
        <div className="relative aspect-3/2 overflow-hidden rounded-card bg-photo-bg shadow-card lg:aspect-auto">
          <Image
            src={photos[active].src}
            alt={photos[active].label}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
          <span className="absolute top-4 left-4 rounded-full bg-plum px-3 py-1 text-[12px] font-semibold text-white">
            {property.tenancy}
          </span>
          {/* A caption needs its own small scrim; a full gradient across the
              picture was there to carry 110px of numeral that is now gone. */}
          <span className="absolute bottom-4 left-4 rounded-full bg-ink/72 px-3 py-1.5 text-[12px] font-medium text-white">
            {photos[active].label} · {active + 1}/{photos.length}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {upcoming.map((index, position) => (
            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className="relative aspect-3/2 cursor-pointer overflow-hidden rounded-card bg-photo-bg shadow-card transition-[translate,box-shadow] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lift lg:aspect-auto lg:flex-1"
            >
              <Image
                src={photos[index].src}
                alt={`Lihat ${photos[index].label}`}
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover"
              />
              {position === 1 && (
                <span className="absolute right-3 bottom-3 rounded-full bg-ink/72 px-3 py-1.5 text-[12px] font-medium text-white">
                  Lihat semua foto
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-7">
        <div>
          <h1 className="flex flex-wrap items-baseline gap-2.5 text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-semibold tracking-[-0.02em]">
            <span className="rounded-badge bg-stone px-2 py-0.5 font-figure text-[15px] leading-[1.4] font-semibold">
              <span className="sr-only">Kostella </span>
              {property.number}
            </span>
            {property.address}
          </h1>
          <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">{property.distances}</p>
        </div>
        {/* Full width on a phone: a lone button shoved to the right edge reads
            as an afterthought, and this is the screen's primary action. */}
        <div className="w-full sm:ml-auto sm:w-auto">
          <Button href={routes.survei} className="w-full sm:w-auto">
            Jadwalkan survei
          </Button>
        </div>
      </div>
    </section>
  )
}
