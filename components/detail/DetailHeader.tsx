import Link from 'next/link'
import { routes } from '@/lib/routes'

/**
 * A step inside a journey, not the front door — so this header carries the way
 * back to the results rather than the site's full navigation.
 */
export function DetailHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-stone">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href={routes.beranda} className="text-[20px] font-semibold text-ink">
          Kostella
        </Link>
        <Link href={routes.pencarian} className="text-[14px] font-medium">
          ← Hasil pencarian
        </Link>
      </div>
    </header>
  )
}
