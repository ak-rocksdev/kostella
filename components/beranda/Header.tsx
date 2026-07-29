import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { nav } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-stone">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <span className="text-[20px] font-semibold tracking-[-0.01em]">Kostella</span>

        {/* The design has no mobile navigation pattern, so below md the links
            give way to the wordmark and the primary action rather than to an
            invented menu. */}
        <nav aria-label="Utama" className="hidden gap-8 text-[14px] font-medium md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(item.muted && 'text-ink-soft hover:text-ink')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button href={routes.survei} size="sm">
          Jadwalkan survei
        </Button>
      </div>
    </header>
  )
}
