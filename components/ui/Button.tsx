import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'warn' | 'restore'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Renders a link instead of a button. Every action on Beranda navigates. */
  href?: string
  disabled?: boolean
  className?: string
  /** Added for the management panel, where actions act rather than navigate. */
  onClick?: () => void
  /** `submit` so a form's own validation runs before the handler. */
  type?: 'button' | 'submit'
}

/* Border width only. The colour belongs to the variant — setting a colour here
   too would collide on the same property, and source order rather than intent
   would decide which one wins. */
/* `min-h-11` = 44px on every size. `sm` and `md` computed to 35px and 38px,
   under the touch floor this project's own guidelines set — measured on a
   phone, not eyeballed. Padding still sets the horizontal rhythm; the minimum
   only ever grows the box. */
const base =
  'inline-flex min-h-11 items-center justify-center rounded-full border font-body font-semibold leading-[1.2] transition-colors duration-200'

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[14px]',
  md: 'px-5 py-2.5 text-[15px]',
  lg: 'px-7 py-4 text-[16px]',
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
  /* Two variants for actions that change what a room *is*, rather than just
     editing it. They borrow the status colours already in use — a withdrawn
     room is amber in the floor grid and the room table, so the control that
     withdraws it is amber too. Colour here marks consequence, not importance:
     the shape stays identical to `secondary` so nothing reads as more primary
     than its neighbours. */
  warn: 'border-held/45 bg-held-soft/40 text-held hover:border-held hover:bg-held-soft focus-visible:outline-held',
  restore:
    'border-available/45 bg-available/8 text-available hover:border-available hover:bg-available/15 focus-visible:outline-available',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  disabled,
  className,
  onClick,
  type = 'button',
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
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(classes, disabled ? 'cursor-default' : 'cursor-pointer')}
    >
      {children}
    </button>
  )
}
