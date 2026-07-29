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
        'inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 py-2 font-body text-[14px] leading-[1.2] font-medium transition-colors duration-150',
        selected
          ? 'border-ink bg-ink text-stone'
          : 'border-line bg-paper text-ink hover:border-ink-soft',
      )}
    >
      {children}
    </button>
  )
}
