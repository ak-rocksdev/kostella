'use client'

import { useState } from 'react'
import { Segmented } from '@/components/ui/Segmented'
import { useManagement } from '@/lib/management/useManagement'
import { ACTION_LABEL, describe, when } from './log'
import type { AuditEntry } from '@/lib/management/store'

/**
 * Every change anyone made, newest first.
 *
 * Append-only: a mistake is corrected by another logged change, never by
 * editing or deleting an entry. That is what makes this an audit trail rather
 * than a status field with a date attached.
 *
 * These questions arrive as disputes, long after the fact — who marked 211
 * taken, why is this tenant's rent below the listed price — and are
 * unanswerable unless the record was kept at the time.
 */
export function ActivityLog() {
  const { log, buildings } = useManagement()
  const [building, setBuilding] = useState<string | null>(null)
  const [action, setAction] = useState<AuditEntry['action'] | null>(null)

  const matches = (e: AuditEntry) =>
    (!building || e.building === building) && (!action || e.action === action)

  const visible = log.filter(matches)
  const countWith = (o: Partial<{ building: string | null; action: AuditEntry['action'] | null }>) =>
    log.filter(
      (e) =>
        (!(o.building ?? building) || e.building === (o.building ?? building)) &&
        (!(o.action ?? action) || e.action === (o.action ?? action)),
    ).length

  return (
    <div className="wrap-wide py-8 sm:py-10">
      <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.02em]">Aktivitas</h1>
      <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.6] text-ink-soft">
        Setiap perubahan tercatat: siapa, kapan, dari nilai berapa ke berapa. Catatan tidak bisa
        disunting atau dihapus — koreksi dilakukan dengan perubahan baru, yang juga tercatat.
      </p>

      {log.length > 0 && (
        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <Segmented
            legend="Gedung"
            value={building}
            onChange={setBuilding}
            options={[
              { value: null, label: 'Semua gedung', count: countWith({ building: null }) },
              ...buildings.map((b) => ({
                value: b.number,
                label: b.number,
                count: countWith({ building: b.number }),
              })),
            ]}
          />
          <Segmented
            legend="Jenis perubahan"
            value={action}
            onChange={setAction}
            options={[
              { value: null, label: 'Semua jenis', count: countWith({ action: null }) },
              ...(Object.keys(ACTION_LABEL) as AuditEntry['action'][])
                .map((a) => ({ value: a, label: ACTION_LABEL[a], count: countWith({ action: a }) }))
                .filter((o) => o.count > 0),
            ]}
          />
        </div>
      )}

      {visible.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-2.5">
          {visible.map((entry) => (
            <li key={entry.id} className="rounded-card bg-paper p-4 shadow-card sm:p-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="rounded-badge bg-stone px-1.5 py-0.5 font-figure text-[13px] font-semibold">
                  {entry.building}
                  {entry.room ? `/${entry.room}` : ''}
                </span>
                <span className="text-[15px] font-semibold">{describe(entry)}</span>
                <span className="ml-auto text-[13px] whitespace-nowrap text-ink-soft">
                  {when(entry.at)}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] text-ink-soft">
                {entry.actor}
                {entry.note && <> · “{entry.note}”</>}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        // The log is empty on a fresh demo — which is exactly when a client is
        // looking at it. Say what will appear rather than "tidak ada data".
        <div className="mt-6 rounded-card border border-dashed border-line px-6 py-10 text-center">
          <p className="text-[16px] font-semibold">
            {log.length === 0 ? 'Belum ada perubahan.' : 'Tidak ada yang cocok dengan filter.'}
          </p>
          <p className="mx-auto mt-2 max-w-[52ch] text-[14px] leading-[1.6] text-ink-soft">
            {log.length === 0
              ? 'Begitu ada kamar yang ditandai terisi, harga yang diubah, atau fasilitas yang dicentang, catatannya muncul di sini beserta siapa dan kapan.'
              : 'Coba lepas salah satu filter di atas.'}
          </p>
        </div>
      )}
    </div>
  )
}
