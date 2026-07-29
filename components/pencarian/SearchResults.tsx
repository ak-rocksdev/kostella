'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { ResultCard } from './ResultCard'
import { ResultsMap } from './ResultsMap'
import { context, defaultFilters, emptyState, filters, results } from '@/lib/content/pencarian'
import { routes } from '@/lib/routes'

/** An empty result offers the nearest alternative, never just a dead end. */
function EmptyState() {
  return (
    <div className="rounded-card border border-dashed border-line bg-paper px-6 py-8 text-center">
      <p className="text-[16px] font-semibold">{emptyState.heading}</p>
      <p className="mt-2 mb-4 text-[14px] leading-[1.6] text-ink-soft">{emptyState.body}</p>
      <Button href={routes.kawasanLain} variant="secondary" size="sm">
        {emptyState.cta}
      </Button>
    </div>
  )
}

/**
 * Results beside a map, 60/40. Both halves share one selection, so picking a
 * building in the list moves the plum pin and vice versa.
 *
 * The design gives this screen 24px of padding all round, which leaves the last
 * card sitting on the viewport edge. The top stays tight, so the filters read
 * as attached to the header, but the bottom takes the system's section padding.
 */
export function SearchResults() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>(defaultFilters)
  const [activeNumber, setActiveNumber] = useState(results[0].number)

  const toggleFilter = (filter: string) =>
    setSelectedFilters((current) =>
      current.includes(filter) ? current.filter((f) => f !== filter) : [...current, filter],
    )

  return (
    <div className="wrap-wide pt-6 pb-14 sm:pb-24">
      <div role="group" aria-label="Filter pencarian" className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Chip
            key={filter}
            selected={selectedFilters.includes(filter)}
            onClick={() => toggleFilter(filter)}
          >
            {filter}
          </Chip>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[60fr_40fr]">
        <div className="flex flex-col gap-4">
          <Eyebrow>{context.resultsLabel}</Eyebrow>
          {results.map((result) => (
            <ResultCard
              key={result.number}
              result={result}
              active={activeNumber === result.number}
              href={result.hasDetail ? routes.detail : undefined}
              onSelect={() => setActiveNumber(result.number)}
            />
          ))}
          <EmptyState />
        </div>

        <ResultsMap activeNumber={activeNumber} />
      </div>
    </div>
  )
}
