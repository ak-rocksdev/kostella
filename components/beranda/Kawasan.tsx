import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PropertyCard } from '@/components/ui/PropertyCard'
import { Reveal } from '@/components/ui/Reveal'
import { areas } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

export function Kawasan() {
  return (
    <section id="kawasan" className="bg-paper">
      <div className="wrap py-20 sm:py-28">
        {/* No section eyebrow. The area name is the heading, and "Properti per
            kawasan" only restated what four property cards already say. */}
        {areas.map((area) => (
          <div key={area.name}>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <h2 className="text-[clamp(2rem,4.5vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.015em]">
                  {area.name}
                </h2>
                <p className="mt-1.5 text-[15px] text-ink-soft">{area.nearby}</p>
              </div>
              <p className="rounded-badge bg-available px-3 py-[5px] font-figure text-[13px] font-medium text-white">
                {area.vacantRooms} kamar kosong
              </p>
            </div>

            {/* A phone gets a scroller, not a stack. Four full-width cards is
                four screens of scrolling before the section ends; sideways, the
                set stays one gesture wide and the half-visible next card says
                how many there are. The bleed matches the content gutter exactly,
                so cards run to the screen edge without pushing the page wider.
                From sm up it is a plain grid again. */}
            {/* Two things a scroller gets wrong by default, both fixed here.
                `overflow-x: auto` clips on BOTH axes — the spec makes the other
                axis `auto` the moment one stops being `visible` — so the cards'
                shadows were being sliced off inside the box. The py/-my pair
                opens the clip box by 16px without moving anything on the page.
                And `snap-start` aligns to the scrollport edge, not the padding
                edge, so the first card slammed flush left on load however much
                px-5 was there; scroll-px-5 is what makes snapping respect the
                inset. */}
            <ul className="no-scrollbar -mx-5 -my-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 py-8 sm:mx-0 sm:my-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-4">
              {area.properties.map((property, i) => (
                <li key={property.number} className="w-[82%] shrink-0 snap-start sm:w-auto">
                  <Reveal delay={i * 90} className="h-full">
                    <PropertyCard {...property} href={routes.detail} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="mt-9">
          <Link
            href={routes.pencarian}
            className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold"
          >
            Lihat semua kawasan
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
          </Link>
        </p>
      </div>
    </section>
  )
}
