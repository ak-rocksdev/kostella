'use client'

import { useRouter } from 'next/navigation'
import { Select } from '@/components/ui/Select'
import { buildingName, occupancy, type Building } from '@/lib/content/management/buildings'
import { useManagement } from '@/lib/management/useManagement'

/**
 * The `362 ▾` control from the design bundle's dashboard.
 *
 * Every option carries its free-room count, because that is what decides which
 * building a manager opens next — a bare list of names makes them open one to
 * find out.
 */
export function BuildingSwitcher({ current }: { current: string }) {
  const router = useRouter()
  const { buildings } = useManagement()

  const detail = (b: Building) => {
    const o = occupancy(b)
    const parts = [`${o.free} kosong`]
    if (o.held > 0) parts.push(`${o.held} dibooking`)
    if (o.blocked > 0) parts.push(`${o.blocked} diblokir`)
    return `${b.district} · ${parts.join(' · ')}`
  }

  return (
    <Select
      label="Gedung"
      value={current}
      onChange={(next) => router.push(`/management/buildings/${next}`)}
      options={buildings.map((b) => ({
        value: b.number,
        label: buildingName(b, buildings),
        detail: detail(b),
      }))}
    />
  )
}
