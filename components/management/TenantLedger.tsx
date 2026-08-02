'use client'

import { StatusChip } from '@/components/ui/StatusChip'
import {
  monthLabel,
  rentCharge,
  rentPeriods,
  settle,
  type Charge,
} from '@/lib/content/management/billing'
import type { Tenancy } from '@/lib/content/management/tenancies'
import { useManagement } from '@/lib/management/useManagement'
import { formatDate, formatDateShort } from '@/lib/dates'
import { formatRupiah } from '@/lib/format'

/** Charge status onto the panel's three-step scale plus done. */
const STATUS_TONE = {
  terlambat: 'late',
  kurang: 'late',
  belum: 'now',
  lunas: 'done',
} as const

const LABEL = {
  terlambat: 'Terlambat',
  kurang: 'Kurang bayar',
  belum: 'Belum bayar',
  lunas: 'Lunas',
} as const

/**
 * One tenant's money, newest first.
 *
 * It belongs to the person, not the room. When 212 passes from one tenant to
 * the next their histories must not merge — that is why phase 3 gave a tenancy
 * an identity, and why every charge points at one.
 *
 * Capped at twelve periods. A tenant of two years has twenty-four and nobody
 * scrolls a room panel for the twenty-third; the audit log holds the rest.
 */
export function TenantLedger({ tenant }: { tenant: Tenancy }) {
  const { billing, today } = useManagement()
  if (!today) return null

  const rows = [
    ...rentPeriods(tenant, today).map((p) => rentCharge(tenant, p)),
    ...billing.charges.filter((c) => c.tenancy === tenant.id),
  ]
    .map((charge) => settle(charge, billing.payments, today))
    .sort((a, b) => b.charge.dueOn.localeCompare(a.charge.dueOn))

  const owed = rows.reduce((n, r) => n + r.outstanding, 0)
  const shown = rows.slice(0, 12)

  return (
    <div className="mt-5 border-t border-line pt-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[14px] font-semibold">Riwayat pembayaran</h3>
        <p className="text-[13px] text-ink-soft">
          {owed > 0 ? (
            <>
              <strong className="font-figure font-semibold text-held">{formatRupiah(owed)}</strong>{' '}
              belum dibayar
            </>
          ) : (
            <span className="text-available">Tidak ada tunggakan</span>
          )}
        </p>
      </div>

      <ul className="flex flex-col">
        {shown.map((r) => (
          <li
            key={r.charge.id}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-line py-2 last:border-0 text-[13px]"
          >
            <span className="min-w-40 font-medium">{periodLabel(r.charge)}</span>
            <span className="font-figure font-semibold">{formatRupiah(r.total)}</span>
            <StatusChip tone={STATUS_TONE[r.status]}>{LABEL[r.status]}</StatusChip>
            {r.payments.length > 0 && (
              <span className="text-ink-soft">
                dibayar {formatDate(r.payments[0].paidOn)} · {r.payments[0].method}
                {r.status === 'kurang' && ` · ${formatRupiah(r.paid)}`}
              </span>
            )}
            {r.payments[0]?.note && (
              <span className="basis-full text-[12px] text-ink-soft">
                &ldquo;{r.payments[0].note}&rdquo;
              </span>
            )}
          </li>
        ))}
      </ul>

      {rows.length > shown.length && (
        <p className="mt-2 text-[12px] text-ink-soft">
          {rows.length - shown.length} periode lebih lama ada di Aktivitas.
        </p>
      )}
    </div>
  )
}

function periodLabel(charge: Charge): string {
  if (charge.kind === 'sewa') return `Sewa ${formatDateShort(charge.period)}`
  if (charge.kind === 'listrik') return `Listrik ${monthLabel(charge.period)}`
  return charge.note ?? charge.kind
}
