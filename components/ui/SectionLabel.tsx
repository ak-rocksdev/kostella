import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * The small line that names a block.
 *
 * This replaces the previous world's eyebrow — ALL CAPS at 12px with 0.08em
 * tracking, preceded by a short plum rule. That device belonged to a design
 * built on hairlines; here a label is a label, set in the same sentence case as
 * everything else and separated from what follows by space alone.
 */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <p className={cn('text-[13px] font-semibold text-ink-soft', className)}>{children}</p>
}
