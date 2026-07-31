import { Button } from '@/components/ui/Button'
import { franchise } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

/**
 * The one dark surface, and the only place the copy switches from "kamu" to
 * "Anda" — this block speaks to owners, not tenants.
 *
 * It used to be a full-bleed slab with a 140px outlined numeral. In this world
 * it is a rounded panel sitting on the canvas like every other card, which is
 * how the category signs off a page: one dark band, one sentence, one action.
 */
export function Franchise() {
  return (
    <section id="franchise" className="bg-canvas">
      <div className="wrap pb-20 sm:pb-28">
        <div className="flex flex-col items-start gap-8 rounded-card bg-ink px-8 py-12 shadow-card sm:px-14 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div>
            <p className="text-[14px] font-semibold text-stone/70">{franchise.eyebrow}</p>
            <h2 className="mt-3 max-w-[24ch] text-[clamp(1.5rem,3vw,2rem)] leading-[1.25] font-semibold tracking-[-0.02em] text-stone text-balance">
              {franchise.body}
            </h2>
          </div>

          <Button href={routes.kemitraan} variant="inverse" size="lg" className="shrink-0">
            {franchise.cta}
          </Button>
        </div>
      </div>
    </section>
  )
}
