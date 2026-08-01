'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { useToast } from '@/components/ui/Toast'
import { facilityToast, tenancyToast } from './changeToast'
import {
  FACILITIES,
  tenancyLabel,
  type Building,
  type FacilityId,
  type TenancyId,
} from '@/lib/content/management/buildings'
import { setFacilities, setTenancy } from '@/lib/management/store'
import { useManagement } from '@/lib/management/useManagement'

const TENANCIES: TenancyId[] = ['putri', 'putra', 'campur']

/**
 * What the building offers, and who it takes.
 *
 * Both are building-wide facts that appear on every public card, so both are
 * edited here and logged like any room change.
 *
 * A tick here travels further than a room status does. Facilities feed the
 * property card's tags, the search result line, **and the search screen's
 * filter chips**, which are built from whatever the buildings actually offer.
 * Ticking Laundry moves its chip from one building to two — the filter itself
 * changes, not just a row of text. The note beneath says so, because a manager
 * should not have to guess how far a tick reaches.
 *
 * Values are ids from a fixed list, never free text: `facilityFacet` groups the
 * chips by exact string, so "WiFi" beside "Wifi" would silently become two
 * filters each matching half the inventory.
 */
export function FacilitiesPanel({ building }: { building: Building }) {
  const { apply, actor } = useManagement()
  const { show } = useToast()
  const ctx = { building: building.number, actor }

  const toggle = (id: FacilityId, label: string) => {
    const before = building.facilities
    const after = before.includes(id) ? before.filter((f) => f !== id) : [...before, id]
    apply((s) => setFacilities(s, building.number, before, after, id, label))
    show(facilityToast(ctx, label, after.includes(id)))
  }

  return (
    <section className="rounded-card bg-paper p-5 shadow-card sm:p-6">
      <SectionLabel>Fasilitas &amp; tipe penghuni</SectionLabel>
      <p className="mt-2 text-[13px] leading-[1.5] text-ink-soft">
        Muncul di kartu properti, hasil pencarian, dan filter fasilitas.
      </p>

      <ul className="mt-5 flex flex-col gap-1">
        {FACILITIES.map((facility) => {
          const on = building.facilities.includes(facility.id)
          return (
            <li key={facility.id}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-badge px-2 text-[15px] transition-colors hover:bg-canvas has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-plum">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(facility.id, facility.label)}
                  className="size-4 accent-plum"
                />
                {facility.label}
              </label>
            </li>
          )
        })}
      </ul>

      <fieldset className="mt-6 border-t border-line pt-5">
        <legend className="sr-only">Tipe penghuni</legend>
        <p className="mb-3 text-[13px] font-semibold">Tipe penghuni</p>
        <div className="flex flex-wrap gap-2">
          {TENANCIES.map((id) => {
            const on = building.tenancy === id
            return (
              <label
                key={id}
                className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[14px] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum ${
                  on
                    ? 'border-ink bg-ink text-stone'
                    : 'border-line bg-paper text-ink hover:border-ink-soft'
                }`}
              >
                <input
                  type="radio"
                  name={`tenancy-${building.number}`}
                  className="sr-only"
                  checked={on}
                  onChange={() => {
                    apply((s) =>
                      setTenancy(
                        s,
                        building.number,
                        tenancyLabel[building.tenancy],
                        id,
                        tenancyLabel[id],
                      ),
                    )
                    show(tenancyToast(ctx, tenancyLabel[id]))
                  }}
                />
                {tenancyLabel[id]}
              </label>
            )
          })}
        </div>
      </fieldset>
    </section>
  )
}
