'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MetricCard } from '@/components/ui/MetricCard'
import {
  cheapestFree,
  occupancy,
  portfolio,
  tenancyLabel,
  type Building,
} from '@/lib/content/management/buildings'
import { formatRupiah } from '@/lib/format'
import { useManagement } from '@/lib/management/useManagement'

const jt = (n: number) => `Rp ${(n / 1_000_000).toFixed(1).replace('.', ',')} jt`

/**
 * Every building, with the one figure that decides which to open.
 *
 * Sorted by free rooms descending: the building with rooms to fill is the one a
 * manager opens first. The order of the source array carries no meaning and is
 * deliberately not relied on — the search screen once claimed "urut jarak
 * terdekat" over a list that was in no order at all.
 */
export function BuildingList() {
  const { buildings } = useManagement()
  const totals = portfolio(buildings)

  const sorted = [...buildings].sort((a, b) => occupancy(b).free - occupancy(a).free)

  return (
    <div className="wrap-wide py-8 sm:py-10">
      <h1 className="text-[clamp(1.5rem,3vw,2rem)] leading-[1.2] font-semibold tracking-[-0.02em]">
        Gedung
      </h1>
      <p className="mt-2 text-[15px] text-ink-soft">
        Semua angka di halaman ini dihitung dari data kamar, bukan disimpan terpisah.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Gedung dikelola" value={totals.buildings} detail="di Grogol" />
        <MetricCard
          label="Kamar"
          value={totals.rooms}
          detail={
            totals.blocked > 0
              ? `${totals.blocked} diblokir untuk perbaikan`
              : 'tidak ada yang diblokir'
          }
        />
        <MetricCard
          label="Kamar kosong"
          value={totals.free}
          tone="available"
          detail={totals.held > 0 ? `${totals.held} lagi dibooking` : 'tidak ada yang dibooking'}
        />
        <MetricCard
          label="Terisi bulan ini"
          value={jt(totals.booked)}
          detail={`dari ${jt(totals.potential)} bila penuh`}
        />
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {sorted.map((building) => (
          <li key={building.number}>
            <BuildingRow building={building} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function BuildingRow({ building }: { building: Building }) {
  const o = occupancy(building)
  const cheapest = cheapestFree(building)

  return (
    <Link
      href={`/management/buildings/${building.number}`}
      className="group flex flex-wrap items-center gap-x-6 gap-y-3 rounded-card bg-paper p-5 shadow-card transition-[box-shadow] duration-200 hover:shadow-lift sm:flex-nowrap"
    >
      <span className="rounded-badge bg-stone px-2 py-1 font-figure text-[15px] leading-[1.3] font-semibold">
        <span className="sr-only">Kostella </span>
        {building.number}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold">{building.street}</span>
        <span className="mt-0.5 block text-[13px] text-ink-soft">
          {tenancyLabel[building.tenancy]} · {building.area}
        </span>
      </span>

      {/* Status carries a word, never colour alone. */}
      <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[13px]">
        <span className="font-semibold text-available">{o.free} kosong</span>
        {o.held > 0 && <span className="text-held">{o.held} dibooking</span>}
        {o.blocked > 0 && <span className="text-ink-soft">{o.blocked} diblokir</span>}
        <span className="text-ink-soft">
          {o.occupied}/{o.lettable} terisi
        </span>
      </span>

      <span className="text-right text-[13px] whitespace-nowrap text-ink-soft">
        {cheapest ? (
          <>
            mulai{' '}
            <span className="font-figure font-semibold text-ink">{formatRupiah(cheapest)}</span>
          </>
        ) : (
          'penuh'
        )}
      </span>

      <ArrowRight
        size={18}
        strokeWidth={1.75}
        aria-hidden
        className="shrink-0 text-ink-soft transition-[translate] duration-200 group-hover:translate-x-1"
      />
    </Link>
  )
}
