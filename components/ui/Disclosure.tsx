'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * A panel that unfolds under the control that summoned it, and folds away
 * again.
 *
 * Closing has to animate too, which means the content must outlive the state
 * that opened it. When `open` turns false the children are captured into state
 * and replayed on the way out, then dropped when the animation ends.
 *
 * The capture matters for more than the animation: a form whose guard has just
 * become false — `Catat keluar` clears the tenant the form was reading — would
 * otherwise re-render against nothing and throw while still fading.
 *
 * State is adjusted during render rather than in an effect. Writing a ref
 * mid-render breaks under concurrent rendering, and `setState` inside an effect
 * costs a second render pass; comparing previous props in state is the pattern
 * React documents for exactly this.
 *
 * Unmounting when shut also means `autoFocus` fires on opening and only then,
 * rather than seven hidden forms fighting over the caret.
 *
 * `motion-reduce` keeps the fade and drops the movement: less motion, not none.
 */
export function Disclosure({
  open,
  children,
  className,
}: {
  open: boolean
  children: ReactNode
  className?: string
}) {
  const [wasOpen, setWasOpen] = useState(open)
  const [leaving, setLeaving] = useState<ReactNode>(null)

  if (wasOpen !== open) {
    setWasOpen(open)
    setLeaving(open ? null : children)
  }

  if (!open && !leaving) return null

  return (
    <div
      className={cn(
        open
          ? 'animate-[kst-unfold_220ms_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-[kst-fade-in_150ms_ease-out_both]'
          : 'animate-[kst-fold_180ms_cubic-bezier(0.3,0,0.8,0.15)_both] motion-reduce:animate-[kst-fade-out_120ms_ease-in_both]',
        className,
      )}
      onAnimationEnd={() => {
        if (!open) setLeaving(null)
      }}
    >
      {open ? children : leaving}
    </div>
  )
}
