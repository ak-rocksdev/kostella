'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { SectionEyebrow } from '@/components/ui/Eyebrow'
import { AvailabilityCard, type EmptyReason } from './AvailabilityCard'
import { BudgetPanel } from './BudgetPanel'
import { areaChips, budget, hero, vacantRooms } from '@/lib/content/beranda'

/**
 * The hero is a live demonstration, not a description.
 *
 * The brand's two claims are that it knows which rooms are genuinely empty and
 * exactly what they cost. So the visitor sets a budget and the inventory answers
 * immediately — the proof happens in front of them, which is something no
 * aggregator reselling someone else's listings could show.
 *
 * It reads as two bands: the argument and its control on stone, then the
 * building itself running edge to edge with the live list floating over it.
 */
export function Hero() {
  const [area, setArea] = useState(areaChips[0].label)
  const [amount, setAmount] = useState<number>(budget.initial)

  const inArea = useMemo(() => vacantRooms.filter((room) => room.area === area), [area])
  const matches = useMemo(() => inArea.filter((room) => room.rent <= amount), [inArea, amount])

  const selectedChip = areaChips.find((chip) => chip.label === area)
  const cheapestInArea = inArea[0]

  let emptyReason: EmptyReason | null = null
  if (inArea.length === 0 && selectedChip?.nearest) {
    emptyReason = { kind: 'area', area, nearest: selectedChip.nearest }
  } else if (matches.length === 0 && cheapestInArea) {
    emptyReason = { kind: 'budget', cheapest: cheapestInArea }
  }

  const fixEmpty = () => {
    if (emptyReason?.kind === 'area') setArea(emptyReason.nearest)
    if (emptyReason?.kind === 'budget') setAmount(emptyReason.cheapest.rent)
  }

  return (
    <section className="bg-stone">
      <div className="wrap grid items-start gap-10 pt-14 pb-12 sm:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="lg:pt-2">
          <SectionEyebrow>{hero.eyebrow}</SectionEyebrow>

          <h1 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] font-semibold tracking-[-0.015em] text-balance">
            {hero.heading}
          </h1>

          <p className="mt-5 max-w-[460px] text-[17px] leading-[1.65] text-ink-soft">
            {hero.intro}
          </p>
        </div>

        <BudgetPanel
          area={area}
          onAreaChange={setArea}
          amount={amount}
          onAmountChange={setAmount}
          matchCount={matches.length}
          totalCount={inArea.length}
        />
      </div>

      {/* The building, edge to edge. The list sits on it because the photo is
          the promise and the list is the proof — they belong in one frame. */}
      <div className="relative">
        <div className="relative aspect-3/2 w-full sm:aspect-21/9 lg:h-[460px] lg:aspect-auto">
          <Image
            src={hero.photo.src}
            alt={hero.photo.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Keeps the floating card's edge readable against a bright photo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/25 to-transparent to-40%"
          />
        </div>

        <div className="wrap relative -mt-16 pb-4 sm:-mt-24 lg:mt-0 lg:pb-0">
          <AvailabilityCard
            rooms={matches}
            area={area}
            emptyReason={emptyReason}
            onFixEmpty={fixEmpty}
            className="lg:absolute lg:right-8 lg:bottom-10 lg:w-[440px]"
          />
        </div>
      </div>
    </section>
  )
}
