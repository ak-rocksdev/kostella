'use client'

import { useState } from 'react'
import { Wrench, Zap } from 'lucide-react'
import { FloorGrid, FloorGridLegend, type Floor } from '@/components/ui/FloorGrid'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { monthLabel } from '@/lib/content/management/billing'
import { ownerSummary } from '@/lib/content/management/owner'
import { useManagement } from '@/lib/management/useManagement'
import { formatRupiah } from '@/lib/format'
import { parseDate } from '@/lib/dates'
import { IncomeTrend } from './IncomeTrend'
import { OwnerShell } from './OwnerShell'

/**
 * One building, answered in one screen.
 *
 * A partner checks in; they do not browse. So there is one page, scrolled once,
 * and no second destination to build.
 *
 * Everything here comes from `ownerSummary`, which returns aggregates and never
 * a tenancy. That is the safety: not a filter applied on the way out — a filter
 * is one careless prop from leaking — but a shape with nothing in it to leak.
 */
export function OwnerView() {
  const { buildings, tenancies, billing, today } = useManagement()
  const [number, setNumber] = useState(buildings[0]?.number ?? '')

  const building = buildings.find((b) => b.number === number) ?? buildings[0]

  if (!today || !building) {
    return (
      <OwnerShell buildings={buildings} selected={number} onSelect={setNumber}>
        <div className="wrap py-10" />
      </OwnerShell>
    )
  }

  const s = ownerSummary(building, buildings, tenancies, billing, today)
  const dated = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parseDate(today))

  /* The same grid a renter sees on the public page and a manager works in —
     with no occupants on it. Which rooms are empty is the owner's business;
     who is behind the closed doors is not. */
  const floors: Floor[] = s.floors.map((floor) => ({
    label: floor.label,
    rooms: floor.rooms.map((room) => ({
      room: room.room,
      status: room.status,
      blocked: room.blocked,
    })),
  }))

  const gap = s.income.potential - s.income.booked

  return (
    <OwnerShell buildings={buildings} selected={number} onSelect={setNumber}>
      <div className="wrap py-8 sm:py-10">
        <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.02em]">{s.name}</h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          {s.street} · {s.district}, {s.city} · {dated}
        </p>

        {/* The three figures a partner opens this for. */}
        <dl className="mt-6 grid grid-cols-1 overflow-hidden rounded-card bg-paper shadow-card sm:grid-cols-3">
          {[
            {
              label: 'Okupansi',
              value: `${Math.round(s.rate * 100)}%`,
              detail: `${s.rooms.occupied} dari ${s.rooms.lettable} kamar yang bisa disewakan`,
            },
            {
              label: 'Terisi bulan ini',
              value: formatRupiah(s.income.booked),
              detail:
                gap > 0
                  ? `${formatRupiah(gap)} belum terisi dari ${formatRupiah(s.income.potential)}`
                  : 'penuh — tidak ada potensi yang menganggur',
            },
            {
              label: 'Belum terbayar',
              value: formatRupiah(s.outstanding),
              detail:
                s.outstanding > 0
                  ? 'sedang ditagih pengelola'
                  : 'semua tagihan bulan ini sudah lunas',
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`grid grid-rows-subgrid row-span-3 content-start px-5 py-4 ${
                i > 0 ? 'border-t border-line sm:border-t-0 sm:border-l' : ''
              }`}
            >
              <dt className="text-[13px] text-ink-soft">{item.label}</dt>
              <dd className="mt-1 font-figure text-[26px] leading-none font-bold tracking-[-0.02em]">
                {item.value}
              </dd>
              <dd className="mt-1.5 text-[12px] leading-[1.4] text-ink-soft">{item.detail}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-card bg-paper p-5 shadow-card sm:p-6">
            <SectionLabel className="mb-4">Kamar</SectionLabel>
            <FloorGrid floors={floors} />
            <div className="mt-5 border-t border-line pt-4">
              <FloorGridLegend />
            </div>
            {/* Named rather than left to be noticed as a gap. */}
            <p className="mt-4 text-[13px] text-ink-soft">
              Kisi yang sama dengan yang dilihat calon penyewa di halaman publik. Nama penghuni
              tidak ditampilkan di sini.
            </p>
          </section>

          <div className="flex flex-col gap-6">
            <section className="rounded-card bg-paper p-5 shadow-card sm:p-6">
              <SectionLabel className="mb-4">Pemasukan enam bulan</SectionLabel>
              <IncomeTrend trend={s.trend} />
            </section>

            <section className="rounded-card bg-paper p-5 shadow-card sm:p-6">
              <SectionLabel className="mb-4">Yang sedang dikerjakan</SectionLabel>
              <ul className="flex flex-col gap-3 text-[14px]">
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-stone text-ink-soft"
                  >
                    <Wrench size={15} strokeWidth={1.9} />
                  </span>
                  <span>
                    <strong className="font-semibold">{s.attention} kamar</strong> sedang ditangani
                    pengelola — kosong atau dalam perbaikan.
                    <span className="mt-0.5 block text-[13px] text-ink-soft">
                      Pengelola yang menindaklanjuti; rinciannya ada di sisi mereka.
                    </span>
                  </span>
                </li>

                {/* The one figure on this screen an owner could not get by
                    asking: PLN bills a meter whether or not anybody is behind
                    it, and there is nobody to charge. */}
                <li className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-held-soft text-held"
                  >
                    <Zap size={15} strokeWidth={1.9} />
                  </span>
                  <span>
                    <strong className="font-semibold">{formatRupiah(s.powerOnEmptyRooms)}</strong>{' '}
                    tagihan PLN untuk kamar tanpa penghuni, {monthLabel(s.powerMonth)}.
                    <span className="mt-0.5 block text-[13px] text-ink-soft">
                      Meteran tetap ditagih walau kamarnya kosong.
                    </span>
                  </span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </OwnerShell>
  )
}
