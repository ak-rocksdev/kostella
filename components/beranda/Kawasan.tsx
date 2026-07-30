import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PropertyCard } from '@/components/ui/PropertyCard'
import { SectionEyebrow } from '@/components/ui/Eyebrow'
import { areas } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

export function Kawasan() {
  return (
    <section id="kawasan" className="border-t border-line bg-paper">
      <div className="wrap py-14 sm:py-24">
        <SectionEyebrow>Properti per kawasan</SectionEyebrow>

        {areas.map((area) => (
          <div key={area.name} className="mt-7">
            <div className="mb-7 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h2 className="text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.01em]">
                {area.name}
              </h2>
              <p className="text-[14px] text-ink-soft">{area.nearby}</p>
              <p className="ml-auto rounded-badge bg-available px-3 py-[5px] font-figure text-[13px] font-medium text-white">
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
