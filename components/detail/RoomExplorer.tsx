'use client'

import { useState } from 'react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { FloorGrid, FloorGridLegend } from '@/components/ui/FloorGrid'
import { ReceiptTable } from '@/components/ui/ReceiptTable'
import { HouseRules } from './HouseRules'
import { RoomPanel } from './RoomPanel'
import { Sekitar } from './Sekitar'
import { defaultRoom, receiptFor, receiptNote, property } from '@/lib/content/detail'
import { findLive, publicFloors } from '@/lib/content/management/public'
import { floors as SEED_FLOORS } from '@/lib/content/detail'
import { useLiveBuildings } from '@/lib/management/useManagement'

/**
 * The property's body, driven by one piece of state: which room you picked.
 *
 * The floor grid leads, not a photo carousel. That is the deliberate risk in
 * this design — competitors open with pictures, Kostella opens with inventory,
 * because knowing what is actually free is the thing it can prove.
 *
 * The room panel sits in column two at desktop but follows the grid in source
 * order, so on a phone you get the grid and then what you just selected.
 *
 * Every block here is now a white card on the page ground, the same as the
 * landing page. The previous world separated them with hairline rules and gave
 * the receipt a 3px plum top edge; both were devices of a design built on lines
 * rather than on surfaces.
 */
export function RoomExplorer() {
  const [room, setRoom] = useState(defaultRoom)
  const receipt = receiptFor(room)
  const buildings = useLiveBuildings()

  // The grid a visitor reads is built from the same records the manager edits —
  // the label above it says "sama dengan halaman publik", and this is what
  // makes that true rather than decorative.
  const live = findLive(buildings, property.number)
  const floors = live ? publicFloors(live) : SEED_FLOORS

  return (
    <div className="wrap grid items-start gap-x-12 gap-y-14 pt-14 pb-16 sm:gap-y-16 sm:pb-24 lg:grid-cols-[1.5fr_1fr]">
      <section className="lg:col-start-1">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <SectionLabel>Semua kamar · pilih untuk lihat detail</SectionLabel>
          <FloorGridLegend />
        </div>
        <div className="rounded-card bg-paper p-5 shadow-card sm:p-8">
          <FloorGrid
            floors={floors}
            selectedRoom={room}
            onSelect={(selected) => setRoom(selected.room)}
            animate
          />
        </div>
      </section>

      <div className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-4 lg:row-start-1">
        <RoomPanel key={room} roomNumber={room} />
      </div>

      <section className="lg:col-start-1">
        <SectionLabel>Rincian biaya — kamar {room}</SectionLabel>
        <div className="mt-4 rounded-card bg-paper p-5 shadow-card sm:p-8">
          <ReceiptTable rows={receipt.rows} total={receipt.total} note={receiptNote} />
        </div>
      </section>

      <section className="lg:col-start-1">
        <SectionLabel className="mb-4">Sekitar</SectionLabel>
        <Sekitar />
      </section>

      <section className="lg:col-start-1">
        <SectionLabel className="mb-4">Aturan rumah</SectionLabel>
        <HouseRules />
      </section>
    </div>
  )
}
