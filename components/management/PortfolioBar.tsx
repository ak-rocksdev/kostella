import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Portfolio totals as one dense strip.
 *
 * Four `MetricCard`s stood here first, and that is the hero-metric template —
 * big number, small label, repeated four times as the page's structure. The
 * bundle specifies MetricCard for the *dashboard*, where four figures are the
 * screen's subject; on a list screen the subject is the list, and the totals are
 * context above it.
 *
 * A single bar with hairline-divided cells says the same thing in a third of the
 * height, which is what an operator screen should spend its space on. It is the
 * design system's own `ProofBar` shape, restated in this world's card surface.
 */
export function PortfolioBar({
  items,
}: {
  items: { label: string; value: ReactNode; detail?: ReactNode; tone?: 'available' }[]
}) {
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-card bg-paper shadow-card sm:grid-cols-4">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            'px-5 py-4',
            // Hairlines between cells only — the card's own edge closes the row.
            // Which side they fall on changes with the column count.
            i % 2 === 1 && 'border-l border-line',
            i >= 2 && 'border-t border-line',
            'sm:border-t-0',
            i > 0 && 'sm:border-l sm:border-line',
          )}
        >
          <dt className="text-[13px] text-ink-soft">{item.label}</dt>
          <dd
            className={cn(
              'mt-1 font-figure text-[26px] leading-none font-bold tracking-[-0.02em]',
              item.tone === 'available' ? 'text-available' : 'text-ink',
            )}
          >
            {item.value}
          </dd>
          {item.detail && (
            <dd className="mt-1.5 text-[12px] leading-[1.4] text-ink-soft">{item.detail}</dd>
          )}
        </div>
      ))}
    </dl>
  )
}
