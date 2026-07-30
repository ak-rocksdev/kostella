import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { StatusBadge } from './Badge'
import { Tag } from './Tag'
import { formatRupiah } from '@/lib/format'
import type { Property } from '@/lib/content/beranda'

type PropertyCardProps = Property & {
  href: string
  /** Widths the photo will render at, for the responsive image sizes hint. */
  sizes?: string
}

/**
 * A property, led by its number.
 *
 * Kostella doesn't name its buildings, it numbers them — real house numbers on
 * Jl. Dr. Susilo. The numeral over the photo is that identity, so it is set
 * large rather than tucked into the caption.
 *
 * Availability sits on the photograph rather than beside the price. It is the
 * brand's first claim and the thing a visitor scans for, so it should be
 * readable before the card is, not discovered at the end of it.
 *
 * The photo is square on a phone and 4:5 from sm up. Full-bleed at 4:5 the card
 * ran 437px of photograph before a single word, which is a lot of scrolling to
 * reach the facts.
 */
export function PropertyCard({
  number,
  street,
  area,
  distances,
  tenancy,
  facilities,
  priceFrom,
  status,
  count,
  photo,
  href,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 85vw',
}: PropertyCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper font-body shadow-card transition-[box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative aspect-square overflow-hidden bg-photo-bg sm:aspect-4/5">
        {/* Decorative: the street and number are already in the text below, and
            these are placeholders from the design bundle rather than the real
            buildings — naming them would assert something untrue. */}
        <Image
          src={photo}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
        />

        <span className="absolute top-3 left-3">
          <StatusBadge status={status} count={count} />
        </span>

        {/* A text-shadow alone left the numeral at 1.4:1 wherever the photo runs
            light. This is the same foot scrim the property gallery already uses,
            so the number holds against any photograph dropped in later. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink/55 to-transparent to-45%"
        />
        <span
          aria-hidden
          className="numeral absolute bottom-2 left-4 text-[56px] leading-[0.85] tracking-[-0.02em] text-white"
        >
          {number}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[15px] leading-[1.35] font-semibold text-ink">
            <span className="sr-only">Kostella {number}, </span>
            {street}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-soft">
            <MapPin size={14} strokeWidth={1.5} aria-hidden className="shrink-0" />
            {area}
          </p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          <li>
            <Tag>{tenancy}</Tag>
          </li>
          {facilities.map((facility) => (
            <li key={facility}>
              <Tag>{facility}</Tag>
            </li>
          ))}
        </ul>

        {distances.length > 0 && (
          <p className="text-[13px] leading-[1.5] text-ink-soft">{distances.join(' · ')}</p>
        )}

        {/* mt-auto so the price sits on the card's floor whatever the tags do to
            the height above it — four cards in a row must agree on that line.
            Ranged right at full weight: it is the number the card is scanned
            for, and a right edge gives four cards one column to compare down. */}
        <p className="mt-auto border-t border-line pt-3 text-right">
          <span className="block text-[12px] leading-none text-ink-soft">mulai</span>
          <span className="mt-2 block font-figure text-[22px] leading-none font-bold text-ink">
            {formatRupiah(priceFrom)}
          </span>
          <span className="mt-1 block text-[12px] leading-none text-ink-soft">per bulan</span>
        </p>
      </div>
    </Link>
  )
}
