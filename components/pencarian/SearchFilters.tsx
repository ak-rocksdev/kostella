'use client'

import { RotateCcw } from 'lucide-react'
import { Chip } from '@/components/ui/Chip'
import { Segmented } from '@/components/ui/Segmented'
import { Switch } from '@/components/ui/Switch'
import { budget, budgetSteps } from '@/lib/content/beranda'
import {
  facilityFacet,
  tenancyFacet,
  tenancyShort,
  walkFacet,
  type Tenancy,
} from '@/lib/content/pencarian'
import { formatRupiah } from '@/lib/format'

export type Filters = {
  /** Maximum monthly rent. `budget.max` means no limit was stated. */
  maxRent: number
  tenancy: Tenancy | null
  /** Maximum minutes on foot, or null for any distance. */
  walkMinutes: number | null
  facilities: string[]
  onlyVacant: boolean
}

/**
 * Defaults, and the reasoning for two of them.
 *
 * `tenancy: null`. The design bundle preselected "Putri". While the filters were
 * decorative that was a harmless demo of the selected state; the moment they
 * filter, it hides half the inventory on an assumption about who is reading.
 *
 * `onlyVacant: false`. Full buildings stay visible until asked otherwise — the
 * client's call. Parents assessing whether an operator is real read a full
 * building as evidence, not as a dead end.
 *
 * `maxRent: budget.max`. Landing here directly states no budget, so the page
 * does not invent one. A figure carried from the hero overrides it.
 */
export const defaultFilters: Filters = {
  maxRent: budget.max,
  tenancy: null,
  walkMinutes: null,
  facilities: [],
  onlyVacant: false,
}

export function isDefault(filters: Filters) {
  return (
    filters.maxRent === defaultFilters.maxRent &&
    filters.tenancy === null &&
    filters.walkMinutes === null &&
    filters.facilities.length === 0 &&
    filters.onlyVacant === false
  )
}

/**
 * The filter bar.
 *
 * Each facet gets the control its logic calls for rather than one shared pill:
 * a range is a select, mutually exclusive options are a radio group, a boolean
 * is a switch, and only the facets you can genuinely combine are chips. Six
 * identical pills for six different rules was the previous version's real
 * problem — you had to click one to learn how it behaved.
 *
 * Every option carries the number of properties it would leave, computed
 * against the other facets. With four results, a filter that reaches nothing is
 * one click away at all times; the count says so before the click.
 */
export function SearchFilters({
  filters,
  onChange,
  countWith,
}: {
  filters: Filters
  onChange: (next: Filters) => void
  /** Results remaining if `override` were applied on top of the current state. */
  countWith: (override: Partial<Filters>) => number
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value })

  const toggleFacility = (facility: string) =>
    set(
      'facilities',
      filters.facilities.includes(facility)
        ? filters.facilities.filter((f) => f !== facility)
        : [...filters.facilities, facility],
    )

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Two scrolling rows on a phone rather than five stacked ones. Wrapped,
          these controls filled ~600px before the first result — most of the
          screen spent on the filter rather than on what it found. Sideways they
          take one row each, and the half-visible next control says there is
          more, the same way the area carousel does on Beranda. */}
      <div className="no-scrollbar -mx-5 flex items-center gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {/* The brand's second claim, and the figure the hero already asked for.
            A native select keeps the keyboard and the mobile wheel for free. */}
        <label className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-paper px-4 text-[14px] font-medium">
          <span className="whitespace-nowrap">Budget maks.</span>
          <select
            value={filters.maxRent}
            onChange={(e) => set('maxRent', Number(e.target.value))}
            className="cursor-pointer appearance-none bg-transparent py-2 pr-1 font-figure text-[14px] font-semibold focus:outline-none"
          >
            {budgetSteps.map((step) => (
              <option key={step} value={step}>
                {step >= budget.max ? 'Semua' : formatRupiah(step)}
              </option>
            ))}
          </select>
        </label>

        <Segmented
          legend="Tipe penghuni"
          value={filters.tenancy}
          onChange={(next) => set('tenancy', next)}
          options={[
            {
              // Carries the facet's name so the group needs no visible legend
              // beside it — "Semua" alone, next to a second segmented control
              // that also ends in "Semua", says nothing.
              value: null,
              label: 'Semua penghuni',
              count: countWith({ tenancy: null }),
            },
            ...tenancyFacet.map((tenancy) => ({
              value: tenancy,
              label: tenancyShort[tenancy],
              count: countWith({ tenancy }),
            })),
          ]}
        />

        {/* A scale, so it runs tightest to loosest rather than putting the
            unfiltered option first. */}
        <Segmented
          legend="Jarak jalan kaki"
          value={filters.walkMinutes}
          onChange={(next) => set('walkMinutes', next)}
          options={[
            ...walkFacet.map((minutes) => ({
              value: minutes,
              label: `≤${minutes} menit`,
              count: countWith({ walkMinutes: minutes }),
            })),
            { value: null, label: 'Semua', count: countWith({ walkMinutes: null }) },
          ]}
        />

        {/* The brand's first claim. Off by default at the client's direction. */}
        <Switch
          checked={filters.onlyVacant}
          onChange={(next) => set('onlyVacant', next)}
          count={countWith({ onlyVacant: true })}
        >
          Hanya yang masih kosong
        </Switch>
      </div>

      <div
        role="group"
        aria-label="Fasilitas"
        className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {facilityFacet.map((facility) => {
          const selected = filters.facilities.includes(facility)
          const count = countWith({
            facilities: [...new Set([...filters.facilities, facility])],
          })

          return (
            <Chip key={facility} selected={selected} onClick={() => toggleFacility(facility)}>
              {facility}
              <span
                aria-hidden
                className={`ml-1.5 font-figure text-[13px] ${selected ? 'text-stone/70' : 'text-ink-soft'} ${count === 0 && !selected ? 'opacity-60' : ''}`}
              >
                {count}
              </span>
            </Chip>
          )
        })}
      </div>
    </div>
  )
}

/** Sits with the result count, so "how many" and "undo" read as one line. */
export function ResetFilters({ onReset }: { onReset: () => void }) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-[14px] font-semibold text-plum transition-colors hover:text-ink"
    >
      <RotateCcw size={16} strokeWidth={1.75} aria-hidden />
      Atur ulang filter
    </button>
  )
}
