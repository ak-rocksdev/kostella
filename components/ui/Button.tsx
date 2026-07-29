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

const base =
  'inline-flex items-center justify-center rounded-badge border border-transparent font-body font-semibold leading-[1.2] transition-colors duration-150'

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-[7px] text-[14px]',
  md: 'px-5 py-2.5 text-[14px]',
  lg: 'px-7 py-3.5 text-[16px]',
}

/* Hover states are CSS here; the prototype ran them as JS event handlers. Same
   values, no client JavaScript. The system's rule is that buttons darken
   slightly — nothing bouncy. */
const variants: Record<Variant, string> = {
  primary: 'bg-plum text-white hover:bg-plum-deep',
  secondary: 'bg-paper text-ink border-line hover:border-ink-soft',
  ghost: 'bg-transparent text-plum hover:bg-plum-soft',
  // Plum focus rings are unreadable on the dark franchise block.
  inverse: 'bg-stone text-ink hover:bg-line focus-visible:outline-stone',
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
