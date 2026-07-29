import { cn } from '@/lib/cn'

export type ReceiptRow = {
  label: string
  value: string
  /** Not a rupiah figure — a rule or an inclusion. Set in the softer ink. */
  soft?: boolean
}

type ReceiptTableProps = {
  rows: readonly ReceiptRow[]
  total?: { label: string; value: string }
  note?: string
}

/**
 * Costs as a receipt, not a marketing table. Mono figures line up, which is the
 * point: the brand's second claim is that you can see exactly what you pay.
 *
 * A description list, because every line is a label and its value.
 */
export function ReceiptTable({ rows, total, note }: ReceiptTableProps) {
  const row = 'flex justify-between gap-8 py-1.5'

  return (
    <>
      <dl className="font-mono text-[15px] leading-[1.6] text-ink">
        {rows.map((r) => (
          <div key={r.label} className={row}>
            <dt>{r.label}</dt>
            <dd className={cn('text-right', r.soft ? 'text-ink-soft' : 'text-ink')}>{r.value}</dd>
          </div>
        ))}
        {total && (
          <div className={cn(row, 'mt-1.5 border-t border-ink pt-2.5 font-medium')}>
            <dt>{total.label}</dt>
            <dd className="text-right">{total.value}</dd>
          </div>
        )}
      </dl>
      {note && <p className="mt-3 font-body text-[13px] text-ink-soft">{note}</p>}
    </>
  )
}
