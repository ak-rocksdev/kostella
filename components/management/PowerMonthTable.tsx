'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { buildingName, type Building } from '@/lib/content/management/buildings'
import {
  monthLabel,
  monthOf,
  monthStart,
  powerMonth,
  POWER_STAGE_LABEL,
  type PowerStage,
} from '@/lib/content/management/billing'
import type { Tenancy } from '@/lib/content/management/tenancies'
import { addCharge, markPlnPaid, recordPln } from '@/lib/management/store'
import { useManagement } from '@/lib/management/useManagement'
import { addDays, addMonths, formatDateShort } from '@/lib/dates'
import { formatRupiah } from '@/lib/format'

/** Where each stage sits on the panel's urgency scale. */
const STAGE_TONE: Record<PowerStage, string> = {
  'belum-dicatat': 'bg-stone text-ink-soft',
  'utang-pln': 'bg-held-soft text-held',
  'tanpa-penghuni': 'bg-stone text-ink-soft',
  'belum-ditagih': 'bg-held-soft text-held',
  'menunggu-bayar': 'bg-plum/10 text-plum',
  selesai: 'bg-available/10 text-available',
}

/**
 * A month of electricity, one building at a time.
 *
 * This is a batch job, not a series of one-offs: invoices arrive for thirty
 * meters at once and a manager works down them. So the amount is typed into
 * the row itself — no form to open, tab to the next — and the two steps that
 * apply to every recorded row are single buttons at the foot rather than a
 * repeated control.
 *
 * The column that earns its place is **Selisih**. PLN bills a meter whether or
 * not anybody lives behind it, so a room standing empty is money leaving with
 * nothing to recover it. That is invisible in Kostella's books today.
 */
