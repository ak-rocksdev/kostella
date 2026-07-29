import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import type { SearchResult } from '@/lib/content/pencarian'

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
      <div className="relative aspect-4/3 w-28 shrink-0 self-stretch bg-photo-bg sm:w-55">
        <Image
          src={result.photo}
          alt=""
          fill
          sizes="(min-width: 640px) 220px, 112px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 py-4 pr-4 text-left sm:pr-5">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="numeral text-[32px] leading-none">
            <span className="sr-only">Kostella </span>
            {result.number}
          </span>
          <Badge tone="plum">{result.tenancy}</Badge>
        </div>

        <p className="text-[14px] text-ink-soft">{result.street}</p>
        <p className="text-[13px] text-ink-soft">
          {result.facilities.join(' · ')} · {result.walk}
        </p>

        {/* The figure carries the row, with the unit stepped down beside it and
            availability holding the opposite edge. */}
        <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-3">
          <p className="font-figure text-[20px] leading-none font-medium">
            {result.price}
            <span className="font-body text-[13px] font-normal text-ink-soft"> /bulan</span>
          </p>
          <p className={cn('font-figure text-[13px] font-medium', availabilityTone[result.status])}>
            {result.availability}
          </p>
        </div>
      </div>
    </>
  )

  const shell = cn(
    'flex w-full cursor-pointer gap-4 overflow-hidden rounded-card bg-paper text-ink shadow-max transition-colors sm:gap-5',
    active ? 'border border-ink' : 'border border-line hover:border-ink-soft',
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
