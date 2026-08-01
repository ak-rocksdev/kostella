import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * One figure with its name and a line of context.
 *
 * From the design system bundle (`project/components/core/MetricCard.jsx`),
 * restated in this world's materials: the bundle draws a 1px border and sets
 * the value in Archivo Expanded at 40px, both of which belong to the visual
 * world we replaced. Card surface and elevation here, figure face at a size
 * that sits beside the rest of the panel.
 *
 * `detail` is where a metric earns its place — a number alone invites the
 * question the detail line should already have answered.
 *
 * Fixed size, not clamped: an operator works at a consistent width and a figure
 * that shrinks with the window is harder to compare, not more responsive.
 */
export function MetricCard({
  label,
  value,
  detail,
  tone,
  className,
}: {
  label: string
  value: ReactNode
  detail?: ReactNode
  /** Availability green for figures about free rooms; never colour alone. */
  tone?: 'available'
  className?: string
}) {
  return (
    <div className={cn('rounded-card bg-paper p-5 shadow-card sm:p-6', className)}>
      <p className="text-[13px] font-semibold text-ink-soft">{label}</p>
      <p
        className={cn(
          'mt-2 font-figure text-[32px] leading-none font-bold tracking-[-0.02em]',
          tone === 'available' ? 'text-available' : 'text-ink',
        )}
      >
        {value}
      </p>
      {detail && <p className="mt-2.5 text-[13px] leading-[1.5] text-ink-soft">{detail}</p>}
    </div>
  )
}