export function PowerMonthTable({ buildings }: { buildings: Building[] }) {
  const { tenancies, billing, apply, actor, today } = useManagement()
  const { show } = useToast()
  const [monthBack, setMonthBack] = useState(1)
  const [draft, setDraft] = useState<Record<string, string>>({})

  if (!today) return null

  // Last month by default: this month's invoices have not arrived.
  const month = monthOf(addMonths(monthStart(monthOf(today)), -monthBack))
  const rows = buildings.flatMap((b) =>
    b.rooms.map((room) => ({
      building: b,
      room,
      power: powerMonth(
        b.number,
        room.room,
        month,
        billing.bills,
        billing.charges,
        billing.payments,
        tenancies,
        today,
      ),
      tenant: room.tenant as Tenancy | undefined,
    })),
  )

  const unrecorded = rows.filter((r) => r.power.stage === 'belum-dicatat')
  const owedToPln = rows.filter((r) => r.power.stage === 'utang-pln')
  const unbilled = rows.filter((r) => r.power.stage === 'belum-ditagih' && r.tenant)
  // "Selesai" includes an empty room: PLN is paid and there is nobody to bill,
  // so there is no work left on it.
  const done = rows.filter(
    (r) => r.power.stage === 'selesai' || r.power.stage === 'tanpa-penghuni',
  ).length
  const emptyCost = rows
    .filter((r) => r.power.bill && !r.tenant)
    .reduce((n, r) => n + r.power.bill!.amount, 0)

  const saveDraft = (key: string, building: string, room: string) => {
    const raw = draft[key]
    const amount = Number(String(raw ?? '').replace(/\D/g, ''))
    if (!amount) return
    apply((s) => recordPln(s, building, room, month, amount))
    setDraft((d) => ({ ...d, [key]: '' }))
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 text-[15px] font-semibold">
          <Zap size={16} strokeWidth={1.9} aria-hidden className="text-ink-soft" />
          Listrik — {monthLabel(month)}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            onClick={() => setMonthBack((n) => n + 1)}
            className="inline-flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-stone hover:text-ink"
          >
            <ChevronLeft size={16} strokeWidth={1.9} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            disabled={monthBack <= 0}
            onClick={() => setMonthBack((n) => Math.max(0, n - 1))}
            className="inline-flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-stone hover:text-ink disabled:opacity-35"
          >
            <ChevronRight size={16} strokeWidth={1.9} aria-hidden />
          </button>
        </div>
      </div>

      {/* A finish line. Per-building counts existed; nothing said the month
          was done, so there was nothing to work towards. */}
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div
          className="h-1.5 min-w-40 flex-1 overflow-hidden rounded-full bg-stone"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={rows.length}
          aria-label="Kemajuan listrik bulan ini"
        >
          <div
            className={cn('h-full rounded-full', done === rows.length ? 'bg-available' : 'bg-ink')}
            style={{ width: `${rows.length ? (done / rows.length) * 100 : 0}%` }}
          />
        </div>
        <p className="text-[13px] text-ink-soft">
          {done === rows.length ? (
            <span className="font-semibold text-available">
              {rows.length} kamar selesai — tidak ada yang tertinggal bulan ini
            </span>
          ) : (
            <>
              <strong className="font-figure font-semibold text-ink">
                {done}/{rows.length}
              </strong>{' '}
              kamar selesai
            </>
          )}
        </p>
      </div>

      {emptyCost > 0 && (
        // The figure this whole section exists to surface.
        <p className="mb-4 flex flex-wrap items-baseline gap-x-2 rounded-card bg-held-soft px-4 py-3 text-[13px] text-held">
          <strong className="font-semibold">{formatRupiah(emptyCost)}</strong>
          ditagih PLN untuk kamar tanpa penghuni bulan ini — biaya Kostella, tidak ada yang bisa
          ditagih.
        </p>
      )}

      <div className="flex flex-col gap-5">
        {buildings.map((b) => {
          const mine = rows.filter((r) => r.building.number === b.number)
          const recorded = mine.filter((r) => r.power.bill)
          const unpaid = recorded.filter((r) => !r.power.bill!.paidOn)
          const billable = mine.filter((r) => r.power.stage === 'belum-ditagih' && r.tenant)

          return (
            <div key={b.number} className="overflow-hidden rounded-card bg-paper shadow-card">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line px-5 py-3">
                <h3 className="text-[14px] font-semibold">{buildingName(b, buildings)}</h3>
                <p className="font-figure text-[13px] text-ink-soft">
                  {recorded.length}/{mine.length} kamar dicatat
                </p>
              </div>

              {/* A five-column table clipped its most important column inside
                  an overflow-hidden card at 500px — the one saying what is
                  stuck, unreachable. Below lg it becomes stacked rows. */}
              <table className="hidden w-full border-collapse text-left lg:table">
                <thead>
                  <tr className="border-b border-line text-[12px] text-ink-soft">
                    <th className="px-5 py-2.5 font-medium">Kamar</th>
                    <th className="px-5 py-2.5 font-medium">Penghuni</th>
                    <th className="px-5 py-2.5 text-right font-medium">Tagihan PLN</th>
                    <th className="px-5 py-2.5 text-right font-medium">Ditagihkan</th>
                    <th className="px-5 py-2.5 font-medium">Tahap</th>
                  </tr>
                </thead>
                <tbody>
                  {mine.map(({ room, power, tenant }) => {
                    const key = `${b.number}/${room.room}`
                    return (
                      <tr
                        key={key}
                        className={cn(
                          'border-b border-line last:border-0',
                          power.bill && !tenant && 'bg-held-soft/30',
                        )}
                      >
                        <td className="px-5 py-2.5 font-figure text-[14px] font-semibold">
                          {room.room}
                        </td>
                        <td className="px-5 py-2.5 text-[13px] text-ink-soft">
                          {tenant?.name ?? <span className="text-held">kosong</span>}
                        </td>
                        <td className="px-5 py-2.5 text-right">
                          {power.bill ? (
                            <span className="font-figure text-[14px] font-semibold">
                              {formatRupiah(power.bill.amount)}
                            </span>
                          ) : (
                            /* Typed in the row. Thirty of these a month is the
                               job; opening a form for each would end in none of
                               them being entered. */
                            <input
                              inputMode="numeric"
                              placeholder="Rp —"
                              aria-label={`Tagihan PLN kamar ${room.room}`}
                              value={draft[key] ?? ''}
                              onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                              onBlur={() => saveDraft(key, b.number, room.room)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  saveDraft(key, b.number, room.room)
                                }
                              }}
                              className="w-28 rounded-badge border border-line bg-canvas px-2.5 py-1.5 text-right font-figure text-[14px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-plum"
                            />
                          )}
                        </td>
                        <td className="px-5 py-2.5 text-right font-figure text-[13px] text-ink-soft">
                          {power.charges.length ? formatRupiah(power.chargedTotal) : '—'}
                        </td>
                        <td className="px-5 py-2.5">
                          <span
                            className={cn(
                              'inline-block rounded-badge px-2 py-0.5 text-[12px] font-semibold',
                              STAGE_TONE[power.stage],
                            )}
                          >
                            {POWER_STAGE_LABEL[power.stage]}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              <ul className="lg:hidden">
                {mine.map(({ room, power, tenant }) => {
                  const key = `${b.number}/${room.room}`
                  return (
                    <li
                      key={key}
                      className={cn(
                        'flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-3 last:border-0',
                        power.bill && !tenant && 'bg-held-soft/30',
                      )}
                    >
                      <span className="font-figure text-[15px] font-semibold">{room.room}</span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-ink-soft">
                        {tenant?.name ?? <span className="text-held">kosong</span>}
                      </span>
                      {power.bill ? (
                        <span className="font-figure text-[14px] font-semibold">
                          {formatRupiah(power.bill.amount)}
                        </span>
                      ) : (
                        <input
                          inputMode="numeric"
                          placeholder="Rp —"
                          aria-label={`Tagihan PLN kamar ${room.room}`}
                          value={draft[key] ?? ''}
                          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                          onBlur={() => saveDraft(key, b.number, room.room)}
                          className="min-h-11 w-28 rounded-badge border border-line bg-canvas px-2.5 text-right font-figure text-[14px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-plum"
                        />
                      )}
                      <span
                        className={cn(
                          'basis-full rounded-badge px-2 py-0.5 text-[12px] font-semibold',
                          'inline-block w-fit',
                          STAGE_TONE[power.stage],
                        )}
                      >
                        {POWER_STAGE_LABEL[power.stage]}
                      </span>
                    </li>
                  )
                })}
              </ul>

              {(unpaid.length > 0 || billable.length > 0) && (
                /* The two steps that apply to every recorded row at once. A
                   button per row would be thirty buttons for one decision. */
                <div className="flex flex-wrap gap-2 border-t border-line px-5 py-3">
                  {unpaid.length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        unpaid.forEach((r) => apply((s) => markPlnPaid(s, r.power.bill!, today)))
                        show({
                          title: `${unpaid.length} tagihan PLN ditandai dibayar`,
                          detail: `${buildingName(b, buildings)} · ${monthLabel(month)} · tercatat atas ${actor}`,
                          tone: 'success',
                          action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
                        })
                      }}
                    >
                      Tandai {unpaid.length} sudah dibayar ke PLN
                    </Button>
                  )}
                  {billable.length > 0 && (
                    <Button
                      size="sm"
                      onClick={() => {
                        billable.forEach((r) =>
                          apply((s) =>
                            addCharge(
                              s,
                              {
                                tenancy: r.tenant!.id,
                                kind: 'listrik',
                                period: month,
                                amount: r.power.bill!.amount,
                                dueOn: addDays(`${month}-28`, 10),
                              },
                              {
                                building: b.number,
                                room: r.room.room,
                                label: `Listrik ${monthLabel(month)}`,
                              },
                            ),
                          ),
                        )
                        show({
                          title: `Listrik ditagihkan ke ${billable.length} penghuni`,
                          detail: `${buildingName(b, buildings)} · jatuh tempo ${formatDateShort(addDays(`${month}-28`, 10))} · tercatat atas ${actor}`,
                          tone: 'success',
                          action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
                        })
                      }}
                    >
                      Tagihkan ke {billable.length} penghuni
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {unrecorded.length > 0 && (
        <p className="mt-4 text-[13px] text-ink-soft">
          {unrecorded.length} kamar belum ada angkanya. Ketik langsung di barisnya — invoice PLN
          datang per meteran, jadi angkanya sudah per kamar.
        </p>
      )}
      {owedToPln.length === 0 && unbilled.length === 0 && unrecorded.length === 0 && (
        <p className="mt-4 text-[13px] text-available">
          Semua kamar sudah dicatat, dibayar ke PLN, dan ditagihkan.
        </p>
      )}
    </section>
  )
}
