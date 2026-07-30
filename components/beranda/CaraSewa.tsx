import { CalendarCheck, FileText, KeyRound, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionEyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'
import { caraSewa, type StepIcon } from '@/lib/content/beranda'

/* Mapped here rather than in content.ts so only the four icons the page uses
   are bundled. Thin-line, 1.5px stroke, 20px — the system's icon rule. */
const icons: Record<StepIcon, LucideIcon> = {
  search: Search,
  calendar: CalendarCheck,
  document: FileText,
  key: KeyRound,
}

/**
 * Numbered because renting genuinely is a sequence — you cannot pay before you
 * survey. The numerals double as the brand's display treatment.
 *
 * Dividers are 1px grid gaps showing through from the container, so they run
 * vertically at four columns and horizontally when the steps stack. The
 * negative inline margin keeps the first step's text on the content edge.
 */
export function CaraSewa() {
  return (
    <section className="border-t border-line bg-paper">
      <div className="wrap py-14 sm:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <SectionEyebrow as="h2">{caraSewa.eyebrow}</SectionEyebrow>
          <p className="text-[14px] text-ink-soft">{caraSewa.aside}</p>
        </div>

        {/* The bleed only applies from sm up, where the content gutter (32px) is
            wide enough to absorb it. At one column the steps sit flush in the
            column and the rules run its full width. */}
        <ol className="mt-3 grid grid-cols-1 gap-px bg-line sm:-mx-7 sm:grid-cols-2 lg:mx-0 lg:mt-10 lg:grid-cols-4 lg:gap-0 lg:bg-transparent">
          {caraSewa.steps.map((step, i) => {
            const Icon = icons[step.icon]
            return (
              <li
                key={step.number}
                className={cn(
                  'bg-paper py-7 sm:px-7 lg:py-0 lg:pr-7',
                  i === 0 ? 'lg:pl-0' : 'lg:border-l lg:border-line lg:pl-7',
                )}
              >
                <div className="flex items-start justify-between">
                  <span className="numeral text-[44px] leading-none text-plum">{step.number}</span>
                  <Icon size={20} strokeWidth={1.5} aria-hidden className="mt-1 text-ink-soft" />
                </div>
                <h3 className="mt-3.5 mb-2 text-[20px] leading-[1.3] font-semibold">{step.title}</h3>
                <p className="text-[14px] leading-[1.6] text-ink-soft">{step.body}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
