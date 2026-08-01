'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { Check, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Confirmation that something was saved.
 *
 * A change a manager makes has no page reload to confirm it and no server round
 * trip to wait on, so without this the only evidence is a number quietly
 * changing somewhere on screen. The toast says what changed, in the product's
 * own words — "Kamar 105 · sewa jadi Rp1.800.000", never "Berhasil disimpan".
 *
 * The surface is the system's one dark layer rather than a status colour. Green
 * and amber already mean *available* and *withdrawn* here; spending green on
 * "saved" would overload the vocabulary the rest of the panel depends on. Only
 * the icon is tinted, and only where the action itself carries a consequence.
 *
 * `role="status"` with `aria-live="polite"` so a screen reader hears the same
 * confirmation. Announced without stealing focus — the manager is mid-task.
 */

type Tone = 'neutral' | 'attention' | 'available'

export type ToastInput = {
  /** What changed, specifically. Not "Berhasil". */
  title: string
  /** Who, or where it was recorded. One line. */
  detail?: string
  icon?: LucideIcon
  tone?: Tone
  /** Optional follow-through, e.g. the activity log. */
  action?: { label: string; href: string }
}

type Toast = ToastInput & { id: number }

const ToastContext = createContext<{ show: (t: ToastInput) => void } | null>(null)

/** Long enough to read a line and a half without hurrying the reader. */
const DISMISS_AFTER = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((input: ToastInput) => {
    const id = (nextId.current += 1)
    // Newest first, and capped: a burst of changes should not build a column
    // that covers the screen someone is working in.
    setToasts((current) => [{ ...input, id }, ...current].slice(0, 3))
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        // Bottom-end and fixed, clear of the sticky header and of the actions
        // themselves. `pointer-events-none` on the stack so it never blocks a
        // click; each toast re-enables its own.
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px]"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const out = setTimeout(() => setLeaving(true), DISMISS_AFTER)
    const gone = setTimeout(onDismiss, DISMISS_AFTER + 200)
    return () => {
      clearTimeout(out)
      clearTimeout(gone)
    }
  }, [onDismiss])

  const Icon = toast.icon ?? Check
  const iconTone: Record<Tone, string> = {
    neutral: 'text-stone',
    attention: 'text-held-soft',
    available: 'text-available',
  }

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-card bg-ink px-4 py-3.5 text-stone shadow-lift',
        leaving
          ? 'animate-[kst-toast-out_200ms_ease-in_forwards]'
          : 'animate-[kst-toast-in_260ms_cubic-bezier(0.16,1,0.3,1)_both]',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white/12',
          iconTone[toast.tone ?? 'neutral'],
        )}
      >
        <Icon size={14} strokeWidth={2.25} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-[1.4] font-semibold">{toast.title}</p>
        {toast.detail && (
          <p className="mt-1 text-[13px] leading-[1.45] text-stone/70">{toast.detail}</p>
        )}
        {toast.action && (
          <Link
            href={toast.action.href}
            onClick={onDismiss}
            className="mt-2 inline-flex min-h-9 items-center text-[13px] font-semibold text-stone underline underline-offset-4 hover:text-white focus-visible:outline-stone"
          >
            {toast.action.label}
          </Link>
        )}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup pemberitahuan"
        className="-mr-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone/60 transition-colors hover:bg-white/10 hover:text-stone focus-visible:outline-stone"
      >
        <X size={15} strokeWidth={2} aria-hidden />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
