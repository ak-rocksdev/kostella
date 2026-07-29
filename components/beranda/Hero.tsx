'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { BudgetPanel, type EmptyReason } from './BudgetPanel'
import { areaChips, budget, hero, vacantRooms } from '@/lib/content/beranda'

/**
 * The building itself is the page's opening frame, and the argument sits on it.
 *
 * Kostella owns and runs every room, so the honest thing to lead with is the
 * place — not a stock scene, not an illustration. The headline and the budget
 * control layer over it: one states the claim, the other lets you test it
 * immediately, which is the whole difference between this and an aggregator.
 *
 * Results deliberately do not appear here. Stating a budget sends you to the
 * search screen with that figure already set; a hero that previews its own
 * answer gives the visitor two places to read the same list.
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
    <section className="relative isolate bg-ink">
      <div className="absolute inset-0 -z-10">
        <Image
          src={hero.photo.src}
          alt={hero.photo.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Weighted to the left, where the type sits, so the photo stays
            readable as a photograph on the right instead of being flattened
            under an even wash. Held at 70% behind the text: against a fully
            blown-out photo that still leaves solid stone at 5.6:1, so the
            wording holds up whatever image is dropped in later. */}
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

          <h1 className="mt-5 max-w-[15ch] text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.02em] text-stone text-balance">
            {hero.heading}
          </h1>

          {/* Solid, not translucent. Over a photograph the alpha would eat the
              contrast, and the system's inverse-secondary grey is far too faint
              to survive here — the hierarchy comes from size and weight. */}
          <p className="mt-6 max-w-[480px] text-[17px] leading-[1.65] text-stone">
            {hero.intro}
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
