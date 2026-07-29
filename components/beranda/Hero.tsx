'use client'

import { useMemo, useState, type CSSProperties } from 'react'
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
      {/* Phones get the ink surface; everything wider gets the photograph. The
          cut is at md, not lg: between 768 and 1023 the viewport is wide enough
          that a bare dark block reads as a missing image rather than a choice.
          See .hero-backdrop in globals.css for why this is a background and not
          an <img>. */}
      <div
        aria-hidden
        style={{ '--hero-photo': `url(${hero.photo.src})` } as CSSProperties}
        className="hero-backdrop absolute inset-0 -z-10"
      >
        {/* The type spans the full width until lg, so an even wash is the only
            one that holds there — the left-weighted ramp measured 4.26:1 on the
            lead paragraph, under the 4.5 floor. At lg the type returns to the
            left half and the ramp comes back, keeping the right side readable
            as a photograph rather than flattening it. */}
        <div className="absolute inset-0 md:bg-ink/78 lg:bg-transparent lg:bg-linear-to-r lg:from-ink/90 lg:from-5% lg:via-ink/70 lg:to-ink/35" />
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
