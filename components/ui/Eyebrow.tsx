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

/**
 * An eyebrow preceded by a short accent rule. Opens every section.
 *
 * `as="h2"` where the eyebrow is genuinely the section's heading rather than a
 * label above one — a section whose only headings are h3 steps otherwise nests
 * them under whatever h2 came before it.
 */
export function SectionEyebrow({
  children,
  inverse,
  as: Tag = 'div',
}: {
  children: ReactNode
  inverse?: boolean
  as?: 'div' | 'h2'
}) {
  return (
    <Tag className="flex items-center gap-3">
      <span aria-hidden className={cn('h-0.5 w-8 shrink-0', inverse ? 'bg-stone' : 'bg-plum')} />
      <Eyebrow inverse={inverse} className="inline">
        {children}
      </Eyebrow>
    </Tag>
  )
}
