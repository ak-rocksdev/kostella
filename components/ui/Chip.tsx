'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ChipProps = {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
}

/** A filter toggle, so it reports pressed state rather than posing as a link. */
export function Chip({ children, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        // min-h-11 = 44px: the chips are the main touch target on a phone and
        // were rendering at 34.8px, clearing the 24px floor but not the 44px
        // comfortable minimum.
        // shrink-0 so the chip keeps its width inside a horizontal scroller.
        'inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-full border px-4 py-2 font-body text-[14px] leading-[1.2] font-medium whitespace-nowrap transition-colors duration-150',
        selected
          ? 'border-ink bg-ink text-stone'
          : 'border-line bg-paper text-ink hover:border-ink-soft',
      )}
    >
      {children}
    </button>
  )
}
