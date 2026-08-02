'use client'

import { useState } from 'react'
import {
  CalendarClock,
  CalendarX,
  DoorOpen,
  Tag,
  UserRoundCheck,
  UserRoundPlus,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Disclosure } from '@/components/ui/Disclosure'
import { Field, FieldActions, FieldRow } from '@/components/ui/Field'
import { RupiahInput } from '@/components/ui/RupiahInput'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/components/ui/Toast'
import {
  blockToast,
  moveInToast,
  moveOutToast,
  noticeCancelledToast,
  noticeToast,
  rentToast,
  tenantRentToast,
} from './changeToast'
import type { Building, RoomState } from '@/lib/content/management/buildings'
import { canStart, hasNotice } from '@/lib/content/management/tenancies'
import {
  addCharge,
  cancelNotice,
  endTenancy,
  giveNotice,
  moveInEarly,
  setAgreedRent,
  setBlocked,
  setRent,
  startTenancy,
} from '@/lib/management/store'
import { useManagement } from '@/lib/management/useManagement'
import { addDays, formatDate, parseDate } from '@/lib/dates'
import { cn } from '@/lib/cn'
import { daysInMonthOf, estimatePower, monthOf } from '@/lib/content/management/billing'
import { formatRupiah } from '@/lib/format'

const field =
  'w-full rounded-badge border border-line bg-paper px-3 py-2.5 text-[14px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-plum'

const label = 'mb-1.5 block text-[13px] font-semibold'

/**
 * Why someone left. A list rather than a required sentence.
 *
 * A free-text box was the first draft, matching the reason a price change
 * demands. But a move-out happens dozens of times a year for entirely ordinary
 * reasons, and typing "lulus" forty times is friction that ends in "-" being
 * typed instead. A list still answers the question an auditor asks, and the
 * note stays for the case the list does not cover.
 */
const LEAVING_REASONS = [
  'Lulus kuliah',
  'Pindah kerja',
  'Pulang kampung',
  'Pindah kos lain',
  'Lainnya',
]

/**
 * What a manager can do to one room.
 *
 * The set changes with who is in it, because occupancy is now a consequence of
 * a tenant rather than a flag. Phase 1's single "Tandai terisi" toggle is gone:
 * it let a room be marked taken with nobody named, no date, and nothing for
 * phase 4 to bill.
 *
 * The order is deliberate. Tenant actions come first because that is what a
 * manager opens this panel to do; the room's own asking price and its
 * maintenance block sit behind a divider, since they belong to the room rather
 * than to whoever is in it.
 *
 * Inline forms rather than modals: a modal needs a focus trap, an escape route
 * and a scroll lock to be correct, and buys nothing here.
 */
