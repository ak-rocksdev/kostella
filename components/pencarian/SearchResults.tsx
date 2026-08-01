'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { ResultCard } from './ResultCard'
import { ResultsMap } from './ResultsMap'
import { defaultFilters, isDefault, ResetFilters, SearchFilters, type Filters } from './SearchFilters'
import { budget, budgetSteps } from '@/lib/content/beranda'
import { results, type SearchResult } from '@/lib/content/pencarian'
import { formatRupiah } from '@/lib/format'
import { routes } from '@/lib/routes'

function matches(result: SearchResult, filters: Filters) {
  if (result.rent > filters.maxRent) return false
  if (filters.tenancy && result.tenancy !== filters.tenancy) return false
  if (filters.walkMinutes && result.walkMinutes > filters.walkMinutes) return false
  if (filters.onlyVacant && result.vacant === 0) return false
  return filters.facilities.every((facility) => result.facilities.includes(facility))
}

/**
 * The single filter most worth dropping: the one that, released on its own,
 * brings back the most properties.
 *
 * At zero results every facet count is also zero — correctly, since adding
 * anything to a set that already matches nothing still matches nothing — which
 * leaves the counts saying nothing about the way out. This looks the other
 * direction and names one filter to remove.
 */
function bestRelaxation(filters: Filters) {
  const candidates: Array<{ label: string; next: Filters }> = []

  if (filters.tenancy) candidates.push({ label: 'tipe penghuni', next: { ...filters, tenancy: null } })
  if (filters.walkMinutes)
    candidates.push({ label: 'batas jarak', next: { ...filters, walkMinutes: null } })
  if (filters.onlyVacant)
    candidates.push({ label: '“hanya yang masih kosong”', next: { ...filters, onlyVacant: false } })
  for (const facility of filters.facilities) {
    candidates.push({
      label: `“${facility}”`,
      next: { ...filters, facilities: filters.facilities.filter((f) => f !== facility) },
    })
  }

  return candidates
    .map((candidate) => ({
      ...candidate,
      count: results.filter((r) => matches(r, candidate.next)).length,
    }))
    .filter((candidate) => candidate.count > 0)
    .sort((a, b) => b.count - a.count)[0]
}

/**
 * Nothing matched.
 *
 * A count of zero with no way forward is the worst screen in a search product,
 * and with four properties it is always one click away. So this never just
 * states the zero: it names the budget figure that would clear it, or the one
 * filter worth dropping, and always offers the way back.
 */
function NoMatches({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters
  onChange: (next: Filters) => void
  onReset: () => void
}) {
  // Properties that clear every filter except the budget. If any exist, the
  // budget is the binding constraint and can be named as a figure — more useful
  // than naming the control, so it is tried first.
  const blockedByBudget = results.filter((r) => matches(r, { ...filters, maxRent: Infinity }))
  const cheapest = blockedByBudget.length ? Math.min(...blockedByBudget.map((r) => r.rent)) : null
  // Snap to a figure the control can actually show.
  const nextStep = cheapest ? budgetSteps.find((step) => step >= cheapest) : undefined
  const relax = nextStep ? undefined : bestRelaxation(filters)

  return (
    <div className="rounded-card border border-dashed border-line px-6 py-10 text-center">
      <p className="text-[16px] font-semibold">Tidak ada properti yang cocok.</p>

      {nextStep && cheapest ? (
        <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
          Termurah yang cocok {formatRupiah(cheapest)} per bulan.{' '}
          <button
            type="button"
            onClick={() => onChange({ ...filters, maxRent: nextStep })}
            className="cursor-pointer font-semibold text-plum underline underline-offset-2 hover:text-ink"
          >
            Naikkan budget
          </button>
        </p>
      ) : relax ? (
        <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">
          <button
            type="button"
            onClick={() => onChange(relax.next)}
            className="cursor-pointer font-semibold text-plum underline underline-offset-2 hover:text-ink"
          >
            Lepas {relax.label}
          </button>{' '}
          untuk melihat {relax.count} properti.
        </p>
      ) : (
        <p className="mt-2 text-[14px] leading-[1.6] text-ink-soft">Coba lepas salah satu filter.</p>
      )}

      <div className="mt-2 flex justify-center">
        <ResetFilters onReset={onReset} />
      </div>
    </div>
  )
}

/**
 * Results beside a map, 60/40. Both halves share one selection and one filter
 * state, so narrowing the list also clears the pins it removed.
 */
export function SearchResults({ initialMaxRent }: { initialMaxRent?: number }) {
  const [filters, setFilters] = useState<Filters>(
    initialMaxRent ? { ...defaultFilters, maxRent: initialMaxRent } : defaultFilters,
  )
  const [picked, setPicked] = useState<string | null>(null)

  const visible = useMemo(() => results.filter((r) => matches(r, filters)), [filters])

  // Counted against the other facets, so an option never advertises results the
  // rest of the filter has already excluded.
  const countWith = (override: Partial<Filters>) =>
    results.filter((r) => matches(r, { ...filters, ...override })).length

  // Derived rather than stored: filtering out the selected property would
  // otherwise leave a pin lit on the map with no card beside it.
  const activeNumber =
    picked && visible.some((r) => r.number === picked) ? picked : (visible[0]?.number ?? '')

  return (
    <div className="wrap-wide pt-8 pb-16 sm:pb-24">
      <SearchFilters filters={filters} onChange={setFilters} countWith={countWith} />

      <div className="mt-7 mb-5 flex flex-wrap items-center justify-between gap-x-6">
        {/* aria-live so the count is announced when a filter changes — the whole
            point of the control is this number, and it is off-screen for anyone
            using a screen reader. */}
        <SectionLabel>
          <span aria-live="polite">
            {visible.length === results.length
              ? `${results.length} properti`
              : `${visible.length} dari ${results.length} properti`}{' '}
            · Grogol
          </span>
        </SectionLabel>
        {!isDefault(filters) && <ResetFilters onReset={() => setFilters(defaultFilters)} />}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[60fr_40fr] lg:gap-8">
        <div className="flex flex-col gap-4">
          {visible.length > 0 ? (
            visible.map((result) => (
              <ResultCard
                key={result.number}
                result={result}
                active={activeNumber === result.number}
                href={result.hasDetail ? routes.detail : undefined}
                onSelect={() => setPicked(result.number)}
              />
            ))
          ) : (
            <NoMatches
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultFilters)}
            />
          )}
        </div>

        <ResultsMap numbers={visible.map((r) => r.number)} activeNumber={activeNumber} />
      </div>
    </div>
  )
}

/**
 * The hero's budget, carried across.
 *
 * Someone who states Rp2.100.000 on Beranda and then has to state it again here
 * has been made to do the same work twice. Split out because `useSearchParams`
 * suspends: the page renders `SearchResults` directly as the fallback, so the
 * static HTML holds the full results and the URL figure is applied on hydration.
 */
export function SearchResultsFromUrl() {
  const params = useSearchParams()
  const raw = Number(params.get('budget'))

  // Snapped up to the nearest step the control can display rather than matched
  // exactly. The hero only ever sends a step, but a URL is public: a figure
  // typed or trimmed by hand should still narrow the results instead of being
  // silently dropped, and rounding up never hides something affordable.
  const asked = Number.isFinite(raw) && raw > 0 ? budgetSteps.find((step) => step >= raw) : undefined

  return <SearchResults initialMaxRent={asked && asked < budget.max ? asked : undefined} />
}
