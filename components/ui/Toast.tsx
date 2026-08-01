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
 * A change here has no page reload to confirm it and no server round trip to
 * wait on, so without this the only evidence is a number quietly moving
 * somewhere on screen. This says what changed, in the product's own words —
 * "Wifi ditambahkan", never "Berhasil disimpan".
 *
 * Success reads green. That overlaps the availability green the floor grid uses,
 * and the overlap is acceptable: this is a transient overlay, not a status
 * painted on content, and a green tick is the one signal nobody has to learn.
 * Where an action carries a consequence — withdrawing a room from letting — the
 * mark goes amber instead, matching the blocked cell it just created.
 *
 * `role="status"` with `aria-live="polite"` so a screen reader hears the same
 * confirmation, announced without stealing focus from a manager mid-task.
 */

type Tone = 'success' | 'attention'

export type ToastInput = {
  /** What changed, specifically. Not "Berhasil". */
  title: string
  /** Who, or what else moved because of it. One line. */
  detail?: string
  icon?: LucideIcon
  tone?: Tone
  /** Optional follow-through, e.g. the activity log. */
  action?: { label: string; href: string }
}

type Toast = ToastInput & { id: number }

const ToastContext = createContext<{ show: (t: ToastInput) => void } | null>(null)

/** Long enough to read a line and a half, and to reach for the link. */
const DISMISS_AFTER = 5500
const LEAVE_DURATION = 200

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const show = useCallback((input: ToastInput) => {
    const id = (nextId.current += 1)
    // Newest first, capped: a burst of edits should not build a column over the
    // screen someone is working in.
    setToasts((current) => [{ ...input, id }, ...current].slice(0, 3))
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        // `flex-col-reverse` so the newest sits closest to the corner the stack
        // is anchored to, which is where the eye already is.
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col-reverse gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px]"
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
    const gone = setTimeout(onDismiss, DISMISS_AFTER + LEAVE_DURATION)
    return () => {
      clearTimeout(out)
      clearTimeout(gone)
    }
  }, [onDismiss])

  const tone = toast.tone ?? 'success'
  const Icon = toast.icon ?? Check

  return (
    <div
      className={cn(
        // The card itself never intercepts a click. A confirmation that covers
        // the control you were about to press is worse than no confirmation —
        // it appeared over the tenancy buttons and swallowed them. Only the two
        // things you can actually use take pointer events back.
        'pointer-events-none relative overflow-hidden rounded-card bg-ink text-stone shadow-lift',
        leaving
          ? 'animate-[kst-toast-out_200ms_ease-in_forwards]'
          : 'animate-[kst-toast-in_260ms_cubic-bezier(0.16,1,0.3,1)_both]',
      )}
    >
      <div className="flex items-start gap-3 px-4 pt-3.5 pb-4">
        {/* Solid fill, white mark. A tinted circle reads as information; a
            filled one reads as done. */}
        <span
          aria-hidden
          className={cn(
            'mt-px inline-flex size-7 shrink-0 items-center justify-center rounded-full',
            tone === 'success' ? 'bg-available text-white' : 'bg-held text-white',
          )}
        >
          <Icon size={16} strokeWidth={2.5} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] leading-[1.35] font-semibold">{toast.title}</p>
          {toast.detail && (
            <p className="mt-1 text-[13px] leading-[1.45] text-stone/70">{toast.detail}</p>
          )}
          {toast.action && (
            <Link
              href={toast.action.href}
              onClick={onDismiss}
              // Stone, not the accent. The availability green measures 3,56:1 on
              // this dark surface — under the 4,5 floor for 13px text. The green
              // belongs to the mark and the rail, where it carries meaning
              // without having to be read.
              className="pointer-events-auto mt-2 inline-flex min-h-9 items-center text-[13px] font-semibold text-stone underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-stone"
            >
              {toast.action.label}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup pemberitahuan"
          className="pointer-events-auto -mt-0.5 -mr-1 inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone/60 transition-colors hover:bg-white/10 hover:text-stone focus-visible:outline-stone"
        >
          <X size={15} strokeWidth={2} aria-hidden />
        </button>
      </div>

      {/* How long it will stay. The toast carries a link, so the reader needs to
          know whether there is time to reach it. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bottom-0 h-[3px] origin-left',
          tone === 'success' ? 'bg-available' : 'bg-held',
        )}
        style={{ animation: `kst-toast-drain ${DISMISS_AFTER}ms linear forwards` }}
      />
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
