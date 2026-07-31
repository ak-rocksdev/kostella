import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type EyebrowProps = {
  children: ReactNode
  /** For the dark franchise surface, the only inverse block in the system. */
  inverse?: boolean
  className?: string
}

/** The one place the system uses ALL CAPS. Everything else is sentence case. */
export function Eyebrow({ children, inverse, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'block font-body text-eyebrow uppercase',
        inverse ? 'text-ink-faint' : 'text-ink-soft',
        className,
      )}
    >
      {children}
    </span>
  )
}
