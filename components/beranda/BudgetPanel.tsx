'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Chip } from '@/components/ui/Chip'
import { areaChips, budget, hero } from '@/lib/content/beranda'
import { formatRupiah } from '@/lib/format'
import { routes } from '@/lib/routes'

/** Why the search currently returns nothing, and what to do about it. */
export type EmptyReason =
  | { kind: 'area'; area: string; nearest: string }
  | { kind: 'budget'; cheapest: number; building: string }

type BudgetPanelProps = {
  area: string
  onAreaChange: (area: string) => void
  amount: number
  onAmountChange: (amount: number) => void
  matchCount: number
  totalCount: number
  emptyReason: EmptyReason | null
  onFixEmpty: () => void
}

/**
 * Search starts from what you can pay.
 *
 * Every competitor opens with a location box. Kostella can open with money,
 * because it owns its buildings and therefore knows every rent exactly — so the
 * budget becomes the brand's own number, set in the same Expanded numerals as
 * the building plates. You state a figure and the panel tells you, before you
 * click anything, how much of the inventory it reaches.
 *
 * The results themselves live on the search screen. This panel's job is to send
 * you there with a figure already set, not to preview the answer.
 */
export function BudgetPanel({
  area,
  onAreaChange,
  amount,
  onAmountChange,
  matchCount,
  totalCount,
  emptyReason,
  onFixEmpty,
}: BudgetPanelProps) {
  const progress = ((amount - budget.min) / (budget.max - budget.min)) * 100

  return (
    // min-w-0: as a grid item this defaults to min-width:auto, which refuses to
    // shrink below the chip row's content width — so the row never scrolls, it
    // widens the panel instead and takes the page with it.
    <div className="min-w-0 rounded-card border border-line bg-paper p-5 shadow-float sm:p-7">
      <p id="area-prompt" className="text-[15px] leading-[1.6] font-semibold">
        {hero.chipPrompt}
      </p>
      {/* One scrolling row on a phone, where two wrapped rows cost 148px — the
          panel's single largest block — and pushed the action past the fold.
          The row bleeds to the panel's edge so the cut-off chip reads as "there
          is more", and it wraps normally again once there is room. */}
      <div
        role="group"
        aria-labelledby="area-prompt"
        className="no-scrollbar mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-7 sm:px-7 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0"
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

      {/* The count sits above the action, not after it. It is the reason to
          press the button, and below it the line landed on the fold and went
          unread. Never invite someone to view nothing either: with no match the
          action widens the search instead of counting to zero. */}
      <div className="mt-6">
        {emptyReason ? (
          <SearchHint reason={emptyReason} onFix={onFixEmpty} />
        ) : (
          <p aria-live="polite" className="mb-3 text-[13px] leading-[1.5] text-ink-soft">
            {matchCount} dari {totalCount} kamar masuk budget kamu
          </p>
        )}

        <Link
          href={routes.pencarian}
          className="inline-flex items-center justify-center gap-2 rounded-badge border border-transparent bg-plum px-7 py-3.5 font-body text-[16px] leading-[1.2] font-semibold text-white transition-colors duration-150 hover:bg-plum-deep"
        >
          {matchCount > 0 ? `Lihat ${matchCount} kamar kosong` : 'Lihat semua kamar'}
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
        </Link>
      </div>
    </div>
  )
}

/** An empty result is an invitation to act, never a dead end. */
function SearchHint({ reason, onFix }: { reason: EmptyReason; onFix: () => void }) {
  const copy =
    reason.kind === 'area'
      ? {
          line: `Belum ada kamar kosong di ${reason.area}.`,
          action: `Coba ${reason.nearest}`,
        }
      : {
          line: `Termurah ${formatRupiah(reason.cheapest)} di gedung ${reason.building}.`,
          action: `Naikkan ke ${formatRupiah(reason.cheapest)}`,
        }

  return (
    <p aria-live="polite" className="mb-3 text-[13px] leading-[1.5] text-ink-soft">
      {copy.line}{' '}
      <button
        type="button"
        onClick={onFix}
        className="cursor-pointer font-semibold text-plum underline underline-offset-2 hover:text-ink"
      >
        {copy.action}
      </button>
    </p>
  )
}
