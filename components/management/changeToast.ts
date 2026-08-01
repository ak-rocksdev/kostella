import {
  CalendarClock,
  Check,
  DoorOpen,
  Tag,
  UserRoundCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { ToastInput } from '@/components/ui/Toast'
import { formatDate } from '@/lib/dates'
import { formatRupiah } from '@/lib/format'

/**
 * The confirmation for one change, composed in one place.
 *
 * Every screen that writes calls this, so the same change never gets announced
 * two different ways — the same reason `describe()` composes the audit log's
 * sentences. Both read from the change, not from whoever wrote the call site.
 *
 * The wording names what happened. "Berhasil disimpan" tells a manager nothing
 * they could check; "Kamar 105 · sewa jadi Rp1.800.000" is the fact they can.
 */

const withRoom = (building: string, room: string, rest: string) =>
  `Kamar ${room} · ${rest}`

const recorded = (actor: string): Pick<ToastInput, 'detail' | 'action'> => ({
  detail: `Tercatat atas ${actor}`,
  // Reinforces that everything here is audited, and gives the follow-through a
  // place to go.
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})

type Args = { building: string; actor: string }

/* Tenants. `statusToast` stood here and went with `setStatus`: a room is no
   longer marked taken, somebody moves into it. */

export const moveInToast = (
  { building, actor }: Args,
  room: string,
  name: string,
  movedIn: string,
): ToastInput => ({
  title: withRoom(building, room, `${name} masuk`),
  detail: `Mulai ${formatDate(movedIn)} · tercatat atas ${actor}`,
  icon: UserRoundCheck as LucideIcon,
  tone: 'success',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})

export const noticeToast = (
  { building, actor }: Args,
  room: string,
  name: string,
  leavingOn: string,
): ToastInput => ({
  title: withRoom(building, room, `${name} akan keluar ${formatDate(leavingOn)}`),
  // Says the thing a manager acts on, not merely that a field changed.
  detail: `Kamar masih terisi sampai dikonfirmasi · tercatat atas ${actor}`,
  icon: CalendarClock as LucideIcon,
  tone: 'attention',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})

export const noticeCancelledToast = (
  { building, actor }: Args,
  room: string,
  name: string,
): ToastInput => ({
  title: withRoom(building, room, `${name} jadi tetap tinggal`),
  ...recorded(actor),
  icon: Check as LucideIcon,
  tone: 'success',
})

export const moveOutToast = (
  { building, actor }: Args,
  room: string,
  name: string,
  endedOn: string,
): ToastInput => ({
  title: withRoom(building, room, `${name} keluar`),
  detail: `Kamar kosong sejak ${formatDate(endedOn)} · tercatat atas ${actor}`,
  icon: DoorOpen as LucideIcon,
  tone: 'success',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})

export const tenantRentToast = (
  { building, actor }: Args,
  room: string,
  name: string,
  from: number,
  to: number,
): ToastInput => ({
  title: withRoom(building, room, `sewa ${name} ${formatRupiah(from)} → ${formatRupiah(to)}`),
  ...recorded(actor),
  icon: Tag as LucideIcon,
  tone: 'success',
})

export const rentToast = (
  { building, actor }: Args,
  room: string,
  from: number,
  to: number,
): ToastInput => ({
  title: withRoom(building, room, `harga jadi ${formatRupiah(to)}`),
  detail: `Dari ${formatRupiah(from)} · berlaku untuk penghuni berikutnya · ${actor}`,
  icon: Tag as LucideIcon,
  tone: 'success',
  ...recorded(actor),
})

export const blockToast = (
  { building, actor }: Args,
  room: string,
  blocked: boolean,
): ToastInput => ({
  title: withRoom(building, room, blocked ? 'diblokir untuk perbaikan' : 'blokir dibuka'),
  // The one place a manager should feel the weight: a blocked room leaves the
  // public site entirely.
  detail: blocked
    ? `Hilang dari halaman publik · tercatat atas ${actor}`
    : `Kembali tampil di halaman publik · tercatat atas ${actor}`,
  icon: Wrench as LucideIcon,
  // Blocking withdraws a room from letting — the mark matches the amber cell it
  // just created. Unblocking puts it back, which is a plain success.
  tone: blocked ? 'attention' : 'success',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})

export const facilityToast = (
  { actor }: Args,
  facility: string,
  on: boolean,
): ToastInput => ({
  title: `${facility} ${on ? 'ditambahkan' : 'dihapus'}`,
  detail: `Kartu properti, hasil pencarian, dan filter ikut berubah · ${actor}`,
  icon: Check as LucideIcon,
  tone: 'success',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})

export const tenancyToast = (
  { actor }: Args,
  to: string,
): ToastInput => ({
  title: `Tipe penghuni jadi ${to}`,
  detail: `Kartu properti dan filter pencarian ikut berubah · ${actor}`,
  icon: Check as LucideIcon,
  tone: 'success',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})
