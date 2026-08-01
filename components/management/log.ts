import { formatRupiah } from '@/lib/format'
import type { AuditEntry } from '@/lib/management/store'

/**
 * One sentence per log entry, shared by the room history and the activity
 * screen so the same change never reads two ways.
 *
 * Rents are stored as numbers in the log, not as formatted strings, so the
 * figure can be rendered here in the same format as everywhere else. A log that
 * spelled its own rupiah would drift from the rest of the site the first time
 * the format changed.
 */
export function describe(entry: AuditEntry): string {
  switch (entry.action) {
    case 'status':
      return `Status ${entry.from} → ${entry.to}${
        entry.effectiveFrom ? `, berlaku ${entry.effectiveFrom}` : ''
      }`
    case 'rent':
      return `Sewa ${formatRupiah(Number(entry.from))} → ${formatRupiah(Number(entry.to))}`
    case 'block':
      return 'Diblokir untuk perbaikan'
    case 'unblock':
      return 'Blokir dibuka'
    case 'facility':
      return `Fasilitas — ${entry.to}`
    case 'tenancy':
      return `Tipe penghuni ${entry.from} → ${entry.to}`
    case 'photo-add':
      return `Foto ditambahkan — ${entry.note ?? 'tanpa nama'}`
    case 'photo-remove':
      return `Foto dihapus — ${entry.note ?? 'tanpa nama'}`
    case 'photo-cover':
      return `Sampul ${entry.from} → ${entry.to}`
    case 'photo-label':
      return `Nama foto ${entry.from} → ${entry.to}`
  }
}

export const ACTION_LABEL: Record<AuditEntry['action'], string> = {
  status: 'Status kamar',
  rent: 'Harga',
  block: 'Blokir',
  unblock: 'Buka blokir',
  facility: 'Fasilitas',
  tenancy: 'Tipe penghuni',
  'photo-add': 'Foto ditambah',
  'photo-remove': 'Foto dihapus',
  'photo-cover': 'Sampul',
  'photo-label': 'Nama foto',
}

/**
 * `id-ID` with an explicit timezone, not the visitor's.
 *
 * A log read in another timezone would show a time the change did not happen
 * at. Kostella operates in Jakarta; the record is in Jakarta time.
 */
export function when(iso: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(iso))
}
