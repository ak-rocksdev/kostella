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
        'cursor-pointer rounded-full border px-4 py-2 font-body text-[14px] leading-[1.2] font-medium transition-colors duration-150',
        selected
          ? 'border-ink bg-ink text-stone'
          : 'border-line bg-paper text-ink hover:border-ink-soft',
      )}
    >
      {children}
    </button>
  )
}
