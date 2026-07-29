import { Button } from '@/components/ui/Button'
import { SectionEyebrow } from '@/components/ui/Eyebrow'
import { franchise } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

/**
 * The only inverse surface in the system, and the only place the copy switches
 * from "kamu" to "Anda" — this block speaks to owners, not tenants.
 */
export function Franchise() {
  return (
    <section id="franchise" className="bg-ink">
      <div className="wrap grid items-center gap-8 py-14 sm:py-18 lg:grid-cols-[1fr_auto] lg:gap-12">
        <div>
          <SectionEyebrow inverse>{franchise.eyebrow}</SectionEyebrow>
          <p className="mt-4 max-w-[620px] text-[clamp(1.375rem,3vw,1.75rem)] leading-[1.3] font-semibold tracking-[-0.01em] text-stone">
            {franchise.body}
          </p>
          <div className="mt-6">
            <Button href={routes.kemitraan} variant="inverse">
              {franchise.cta}
            </Button>
          </div>
        </div>

        {/* The sentence already states the number; this is its display echo. */}
        <p
          aria-hidden
          className="numeral hidden text-[140px] leading-[0.85] text-transparent [-webkit-text-stroke:1px_var(--color-ink-soft)] sm:block"
        >
          {franchise.numeral}
        </p>
      </div>
    </section>
  )
}
