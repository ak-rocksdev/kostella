'use client'

import { Select } from '@/components/ui/Select'
import { buildingName, type Building } from '@/lib/content/management/buildings'

export const ALL_BUILDINGS = '__all__'

/**
 * Narrow a management screen to one building.
 *
 * Every screen in the panel carries this and each had written its own copy of
 * the option list — six of them by phase 4, so a change to how a building is
 * labelled here meant six edits.
 */
export function ScopeSelect({
  buildings,
  value,
  onChange,
}: {
  buildings: Building[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Select
      label="Lingkup"
      align="end"
      value={value}
      onChange={onChange}
      options={[
        { value: ALL_BUILDINGS, label: 'Semua gedung', detail: `${buildings.length} gedung` },
        ...buildings.map((b) => ({
          value: b.number,
          label: buildingName(b, buildings),
          detail: b.district,
        })),
      ]}
    />
  )
}

/** The name of the building a record points at. Was rewritten in three files. */
export const buildingNamer = (buildings: Building[]) => (number: string) => {
  const b = buildings.find((x) => x.number === number)
  return b ? buildingName(b, buildings) : `Kostella ${number}`
}
