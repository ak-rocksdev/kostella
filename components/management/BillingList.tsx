'use client'

import { useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import {
  CHARGE_LABEL,
  monthLabel,
  rentCharge,
  rentPeriods,
  settle,
  type Charge,
  type Settlement,
} from '@/lib/content/management/billing'
import { isCurrent, type Tenancy } from '@/lib/content/management/tenancies'
import { addPayment } from '@/lib/management/store'
import { useManagement } from '@/lib/management/useManagement'
import { formatDateShort, relativeDays } from '@/lib/dates'
import { formatRupiah } from '@/lib/format'
import { PowerMonthTable } from './PowerMonthTable'
import { StatusChip } from '@/components/ui/StatusChip'
import { ALL_BUILDINGS, ScopeSelect, buildingNamer } from './ScopeSelect'

/**
 * What money is outstanding, and where it is stuck.
 *
 * Two directions, kept apart on purpose. A tenant owing rent and Kostella owing
 * PLN are both "Rp 2,4 juta on a screen", and mixing them makes that figure
 * ambiguous — so what tenants owe is the first section, and the PLN loop is its
 * own below.
 *
 * Ordered by how overdue, like every other worklist in this panel: it is opened
 * to work, not to browse.
 */
export function BillingList() {
  const { buildings, tenancies, billing, apply, actor, today } = useManagement()
  const [scope, setScope] = useState<string>(ALL_BUILDINGS)

  if (!today) return <div className="wrap-wide py-8 sm:py-10" />

  const inScope = buildings.filter((b) => scope === ALL_BUILDINGS || b.number === scope)
  const scopedNumbers = new Set(inScope.map((b) => b.number))
  const living = tenancies.filter((t) => isCurrent(t, today) && scopedNumbers.has(t.building))

  /* Every charge a living tenant carries: rent derived from their periods,
     plus whatever was added. */
  const all: Array<{ tenancy: Tenancy; settlement: Settlement }> = []
  for (const t of living) {
    for (const period of rentPeriods(t, today)) {
      all.push({ tenancy: t, settlement: settle(rentCharge(t, period), billing.payments, today) })
    }
    for (const c of billing.charges.filter((c) => c.tenancy === t.id)) {
      all.push({ tenancy: t, settlement: settle(c, billing.payments, today) })
    }
  }

  /* Grouped by person, not by charge.
     A manager chases somebody, not a line item — one tenant owing rent and
     electricity is one phone call, and listing them as two rows read as two
     jobs. One transfer usually settles both, which is what the form does. */
  const byTenant = new Map<string, { tenancy: Tenancy; items: Settlement[] }>()
  for (const { tenancy, settlement } of all) {
    if (settlement.status === 'lunas') continue
    const entry = byTenant.get(tenancy.id) ?? { tenancy, items: [] }
    entry.items.push(settlement)
    byTenant.set(tenancy.id, entry)
  }

  const outstanding = [...byTenant.values()]
    .map((g) => ({
      ...g,
      items: g.items.sort((a, b) => a.charge.dueOn.localeCompare(b.charge.dueOn)),
      owed: g.items.reduce((n, s) => n + s.outstanding, 0),
      worst: Math.max(...g.items.map((s) => s.lateBy)),
    }))
    .sort((a, b) => b.worst - a.worst)

  const owedByTenants = outstanding.reduce((n, x) => n + x.owed, 0)
  const owedToPln = billing.bills
    .filter((b) => !b.paidOn && scopedNumbers.has(b.building))
    .reduce((n, b) => n + b.amount, 0)

  const nameOf = buildingNamer(buildings)

  return (
    <div className="wrap-wide py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.02em]">Tagihan</h1>
          {/* Both directions in one line, each labelled by who owes whom —
              the figures are meaningless without it. */}
          <p className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[15px] text-ink-soft">
            <span>
              <strong className="font-figure font-semibold text-ink">
                {formatRupiah(owedByTenants)}
              </strong>{' '}
              belum masuk dari penghuni
            </span>
            <span>
              <strong
                className={cn('font-figure font-semibold', owedToPln ? 'text-held' : 'text-ink')}
              >
                {formatRupiah(owedToPln)}
              </strong>{' '}
              belum dibayar ke PLN
            </span>
          </p>
        </div>

        <ScopeSelect buildings={buildings} value={scope} onChange={setScope} />
      </div>

      <section className="mt-8">
        <SectionLabel className="mb-4">Belum dibayar</SectionLabel>

        {outstanding.length === 0 ? (
          <p className="flex items-center gap-3 rounded-card border border-dashed border-line px-5 py-8 text-[14px] text-ink-soft">
            <CircleCheck
              size={18}
              strokeWidth={1.9}
              aria-hidden
              className="shrink-0 text-available"
            />
            Semua tagihan penghuni sudah lunas di lingkup ini.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {outstanding.map((group) => (
              <OutstandingRow
                key={group.tenancy.id}
                group={group}
                where={nameOf(group.tenancy.building)}
                onPay={(amount, method, note) => {
                  /* One transfer, spread across what is owed oldest first —
                     which is how the money actually arrives. Allocating by hand
                     would be arithmetic at the point of typing. */
                  let left = amount
                  apply((s) => {
                    let next = s
                    for (const item of group.items) {
                      if (left <= 0) break
                      const take = Math.min(left, item.outstanding)
                      left -= take
                      next = addPayment(
                        next,
                        {
                          charge: item.charge.id,
                          paidOn: today,
                          amount: take,
                          method,
                          note,
                          totalThen: item.total,
                        },
                        {
                          building: group.tenancy.building,
                          room: group.tenancy.room,
                          label: `${group.tenancy.name} — ${chargeLabel(item.charge)}`,
                        },
                      )
                    }
                    return next
                  })
                }}
                actor={actor}
              />
            ))}
          </ul>
        )}
      </section>

      <div className="mt-10">
        <PowerMonthTable buildings={inScope} />
      </div>
    </div>
  )
}

/** "Sewa 4 Agt – 4 Sep" / "Listrik Juli 2026" — the period in its own terms. */
function chargeLabel(charge: Charge): string {
  if (charge.kind === 'sewa') return `Sewa ${formatDateShort(charge.period)}`
  if (charge.kind === 'listrik') return `Listrik ${monthLabel(charge.period)}`
  return CHARGE_LABEL[charge.kind]
}

/**
 * One thing owed, with the way to clear it on the row.
 *
 * Recording a payment needs three fields, so it opens in place rather than
 * sending a manager to another screen — the friction of a page change for three
 * fields ends in nothing being recorded at all.
 */
function OutstandingRow({
  group,
  where,
  onPay,
  actor,
}: {
  group: { tenancy: Tenancy; items: Settlement[]; owed: number; worst: number }
  where: string
  onPay: (amount: number, method: 'transfer' | 'tunai', note?: string) => void
  actor: string
}) {
  const { show } = useToast()
  const { tenancy, items, owed, worst } = group
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(String(owed))
  const [method, setMethod] = useState<'transfer' | 'tunai'>('transfer')
  const [note, setNote] = useState('')

  const value = Number(String(amount).replace(/\D/g, ''))
  const short = value > 0 && value < owed
  const late = worst > 0

  return (
    <li
      className={cn('rounded-card bg-paper p-4 shadow-card sm:p-5', late && 'ring-1 ring-held/50')}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <div className="min-w-0 flex-1 basis-60">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[16px] font-semibold">{tenancy.name}</span>
            <StatusChip tone={late ? 'late' : 'now'}>
              {late ? `Terlambat ${worst} hari` : relativeDays(-worst)}
            </StatusChip>
            <span className="text-[13px] text-ink-soft">
              {where} · kamar {tenancy.room}
            </span>
          </div>

          {/* The total leads, because that is what gets asked for. The lines
              below say what it is made of, so the answer to "for what" is
              already on screen when the tenant asks. */}
          <p className="mt-1.5 font-figure text-[18px] font-bold">{formatRupiah(owed)}</p>
          <ul className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[13px] text-ink-soft">
            {items.map((item) => (
              <li key={item.charge.id}>
                {chargeLabel(item.charge)} {formatRupiah(item.outstanding)}
                {item.paid > 0 && ` (sisa dari ${formatRupiah(item.total)})`}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[13px] text-ink-soft">{tenancy.phone}</p>
        </div>

        <Button variant={open ? 'ghost' : 'secondary'} size="sm" onClick={() => setOpen(!open)}>
          {open ? 'Tutup' : 'Catat pembayaran'}
        </Button>
      </div>

      {open && (
        <form
          className="mt-4 flex flex-wrap items-end gap-3 rounded-card bg-canvas p-4"
          onSubmit={(e) => {
            e.preventDefault()
            onPay(value, method, note.trim() || undefined)
            show({
              title: `${tenancy.name} bayar ${formatRupiah(value)}`,
              detail:
                items.length > 1 && value >= owed
                  ? `${items.length} tagihan lunas · ${method} · tercatat atas ${actor}`
                  : `${chargeLabel(items[0].charge)} · ${method} · tercatat atas ${actor}`,
              tone: 'success',
              action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
            })
            setOpen(false)
          }}
        >
          <label className="basis-40">
            <span className="mb-1.5 block text-[13px] font-semibold">Jumlah diterima</span>
            <input
              inputMode="numeric"
              required
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="min-h-11 w-full rounded-badge border border-line bg-paper px-3 text-right font-figure text-[14px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-plum"
            />
          </label>
          <label className="basis-36">
            <span className="mb-1.5 block text-[13px] font-semibold">Cara</span>
            <Select
              variant="field"
              label="Cara bayar"
              value={method}
              onChange={(v) => setMethod(v as 'transfer' | 'tunai')}
              options={[
                { value: 'transfer', label: 'Transfer' },
                { value: 'tunai', label: 'Tunai' },
              ]}
            />
          </label>
          <label className="min-w-0 flex-1 basis-56">
            <span className="mb-1.5 block text-[13px] font-semibold">
              Catatan {short ? '' : '(opsional)'}
            </span>
            <input
              required={short}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={short ? 'kenapa kurang dari tagihan' : ''}
              className="min-h-11 w-full rounded-badge border border-line bg-paper px-3 text-[14px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-plum"
            />
            <span className="mt-1.5 block text-[12px] text-ink-soft">
              {short ? (
                <span className="text-held">
                  Kurang {formatRupiah(owed - value)}. Dipakai untuk tagihan terlama dulu.
                </span>
              ) : items.length > 1 ? (
                `Melunasi ${items.length} tagihan sekaligus.`
              ) : (
                ''
              )}
            </span>
          </label>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" type="submit">
              Simpan
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Batal
            </Button>
          </div>
        </form>
      )}
    </li>
  )
}