export function RoomActions({ building, room }: { building: Building; room: RoomState }) {
  const { apply, actor, tenancies, billing, today } = useManagement()
  const { show } = useToast()
  const ctx = { building: building.number, actor }

  type Form = 'move-in' | 'notice' | 'notice-cancel' | 'move-out' | 'tenant-rent' | 'rent' | 'block'
  const [open, setOpen] = useState<Form | null>(null)
  const [note, setNote] = useState('')
  const [date, setDate] = useState('')
  const [rent, setRentValue] = useState(room.rent)
  const [reason, setReason] = useState(LEAVING_REASONS[0])
  const [power, setPower] = useState('')
  const [chargePower, setChargePower] = useState(true)
  const [who, setWho] = useState({
    name: '',
    phone: '',
    guardianName: '',
    guardianPhone: '',
    occupation: '',
  })

  const tenant = room.tenant
  const incoming = room.incoming
  const leaving = tenant && today ? hasNotice(tenant, today) : false

  const close = () => {
    setOpen(null)
    setNote('')
    setDate('')
    setReason(LEAVING_REASONS[0])
    setPower('')
    setChargePower(true)
    setRentValue(room.rent)
    setWho({ name: '', phone: '', guardianName: '', guardianPhone: '', occupation: '' })
  }

  const toggle = (form: Form, defaults?: () => void) => () => {
    if (open === form) return close()
    close()
    defaults?.()
    setOpen(form)
  }

  /* Until the browser reports a date there is nothing safe to write: every
     action here is dated, and the build's idea of "today" is months stale by
     the time anyone reads this. */
  if (!today) {
    return <div className="mt-5 min-h-11 border-t border-line pt-5" />
  }

  const startCheck = canStart(tenancies, building.number, room.room, addDays(today, 1), today)
  const estimate = tenant
    ? estimatePower(building.number, room.room, date || today, billing.bills)
    : null

  return (
    <div className="mt-5 border-t border-line pt-5">
      <div className="flex flex-wrap gap-2">
        {!tenant && !incoming && (
          <Button variant="secondary" size="sm" onClick={toggle('move-in', () => setDate(today))}>
            <UserRoundCheck size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
            Catat penghuni masuk
          </Button>
        )}

        {!tenant && incoming && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                apply((s) => moveInEarly(s, incoming, today))
                show(moveInToast(ctx, room.room, incoming.name, today))
                close()
              }}
            >
              <UserRoundCheck size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
              Konfirmasi masuk lebih awal
            </Button>
            <Button variant="warn" size="sm" onClick={toggle('move-out', () => setDate(today))}>
              <CalendarX size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
              Batalkan
            </Button>
          </>
        )}

        {tenant && !leaving && (
          <Button
            variant="warn"
            size="sm"
            onClick={toggle('notice', () => setDate(addDays(today, 30)))}
          >
            <CalendarClock size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
            Catat kontrak akan habis
          </Button>
        )}

        {tenant && leaving && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={toggle('move-out', () => setDate(tenant.leavingOn ?? today))}
            >
              <DoorOpen size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
              Catat keluar
            </Button>
            {/* Not "Batalkan pemberitahuan". A tenancy ending and a tenant
                leaving are different things — most of the time they simply
                renew, and that is what this records. */}
            <Button variant="restore" size="sm" onClick={toggle('notice-cancel')}>
              <UserRoundCheck size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
              Kontrak dilanjutkan
            </Button>
            {startCheck.ok && (
              <Button
                variant="secondary"
                size="sm"
                onClick={toggle('move-in', () => setDate(addDays(tenant.leavingOn ?? today, 1)))}
              >
                <UserRoundPlus size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
                Jadwalkan pengganti
              </Button>
            )}
          </>
        )}

        {tenant && (
          <Button
            variant="secondary"
            size="sm"
            onClick={toggle('tenant-rent', () => setRentValue(tenant.agreedRent))}
          >
            <Tag size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
            Ubah sewa penghuni
          </Button>
        )}

        {tenant && !leaving && (
          <Button variant="warn" size="sm" onClick={toggle('move-out', () => setDate(today))}>
            <DoorOpen size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
            Catat keluar
          </Button>
        )}
      </div>

      {/* The room's own settings, not the tenant's. */}
      <div className="mt-3 flex flex-wrap gap-2 border-t border-dashed border-line pt-3">
        <Button variant="ghost" size="sm" onClick={toggle('rent', () => setRentValue(room.rent))}>
          <Tag size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
          Harga kamar
        </Button>
        <Button variant={room.blocked ? 'restore' : 'warn'} size="sm" onClick={toggle('block')}>
          <Wrench size={16} strokeWidth={1.75} aria-hidden className="mr-2" />
          {room.blocked ? 'Buka blokir' : 'Blokir untuk perbaikan'}
        </Button>
      </div>

      <Disclosure open={open === 'move-in'}>
        <form
          className="mt-4 rounded-card bg-canvas p-4"
          onSubmit={(e) => {
            e.preventDefault()
            const check = canStart(tenancies, building.number, room.room, date, today)
            if (!check.ok) {
              setNote(check.reason)
              return
            }
            apply((s) =>
              startTenancy(s, {
                building: building.number,
                room: room.room,
                ...who,
                movedIn: date,
                agreedRent: rent,
              }),
            )
            show(moveInToast(ctx, room.room, who.name, date))
            close()
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label>
              <span className={label}>Nama penghuni</span>
              <input
                required
                autoFocus
                value={who.name}
                onChange={(e) => setWho({ ...who, name: e.target.value })}
                className={field}
              />
            </label>
            <label>
              <span className={label}>Nomor HP</span>
              <input
                required
                value={who.phone}
                onChange={(e) => setWho({ ...who, phone: e.target.value })}
                placeholder="0812 xxxx 3456"
                className={field}
              />
            </label>
            <label>
              <span className={label}>Nama orang tua / wali</span>
              <input
                required
                value={who.guardianName}
                onChange={(e) => setWho({ ...who, guardianName: e.target.value })}
                className={field}
              />
            </label>
            <label>
              <span className={label}>HP orang tua / wali</span>
              <input
                required
                value={who.guardianPhone}
                onChange={(e) => setWho({ ...who, guardianPhone: e.target.value })}
                placeholder="0813 xxxx 5432"
                className={field}
              />
            </label>
            <label>
              <span className={label}>Pekerjaan / kampus</span>
              <input
                required
                value={who.occupation}
                onChange={(e) => setWho({ ...who, occupation: e.target.value })}
                placeholder="mis. Mahasiswa Untar"
                className={field}
              />
            </label>
            <label>
              <span className={label}>Tanggal masuk</span>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={field}
              />
              <span className="mt-1.5 block text-[12px] text-ink-soft">
                Jatuh tempo tiap bulan mengikuti tanggal ini.
              </span>
            </label>
            <RupiahInput
              label="Sewa disepakati"
              value={rent}
              onChange={setRentValue}
              required
              hint={`Harga kamar sekarang ${formatRupiah(room.rent)}. Yang tercatat di sini yang ditagih.`}
            />
          </div>
          {note && (
            <p role="alert" className="mt-3 text-[13px] font-semibold text-held">
              {note}
            </p>
          )}
          <Confirm onCancel={close} className="mt-4" />
        </form>
      </Disclosure>

      <Disclosure open={open === 'notice' && Boolean(tenant)}>
        {tenant && (
          <form
            className="mt-4 flex flex-wrap items-end gap-3 rounded-card bg-canvas p-4"
            onSubmit={(e) => {
              e.preventDefault()
              apply((s) => giveNotice(s, tenant, date))
              show(noticeToast(ctx, room.room, tenant.name, date))
              close()
            }}
          >
            <label className="flex-1 basis-52">
              <span className={label}>Kontrak {tenant.name} habis tanggal</span>
              <input
                type="date"
                required
                autoFocus
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={field}
              />
              <span className="mt-1.5 block text-[12px] text-ink-soft">
                Kamar tetap terisi sampai keluarnya dikonfirmasi — penghuni masih bisa
                memperpanjang. Sementara itu pengganti sudah boleh dijadwalkan.
              </span>
            </label>
            <Confirm onCancel={close} />
          </form>
        )}
      </Disclosure>

      <Disclosure open={open === 'notice-cancel' && Boolean(tenant)}>
        {tenant && (
          <form
            className="mt-4 flex flex-wrap items-end gap-3 rounded-card bg-canvas p-4"
            onSubmit={(e) => {
              e.preventDefault()
              apply((s) => cancelNotice(s, tenant, note.trim()))
              show(noticeCancelledToast(ctx, room.room, tenant.name))
              close()
            }}
          >
            <label className="min-w-0 flex-1 basis-60">
              <span className={label}>Alasan lanjut</span>
              <input
                required
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="mis. kontrak kerjanya diperpanjang"
                className={field}
              />
            </label>
            <Confirm onCancel={close} />
          </form>
        )}
      </Disclosure>

      <Disclosure open={open === 'move-out' && Boolean(tenant || incoming)}>
        {(tenant || incoming) && (
          <form
            className="mt-4 flex flex-wrap items-end gap-3 rounded-card bg-canvas p-4"
            onSubmit={(e) => {
              e.preventDefault()
              const going = tenant ?? incoming!
              const why = reason === 'Lainnya' ? note.trim() : reason
              const owed = Number(String(power || estimate?.amount || 0).replace(/\D/g, ''))

              apply((s) => {
                let next = endTenancy(
                  s,
                  going,
                  date,
                  why + (note.trim() && reason !== 'Lainnya' ? ` — ${note.trim()}` : ''),
                )
                if (!tenant) return next

                /* Electricity is settled here or not at all: PLN invoices this
                   room after the month ends, by which time this person has gone
                   and there is nothing left to deduct it from. */
                if (chargePower && owed > 0) {
                  next = addCharge(
                    next,
                    {
                      tenancy: going.id,
                      kind: 'listrik',
                      period: monthOf(date),
                      amount: owed,
                      dueOn: date,
                      days: { from: 1, to: parseDate(date).getDate() },
                      // Untouched means the pro-rata figure stood, which is a
                      // guess and says so on the record.
                      estimated: !power,
                    },
                    { building: building.number, room: room.room, label: 'Listrik sampai keluar' },
                  )
                } else if (!chargePower) {
                  // Declining is a choice somebody will be asked about later, so
                  // it is logged rather than simply absent.
                  next = addCharge(
                    next,
                    {
                      tenancy: going.id,
                      kind: 'listrik',
                      period: monthOf(date),
                      amount: 0,
                      dueOn: date,
                      note: 'Tidak ditagihkan saat keluar',
                    },
                    {
                      building: building.number,
                      room: room.room,
                      label: 'Listrik tidak ditagihkan',
                    },
                  )
                }
                return next
              })
              show(moveOutToast(ctx, room.room, going.name, date))
              close()
            }}
          >
            <label className="basis-44">
              <span className={label}>Tanggal keluar</span>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={field}
              />
            </label>
            <label className="basis-48">
              <span className={label}>Alasan</span>
              <Select
                variant="field"
                label="Alasan keluar"
                value={reason}
                onChange={setReason}
                options={LEAVING_REASONS.map((r) => ({ value: r, label: r }))}
              />
            </label>
            <label className="min-w-0 flex-1 basis-52">
              <span className={label}>Catatan {reason === 'Lainnya' ? '' : '(opsional)'}</span>
              <input
                required={reason === 'Lainnya'}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={field}
              />
              <span className="mt-1.5 block text-[12px] text-ink-soft">
                Kamar jadi kosong terhitung tanggal keluar.
              </span>
            </label>

            {/* Electricity, settled here and nowhere else.
                PLN invoices this room after the month ends, by which time the
                tenant has gone — no deposit to hold it back from, no next rent to
                deduct it from. The only certain moment to collect is while they
                are still standing here. */}
            {tenant && (
              <div className="basis-full rounded-card border border-line bg-paper p-3">
                <label className="flex flex-wrap items-end gap-3">
                  <span className="min-w-0 flex-1 basis-56">
                    <span className={label}>Listrik sampai tanggal keluar</span>
                    <span className="flex items-center gap-2">
                      <input
                        inputMode="numeric"
                        disabled={!chargePower}
                        value={power}
                        onChange={(e) => setPower(e.target.value)}
                        placeholder={estimate ? String(estimate.amount) : 'ketik jumlahnya'}
                        className={cn(
                          field,
                          'text-right font-figure',
                          !chargePower && 'opacity-40',
                        )}
                      />
                    </span>
                    <span className="mt-1.5 block text-[12px] text-ink-soft">
                      {estimate
                        ? `Taksiran ${estimate.days}/${daysInMonthOf(monthOf(date || today))} × ${formatRupiah(estimate.basis.amount)} bulan lalu. Timpa kalau meteran sudah dibaca.`
                        : 'Belum ada tagihan bulan sebelumnya untuk ditaksir — isi dari meteran.'}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2 pb-2.5">
                    <input
                      type="checkbox"
                      checked={!chargePower}
                      onChange={(e) => setChargePower(!e.target.checked)}
                      className="size-4 accent-plum"
                    />
                    <span className="text-[13px]">Tidak ditagihkan</span>
                  </span>
                </label>
              </div>
            )}

            <Confirm onCancel={close} />
          </form>
        )}
      </Disclosure>

      <Disclosure open={open === 'tenant-rent' && Boolean(tenant)}>
        {tenant && (
          <FieldRow
            className="sm:grid-cols-[13rem_1fr_auto]"
            onSubmit={(e) => {
              e.preventDefault()
              apply((s) => setAgreedRent(s, tenant, rent, note.trim()))
              show(tenantRentToast(ctx, room.room, tenant.name, tenant.agreedRent, rent))
              close()
            }}
          >
            <RupiahInput
              label={`Sewa ${tenant.name}`}
              value={rent}
              onChange={setRentValue}
              required
            />
            {/* Required here, unlike the room's asking price: this changes what
                a real person pays, which is the entry somebody asks about. */}
            <Field
              label="Alasan"
              hint="Hanya penghuni ini. Harga kamar untuk penghuni berikutnya tidak berubah."
            >
              <input
                required
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="mis. penyesuaian tahunan, sudah disepakati"
                className={field}
              />
            </Field>
            <FieldActions>
              <Button size="sm" type="submit">
                Simpan
              </Button>
              <Button variant="ghost" size="sm" onClick={close}>
                Batal
              </Button>
            </FieldActions>
          </FieldRow>
        )}
      </Disclosure>

      <Disclosure open={open === 'rent'}>
        <FieldRow
          className="sm:grid-cols-[13rem_1fr_auto]"
          onSubmit={(e) => {
            e.preventDefault()
            apply((s) => setRent(s, building.number, room, rent, note.trim()))
            show(rentToast(ctx, room.room, room.rent, rent))
            close()
          }}
        >
          <RupiahInput
            label="Harga kamar baru"
            value={rent}
            onChange={setRentValue}
            required
            autoFocus
            hint={
              tenant
                ? `Berlaku untuk penghuni berikutnya. ${tenant.name} tetap di ${formatRupiah(tenant.agreedRent)}.`
                : 'Berlaku untuk penghuni berikutnya.'
            }
          />
          {/* Optional, and it did not used to be. The reason was required back
                when a room's rent was also the tenant's; since a tenant carries
                their own agreed rent with its own logged action, changing the
                asking price affects nobody's money today. Demanding a sentence
                for it produced sentences typed to get past the form. */}
          <Field label="Catatan (opsional)">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="mis. setelah renovasi kamar mandi"
              className={field}
            />
          </Field>
          <FieldActions>
            <Button size="sm" type="submit">
              Simpan
            </Button>
            <Button variant="ghost" size="sm" onClick={close}>
              Batal
            </Button>
          </FieldActions>
        </FieldRow>
      </Disclosure>

      <Disclosure open={open === 'block'}>
        <form
          className="mt-4 flex flex-wrap items-end gap-3 rounded-card bg-canvas p-4"
          onSubmit={(e) => {
            e.preventDefault()
            apply((s) =>
              setBlocked(
                s,
                building.number,
                room,
                room.blocked ? null : { since: today, note: note.trim() },
                note.trim(),
              ),
            )
            show(blockToast(ctx, room.room, !room.blocked))
            close()
          }}
        >
          <label className="min-w-0 flex-1 basis-60">
            <span className={label}>Alasan</span>
            <input
              required
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                room.blocked ? 'mis. perbaikan selesai' : 'mis. ganti keramik kamar mandi'
              }
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
      </Disclosure>

      {incoming && tenant && (
        <p className="mt-4 flex items-center gap-2 rounded-card bg-stone px-4 py-3 text-[13px]">
          <UserRoundPlus size={15} strokeWidth={1.9} aria-hidden className="shrink-0 text-plum" />
          <span>
            <strong className="font-semibold">{incoming.name}</strong> menggantikan {tenant.name},
            masuk {formatDate(incoming.movedIn)}.
          </span>
        </p>
      )}
    </div>
  )
}

function Confirm({ onCancel, className }: { onCancel: () => void; className?: string }) {
  return (
    <div className={`flex shrink-0 gap-2 ${className ?? ''}`}>
      <Button size="sm" type="submit">
        Simpan
      </Button>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Batal
      </Button>
    </div>
  )
}
