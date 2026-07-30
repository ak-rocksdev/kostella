import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PropertyCard } from '@/components/ui/PropertyCard'
import { areas } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

export function Kawasan() {
  return (
    <section id="kawasan" className="border-t border-line bg-paper">
      <div className="wrap py-14 sm:py-24">
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

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {area.properties.map((property) => (
                <li key={property.number}>
                  <PropertyCard {...property} href={routes.detail} />
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
