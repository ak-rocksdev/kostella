'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  ChevronRight,
  DoorOpen,
  MessageCircle,
  UserRound,
} from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/cn'
import { buildingName } from '@/lib/content/management/buildings'
import {
  daysUntilDue,
  hasNotice,
  isCurrent,
  isIncoming,
  nextDue,
  type Tenancy,
} from '@/lib/content/management/tenancies'
import { useManagement } from '@/lib/management/useManagement'
import { daysBetween, formatDate, formatDateShort, relativeDays } from '@/lib/dates'
import { formatRupiah } from '@/lib/format'

const ALL = '__all__'

/**
 * Everyone currently in a room, and everyone about to be.
 *
 * **Sorted by next due date, nearest first.** That ordering is the reason to
 * open this in the morning; by name or by room it would be a filing cabinet.
 * Two things jump the queue, in this order: a leaving date that has arrived and
 * needs confirming, then someone whose rent is due within days. Both are work
 * that stops if nobody does it today.
 *
 * Past tenants are deliberately absent. `RoomHistory` already shows a room's
 * audit entries, and every action here writes one, so a room's history lives
 * where somebody would look for it rather than in a second list.
 */
export function TenantList() {
  const { buildings, tenancies, today } = useManagement()
  const [scope, setScope] = useState<string>(ALL)

  if (!today) return <div className="wrap-wide py-8 sm:py-10" />

  const inScope = (t: Tenancy) => scope === ALL || t.building === scope
  const rows = tenancies
    .filter((t) => (isCurrent(t, today) || isIncoming(t, today)) && inScope(t))
    .map((tenancy) => {
      const incoming = isIncoming(tenancy, today)
      const leaving = hasNotice(tenancy, today)
      const overdue = leaving && daysBetween(tenancy.leavingOn!, today) >= 0
      const due = incoming ? null : daysUntilDue(tenancy, today)
      return { tenancy, incoming, leaving, overdue, due }
    })
    .sort((a, b) => rank(a) - rank(b))

  const nameOf = (number: string) => {
    const b = buildings.find((x) => x.number === number)
    return b ? buildingName(b, buildings) : `Kostella ${number}`
  }

  const leavingSoon = rows.filter((r) => r.leaving).length
  const dueSoon = rows.filter((r) => r.due !== null && r.due <= 3).length

  return (
    <div className="wrap-wide py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.02em]">Penghuni</h1>
          <p className="mt-2 text-[15px] text-ink-soft">
            Urut dari jatuh tempo terdekat. Yang akan keluar naik ke atas.
          </p>
        </div>

        <Select
          label="Lingkup"
          align="end"
          value={scope}
          onChange={setScope}
          options={[
            { value: ALL, label: 'Semua gedung', detail: `${buildings.length} gedung` },
            ...buildings.map((b) => ({
              value: b.number,
              label: buildingName(b, buildings),
              detail: b.district,
            })),
          ]}
        />
      </div>

      <dl className="mt-6 grid grid-cols-2 overflow-hidden rounded-card bg-paper shadow-card sm:grid-cols-3">
        {[
          {
            label: 'Penghuni',
            value: rows.filter((r) => !r.incoming).length,
            detail: 'sedang menempati',
          },
          {
            label: 'Jatuh tempo ≤ 3 hari',
            value: dueSoon,
            detail: dueSoon ? 'perlu diingatkan' : 'tidak ada yang mendesak',
          },
          {
            label: 'Akan keluar',
            value: leavingSoon,
            detail: leavingSoon ? 'kamar bisa mulai ditawarkan' : 'belum ada pemberitahuan',
          },
        ].map((item, i) => (
          <div
            key={item.label}
            className={cn(
              'grid grid-rows-subgrid row-span-3 content-start px-5 py-4',
              i % 2 === 1 && 'border-l border-line',
              i >= 2 && 'border-t border-line',
              'sm:border-t-0',
              i > 0 && 'sm:border-l sm:border-line',
            )}
          >
            <dt className="text-[13px] text-ink-soft">{item.label}</dt>
            <dd className="mt-1 font-figure text-[26px] leading-none font-bold tracking-[-0.02em]">
              {item.value}
            </dd>
            <dd className="mt-1.5 text-[12px] leading-[1.4] text-ink-soft">{item.detail}</dd>
          </div>
        ))}
      </dl>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line px-5 py-10 text-center text-[14px] text-ink-soft">
          Belum ada penghuni tercatat di lingkup ini. Catat lewat kisi kamar di halaman gedung.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-2.5">
          {rows.map(({ tenancy, incoming, leaving, overdue, due }) => (
            <li
              key={tenancy.id}
              className={cn(
                'rounded-card bg-paper p-4 shadow-card sm:p-5',
                overdue && 'ring-1 ring-held/50',
              )}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-2 text-[16px] font-semibold">
                  <UserRound size={16} strokeWidth={1.9} aria-hidden className="text-ink-soft" />
                  {tenancy.name}
                </span>
                <span className="text-[13px] text-ink-soft">
                  {nameOf(tenancy.building)} · kamar {tenancy.room}
                </span>
                <span className="text-[13px] text-ink-soft">{tenancy.occupation}</span>

                {/* One target per card, at the size a thumb needs.
                    The building and room used to be the link, and measured 20px
                    tall at 390px — a control below the 44px floor these
                    guidelines set, dressed as running text. Plain text now
                    says where the tenant is; this says where to go. */}
                <Link
                  href={`/management/buildings/${tenancy.building}`}
                  className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-plum transition-colors hover:bg-stone hover:text-ink"
                >
                  Buka kamar
                  <ArrowRight size={14} strokeWidth={1.9} aria-hidden />
                </Link>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-ink-soft">
                <span>
                  {incoming ? 'Masuk' : 'Sejak'} {formatDate(tenancy.movedIn)}
                </span>
                <span className="font-figure font-semibold text-ink">
                  {formatRupiah(tenancy.agreedRent)}
                  <span className="font-body font-normal text-ink-soft">/bulan</span>
                </span>

                {due !== null && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5',
                      due <= 3 && 'font-semibold text-ink',
                    )}
                  >
                    <CalendarClock size={14} strokeWidth={1.9} aria-hidden />
                    Jatuh tempo {formatDateShort(nextDue(tenancy, today))} · {relativeDays(due)}
                  </span>
                )}

                {/* WhatsApp, not a call. It is how a kos manager reaches a
                    tenant here, so the verb has to match. The number is masked
                    in a public repository, which the title says outright rather
                    than letting a dead link look broken. */}
                <span
                  title="Nomor disamarkan di prototipe ini"
                  className="inline-flex items-center gap-1.5"
                >
                  <MessageCircle size={14} strokeWidth={1.9} aria-hidden />
                  {tenancy.phone}
                </span>
              </div>

              {leaving && (
                <p
                  className={cn(
                    'mt-2.5 flex items-center gap-2 rounded-badge px-3 py-2 text-[13px]',
                    overdue ? 'bg-held-soft font-semibold text-held' : 'bg-stone text-ink',
                  )}
                >
                  <DoorOpen size={15} strokeWidth={1.9} aria-hidden className="shrink-0" />
                  {overdue
                    ? `Seharusnya keluar ${formatDate(tenancy.leavingOn!)} — konfirmasi agar kamar jadi kosong`
                    : `Akan keluar ${formatDate(tenancy.leavingOn!)} · kamar bisa mulai ditawarkan`}
                </p>
              )}

              {/* Guardian sits behind a disclosure rather than in the row:
                  wanted in an emergency, not while scanning nineteen names.
                  The marker is there so it reads as something to open — the
                  first version was bare text that looked like a stray label. */}
              <details className="group mt-1 text-[13px]">
                <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-ink-soft hover:text-ink [&::-webkit-details-marker]:hidden">
                  <ChevronRight
                    size={14}
                    strokeWidth={2}
                    aria-hidden
                    className="transition-[rotate] duration-200 group-open:rotate-90"
                  />
                  Kontak orang tua / wali
                </summary>
                <p className="pb-1 pl-5 text-ink-soft">
                  {tenancy.guardianName} · {tenancy.guardianPhone}
                </p>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Overdue departures, then notices, then by how soon rent is due. */
function rank(row: {
  incoming: boolean
  leaving: boolean
  overdue: boolean
  due: number | null
}): number {
  if (row.overdue) return -2000
  if (row.leaving) return -1000
  if (row.incoming) return 1000
  return row.due ?? 0
}
