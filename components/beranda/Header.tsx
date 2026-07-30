import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { nav } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-canvas">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <span className="text-[20px] font-semibold tracking-[-0.01em]">Kostella</span>

        {/* The design has no mobile navigation pattern, so below md the links
            give way to the wordmark and the primary action rather than to an
            invented menu. */}
        {/* min-h-11 on the links, not just the row: the text sits 21px tall, so
            the clickable area was under the 24px floor even though the header
            gives it 64px to sit in. */}
        <nav aria-label="Utama" className="hidden items-center gap-8 text-[14px] font-medium md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'inline-flex min-h-11 items-center',
                item.muted && 'text-ink-soft hover:text-ink',
              )}
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
