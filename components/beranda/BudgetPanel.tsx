'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Chip } from '@/components/ui/Chip'
import { areaChips, budget, hero } from '@/lib/content/beranda'
import { formatRupiah } from '@/lib/format'
import { routes } from '@/lib/routes'

type BudgetPanelProps = {
  area: string
  onAreaChange: (area: string) => void
  amount: number
  onAmountChange: (amount: number) => void
  matchCount: number
  totalCount: number
}

/**
 * Search starts from what you can pay.
 *
 * Every competitor opens with a location box. Kostella can open with money,
 * because it owns its buildings and therefore knows every rent exactly — so the
 * budget becomes the brand's own number, set in the same Expanded numerals as
 * the building plates. You state a figure and the inventory answers it.
 */
export function BudgetPanel({
  area,
  onAreaChange,
  amount,
  onAmountChange,
  matchCount,
  totalCount,
}: BudgetPanelProps) {
  const progress = ((amount - budget.min) / (budget.max - budget.min)) * 100

  return (
    <div className="rounded-card border border-line bg-paper p-5 shadow-max sm:p-7">
      <p id="area-prompt" className="text-[15px] leading-[1.6] font-semibold">
        {hero.chipPrompt}
      </p>
      <div
        role="group"
        aria-labelledby="area-prompt"
        className="mt-3 flex flex-wrap gap-2"
      >
        {areaChips.map((chip) => (
          <Chip
            key={chip.label}
            selected={area === chip.label}
            onClick={() => onAreaChange(chip.label)}
          >
            {chip.label}
          </Chip>
        ))}
      </div>

      <hr className="my-6 border-line" />

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <label htmlFor="budget" className="text-[15px] leading-[1.6] font-semibold">
          {hero.budgetPrompt}
        </label>
        <output
          htmlFor="budget"
          aria-live="polite"
          className="numeral text-[clamp(1.75rem,4vw,2.25rem)] leading-none text-ink"
        >
          {formatRupiah(amount)}
        </output>
      </div>

      <div className="relative mt-4 flex h-6 items-center">
        <div aria-hidden className="absolute inset-x-0 h-1 rounded-full bg-line" />
        <div
          aria-hidden
          style={{ width: `${progress}%` }}
          className="absolute left-0 h-1 rounded-full bg-plum"
        />
        <input
          id="budget"
          type="range"
          className="budget-range relative"
          min={budget.min}
          max={budget.max}
          step={budget.step}
          value={amount}
          onChange={(event) => onAmountChange(Number(event.target.value))}
          aria-valuetext={`${formatRupiah(amount)} per bulan`}
        />
      </div>

      <div className="flex justify-between font-figure text-[12px] text-ink-soft">
        <span>{formatRupiah(budget.min)}</span>
        <span>{formatRupiah(budget.max)}</span>
      </div>

      {/* Never invite someone to view nothing: with no match the action widens
          the search instead of counting to zero. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <Link
          href={routes.pencarian}
          className="inline-flex items-center justify-center gap-2 rounded-badge border border-transparent bg-plum px-7 py-3.5 font-body text-[16px] leading-[1.2] font-semibold text-white transition-colors duration-150 hover:bg-plum-deep"
        >
          {matchCount > 0 ? `Lihat ${matchCount} kamar kosong` : 'Lihat semua kamar'}
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
        </Link>
        {totalCount > 0 && (
          <p aria-live="polite" className="text-[13px] leading-[1.5] text-ink-soft">
            {matchCount} dari {totalCount} kamar
            <br className="hidden sm:block" /> masuk budget kamu
          </p>
        )}
      </div>
    </div>
  )
}
