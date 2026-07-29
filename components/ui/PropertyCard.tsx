import Image from 'next/image'
import Link from 'next/link'
import { StatusBadge } from './Badge'
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
 * large in Archivo Expanded rather than tucked into the caption.
 */
export function PropertyCard({
  number,
  street,
  distances,
  priceFrom,
  status,
  count,
  photo,
  href,
  sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw',
}: PropertyCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-card border border-line bg-paper font-body shadow-max"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-photo-bg">
        <Image
          src={photo}
          alt={`Tampak gedung Kostella ${number}`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="numeral absolute bottom-2 left-4 text-[56px] leading-[0.85] tracking-[-0.02em] text-white [text-shadow:0_1px_6px_rgba(22,23,26,0.35)]"
        >
          {number}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="text-[15px] font-semibold text-ink">
          <span className="sr-only">Kostella {number}, </span>
          {street}
        </p>
        {distances.length > 0 && (
          <p className="text-[13px] leading-[1.6] text-ink-soft">{distances.join(' · ')}</p>
        )}

        {/* Price is what the card is scanned for, so it gets its own zone below
            a hairline, with "mulai" as a quiet label instead of running into the
            figure. Mono keeps the digits tabular, so prices line up column to
            column across the grid. */}
        <div className="mt-2 flex items-end justify-between gap-3 border-t border-line pt-3">
          <p>
            <span className="block text-[12px] leading-none text-ink-soft">mulai</span>
            <span className="mt-1.5 block font-mono text-[20px] leading-none font-medium text-ink">
              {formatRupiah(priceFrom)}
            </span>
          </p>
          <StatusBadge status={status} count={count} />
        </div>
      </div>
    </Link>
  )
}
