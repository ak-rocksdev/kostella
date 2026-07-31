import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { context } from '@/lib/content/pencarian'
import { routes } from '@/lib/routes'

/**
 * Restates what was searched for, because the results below only make sense
 * against it — which area, and what the ordering means.
 *
 * Structurally identical to the Beranda header: same height, same ground, same
 * hairline under it. Arriving here from the landing page should not feel like
 * arriving at a different site.
 */
export function PencarianHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-canvas">
      <div className="wrap-wide flex h-16 items-center gap-4 sm:gap-8">
        <Link href={routes.beranda} className="text-[20px] font-semibold tracking-[-0.01em]">
          Kostella
        </Link>
        <p className="hidden text-[14px] text-ink-soft sm:block">
          Dekat <strong className="font-semibold text-ink">{context.area}</strong> · {context.sort}
        </p>
        <div className="ml-auto">
          <Button href={routes.survei} size="sm">
            Jadwalkan survei
          </Button>
        </div>
      </div>
    </header>
  )
}
