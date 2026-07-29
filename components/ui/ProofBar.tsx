type ProofItem = { value: string; label: string }

/**
 * The figures that make the brand's claims checkable: founding year, buildings,
 * rooms, average tenure. Numerals in Archivo Expanded, no icons — the numbers
 * carry it.
 *
 * Dividers are 1px grid gaps showing the container colour through, so they land
 * correctly at any column count without per-item border rules.
 */
export function ProofBar({ items }: { items: readonly ProofItem[] }) {
  return (
    <div className="border-y border-line bg-line">
      <ul className="grid grid-cols-2 gap-px lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.label} className="flex flex-col gap-0.5 bg-paper px-6 py-5">
            <span className="numeral text-[32px] leading-none text-ink">{item.value}</span>
            <span className="text-[13px] text-ink-soft">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
