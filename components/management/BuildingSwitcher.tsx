'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { buildingName } from '@/lib/content/management/buildings'
import { useManagement } from '@/lib/management/useManagement'

/**
 * The `362 ▾` control from the design bundle's dashboard.
 *
 * A native `<select>` rather than a custom menu: it gets keyboard handling,
 * type-ahead and the platform's own picker on a phone for free, and none of
 * that is worth rebuilding for a list of buildings.
 */
export function BuildingSwitcher({ current }: { current: string }) {
  const router = useRouter()
  const { buildings } = useManagement()

  return (
    <label className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum">
      <span className="sr-only">Pilih gedung</span>

      <select
        value={current}
        onChange={(e) => router.push(`/management/buildings/${e.target.value}`)}
        className="cursor-pointer appearance-none bg-transparent py-2 pr-1 text-[15px] font-semibold focus:outline-none"
      >
        {buildings.map((b) => (
          <option key={b.number} value={b.number}>
            {buildingName(b, buildings)}
          </option>
        ))}
      </select>
      <ChevronDown size={15} strokeWidth={2} aria-hidden className="text-ink-soft" />
    </label>
  )
}
