'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { budgetSteps } from '@/lib/content/beranda'
import type { Building, RoomState } from '@/lib/content/management/buildings'
import { setBlocked, setRent, setStatus } from '@/lib/management/store'
import { useManagement } from '@/lib/management/useManagement'
import { formatRupiah } from '@/lib/format'

const today = () => new Date().toISOString().slice(0, 10)

const field =
  'w-full rounded-badge border border-line bg-paper px-3 py-2.5 text-[14px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-plum'

/**
 * The three actions the design bundle specifies, each opening the fields it
 * cannot be done without.
 *
 * A price change and a block **require a reason**. That is the difference
 * between a log that answers "why is this tenant paying less than the listed
 * rent" and one that only records that somebody changed something.
 *
 * A status change records the date it takes effect, which is not always today —
 * a tenant moving in on the 1st while the manager updates the record on the
 * 3rd. Phase 4 bills from that date, so it is captured now rather than
 * retrofitted onto entries that no longer have it.
 *
 * Inline forms rather than modals: a modal needs a focus trap, an escape route
 * and a scroll lock to be correct, and buys nothing here.
 */
export function RoomActions({ building, room }: { building: Building; room: RoomState }) {
  const { apply } = useManagement()
  const [open, setOpen] = useState<'status' | 'rent' | 'block' | null>(null)

  const [effectiveFrom, setEffectiveFrom] = useState(today())
  const [rent, setRentValue] = useState(room.rent)
  const [note, setNote] = useState('')

  const close = () => {
    setOpen(null)
    setNote('')
    setEffectiveFrom(today())
    setRentValue(room.rent)
  }

  const toggleStatus = () => {
    const next = room.status === 'occupied' ? 'available' : 'occupied'
    apply((s) => setStatus(s, building.number, room, next, effectiveFrom))
    close()
  }

  return (
    <div className="mt-5 border-t border-line pt-5">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={() => setOpen(open === 'status' ? null : 'status')}>
          {room.status === 'occupied' ? 'Tandai kosong' : 'Tandai terisi'}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setOpen(open === 'rent' ? null : 'rent')}>
          Atur harga
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setOpen(open === 'block' ? null : 'block')}>
          {room.blocked ? 'Buka blokir' : 'Blokir untuk perbaikan'}
        </Button>
      </div>

      {open === 'status' && (
        <form
          className="mt-4 flex flex-wrap items-end gap-3 rounded-card bg-canvas p-4"
          onSubmit={(e) => {
            e.preventDefault()
            toggleStatus()
          }}
        >
          <label className="flex-1 basis-48">
            <span className="mb-1.5 block text-[13px] font-semibold">Berlaku sejak</span>
            <input
              type="date"
              required
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className={field}
            />
            <span className="mt-1.5 block text-[12px] text-ink-soft">
              Tanggal penghuni benar-benar masuk atau keluar, bukan tanggal dicatat.
            </span>
          </label>
          <Confirm onCancel={close} />
        </form>
      )}

      {open === 'rent' && (
        <form
          className="mt-4 flex flex-wrap items-end gap-3 rounded-card bg-canvas p-4"
          onSubmit={(e) => {
            e.preventDefault()
            apply((s) => setRent(s, building.number, room, rent, note.trim()))
            close()
          }}
        >
          <label className="basis-44">
            <span className="mb-1.5 block text-[13px] font-semibold">Sewa per bulan</span>
            <select
              value={rent}
              onChange={(e) => setRentValue(Number(e.target.value))}
              className={`${field} cursor-pointer`}
            >
              {budgetSteps.map((step) => (
                <option key={step} value={step}>
                  {formatRupiah(step)}
                </option>
              ))}
            </select>
          </label>
          <label className="min-w-0 flex-1 basis-60">
            <span className="mb-1.5 block text-[13px] font-semibold">Alasan</span>
            <input
              type="text"
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="mis. renovasi kamar mandi selesai"
              className={field}
            />
          </label>
          <Confirm onCancel={close} />
        </form>
      )}

      {open === 'block' && (
        <form
          className="mt-4 flex flex-wrap items-end gap-3 rounded-card bg-canvas p-4"
          onSubmit={(e) => {
            e.preventDefault()
            apply((s) =>
              setBlocked(
                s,
                building.number,
                room,
                room.blocked ? null : { since: today(), note: note.trim() },
                note.trim(),
              ),
            )
            close()
          }}
        >
          <label className="min-w-0 flex-1 basis-60">
            <span className="mb-1.5 block text-[13px] font-semibold">Alasan</span>
            <input
              type="text"
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={room.blocked ? 'mis. perbaikan selesai' : 'mis. ganti keramik kamar mandi'}
              className={field}
            />
            <span className="mt-1.5 block text-[12px] text-ink-soft">
              {room.blocked
                ? 'Kamar kembali tampil di halaman publik.'
                : 'Kamar hilang dari halaman publik, tapi tetap terhitung di sini.'}
            </span>
          </label>
          <Confirm onCancel={close} />
        </form>
      )}
    </div>
  )
}

function Confirm({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex shrink-0 gap-2">
      <Button size="sm" type="submit">
        Simpan
      </Button>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Batal
      </Button>
    </div>
  )
}
