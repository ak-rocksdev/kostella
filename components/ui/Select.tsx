'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export type SelectOption<T extends string> = {
  value: T
  label: string
  /** One line under the label — what distinguishes this option from its peers. */
  detail?: string
}

/**
 * A listbox that looks like the rest of the product.
 *
 * A native `<select>` was here first, and its argument was real: keyboard,
 * type-ahead and the platform picker for free. What it cannot do is look like
 * anything — the menu is drawn by the operating system, so a grey panel with a
 * blue highlight opened out of a panel built on warm neutrals and plum. On a
 * screen whose whole job is to demonstrate craft, that is the wrong trade.
 *
 * Built on the platform rather than around it. The panel is a **popover**, so
 * the browser gives back most of what the native control was providing:
 *   - the top layer, so it can never be clipped by an ancestor's overflow or
 *     out-ranked by a z-index,
 *   - light dismiss on an outside click,
 *   - Escape to close,
 *   - and it closes any other popover already open.
 *
 * What is left to write is the keyboard inside the list, and the ARIA that
 * tells a screen reader this is a listbox. That is the part worth writing;
 * re-implementing the top layer by hand is not.
 */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
  align = 'start',
  variant = 'pill',
}: {
  /** Shown before the value, and used as the control's accessible name. */
  label: string
  value: T
  options: SelectOption<T>[]
  onChange: (next: T) => void
  className?: string
  /** Which edge the panel lines up with. `end` for controls near the right. */
  align?: 'start' | 'end'
  /**
   * `pill` for a standalone control in a toolbar; `field` inside a form, where
   * it sits beside text inputs and takes their shape. One component either way,
   * so the panel never shows two different kinds of select.
   */
  variant?: 'pill' | 'field'
}) {
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState<{ top: number; left: number; minWidth: number }>()

  const selected = options.find((o) => o.value === value) ?? options[0]
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )

  /**
   * Placed from the trigger's measured box rather than with CSS anchor
   * positioning, which is not in every browser yet. Fixed coordinates are
   * correct here because the popover sits in the top layer, outside normal flow.
   */
  const place = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const r = trigger.getBoundingClientRect()
    const width = Math.max(r.width, 240)
    setPosition({
      top: r.bottom + 8,
      left: align === 'end' ? Math.max(8, r.right - width) : Math.min(r.left, window.innerWidth - width - 8),
      minWidth: width,
    })
  }, [align])

  const show = () => {
    place()
    setActive(selectedIndex)
    panelRef.current?.showPopover()
  }

  const hide = () => panelRef.current?.hidePopover()

  // The browser closes the popover on outside click and on Escape without
  // telling React, so state follows the element rather than the other way round.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const onToggle = (e: Event) => setOpen((e as ToggleEvent).newState === 'open')
    panel.addEventListener('toggle', onToggle)
    return () => panel.removeEventListener('toggle', onToggle)
  }, [])

  // Reposition rather than drift: a scrolled page would leave the panel behind.
  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, place])

  const choose = (option: SelectOption<T>) => {
    onChange(option.value)
    hide()
    triggerRef.current?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1
    const keys: Record<string, number> = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    }
    if (e.key in keys) {
      e.preventDefault()
      setActive(keys[e.key])
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(options[active])
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? hide() : show())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault()
            show()
          }
        }}
        aria-label={variant === 'field' ? label : undefined}
        className={cn(
          'cursor-pointer border bg-paper transition-colors',
          variant === 'pill'
            ? 'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[13px]'
            : 'flex w-full min-h-11 items-center justify-between gap-2 rounded-badge px-3 text-[14px]',
          open ? 'border-ink-soft' : 'border-line hover:border-ink-soft',
          className,
        )}
      >
        {variant === 'pill' && (
          <span className="whitespace-nowrap text-ink-soft">{label}</span>
        )}
        <span className="truncate font-semibold">{selected?.label}</span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          aria-hidden
          className={cn('shrink-0 text-ink-soft transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <div
        ref={panelRef}
        popover="auto"
        role="listbox"
        tabIndex={-1}
        aria-label={label}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onKeyDown={onKeyDown}
        style={position}
        className="fixed m-0 max-h-[min(20rem,60vh)] overflow-y-auto rounded-card border-0 bg-paper p-1.5 shadow-lift focus:outline-none [&:popover-open]:animate-[kst-toast-in_180ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {options.map((option, i) => {
          const isSelected = option.value === value
          return (
            <div
              key={option.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={isSelected}
              onClick={() => choose(option)}
              onMouseMove={() => setActive(i)}
              className={cn(
                'flex cursor-pointer items-start gap-2.5 rounded-badge px-3 py-2.5 text-[14px] transition-colors',
                // The keyboard's position and the mouse's hover are the same
                // highlight, so moving between them never leaves two marks.
                i === active ? 'bg-stone' : 'bg-transparent',
              )}
            >
              <Check
                size={16}
                strokeWidth={2.5}
                aria-hidden
                className={cn('mt-0.5 shrink-0 text-plum', !isSelected && 'invisible')}
              />
              <span className="min-w-0">
                <span className={cn('block leading-[1.35]', isSelected && 'font-semibold')}>
                  {option.label}
                </span>
                {option.detail && (
                  <span className="mt-0.5 block text-[12px] leading-[1.4] text-ink-soft">
                    {option.detail}
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}
