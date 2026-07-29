'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { BudgetPanel, type EmptyReason } from './BudgetPanel'
import { areaChips, budget, hero, vacantRooms } from '@/lib/content/beranda'

/**
 * The hero argues from the renter's side of the screen.
 *
 * Everyone who has hunted for a kos has driven across the city to see a room
 * that turned out to be taken. That is the pain the headline names, and the
 * budget control beside it is the answer — state a figure, and what comes back
 * is only what you can actually still take.
 *
 * Results deliberately do not appear here. Setting a budget sends you to the
 * search screen with the figure already applied; a hero that answers its own
 * question gives the visitor two places to read the same list.
 */
export function Hero() {
  const [area, setArea] = useState(areaChips[0].label)
  const [amount, setAmount] = useState<number>(budget.initial)

  const inArea = useMemo(() => vacantRooms.filter((room) => room.area === area), [area])
  const matchCount = useMemo(
    () => inArea.filter((room) => room.rent <= amount).length,
    [inArea, amount],
  )

  const selectedChip = areaChips.find((chip) => chip.label === area)
  const cheapest = inArea[0]

  let emptyReason: EmptyReason | null = null
  if (inArea.length === 0 && selectedChip?.nearest) {
    emptyReason = { kind: 'area', area, nearest: selectedChip.nearest }
  } else if (matchCount === 0 && cheapest) {
    emptyReason = { kind: 'budget', cheapest: cheapest.rent, building: cheapest.building }
  }

  const fixEmpty = () => {
    if (emptyReason?.kind === 'area') setArea(emptyReason.nearest)
    if (emptyReason?.kind === 'budget') setAmount(emptyReason.cheapest)
  }

  return (
    <section aria-label="Cari kamar" className="relative isolate bg-ink">
      {/* Desktop only. At 390 the photograph showed a 345px band under a 78%
          wash — visually a grey smear, since the panel covers the part of the
          room worth seeing. It cost a full LCP download to say nothing, so the
          phone gets the ink surface instead and the warmth comes from the real
          room photographs in the cards directly below.

          `sizes` is what makes this cheap rather than merely hidden: below lg
          the browser resolves the preload to the smallest candidate, so the
          large file is fetched only where it is actually shown. */}
      <div className="absolute inset-0 -z-10 hidden lg:block">
        <Image
          src={hero.photo.src}
          alt={hero.photo.alt}
          fill
          priority
          sizes="(min-width: 1024px) 100vw, 16px"
          className="object-cover"
        />
        {/* Weighted to the left, where the type sits, so the right side stays
            readable as a photograph rather than flattening under an even wash. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-ink/90 from-5% via-ink/70 to-ink/35"
        />
      </div>

      <div className="wrap grid items-center gap-10 py-14 sm:py-20 lg:min-h-[620px] lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16 lg:py-24">
        <div>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-0.5 w-8 shrink-0 bg-stone" />
            <Eyebrow className="inline text-stone">{hero.eyebrow}</Eyebrow>
          </div>

          <h1 className="mt-5 max-w-[18ch] text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.02em] text-stone text-balance">
            {hero.heading}
          </h1>

          {/* Solid, not translucent. Over a photograph the alpha would eat the
              contrast, and the system's inverse-secondary grey is far too faint
              to survive here — the hierarchy comes from size and weight. */}
          <p className="mt-6 max-w-[460px] text-[17px] leading-[1.65] text-stone text-pretty">
            {hero.lead}
          </p>
        </div>

        <BudgetPanel
          area={area}
          onAreaChange={setArea}
          amount={amount}
          onAmountChange={setAmount}
          matchCount={matchCount}
          totalCount={inArea.length}
          emptyReason={emptyReason}
          onFixEmpty={fixEmpty}
        />
      </div>
    </section>
  )
}
