import { formatRupiah } from '@/lib/format'
import { monthLabel } from '@/lib/content/management/billing'
import { cn } from '@/lib/cn'

const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

/**
 * What came in, month by month.
 *
 * Bars rather than a line: six points is not a curve, and a line drawn through
 * six months invites reading a slope that six months cannot support. A bar per
 * month says "these are six figures" and stops there.
 *
 * Every bar is labelled with its own amount. A chart an owner has to hover to
 * read is a chart they will read wrong on a phone, where there is no hover.
 */
export function IncomeTrend({ trend }: { trend: { month: string; amount: number }[] }) {
  const peak = Math.max(...trend.map((t) => t.amount), 1)
  const latest = trend[trend.length - 1]

  return (
    <div>
      <ul className="flex items-end gap-2 sm:gap-3">
        {trend.map((point) => {
          const share = point.amount / peak
          const isLatest = point.month === latest.month
          return (
            <li key={point.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <span
                className={cn(
                  'font-figure text-[12px] font-semibold whitespace-nowrap',
                  isLatest ? 'text-ink' : 'text-ink-soft',
                )}
              >
                {(point.amount / 1_000_000).toFixed(1).replace('.', ',')}
              </span>
              <span
                aria-hidden
                className={cn('w-full rounded-t-[4px]', isLatest ? 'bg-ink' : 'bg-ink/25')}
                style={{ height: `${Math.max(4, share * 96)}px` }}
              />
              <span className="text-[12px] text-ink-soft">
                {SHORT[Number(point.month.slice(5, 7)) - 1]}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[13px] text-ink-soft">
        Angka dalam juta rupiah, yang benar-benar diterima tiap bulan. {monthLabel(latest.month)}:{' '}
        <strong className="font-semibold text-ink">{formatRupiah(latest.amount)}</strong>.
      </p>
    </div>
  )
}
