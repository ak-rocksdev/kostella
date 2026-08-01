'use client'

import { useId } from 'react'
import { cn } from '@/lib/cn'

export type SegmentedOption<T> = {
  value: T
  label: string
  /** How many results this option would leave. Dimmed at zero, never hidden. */
  count: number
}

/**
 * A single-select facet.
 *
 * Real radio inputs behind the styling, not buttons with `aria-pressed`. The
 * options here are mutually exclusive, and radios say so: a screen reader
 * announces the group and "2 of 3", and arrow keys move between options for
 * free. Buttons would need all of that written by hand and would still be
 * lying about the relationship.
 *
 * This replaces the pair of independent "Putri" / "Campur" pills, which could
 * both be on — a state that means nothing — or both off.
 */
export function Segmented<T extends string | number | null>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (next: T) => void
}) {
  const name = useId()

  return (
    <fieldset className="shrink-0">
      <legend className="sr-only">{legend}</legend>
      <div className="flex gap-1 rounded-full border border-line bg-paper p-1">
        {options.map((option) => {
          const selected = option.value === value

          return (
            <label
              key={String(option.value)}
              className={cn(
                'inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium whitespace-nowrap transition-colors duration-200',
                'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum',
                selected ? 'bg-ink text-stone' : 'text-ink hover:bg-stone',
                option.count === 0 && !selected && 'opacity-45',
              )}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              {option.label}
              <span
                aria-hidden
                className={cn('font-figure text-[13px]', selected ? 'text-stone/70' : 'text-ink-soft')}
              >
                {option.count}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
