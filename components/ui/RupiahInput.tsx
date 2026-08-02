'use client'

import { Field } from './Field'

/**
 * A rupiah amount, typed.
 *
 * Replaces a `Select` built from `budgetSteps` — seven coarse steps that exist
 * for the *public* search filter, where the point is that every option reaches
 * some inventory. Reused for admin input it was worse than clumsy: five of
 * Kostella's seven room prices are not on it, so the control opened showing
 * Rp 1.200.000 for a room let at Rp 1.950.000, and saving without touching it
 * cut the price by three quarters of a million.
 *
 * Grouping is applied as the manager types, because a seven-figure number
 * without separators cannot be checked at a glance — and checking it is the
 * whole reason it is being typed.
 */
export function RupiahInput({
  label,
  value,
  onChange,
  hint,
  required,
  autoFocus,
  className,
}: {
  label: string
  /** Rupiah, as a number. Zero renders as an empty field. */
  value: number
  onChange: (value: number) => void
  hint?: string
  required?: boolean
  autoFocus?: boolean
  className?: string
}) {
  const shown = value > 0 ? value.toLocaleString('id-ID') : ''

  return (
    <Field label={label} hint={hint} className={className}>
      <div className="flex items-stretch overflow-hidden rounded-badge border border-line bg-paper focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-plum">
        {/* The unit sits outside the field so it is never something to delete
            by accident, and never something to type. */}
        <span
          aria-hidden
          className="flex items-center border-r border-line bg-canvas px-3 font-figure text-[13px] text-ink-soft"
        >
          Rp
        </span>
        <input
          inputMode="numeric"
          required={required}
          autoFocus={autoFocus}
          value={shown}
          placeholder="0"
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
          className="min-h-11 w-full bg-paper px-3 text-right font-figure text-[15px] font-semibold focus:outline-none"
        />
      </div>
    </Field>
  )
}
