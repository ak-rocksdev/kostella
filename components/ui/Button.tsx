import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Renders a link instead of a button. Every action on Beranda navigates. */
  href?: string
  disabled?: boolean
  className?: string
}

/* Border width only. The colour belongs to the variant — setting a colour here
   too would collide on the same property, and source order rather than intent
   would decide which one wins. */
const base =
  'inline-flex items-center justify-center rounded-badge border font-body font-semibold leading-[1.2] transition-colors duration-150'

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-[7px] text-[14px]',
  md: 'px-5 py-2.5 text-[14px]',
  lg: 'px-7 py-3.5 text-[16px]',
}

/* Hover states are CSS here; the prototype ran them as JS event handlers. Same
   values, no client JavaScript. The system's rule is that buttons darken
   slightly — nothing bouncy. */
const variants: Record<Variant, string> = {
  primary: 'border-transparent bg-plum text-white hover:bg-plum-deep',
  secondary: 'border-line bg-paper text-ink hover:border-ink-soft',
  ghost: 'border-transparent bg-transparent text-plum hover:bg-plum-soft',
  // Plum focus rings are unreadable on the dark franchise block.
  inverse: 'border-transparent bg-stone text-ink hover:bg-line focus-visible:outline-stone',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  disabled,
  className,
}: ButtonProps) {
  const classes = cn(base, sizes[size], variants[variant], disabled && 'opacity-45', className)

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" disabled={disabled} className={cn(classes, disabled && 'cursor-default')}>
      {children}
    </button>
  )
}
