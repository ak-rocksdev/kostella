import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { context } from '@/lib/content/pencarian'
import { routes } from '@/lib/routes'

/**
 * Restates what was searched for, because the results below only make sense
 * against it — which area, and what the ordering means.
 */
export function PencarianHeader() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="wrap-wide flex h-16 items-center gap-4 sm:gap-8">
        <Link href={routes.beranda} className="text-[20px] font-semibold text-ink">
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
