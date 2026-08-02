import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * How loud a row is allowed to be, in one place.
 *
 * Four states, four tones, and they were written out separately in the tenant
 * list, the billing list, the ledger and the electricity table — the same four
 * pairs, four times. A colour change would have needed four edits and missed
 * one, which is the failure this project's own guideline names: two things
 * answering the same question will disagree, and the wrong one survives because
 * the other is right.
 *
 * Colour never carries it alone. The chip takes words, always.
 */
export type Tone = 'late' | 'now' | 'soon' | 'done'

export const TONE_BG: Record<Tone, string> = {
  /** Something is already wrong. The only tone that also rings its container. */
  late: 'bg-held-soft text-held',
  /** Today or tomorrow — the panel's action colour, because it is an action. */
  now: 'bg-plum/10 text-plum',
  /** Days away. Deliberately quiet: if everything shouts, nothing does. */
  soon: 'bg-stone text-ink-soft',
  /** Nothing left to do here. */
  done: 'bg-available/10 text-available',
}

/** The same tones as text, for a dense row that has no space for a chip. */
export const TEXT_TONE: Record<Tone, string> = {
  late: 'text-held',
  now: 'text-plum',
  soon: 'text-ink-soft',
  done: 'text-available',
}

/** The ring a row wears when something is already wrong. */
export const RING_LATE = 'ring-1 ring-held/50'

export function StatusChip({
  tone,
  children,
  className,
}: {
  tone: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-block rounded-badge px-2 py-0.5 text-[12px] font-semibold whitespace-nowrap',
        TONE_BG[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
