import { CalendarClock, Tag, UserRoundCheck, Wrench, type LucideIcon } from 'lucide-react'
import type { ToastInput } from '@/components/ui/Toast'
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

export const statusToast = (
  { building, actor }: Args,
  room: string,
  to: 'terisi' | 'kosong',
  effectiveFrom: string,
): ToastInput => ({
  title: withRoom(building, room, `ditandai ${to}`),
  icon: UserRoundCheck as LucideIcon,
  tone: to === 'kosong' ? 'available' : 'neutral',
  ...recorded(actor),
  detail: `Berlaku ${effectiveFrom} · tercatat atas ${actor}`,
})

export const rentToast = (
  { building, actor }: Args,
  room: string,
  from: number,
  to: number,
): ToastInput => ({
  title: withRoom(building, room, `sewa ${formatRupiah(from)} → ${formatRupiah(to)}`),
  icon: Tag as LucideIcon,
  tone: 'neutral',
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
  tone: blocked ? 'attention' : 'available',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})

export const facilityToast = (
  { actor }: Args,
  facility: string,
  on: boolean,
): ToastInput => ({
  title: `${facility} ${on ? 'ditambahkan' : 'dihapus'}`,
  detail: `Kartu properti, hasil pencarian, dan filter ikut berubah · ${actor}`,
  icon: CalendarClock as LucideIcon,
  tone: 'neutral',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})

export const tenancyToast = (
  { actor }: Args,
  to: string,
): ToastInput => ({
  title: `Tipe penghuni jadi ${to}`,
  detail: `Kartu properti dan filter pencarian ikut berubah · ${actor}`,
  tone: 'neutral',
  action: { label: 'Lihat di Aktivitas', href: '/management/activity' },
})
