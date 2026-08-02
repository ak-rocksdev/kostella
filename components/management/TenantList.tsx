'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CircleCheck, MessageCircle } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
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
import { ALL_BUILDINGS, ScopeSelect } from './ScopeSelect'
import { useManagement } from '@/lib/management/useManagement'
import { daysBetween, formatDate, formatDateShort, relativeDays } from '@/lib/dates'
import { formatRupiah } from '@/lib/format'
import { urgencyOf } from './urgency'
import { RING_LATE, StatusChip, TEXT_TONE, TONE_BG } from '@/components/ui/StatusChip'

/** How near a due date has to be before it is today's problem. */
const DUE_SOON = 3

type Row = {
  tenancy: Tenancy
  incoming: boolean
  /** Announced a departure and still here. */
  leaving: boolean
  /** The leaving date has arrived and nobody has confirmed it. */
  overdue: boolean
  /** Days until rent is due. Null for someone who has not moved in. */
  due: number | null
}

/**
 * Who is in which room.
 *
 * This screen answers two different questions and used to answer both the same
 * way: twenty-two identical cards, of which eighteen asked nothing of anybody.
 * The strip announced "3 jatuh tempo, 1 akan keluar" and then made a manager
 * hunt the whole list to find which four.
 *
 * Split by the job:
 *
 * - **Perlu tindakan hari ini** — the handful that need something, with the
 *   thing named. It empties as the work gets done, which is the only way this
 *   screen can ever say "finished".
 * - **Semua penghuni** — a table. For "where is Rina", aligned columns let the
 *   eye run down one axis; the prose rows this replaced ran four kinds of data
 *   together in a sentence.
 *
 * The guardian contact moved to the room page. It sat on all twenty-two rows
 * for something wanted perhaps twice a year, in an emergency, about one person
 * — and a room is where you look one person up.
 */
