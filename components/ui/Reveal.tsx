'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

/**
 * An entrance that cannot cost you the content.
 *
 * The hidden state is set from JavaScript, never in the stylesheet, so a script
 * that fails, is blocked, or simply has not run yet leaves the section fully
 * readable. Under a reduced-motion preference the observer never arms and the
 * element is never touched at all.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  /** Stagger, in ms. Keeps a row of cards from arriving as one slab. */
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.dataset.reveal = 'pending'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.reveal = 'in'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      className={className}
    >
      {children}
    </div>
  )
}
