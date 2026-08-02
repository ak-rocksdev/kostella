import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * A label, a control, and an optional hint, in a row that lines up.
 *
 * The forms in the room panel were `flex … items-end`, which aligns the bottoms
 * of the columns. A column carrying a hint underneath is taller, so its label
 * and its field both sat lower than the ones beside them — visible as soon as
 * one field explained itself and its neighbour did not.
 *
 * `subgrid` puts every label on one line and every control on the next by
 * construction, whatever is underneath them.
 */
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('row-span-3 grid min-w-0 grid-rows-subgrid content-start', className)}>
      <span className="mb-1.5 block text-[13px] font-semibold">{label}</span>
      {children}
      {/* Rendered whether or not there is a hint, so the third row exists and
          the column keeps its place in the grid. */}
      <span className="mt-1.5 block text-[12px] leading-[1.45] text-ink-soft">{hint}</span>
    </label>
  )
}

/** The row those fields sit in. Callers set the columns with `className`. */
export function FieldRow({
  children,
  className,
  ...rest
}: {
  children: ReactNode
  className?: string
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'className'>) {
  return (
    <form
      className={cn(
        'mt-4 grid grid-cols-1 items-start gap-x-3 gap-y-1 rounded-card bg-canvas p-4',
        className,
      )}
      style={{ gridTemplateRows: 'auto auto auto' }}
      {...rest}
    >
      {children}
    </form>
  )
}

/** Buttons that sit on the control row rather than above or below it. */
export function FieldActions({ children }: { children: ReactNode }) {
  return (
    <div className="row-span-3 grid grid-rows-subgrid content-start">
      <span />
      <div className="flex shrink-0 gap-2">{children}</div>
      <span />
    </div>
  )
}
