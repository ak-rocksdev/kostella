'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FloorGrid, FloorGridLegend, type Floor } from '@/components/ui/FloorGrid'
import { MetricCard } from '@/components/ui/MetricCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { BuildingSwitcher } from './BuildingSwitcher'
import { FacilitiesPanel } from './FacilitiesPanel'
import { RoomActions } from './RoomActions'
import { RoomHistory } from './RoomHistory'
import {
  monthlyBooked,
  monthlyPotential,
  occupancy,
  tenancyLabel,
  type Building,
} from '@/lib/content/management/buildings'
import { formatRupiah } from '@/lib/format'
import { useManagement } from '@/lib/management/useManagement'

const jt = (n: number) => `Rp ${(n / 1_000_000).toFixed(1).replace('.', ',')} jt`

export function BuildingDetail({ number }: { number: string }) {
  const { buildings } = useManagement()
  const building = buildings.find((b) => b.number === number)
  const [selected, setSelected] = useState<string | null>(null)

  if (!building) {
    return (
      <div className="wrap-wide py-16">
        <p className="text-[16px] font-semibold">Gedung {number} tidak ada.</p>
        <Link href="/management/buildings" className="mt-3 inline-flex text-[15px] font-semibold text-plum">
          Kembali ke daftar gedung
        </Link>
      </div>
    )
  }

  const o = occupancy(building)
  const room = building.rooms.find((r) => r.room === selected) ?? null

  // Grouped for the grid, in the building's own floor order — top down, so it
  // reads like an elevation, the same way the public detail page does.
  const floors: Floor[] = building.floors.map((label) => ({
    label,
    rooms: building.rooms
      .filter((r) => r.floor === label)
      .map((r) => ({
        room: r.room,
        status: r.status,
        type: r.type,
        price: formatRupiah(r.rent),
        blocked: Boolean(r.blocked),
      })),
  }))

  return (
    <div className="wrap-wide py-8 sm:py-10">
      <Link
        href="/management/buildings"
        className="inline-flex min-h-11 items-center gap-2 text-[14px] font-semibold text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft size={17} strokeWidth={1.75} aria-hidden />
        Semua gedung
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
        <BuildingSwitcher current={building.number} />
        <div>
          <h1 className="text-[clamp(1.375rem,2.5vw,1.75rem)] leading-[1.2] font-semibold tracking-[-0.02em]">
            {building.street}
          </h1>
          <p className="mt-1 text-[14px] text-ink-soft">
            {tenancyLabel[building.tenancy]} · {building.area}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Okupansi"
          value={`${o.occupied}/${o.lettable}`}
          detail={
            o.blocked > 0
              ? `${o.blocked} kamar diblokir, di luar hitungan`
              : `${Math.round(o.rate * 100)}% dari kamar yang bisa disewakan`
          }
        />
        <MetricCard
          label="Kamar kosong"
          value={o.free}
          tone="available"
          detail={o.held > 0 ? `${o.held} lagi dibooking` : 'tidak ada yang dibooking'}
        />
        <MetricCard
          label="Terisi bulan ini"
          value={jt(monthlyBooked(building))}
          detail={`dari ${jt(monthlyPotential(building))} bila penuh`}
        />
        <MetricCard label="Total kamar" value={o.total} detail={`${building.floors.length} lantai`} />
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-card bg-paper p-5 shadow-card sm:p-6">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
            <SectionLabel>Kisi lantai — sama dengan halaman publik</SectionLabel>
            <FloorGridLegend />
          </div>

          <FloorGrid
            floors={floors}
            selectedRoom={selected ?? undefined}
            onSelect={(r) => setSelected(r.room)}
          />

          {room ? (
            <>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line pt-5">
                <span className="font-figure text-[17px] font-semibold">Kamar {room.room}</span>
                <span className="text-[14px] text-ink-soft">
                  {room.floor} · {room.type} · {formatRupiah(room.rent)}/bulan
                </span>
                {room.blocked && (
                  <span className="text-[13px] text-held">
                    diblokir sejak {room.blocked.since} — {room.blocked.note}
                  </span>
                )}
              </div>
              <RoomActions building={building} room={room} />
              <RoomHistory building={building.number} room={room.room} />
            </>
          ) : (
            <p className="mt-6 border-t border-line pt-5 text-[14px] text-ink-soft">
              Pilih kamar di kisi untuk mengubah status, harga, atau memblokirnya.
            </p>
          )}
        </section>

        <FacilitiesPanel building={building} />
      </div>

      <section className="mt-8">
        <SectionLabel className="mb-4">Semua kamar</SectionLabel>
        <RoomTable building={building} onSelect={setSelected} />
      </section>
    </div>
  )
}

/**
 * The grid answers "which rooms are free"; the table answers "what is every
 * room". Both are needed — the grid cannot carry rent and a blocking reason
 * without becoming unreadable.
 */
function RoomTable({
  building,
  onSelect,
}: {
  building: Building
  onSelect: (room: string) => void
}) {
  const statusLabel = { available: 'kosong', held: 'dibooking', occupied: 'terisi' } as const
  const statusTone = {
    available: 'text-available',
    held: 'text-held',
    occupied: 'text-ink-soft',
  } as const

  return (
    <div className="overflow-x-auto rounded-card bg-paper shadow-card">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line text-[13px] font-semibold text-ink-soft">
            <th className="px-4 py-3 sm:px-5">Kamar</th>
            {/* The grid above already groups by floor, so this column is the
                one to drop when width is short. */}
            <th className="hidden px-5 py-3 sm:table-cell">Lantai</th>
            <th className="px-5 py-3">Tipe</th>
            <th className="px-5 py-3 text-right">Sewa</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {building.rooms.map((room) => (
            <tr key={room.room} className="border-b border-line last:border-0">
              <td className="px-4 py-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => onSelect(room.room)}
                  className="cursor-pointer font-figure text-[15px] font-semibold underline-offset-4 hover:underline"
                >
                  {room.room}
                </button>
              </td>
              <td className="hidden px-5 py-3 text-[14px] text-ink-soft sm:table-cell">
                {room.floor}
              </td>
              <td className="px-5 py-3 text-[14px] text-ink-soft">{room.type}</td>
              <td className="px-5 py-3 text-right font-figure text-[14px]">
                {formatRupiah(room.rent)}
              </td>
              <td className={`px-5 py-3 text-[13px] font-semibold ${statusTone[room.status]}`}>
                {room.blocked ? (
                  <span className="text-ink-soft">diblokir — {room.blocked.note}</span>
                ) : (
                  statusLabel[room.status]
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
