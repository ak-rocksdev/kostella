import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { Status } from '@/lib/content/types'

type Tone = 'plum' | 'neutral' | 'available' | 'held' | 'occupied'

const tones: Record<Tone, string> = {
  plum: 'bg-plum-soft text-plum',
  neutral: 'bg-stone text-ink-soft',
  available: 'bg-available text-white',
  held: 'bg-held-soft text-held',
  occupied: 'bg-occupied-soft text-ink-soft',
}

export function Badge({
  children,
  tone = 'plum',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-block rounded-full px-3 py-1 font-body text-[12px] leading-[1.4] font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * Availability, stated in words.
 *
 * The system forbids communicating status by colour alone, so the label always
 * carries the meaning and the colour only reinforces it.
 */
export function StatusBadge({ status, count }: { status: Status; count?: number }) {
  const labels: Record<Status, string> = {
    available: count != null ? `${count} kosong` : 'Ada kamar',
    held: 'Sisa 1',
    occupied: 'Penuh',
  }

  return <Badge tone={status}>{labels[status]}</Badge>
}
