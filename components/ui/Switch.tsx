'use client'

import { cn } from '@/lib/cn'

/**
 * A boolean filter.
 *
 * `role="switch"` rather than a pressed button: the two differ to a screen
 * reader, and "on/off" is what this actually is. The label is a real `<span>`
 * inside the control, so the whole row is the hit target — a 44px thumb beside
 * unclickable text is a target people miss.
 */
export function Switch({
  checked,
  onChange,
  children,
  count,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  children: React.ReactNode
  /** Result count if this were on. Read by sighted users from the label. */
  count?: number
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2 text-[14px] font-medium whitespace-nowrap transition-colors duration-200',
        checked
          ? 'border-ink bg-ink text-stone'
          : 'border-line bg-paper text-ink hover:border-ink-soft',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'relative inline-block h-[18px] w-[30px] shrink-0 rounded-full transition-colors duration-200',
          checked ? 'bg-stone' : 'bg-line',
        )}
      >
        <span
          className={cn(
            'absolute top-[3px] left-[3px] size-3 rounded-full transition-[translate] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
            checked ? 'translate-x-3 bg-ink' : 'bg-paper',
          )}
        />
      </span>
      {children}
      {count != null && (
        <span
          aria-hidden
          className={cn('font-figure text-[13px]', checked ? 'text-stone/70' : 'text-ink-soft')}
        >
          {count}
        </span>
      )}
    </button>
  )
}
