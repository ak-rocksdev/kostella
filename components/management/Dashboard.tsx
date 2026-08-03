'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { cn } from '@/lib/cn'
import { portfolio } from '@/lib/content/management/buildings'
import { surveysToday } from '@/lib/content/management/surveys'
import { ALL_BUILDINGS, ScopeSelect } from './ScopeSelect'
import { useManagement } from '@/lib/management/useManagement'
import { useToday } from '@/lib/management/today'
import { TONE_BG } from '@/components/ui/StatusChip'
import { parseDate } from '@/lib/dates'
import { attentionItems } from './attention'
import { describe, when } from './log'
import { PortfolioBar } from './PortfolioBar'
import { SurveyList } from './SurveyList'

const jt = (n: number) => `Rp ${(n / 1_000_000).toFixed(1).replace('.', ',')} jt`

/**
 * What needs a manager today.
 *
 * The handoff bundle scopes its dashboard to one building — switcher, floor
 * grid, room actions — which is most of the building page built in phase 1. The
 * bundle was drawn before that page existed. So this opens on everything the
 * manager covers and keeps the switcher to narrow, and per-building depth stays
 * one click away. This screen answers "where do I go"; the building page answers
 * "what do I change".
 *
 * The bundle's bills table is absent on purpose: tenants and billing are phases
 * 3 and 4, and inventing a table now to replace it later is the retrofit this
 * project has already paid for once.
 */
export function Dashboard() {
  const { buildings, surveys, log } = useManagement()
  const today = useToday()
  const [scope, setScope] = useState<string>(ALL_BUILDINGS)

  const inScope = scope === ALL_BUILDINGS ? buildings : buildings.filter((b) => b.number === scope)
  const totals = portfolio(inScope)
  const surveysDueToday = surveysToday(surveys).filter(
    (s) => scope === ALL_BUILDINGS || s.building === scope,
  )
  const attention = attentionItems(inScope, today)
  const recent = log.filter((e) => scope === ALL_BUILDINGS || e.building === scope).slice(0, 5)

  /* Empty until the browser reports a date. The build cannot know which day
     this will be read on, and pretending otherwise is what made the panel throw
     a hydration error at exactly the moment it was being demonstrated. */
  const dated = today
    ? new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(parseDate(today))
    : ''

  return (
    <div className="wrap-wide py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div>
          <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.02em]">Hari ini</h1>
          {/* The date belongs to the screen, not the header: this is the only
              screen that is about today. Its line keeps its height while empty,
              so the heading below does not jump when the date arrives. */}
          <p className="mt-2 min-h-6 text-[15px] text-ink-soft">{dated}</p>
        </div>

        <ScopeSelect buildings={buildings} value={scope} onChange={setScope} />
      </div>

      <div className="mt-6">
        <PortfolioBar
          items={[
            {
              label: 'Okupansi',
              value: `${Math.round(totals.roomRate * 100)}%`,
              detail: `${totals.occupied} dari ${totals.lettable} kamar${
                totals.blocked > 0 ? `, ${totals.blocked} diblokir` : ''
              } · ${totals.buildings} gedung`,
            },
            {
              label: 'Kamar kosong',
              value: totals.free,
              tone: 'available',
              detail: totals.held > 0 ? `${totals.held} lagi dibooking` : 'tidak ada dibooking',
            },
            {
              label: 'Terisi bulan ini',
              value: jt(totals.booked),
              detail: `dari ${jt(totals.potential)} bila penuh`,
            },
            {
              label: 'Survei hari ini',
              value: surveysDueToday.length,
              detail: surveysDueToday.length
                ? `${surveysDueToday.filter((s) => s.status === 'baru').length} belum dikonfirmasi`
                : 'tidak ada jadwal',
            },
          ]}
        />
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_1fr]">
        <section>
          <SectionLabel className="mb-4">Survei hari ini</SectionLabel>
          <SurveyList surveys={surveysDueToday} buildings={buildings} />
        </section>

        <section>
          <SectionLabel className="mb-4">Perlu perhatian</SectionLabel>
          {attention.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {attention.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="group flex items-start gap-3 rounded-card bg-paper p-4 shadow-card transition-[box-shadow] duration-200 hover:shadow-lift"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          'mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full',
                          TONE_BG[item.tone === 'attention' ? 'late' : 'soon'],
                        )}
                      >
                        <Icon size={15} strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] leading-[1.35] font-semibold">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[13px] leading-[1.45] text-ink-soft">
                          {item.detail}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        strokeWidth={1.75}
                        aria-hidden
                        className="mt-1 shrink-0 text-ink-soft transition-[translate] duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            // Says the check ran. "Nothing here" would be indistinguishable
            // from a list that failed to load.
            <p className="flex items-center gap-3 rounded-card border border-dashed border-line px-5 py-8 text-[14px] text-ink-soft">
              <CircleCheck
                size={18}
                strokeWidth={1.9}
                aria-hidden
                className="shrink-0 text-available"
              />
              Tidak ada kamar diblokir, gedung tanpa foto, atau kamar dibooking yang menggantung.
            </p>
          )}
        </section>
      </div>

      {recent.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-4">
            <SectionLabel>Perubahan terakhir</SectionLabel>
            <Link
              href="/management/activity"
              className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-plum transition-colors hover:text-ink"
            >
              Semua aktivitas
              <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {recent.map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-card bg-paper px-4 py-3 shadow-card"
              >
                <span className="rounded-badge bg-stone px-1.5 py-0.5 font-figure text-[12px] font-semibold">
                  {entry.building}
                  {entry.room ? `/${entry.room}` : ''}
                </span>
                <span className="text-[14px]">{describe(entry)}</span>
                <span className="ml-auto text-[12px] whitespace-nowrap text-ink-soft">
                  {entry.actor} · {when(entry.at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
