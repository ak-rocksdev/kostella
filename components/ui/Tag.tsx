import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * A static fact about a property — who it takes, what it has.
 *
 * Square corners and a flat stone fill, deliberately unlike Chip's pill: a
 * rounded pill on this page means something you can press, and these are read,
 * not chosen. The distinction is the only thing keeping the card's tags from
 * looking like a filter that does nothing.
 */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-badge bg-stone px-2 py-1 text-[12px] leading-[1.3] font-medium text-ink-soft',
        className,
      )}
    >
      {children}
    </span>
  )
}
