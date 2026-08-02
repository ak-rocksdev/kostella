'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarClock,
  Layers,
  TrendingUp,
  UserRound,
  Users,
  UsersRound,
  Wrench,
} from 'lucide-react'
import { FloorGrid, FloorGridLegend, type Floor } from '@/components/ui/FloorGrid'
import { MetricCard } from '@/components/ui/MetricCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { BuildingSwitcher } from './BuildingSwitcher'
import { FacilitiesPanel } from './FacilitiesPanel'
import { PhotoPanel } from './PhotoPanel'
import { RoomActions } from './RoomActions'
import type { Tenancy } from '@/lib/content/management/tenancies'
import { MetricNote } from './MetricNote'
import { RoomHistory } from './RoomHistory'
import {
  areaLabel,
  buildingName,
  monthlyBooked,
  monthlyPotential,
  occupancy,
  tenancyLabel,
  type Building,
} from '@/lib/content/management/buildings'
import { formatDate } from '@/lib/dates'
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
        <Link
          href="/management/buildings"
          className="mt-3 inline-flex text-[15px] font-semibold text-plum"
        >
          Kembali ke daftar gedung
        </Link>
      </div>
    )
  }

  const o = occupancy(building)
  const gap = monthlyPotential(building) - monthlyBooked(building)
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
        ...(r.tenant?.leavingOn ? { leavingOn: formatDate(r.tenant.leavingOn) } : {}),
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
          <h1 className="text-[24px] leading-[1.2] font-semibold tracking-[-0.02em]">
            {buildingName(building, buildings)}
          </h1>
          <p className="mt-1 text-[14px] text-ink-soft">
            {building.street} · {tenancyLabel[building.tenancy]} · {areaLabel(building)}
          </p>
        </div>
      </div>

      {/* Only the lines that report an exception are marked. Marking all four
          would be decoration and would bury the one that matters. */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Percentage leads and the count follows it. The fraction alone made a
            reader do the division to compare two buildings; the percentage alone
            hid how few rooms it is a percentage of. */}
        <MetricCard
          label="Okupansi"
          value={`${Math.round(o.rate * 100)}%`}
          detail={
            o.blocked > 0 ? (
              <MetricNote icon={Wrench} tone="attention">
                {o.occupied} dari {o.lettable} kamar · {o.blocked} diblokir, di luar hitungan
              </MetricNote>
            ) : (
              <MetricNote>
                {o.occupied} dari {o.lettable} kamar yang bisa disewakan
              </MetricNote>
            )
          }
        />
        <MetricCard
          label="Kamar kosong"
          value={o.free}
          tone="available"
          detail={
            o.held > 0 ? (
              <MetricNote icon={CalendarClock} tone="attention">
                {o.held} lagi dibooking, belum masuk
              </MetricNote>
            ) : (
              <MetricNote>tidak ada yang dibooking</MetricNote>
            )
          }
        />
        <MetricCard
          label="Terisi bulan ini"
          value={jt(monthlyBooked(building))}
          detail={
            gap > 0 ? (
              // The gap, not the ceiling. "dari Rp 5,0 jt bila penuh" made the
              // manager do the subtraction to reach the number they care about.
              <MetricNote icon={TrendingUp} tone="attention">
                {jt(gap)} belum terisi dari {jt(monthlyPotential(building))}
              </MetricNote>
            ) : (
              <MetricNote tone="available">penuh — tidak ada potensi yang menganggur</MetricNote>
            )
          }
        />
        <MetricCard
          label="Total kamar"
          value={o.total}
          detail={<MetricNote icon={Layers}>{building.floors.length} lantai</MetricNote>}
        />
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
              <div className="mt-6 border-t border-line pt-5">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-figure text-[17px] font-semibold">Kamar {room.room}</span>
                  <span className="text-[14px] text-ink-soft">
                    {room.floor} · {room.type} · {formatRupiah(room.rent)}/bulan
                  </span>
                  {room.blocked && (
                    <span className="text-[13px] text-held">
                      diblokir sejak {formatDate(room.blocked.since)} — {room.blocked.note}
                    </span>
                  )}
                </div>
                {/* Who is behind the door. The grid answers whether a room is
                    taken; a manager standing in front of it needs the name, the
                    number they can reach, and what that person actually pays —
                    which is not necessarily the room's asking price above. */}
                {room.tenant && <TenantLine tenant={room.tenant} />}
                {!room.tenant && room.incoming && <TenantLine tenant={room.incoming} incoming />}
                {room.conflict && (
                  <p className="mt-2 flex items-start gap-2 rounded-badge bg-held-soft px-3 py-2 text-[13px] font-semibold text-held">
                    <UsersRound
                      size={15}
                      strokeWidth={1.9}
                      aria-hidden
                      className="mt-0.5 shrink-0"
                    />
                    {/* One string rather than interleaved JSX text: the
                        spaces around an expression at a line break are eaten by
                        JSX, and this sentence lost one — it rendered
                        "Penghuni Dbelum dikonfirmasi". */}
                    <span>
                      {`${room.conflict.name} tercatat masuk ${formatDate(
                        room.conflict.movedIn,
                      )}, tapi ${room.tenant?.name} belum dikonfirmasi keluar. Dua penghuni di satu kamar — selesaikan lewat “Catat keluar”.`}
                    </span>
                  </p>
                )}
              </div>
              <RoomActions building={building} room={room} />
              <RoomHistory building={building.number} room={room.room} />
            </>
          ) : (
            <p className="mt-6 border-t border-line pt-5 text-[14px] text-ink-soft">
              Pilih kamar di kisi untuk melihat penghuninya dan mencatat perubahan.
            </p>
          )}
        </section>

        <div className="flex flex-col gap-6">
          <PhotoPanel building={building} />
          <FacilitiesPanel building={building} />
        </div>
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
                  className="inline-flex min-h-11 cursor-pointer items-center font-figure text-[15px] font-semibold underline-offset-4 hover:underline"
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

/**
 * The person in a room, on one line.
 *
 * Rent is stated here as well as on the room above because the two can differ:
 * the room's figure is what the next tenant would pay, this one is what this
 * tenant agreed to. Where they disagree the difference is the point, so it is
 * said rather than left to be noticed.
 */
function TenantLine({ tenant, incoming }: { tenant: Tenancy; incoming?: boolean }) {
  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-soft">
      <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
        <UserRound size={14} strokeWidth={1.9} aria-hidden className="shrink-0" />
        {tenant.name}
      </span>
      <span>{tenant.occupation}</span>
      <span>{tenant.phone}</span>
      <span>
        {incoming ? 'masuk' : 'sejak'} {formatDate(tenant.movedIn)}
      </span>
      <span>{formatRupiah(tenant.agreedRent)}/bulan</span>
      {tenant.leavingOn && (
        <span className="font-semibold text-held">rencana keluar {formatDate(tenant.leavingOn)}</span>
      )}
      {/* The guardian lives here rather than on the tenant list. It is wanted in
          an emergency, about one person — and a room is where one person gets
          looked up. On the list it repeated on all twenty-two rows. */}
      <span className="inline-flex items-center gap-1.5">
        <Users size={13} strokeWidth={1.9} aria-hidden className="shrink-0" />
        {tenant.guardianName} · {tenant.guardianPhone}
      </span>
    </p>
  )
}
