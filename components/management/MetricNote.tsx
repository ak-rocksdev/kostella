import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'muted' | 'attention' | 'available'

/**
 * The line under a figure — but only marked where it reports something other
 * than a plain fact.
 *
 * Four metric cards used to end in four identical grey lines: "1 kamar
 * diblokir, di luar hitungan", "tidak ada yang dibooking", "dari Rp 5,0 jt bila
 * penuh", "2 lantai". Four different kinds of statement rendered the same way,
 * so the one that explains why the occupancy denominator is 3 and not 4 sat at
 * the same weight as the floor count.
 *
 * `attention` takes the amber a withdrawn room already wears in the floor grid
 * and the room table; `available` takes the availability green. `muted` is the
 * default and stays grey, which is the point — if everything were marked,
 * nothing would be.
 */
export function MetricNote({
  icon: Icon,
  tone = 'muted',
  children,
}: {
  icon?: LucideIcon
  tone?: Tone
  children: React.ReactNode
}) {
  const tones: Record<Tone, string> = {
    muted: 'text-ink-soft',
    attention: 'text-held',
    available: 'text-available',
  }

  return (
    <span
      className={cn(
        'inline-flex items-start gap-1.5 text-[13px] leading-[1.45]',
        tones[tone],
        tone !== 'muted' && 'font-medium',
      )}
    >
      {Icon && <Icon size={14} strokeWidth={1.9} aria-hidden className="mt-px shrink-0" />}
      <span>{children}</span>
    </span>
  )
}
