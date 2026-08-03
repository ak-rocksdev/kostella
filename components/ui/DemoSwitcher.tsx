'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Building2, Eye, UserRound, X } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * A way between the three faces, for whoever is presenting them.
 *
 * Nothing linked them before: the public site had no route into the panel, the
 * panel had none into the owner's view, and `/owner` had no links at all — a
 * dead end you could only leave with the browser's back button.
 *
 * It is deliberately **not** a "Masuk pengelola" link in the public footer.
 * There is no login in this prototype, and a sign-in link on the public site
 * reads as a product claim Kostella has not made. This says what it is.
 *
 * Collapsed to a dot by default, because the public pages are the one place
 * with no "Prototipe" banner — they are meant to be looked at as a renter would
 * see them, and a floating panel over that is a blemish during the very moment
 * it matters. One press opens it.
 *
 * Bottom-left: the toast owns bottom-right.
 */

const FACES = [
  { href: '/', label: 'Publik', hint: 'yang dilihat calon penyewa', icon: Eye },
  { href: '/management', label: 'Pengelola', hint: 'yang mengurus harian', icon: Building2 },
  { href: '/owner', label: 'Pemilik', hint: 'yang menitipkan gedung', icon: UserRound },
] as const

function faceOf(pathname: string) {
  if (pathname.startsWith('/owner')) return FACES[2]
  if (pathname.startsWith('/management')) return FACES[1]
  return FACES[0]
}

export function DemoSwitcher() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const current = faceOf(pathname)

  /* Closing on navigation matters more than it looks: the root layout survives
     a client navigation, so without this the tray stays open over the page it
     just moved to. Adjusted during render rather than in an effect — the same
     rule `Disclosure` was rewritten for. */
  const [seen, setSeen] = useState(pathname)
  if (seen !== pathname) {
    setSeen(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="fixed bottom-4 left-4 z-40 print:hidden sm:bottom-6 sm:left-6">
      {open ? (
        <div className="w-64 overflow-hidden rounded-card border border-line bg-paper shadow-lift">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="text-[12px] font-semibold tracking-[0.04em] text-ink-soft uppercase">
              Demo — pindah sisi
            </span>
            <button
              type="button"
              aria-label="Tutup pemilih demo"
              onClick={() => setOpen(false)}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-stone hover:text-ink"
            >
              <X size={15} strokeWidth={2} aria-hidden />
            </button>
          </div>

          <ul>
            {FACES.map((face) => {
              const Icon = face.icon
              const here = face.href === current.href
              return (
                <li key={face.href} className="border-b border-line last:border-0">
                  <Link
                    href={face.href}
                    aria-current={here ? 'page' : undefined}
                    className={cn(
                      'flex min-h-11 items-center gap-3 px-4 py-2.5 transition-colors',
                      here ? 'bg-canvas' : 'hover:bg-canvas',
                    )}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.9}
                      aria-hidden
                      className={here ? 'text-plum' : 'text-ink-soft'}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block text-[14px] font-semibold',
                          here ? 'text-plum' : 'text-ink',
                        )}
                      >
                        {face.label}
                      </span>
                      {/* The open face says so instead of describing itself —
                          you are already looking at it, and one line of text
                          per row keeps the tray from wrapping. */}
                      <span className="block text-[12px] text-ink-soft">
                        {here ? 'sedang dibuka' : face.hint}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <p className="border-t border-line bg-canvas px-4 py-2.5 text-[12px] leading-[1.45] text-ink-soft">
            Alat presentasi, bukan bagian produk. Kostella tidak punya halaman masuk di prototipe
            ini.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Pemilih demo — sedang di sisi ${current.label}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper px-3 shadow-card transition-[box-shadow,border-color] duration-200 hover:border-ink-soft/50 hover:shadow-lift"
        >
          <current.icon size={15} strokeWidth={1.9} aria-hidden className="text-ink-soft" />
          <span className="text-[13px] font-semibold">{current.label}</span>
          <span className="rounded-badge bg-stone px-1.5 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-ink-soft uppercase">
            Demo
          </span>
        </button>
      )}
    </div>
  )
}
