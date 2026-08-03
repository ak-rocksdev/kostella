import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { routes } from '@/lib/routes'

/**
 * A step inside a journey, not the front door — so this header carries the way
 * back to the results rather than the site's full navigation.
 */
export function DetailHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link
          href={routes.beranda}
          className="min-h-11 inline-flex items-center text-[20px] font-semibold tracking-[-0.01em]"
        >
          Kostella
        </Link>
        <Link
          href={routes.pencarian}
          className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={17} strokeWidth={1.75} aria-hidden />
          Hasil pencarian
        </Link>
      </div>
    </header>
  )
}
