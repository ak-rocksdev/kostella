'use client'

import { useState } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FloorGrid, FloorGridLegend } from '@/components/ui/FloorGrid'
import { ReceiptTable } from '@/components/ui/ReceiptTable'
import { HouseRules } from './HouseRules'
import { RoomPanel } from './RoomPanel'
import { Sekitar } from './Sekitar'
import { defaultRoom, floors, receiptFor, receiptNote } from '@/lib/content/detail'

/**
 * The property's body, driven by one piece of state: which room you picked.
 *
 * The floor grid leads, not a photo carousel. That is the deliberate risk in
 * this design — competitors open with pictures, Kostella opens with inventory,
 * because knowing what is actually free is the thing it can prove.
 *
 * The room panel sits in column two at desktop but follows the grid in source
 * order, so on a phone you get the grid and then what you just selected.
 */
export function RoomExplorer() {
  const [room, setRoom] = useState(defaultRoom)
  const receipt = receiptFor(room)

  return (
    <div className="wrap grid items-start gap-x-12 gap-y-14 pt-12 pb-14 sm:gap-y-16 sm:pb-24 lg:grid-cols-[1.5fr_1fr]">
      <section className="lg:col-start-1">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <Eyebrow>Semua kamar · pilih untuk lihat detail</Eyebrow>
          <FloorGridLegend />
        </div>
        <div className="rounded-card border border-line bg-paper p-5 sm:p-8">
          <FloorGrid
            floors={floors}
            selectedRoom={room}
            onSelect={(selected) => setRoom(selected.room)}
            animate
          />
        </div>
      </section>

      <div className="lg:sticky lg:top-22 lg:col-start-2 lg:row-span-4 lg:row-start-1">
        <RoomPanel key={room} roomNumber={room} />
      </div>

      <section className="lg:col-start-1">
        <Eyebrow>Rincian biaya — kamar {room}</Eyebrow>
        <div className="mt-4 rounded-card border border-line border-t-[3px] border-t-plum bg-paper p-5 sm:p-8">
          <ReceiptTable rows={receipt.rows} total={receipt.total} note={receiptNote} />
        </div>
      </section>

      <section className="lg:col-start-1">
        <Eyebrow className="mb-4">Sekitar</Eyebrow>
        <Sekitar />
      </section>

      <section className="lg:col-start-1">
        <Eyebrow>Aturan rumah</Eyebrow>
        <HouseRules />
      </section>
    </div>
  )
}
