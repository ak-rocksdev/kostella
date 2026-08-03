'use client'

import { Select } from '@/components/ui/Select'
import { buildingName, type Building } from '@/lib/content/management/buildings'

/**
 * The frame an owner sees.
 *
 * Its own shell, decided before it was built. A partner logging into the
 * manager's panel would find "Penghuni" and "Tagihan" in the navigation — a
 * menu of things they must not open. That is the wrong model, not a permissions
 * bug to patch later, so this shares the design system and the records with
 * `/management` and nothing else. There is no link from here to there.
 *
 * The navigation is a building, not a menu: an owner has one, or a few, and
 * each is its own answer. Nothing else to go to means nothing else to build.
 */
export function OwnerShell({
  buildings,
  selected,
  onSelect,
  children,
}: {
  buildings: Building[]
  selected: string
  onSelect: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-20 border-b border-line bg-canvas">
        <div className="wrap flex flex-wrap items-center gap-x-4 gap-y-2 py-2.5 sm:h-16 sm:flex-nowrap sm:py-0">
          <span className="inline-flex min-h-11 items-center text-[20px] font-semibold tracking-[-0.01em] whitespace-nowrap">
            Kostella <span className="font-medium text-ink-soft">Pemilik</span>
          </span>

          {/* Chosen, not authenticated, and labelled so — there is no login in
              this prototype and pretending otherwise would be the one dishonest
              thing on a screen about somebody's money. A real deployment
              resolves the owner from a session and drops this. */}
          <div className="ml-auto shrink-0">
            <Select
              label="Masuk sebagai"
              align="end"
              value={selected}
              onChange={onSelect}
              options={buildings.map((b) => ({
                value: b.number,
                label: `Pemilik ${buildingName(b, buildings)}`,
                detail: `${b.district}, ${b.city}`,
              }))}
            />
          </div>
        </div>
      </header>

      <p className="border-b border-held/30 bg-held-soft px-4 py-2 text-center text-[13px] text-held">
        Prototipe — angka di sini contoh, dan tidak ada login.
      </p>

      <main className="flex-1">{children}</main>

      <footer className="mt-12 border-t border-line">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-[13px] text-ink-soft">
          <span>Kostella Pemilik · prototipe</span>
          {/* Says what this screen deliberately does not carry, so an owner is
              not left wondering whether it is missing or withheld. */}
          <span>Data penghuni tidak ditampilkan di sini.</span>
        </div>
      </footer>
    </div>
  )
}