export function TenantList() {
  const { buildings, tenancies, today } = useManagement()
  const [scope, setScope] = useState<string>(ALL_BUILDINGS)

  if (!today) return <div className="wrap-wide py-8 sm:py-10" />

  const rows: Row[] = tenancies
    .filter(
      (t) =>
        (isCurrent(t, today) || isIncoming(t, today)) &&
        (scope === ALL_BUILDINGS || t.building === scope),
    )
    .map((tenancy) => {
      const incoming = isIncoming(tenancy, today)
      const leaving = hasNotice(tenancy, today)
      return {
        tenancy,
        incoming,
        leaving,
        overdue: leaving && daysBetween(tenancy.leavingOn!, today) >= 0,
        due: incoming ? null : daysUntilDue(tenancy, today),
      }
    })

  const needsAction = rows
    .filter((r) => r.overdue || r.leaving || (r.due !== null && r.due <= DUE_SOON))
    .sort((a, b) => weight(a) - weight(b))

  const everyone = [...rows].sort(
    (a, b) => (a.due ?? 9999) - (b.due ?? 9999) || a.tenancy.name.localeCompare(b.tenancy.name),
  )

  const living = rows.filter((r) => !r.incoming).length
  const arriving = rows.filter((r) => r.incoming).length

  const nameOf = (number: string) => {
    const b = buildings.find((x) => x.number === number)
    return b ? buildingName(b, buildings) : `Kostella ${number}`
  }

  return (
    <div className="wrap-wide py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.02em]">Penghuni</h1>
          <p className="mt-2 text-[15px] text-ink-soft">
            {living} orang menempati kamar
            {arriving > 0 && `, ${arriving} lagi akan masuk`}.
          </p>
        </div>

        <ScopeSelect buildings={buildings} value={scope} onChange={setScope} />
      </div>

      {/* ── The work ─────────────────────────────────────────────────────── */}
      <section className="mt-8">
        <SectionLabel className="mb-4">Perlu tindakan hari ini</SectionLabel>

        {needsAction.length === 0 ? (
          // Says the check ran, and gives the day a finish line.
          <p className="flex items-center gap-3 rounded-card border border-dashed border-line px-5 py-8 text-[14px] text-ink-soft">
            <CircleCheck
              size={18}
              strokeWidth={1.9}
              aria-hidden
              className="shrink-0 text-available"
            />
            Tidak ada yang jatuh tempo dalam {DUE_SOON} hari, dan tidak ada yang menunggu
            dikonfirmasi keluar.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {needsAction.map((row) => (
              <ActionRow key={row.tenancy.id} row={row} today={today} nameOf={nameOf} />
            ))}
          </ul>
        )}
      </section>

      {/* ── The register ─────────────────────────────────────────────────── */}
      <section className="mt-10">
        <SectionLabel className="mb-4">Semua penghuni</SectionLabel>

        <div className="overflow-hidden rounded-card bg-paper shadow-card">
          {/* A table from lg up, where columns have room to line up. Below that
              a stacked row: a data table on a phone needs a deliberate
              small-screen form, not a horizontal scrollbar. */}
          <table className="hidden w-full border-collapse text-left lg:table">
            <thead>
              <tr className="border-b border-line text-[12px] text-ink-soft">
                <th className="px-5 py-3 font-medium">Penghuni</th>
                <th className="px-5 py-3 font-medium">Gedung · kamar</th>
                <th className="px-5 py-3 font-medium">Sejak</th>
                <th className="px-5 py-3 text-right font-medium">Sewa / bulan</th>
                <th className="px-5 py-3 text-right font-medium">Jatuh tempo</th>
                <th className="px-5 py-3">
                  <span className="sr-only">Buka kamar</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {everyone.map(({ tenancy, incoming, leaving, overdue, due }) => (
                <tr
                  key={tenancy.id}
                  className={cn('border-b border-line last:border-0', overdue && 'bg-held-soft/30')}
                >
                  <td className="px-5 py-3">
                    <span className="block text-[15px] font-semibold">{tenancy.name}</span>
                    <span className="block text-[12px] text-ink-soft">{tenancy.occupation}</span>
                  </td>
                  <td className="px-5 py-3 text-[13px] text-ink-soft">
                    {nameOf(tenancy.building)} · {tenancy.room}
                  </td>
                  <td className="px-5 py-3 text-[13px] text-ink-soft">
                    {incoming
                      ? `masuk ${formatDateShort(tenancy.movedIn)}`
                      : formatDate(tenancy.movedIn)}
                  </td>
                  {/* Ranged right so a column of figures reads straight down —
                      the reason a table beats the prose rows it replaced. */}
                  <td className="px-5 py-3 text-right font-figure text-[14px] font-semibold whitespace-nowrap">
                    {formatRupiah(tenancy.agreedRent)}
                  </td>
                  <td className="px-5 py-3 text-right text-[13px] whitespace-nowrap">
                    {due !== null && (
                      <span className="text-ink-soft">
                        {formatDateShort(nextDue(tenancy, today))}
                      </span>
                    )}
                    {/* The same chip the section above uses, and only where a
                        row is genuinely near: twenty-two chips would rank
                        nothing. A row shouting here shouts there in the same
                        words and the same colour. */}
                    {(() => {
                      const overdueBy = overdue ? daysBetween(tenancy.leavingOn!, today) : undefined
                      const near =
                        overdue || leaving || (due !== null && due <= DUE_SOON) || incoming
                      if (!near) return null
                      const u = urgencyOf({
                        overdueBy,
                        leaving: leaving && !overdue,
                        due: incoming ? null : due,
                      })
                      return (
                        <StatusChip tone={u.level} className="ml-2">
                          {u.chip}
                        </StatusChip>
                      )
                    })()}
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <Link
                      href={`/management/buildings/${tenancy.building}`}
                      aria-label={`Buka kamar ${tenancy.room} — ${tenancy.name}`}
                      className="inline-flex size-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-stone hover:text-ink"
                    >
                      <ArrowRight size={16} strokeWidth={1.9} aria-hidden />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="lg:hidden">
            {everyone.map(({ tenancy, incoming, leaving, overdue, due }) => (
              <li key={tenancy.id} className="border-b border-line last:border-0">
                <Link
                  href={`/management/buildings/${tenancy.building}`}
                  className="flex min-h-11 items-center gap-3 px-4 py-3 transition-colors hover:bg-canvas"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold">{tenancy.name}</span>
                    <span className="block truncate text-[12px] text-ink-soft">
                      {nameOf(tenancy.building)} · {tenancy.room} · {tenancy.occupation}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-figure text-[13px] font-semibold">
                      {formatRupiah(tenancy.agreedRent)}
                    </span>
                    {/* The same three-step scale as the table and the section
                        above, carried by text colour rather than a chip — a
                        chip would cost width this row does not have. */}
                    <span
                      className={cn(
                        'block text-[12px] font-semibold',
                        TEXT_TONE[
                          urgencyOf({
                            overdueBy: overdue ? daysBetween(tenancy.leavingOn!, today) : undefined,
                            leaving: leaving && !overdue,
                            due: incoming ? null : due,
                          }).level
                        ],
                      )}
                    >
                      {overdue
                        ? `terlewat ${daysBetween(tenancy.leavingOn!, today)} hari`
                        : leaving
                          ? `kontrak habis ${formatDateShort(tenancy.leavingOn!)}`
                          : incoming
                            ? `masuk ${formatDateShort(tenancy.movedIn)}`
                            : relativeDays(due!)}
                    </span>
                  </span>
                  <ArrowRight
                    size={16}
                    strokeWidth={1.9}
                    aria-hidden
                    className="shrink-0 text-ink-soft"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

/**
 * One thing to do, with the thing named.
 *
 * The label states the job — konfirmasi keluar, jadwalkan pengganti — rather
 * than "Buka kamar", which was the same three words on all twenty-two rows and
 * said nothing about why a manager was being sent there.
 */
function ActionRow({
  row,
  today,
  nameOf,
}: {
  row: Row
  today: string
  nameOf: (n: string) => string
}) {
  const { tenancy, leaving, overdue, due } = row
  const overdueBy = overdue ? daysBetween(tenancy.leavingOn!, today) : undefined
  const u = urgencyOf({ overdueBy, leaving: leaving && !overdue, due })
  const Icon = u.icon

  const job = overdue
    ? {
        what: `Kontrak habis ${formatDate(tenancy.leavingOn!)}`,
        why: 'Kamar masih terhitung terisi sampai keluarnya dikonfirmasi',
        cta: 'Konfirmasi keluar',
      }
    : leaving
      ? {
          what: `Kontrak habis ${formatDate(tenancy.leavingOn!)}`,
          why: `Kamar ${tenancy.room} bisa mulai ditawarkan · penghuni masih bisa memperpanjang`,
          cta: 'Jadwalkan pengganti',
        }
      : {
          what: `Jatuh tempo ${formatDate(nextDue(tenancy, today))}`,
          why: `${formatRupiah(tenancy.agreedRent)} — ingatkan lewat WhatsApp`,
          cta: 'Buka kamar',
        }

  return (
    <li
      className={cn(
        'flex flex-wrap items-center gap-x-4 gap-y-3 rounded-card bg-paper p-4 shadow-card sm:p-5',
        u.level === 'late' && RING_LATE,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'inline-flex size-9 shrink-0 items-center justify-center rounded-full',
          TONE_BG[u.level],
        )}
      >
        <Icon size={16} strokeWidth={1.9} />
      </span>

      <span className="min-w-0 flex-1 basis-60">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[16px] font-semibold">{tenancy.name}</span>
          {/* The word rides with the colour, so the level survives being read
              in greyscale or by somebody who cannot separate the two. */}
          <StatusChip tone={u.level}>{u.chip}</StatusChip>
          <span className="text-[13px] text-ink-soft">
            {nameOf(tenancy.building)} · kamar {tenancy.room}
          </span>
        </span>
        <span className={cn('mt-1.5 block text-[14px] font-semibold', TEXT_TONE[u.level])}>
          {job.what}
        </span>
        <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[13px] text-ink-soft">
          {job.why}
          <span
            className="inline-flex items-center gap-1.5"
            title="Nomor disamarkan di prototipe ini"
          >
            <MessageCircle size={13} strokeWidth={1.9} aria-hidden />
            {tenancy.phone}
          </span>
        </span>
      </span>

      <Link
        href={`/management/buildings/${tenancy.building}`}
        className={cn(
          'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors',
          // Only the row that is already wrong gets a filled button. Four filled
          // buttons in a column would rank nothing.
          u.level === 'late'
            ? 'bg-held text-white hover:bg-held/90'
            : 'border border-line text-plum hover:border-plum hover:bg-stone',
        )}
      >
        {job.cta}
        <ArrowRight size={14} strokeWidth={1.9} aria-hidden />
      </Link>
    </li>
  )
}

/** Overdue departures first, then announced ones, then by how soon rent falls. */
const weight = (r: Row) => (r.overdue ? -2000 : r.leaving ? -1000 : (r.due ?? 0))
