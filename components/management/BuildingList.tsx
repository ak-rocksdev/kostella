'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Wrench } from 'lucide-react'
import { PortfolioBar } from './PortfolioBar'
import {
  buildingName,
  coverPhoto,
  monthlyBooked,
  monthlyPotential,
  occupancy,
  portfolio,
  tenancyLabel,
  type Building,
} from '@/lib/content/management/buildings'
import { useManagement } from '@/lib/management/useManagement'

const jt = (n: number) => `Rp ${(n / 1_000_000).toFixed(1).replace('.', ',')} jt`

/**
 * Every building, grouped by district.
 *
 * Within a district, sorted by free rooms descending: the building with rooms
 * to fill is the one a manager opens first. The source array's order carries no
 * meaning and is deliberately not relied on — the search screen once claimed
 * "urut jarak terdekat" over a list that was in no order at all.
 *
 * No search box. Six buildings do not need one, and a control that filters
 * nothing is exactly the mistake the public filters made before they were made
 * to work.
 */
export function BuildingList() {
  const { buildings } = useManagement()
  const totals = portfolio(buildings)

  // Districts ordered by rooms to fill, not alphabetically. Alphabetical put a
  // single building in Bandung above the four-building Grogol cluster; the
  // screen exists to answer "where do I work today", and its order should too.
  const freeIn = (district: string) =>
    buildings
      .filter((b) => b.district === district)
      .reduce((n, b) => n + occupancy(b).free, 0)

  const districts = [...new Set(buildings.map((b) => b.district))].sort(
    (a, b) => freeIn(b) - freeIn(a) || a.localeCompare(b, 'id'),
  )

  return (
    <div className="wrap-wide py-8 sm:py-10">
      {/* Fixed, not fluid. A clamp-sized heading is right on a marketing page
          read at any width; an operator works at a consistent size, and a title
          that shrinks in a narrow window just looks wrong. */}
      <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.02em]">Gedung</h1>
      <p className="mt-2 text-[15px] text-ink-soft">
        Semua angka di halaman ini dihitung dari data kamar, bukan disimpan terpisah.
      </p>

      <div className="mt-6">
        <PortfolioBar
          items={[
            {
              label: 'Gedung dimodelkan',
              value: totals.buildings,
              // Not "dikelola": Kostella operates 31. Saying 6 without saying so
              // would read as the whole portfolio.
              detail: `dari 31 dikelola · ${districts.length} kawasan`,
            },
            {
              label: 'Kamar',
              value: totals.rooms,
              detail:
                totals.blocked > 0 ? `${totals.blocked} diblokir` : 'tidak ada yang diblokir',
            },
            {
              label: 'Kamar kosong',
              value: totals.free,
              tone: 'available',
              detail: totals.held > 0 ? `${totals.held} lagi dibooking` : 'tidak ada dibooking',
            },
            {
              label: 'Terisi bulan ini',
              value: jt(totals.booked),
              detail: `dari ${jt(totals.potential)} bila penuh`,
            },
          ]}
        />
      </div>

      {districts.map((district) => {
        const rows = buildings
          .filter((b) => b.district === district)
          .sort((a, b) => occupancy(b).free - occupancy(a).free)

        return (
          <section key={district} className="mt-8">
            <h2 className="mb-3 flex flex-wrap items-baseline gap-x-2 text-[13px]">
              <span className="font-semibold text-ink">{district}</span>
              <span className="text-ink-soft">
                {rows[0]?.city} · {rows.length} gedung · {freeIn(district)} kamar kosong
              </span>
            </h2>
            <ul className="flex flex-col gap-3">
              {rows.map((building) => (
                <li key={building.number}>
                  <BuildingRow building={building} all={buildings} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function BuildingRow({ building, all }: { building: Building; all: Building[] }) {
  const o = occupancy(building)
  const booked = monthlyBooked(building)
  const potential = monthlyPotential(building)

  return (
    <Link
      href={`/management/buildings/${building.number}`}
      className="group flex flex-wrap items-center gap-x-5 gap-y-4 rounded-card bg-paper p-4 shadow-card transition-[box-shadow] duration-200 hover:shadow-lift sm:flex-nowrap sm:p-5"
    >
      <Facade building={building} />

      <span className="min-w-0 flex-1 basis-40">
        <span className="block text-[16px] leading-[1.3] font-semibold">
          {buildingName(building, all)}
        </span>
        <span className="mt-1 block text-[13px] text-ink-soft">
          {building.street} · {tenancyLabel[building.tenancy]}
        </span>
        {/* A manager's first question is not "what do I own" — they know. It is
            "which one needs me today". */}
        {o.blocked > 0 && (
          <span className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-held">
            <Wrench size={13} strokeWidth={2} aria-hidden />
            {o.blocked} kamar dalam perbaikan
          </span>
        )}
      </span>

      <span className="w-full sm:w-44">
        <OccupancyBar occupancy={o} />
      </span>

      {/* The renter's figure — "mulai Rp1.550.000" — used to sit here. It is
          what someone deciding where to live cares about; a manager wants to
          know what the building earns against what it could. */}
      <span className="w-full text-right sm:w-36">
        <span className="block font-figure text-[16px] font-semibold">{jt(booked)}</span>
        <span className="mt-0.5 block text-[12px] whitespace-nowrap text-ink-soft">
          dari {jt(potential)}
        </span>
      </span>

      <ArrowRight
        size={18}
        strokeWidth={1.75}
        aria-hidden
        className="hidden shrink-0 text-ink-soft transition-[translate] duration-200 group-hover:translate-x-1 sm:block"
      />
    </Link>
  )
}

/**
 * The photograph, or an honest stand-in.
 *
 * Reusing one building's facade for another asserts they look alike, which is
 * worse than showing none. Where a photo is missing the tile carries the house
 * number instead — deliberate rather than broken, and it makes the gap countable
 * when asking the client for real images.
 *
 * No hover zoom. On a marketing card that flourish sells the photograph; here it
 * is motion that conveys no state, on a screen someone works in all day.
 */
function Facade({ building }: { building: Building }) {
  const base = 'relative size-16 shrink-0 overflow-hidden rounded-badge sm:size-20'
  const cover = coverPhoto(building)

  if (!cover) {
    return (
      <span className={`${base} flex items-center justify-center bg-stone`}>
        <span className="font-figure text-[17px] font-bold text-ink-soft">{building.number}</span>
        <span className="sr-only">Foto gedung belum ada</span>
      </span>
    )
  }

  return (
    <span className={`${base} bg-photo-bg`}>
      <Image
        src={cover.src}
        alt=""
        fill
        sizes="80px"
        // Added photos are data URLs, which the optimiser cannot fetch and
        // does not need to — they were already resized on the way in.
        unoptimized={cover.src.startsWith('data:')}
        className="object-cover"
      />
    </span>
  )
}

/**
 * Occupancy as a bar, because `3/6` beside `5/8` beside `3/4` cannot be compared
 * at a glance and comparing them is the whole reason the list exists.
 *
 * Three segments in the order that matters operationally: earning, promised,
 * empty. Blocked rooms are absent — they are outside the denominator, and the
 * row already names them where there are any.
 */
function OccupancyBar({ occupancy: o }: { occupancy: ReturnType<typeof occupancy> }) {
  const pct = (n: number) => (o.lettable ? (n / o.lettable) * 100 : 0)

  return (
    <>
      <span aria-hidden className="flex h-2 overflow-hidden rounded-full bg-stone">
        <span className="bg-ink" style={{ width: `${pct(o.occupied)}%` }} />
        <span className="bg-held" style={{ width: `${pct(o.held)}%` }} />
        <span className="bg-available" style={{ width: `${pct(o.free)}%` }} />
      </span>
      {/* Colour never carries it alone. */}
      <span className="mt-1.5 flex flex-wrap items-baseline gap-x-3 text-[12px]">
        <span className="text-ink-soft">{o.occupied} terisi</span>
        {o.held > 0 && <span className="text-held">{o.held} dibooking</span>}
        <span className="font-semibold text-available">{o.free} kosong</span>
      </span>
    </>
  )
}
