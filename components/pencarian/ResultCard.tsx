import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import {
  availabilityLabel,
  priceLabel,
  tenancyLabels,
  walkLabel,
  type SearchResult,
} from '@/lib/content/pencarian'

const availabilityTone = {
  available: 'text-available',
  held: 'text-held',
  occupied: 'text-ink-soft',
} as const

/**
 * One building in the results list.
 *
 * Availability reads as a fraction rather than a badge — at this point you are
 * comparing buildings, and "3 dari 8 kamar kosong" tells you how much choice
 * each one leaves you.
 *
 * The whole card is a single control. Where a property has a detail screen it
 * is a link; where it does not, it selects itself on the map instead, which is
 * the only thing there is to do with it.
 *
 * Same materials as the property card on the landing page — 16px radius, the
 * three-layer resting shadow, the number as a small marker beside the street,
 * the price ranged right at full weight. The 32px Archivo Expanded numeral this
 * used to lead with belonged to the previous world.
 *
 * Selection is a ring, not a border swap. A border that only exists when active
 * moves the card by a pixel on every selection; a ring draws outside the box.
 */
export function ResultCard({
  result,
  active,
  href,
  onSelect,
}: {
  result: SearchResult
  active: boolean
  href?: string
  onSelect: () => void
}) {
  const body = (
    <>
      <div className="relative aspect-square w-28 shrink-0 self-stretch overflow-hidden bg-photo-bg sm:aspect-4/3 sm:w-55">
        <Image
          src={result.photo}
          alt=""
          fill
          sizes="(min-width: 640px) 220px, 112px"
          className="object-cover transition-[scale] duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 py-4 pr-4 text-left sm:pr-5">
        <div>
          <p className="flex flex-wrap items-baseline gap-2 text-[16px] leading-[1.35] font-semibold">
            <span className="rounded-badge bg-stone px-1.5 py-0.5 font-figure text-[13px] leading-[1.4] font-semibold text-ink">
              <span className="sr-only">Kostella </span>
              {result.number}
            </span>
            {result.street}
          </p>
          <p className="mt-1.5 text-[13px] leading-[1.5] text-ink-soft">
            {tenancyLabels[result.tenancy]} · {result.facilities.join(' · ')} ·{' '}
            {walkLabel(result)}
          </p>
        </div>

        {/* Price ranged right at full weight so a column of results can be read
            straight down; availability holds the opposite edge, where it answers
            "how much choice does this one leave me". */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-t border-line pt-3">
          <p className={cn('text-[13px] font-semibold', availabilityTone[result.status])}>
            {availabilityLabel(result)}
          </p>
          <p className="text-right">
            <span className="font-figure text-[20px] leading-none font-bold">
              {priceLabel(result)}
            </span>
            <span className="ml-1 text-[13px] text-ink-soft">/bulan</span>
          </p>
        </div>
      </div>
    </>
  )

  const shell = cn(
    'group flex w-full cursor-pointer gap-4 overflow-hidden rounded-card bg-paper text-ink shadow-card transition-[box-shadow] duration-200 hover:shadow-lift sm:gap-5',
    active && 'ring-2 ring-ink',
  )

  if (href) {
    return (
      <Link href={href} className={shell}>
        {body}
      </Link>
    )
  }

  return (
    <button type="button" aria-pressed={active} onClick={onSelect} className={shell}>
      {body}
    </button>
  )
}
