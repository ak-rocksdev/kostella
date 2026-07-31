'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PropertyCard } from '@/components/ui/PropertyCard'
import { Reveal } from '@/components/ui/Reveal'
import { formatRupiah } from '@/lib/format'
import { routes } from '@/lib/routes'
import type { Area } from '@/lib/content/beranda'

/** Gap between cards, in px. Paging has to know it to land on a card edge. */
const GAP = 20

/**
 * One area: a standing column of context on the left, its buildings running off
 * the right edge of the screen.
 *
 * The track is deliberately not a grid. A grid that fits its cards says "this
 * is all of it"; a row that leaves the screen says there is more, which is the
 * true claim — these four buildings are the ones on this street, and the rest of
 * the inventory is a click away. The end of the track is where that click lives,
 * so someone who scrolls to the end of the cards arrives at it rather than
 * running into a wall.
 *
 * The left column is sticky on desktop: the area name and its vacancy count stay
 * on screen for as long as its cards do, which is what makes the section read as
 * one area rather than as a loose row of buildings.
 */
export function AreaShowcase({ area }: { area: Area }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  // Both ends are reported as reached until proven otherwise, so the arrows
  // start disabled rather than flashing enabled on a track that cannot scroll.
  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft <= 1)
    setAtEnd(el.scrollLeft >= max - 1)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    sync()
    // Card width changes at every breakpoint, and so does whether the track
    // overflows at all.
    const observer = new ResizeObserver(sync)
    observer.observe(el)
    return () => observer.disconnect()
  }, [sync])

  const page = (direction: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + GAP : el.clientWidth * 0.8
    el.scrollBy({
      left: direction * step,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }

  const cheapest = Math.min(...area.properties.map((property) => property.priceFrom))

  return (
    <div className="rail-bleed grid gap-10 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] lg:gap-14">
      <div className="pr-5 sm:pr-8 lg:sticky lg:top-28 lg:self-start lg:pr-0">
        <p className="text-[13px] font-semibold text-ink-soft">Kawasan</p>
        <h2 className="mt-3 text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.03em]">
          {area.name}
        </h2>
        <p className="mt-2 text-[15px] text-ink-soft">{area.nearby}</p>
        <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.65] text-ink-soft">{area.blurb}</p>

        {/* Both figures are derived from the cards beside them, so the column
            can never disagree with the track. The vacancy count keeps the
            availability green — it is the status colour doing its job, not
            decoration — and the word beside it carries the same meaning for
            anyone who cannot see the hue. */}
        <dl className="mt-9 flex gap-10">
          <div>
            <dd className="font-figure text-[32px] leading-none font-semibold tracking-[-0.02em]">
              {area.properties.length}
            </dd>
            <dt className="mt-2 text-[14px] text-ink-soft">gedung</dt>
          </div>
          <div>
            <dd className="font-figure text-[32px] leading-none font-semibold tracking-[-0.02em] text-available">
              {area.vacantRooms}
            </dd>
            <dt className="mt-2 text-[14px] text-ink-soft">kamar kosong</dt>
          </div>
        </dl>

        <p className="mt-6 text-[15px] text-ink-soft">
          Mulai{' '}
          <span className="font-figure font-semibold text-ink">{formatRupiah(cheapest)}</span> per
          bulan
        </p>

        {/* Paging buttons, not a scrollbar replacement: the track is a native
            scroller and stays swipeable and keyboard-reachable without them.
            Hidden where a thumb is the better control. */}
        <div className="mt-9 hidden gap-2.5 lg:flex">
          <TrackButton label="Gedung sebelumnya" disabled={atStart} onClick={() => page(-1)}>
            <ArrowLeft size={19} strokeWidth={1.75} aria-hidden />
          </TrackButton>
          <TrackButton label="Gedung berikutnya" disabled={atEnd} onClick={() => page(1)}>
            <ArrowRight size={19} strokeWidth={1.75} aria-hidden />
          </TrackButton>
        </div>
      </div>

      <div className="min-w-0">
        {/* Two things a scroller gets wrong by default, both handled here.
            `overflow-x: auto` clips on BOTH axes — the spec makes the other axis
            `auto` the moment one stops being `visible` — so the cards' shadows
            were sliced off inside the box. The px/-mx and py/-my pairs open the
            clip box without moving anything on the page. And `snap-start` aligns
            to the scrollport edge rather than the padding edge, so without
            scroll-px the first card slams flush against it on load. */}
        <ul
          ref={trackRef}
          onScroll={sync}
          className="no-scrollbar -mx-4 -my-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 py-8"
        >
          {area.properties.map((property, i) => (
            <li
              key={property.number}
              className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[320px] lg:w-[340px]"
            >
              <Reveal delay={i * 90} className="h-full">
                <PropertyCard
                  {...property}
                  href={routes.detail}
                  sizes="(min-width: 640px) 340px, 78vw"
                />
              </Reveal>
            </li>
          ))}

          <li className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[280px]">
            <Reveal delay={area.properties.length * 90} className="h-full">
              <EndCap />
            </Reveal>
          </li>
        </ul>

        <div className="mt-9 pr-5 sm:pr-8 lg:pr-0">
          <Button href={routes.pencarian} size="lg">
            Lihat semua kawasan
            <ArrowRight size={19} strokeWidth={1.75} aria-hidden className="ml-2.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function TrackButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition-[background-color,border-color,opacity] duration-200 hover:border-ink-soft hover:bg-stone disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  )
}

/**
 * The last tile in the track. It carries the same label and destination as the
 * button below the cards — one action, stated twice where the two different
 * ways of leaving this section actually end.
 */
function EndCap() {
  return (
    <Link
      href={routes.pencarian}
      className="group flex h-full flex-col justify-center rounded-card bg-plum p-7 text-white shadow-card transition-[translate,box-shadow] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-lift focus-visible:-translate-y-2 focus-visible:shadow-lift active:translate-y-0 active:shadow-card active:duration-100"
    >
      <div>
        <p className="text-[13px] font-semibold text-white/70">Masih cari?</p>
        <p className="mt-3 text-[24px] leading-[1.2] font-semibold tracking-[-0.02em]">
          Lihat semua kawasan
        </p>
        <p className="mt-3 text-[14px] leading-[1.6] text-white/75">
          31 gedung di Jakarta, Bandung, dan Bali.
        </p>
      </div>

      <span
        aria-hidden
        className="mt-8 inline-flex size-12 shrink-0 self-start items-center justify-center rounded-full bg-white/12 transition-[translate,background-color] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:bg-white/20"
      >
        <ArrowRight size={22} strokeWidth={1.75} />
      </span>
    </Link>
  )
}
