'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, CircleCheck, TriangleAlert } from 'lucide-react'
import { Disclosure } from '@/components/ui/Disclosure'
import { cn } from '@/lib/cn'

/**
 * What needs doing, folded away until it is asked for.
 *
 * This started as the page's opening section, on the argument that most rows of
 * a register demand nothing and the few that do should lead. That was right
 * about the ranking and wrong about the space: five expanded cards ran seven
 * hundred pixels before the page's actual subject — the tenants — appeared, on
 * a screen whose heading says "Penghuni".
 *
 * So it is a warning, not a chapter. One line, and the line has to be worth
 * reading on its own: a bare count sends somebody to expand it to find out
 * whether it matters. Naming the kinds — *1 terlewat · 3 jatuh tempo* — usually
 * answers that without opening anything.
 *
 * Collapsed even when something is overdue. The summary already says so, in
 * the tone that says it; opening it is one press, and forcing the page to
 * rearrange itself around a state the reader has not asked about is what this
 * change was undoing.
 */
export function ActionBanner({
  count,
  summary,
  urgent,
  children,
}: {
  count: number
  /** The kinds inside, so the line is useful unopened. */
  summary: string
  /** Something is already wrong, not merely near. */
  urgent?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  if (count === 0) {
    return (
      <p className="flex items-center gap-2.5 rounded-card border border-dashed border-line px-4 py-3 text-[13px] text-ink-soft">
        <CircleCheck size={16} strokeWidth={1.9} aria-hidden className="shrink-0 text-available" />
        Tidak ada yang perlu ditindak hari ini.
      </p>
    )
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex min-h-11 w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-card border px-4 py-2.5 text-left transition-colors',
          urgent
            ? 'border-held/40 bg-held-soft hover:border-held/70'
            : 'border-line bg-paper hover:border-ink-soft/40',
        )}
      >
        <TriangleAlert
          size={16}
          strokeWidth={1.9}
          aria-hidden
          className={cn('shrink-0', urgent ? 'text-held' : 'text-ink-soft')}
        />
        <span className={cn('text-[14px] font-semibold', urgent && 'text-held')}>
          {count} perlu tindakan hari ini
        </span>
        {/* Full colour, not dimmed. Hierarchy comes from weight — the count is
            semibold and this is not — because `text-held/80` on the amber
            surface measured 3,53:1, under the floor for 13px. */}
        <span className={cn('text-[13px]', urgent ? 'text-held' : 'text-ink-soft')}>{summary}</span>
        <span
          className={cn(
            'ml-auto inline-flex items-center gap-1 text-[13px] font-semibold',
            urgent ? 'text-held' : 'text-plum',
          )}
        >
          {open ? 'Tutup' : 'Lihat'}
          <ChevronDown
            size={15}
            strokeWidth={2}
            aria-hidden
            className={cn('transition-[rotate] duration-200', open && 'rotate-180')}
          />
        </span>
      </button>

      <Disclosure open={open}>
        <div className="mt-2.5">{children}</div>
      </Disclosure>
    </div>
  )
}
