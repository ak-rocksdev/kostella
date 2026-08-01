'use client'

import { useManagement } from '@/lib/management/useManagement'
import { describe, when } from './log'

/**
 * The selected room's last five changes, read straight from the audit log.
 *
 * "Why is this room still blocked" and "who dropped this rent" are answered
 * where the question is asked, without a trip to the log screen. Five is enough
 * to see the recent story and short enough not to bury the actions above it.
 */
export function RoomHistory({ building, room }: { building: string; room: string }) {
  const { log } = useManagement()
  const entries = log.filter((e) => e.building === building && e.room === room).slice(0, 5)

  if (entries.length === 0) return null

  return (
    <div className="mt-5 border-t border-line pt-5">
      <p className="text-[13px] font-semibold text-ink-soft">Riwayat kamar {room}</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {entries.map((entry) => (
          <li key={entry.id} className="text-[13px] leading-[1.5]">
            <span className="text-ink">{describe(entry)}</span>{' '}
            <span className="text-ink-soft">
              · {entry.actor} · {when(entry.at)}
            </span>
            {entry.note && <span className="block text-ink-soft">“{entry.note}”</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
