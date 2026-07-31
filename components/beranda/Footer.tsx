import { BadgeCheck, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FooterMap } from './FooterMap'
import { footer } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

/**
 * The labels here used to be the system's rule-and-caps section eyebrow. That
 * device belonged to the previous world; in this one a label is just a small
 * bold line, and the only thing that separates blocks is space.
 */
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-semibold text-ink-soft">{children}</p>
}

export function Footer() {
  return (
    <footer className="bg-canvas">
      <div className="wrap pt-20 sm:pt-28">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <Label>{footer.mapEyebrow}</Label>
            {/* The map carries the card radius and elevation the rest of the
                page uses; it is a photograph of the neighbourhood as far as
                this layout is concerned. */}
            <div className="mt-4 overflow-hidden rounded-card shadow-card">
              <FooterMap />
            </div>
            <p className="mt-3 text-[12px] text-ink-soft">{footer.mapCaption}</p>
          </div>

          <div className="flex flex-col gap-10">
            <div>
              <Label>{footer.addressEyebrow}</Label>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {footer.buildings.map((building) => (
                  <li
                    key={building.number}
                    className="flex items-baseline gap-2.5 text-[13px] leading-[1.5] text-ink-soft"
                  >
                    <span className="rounded-badge bg-stone px-1.5 py-0.5 font-figure text-[13px] leading-[1.4] font-semibold text-ink">
                      {building.number}
                    </span>
                    {building.street}
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 text-[12px] text-ink-soft">{footer.addressNote}</p>
            </div>

            <div className="rounded-card bg-paper p-6 shadow-card">
              <Label>{footer.contactEyebrow}</Label>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <MessageCircle size={22} strokeWidth={1.5} aria-hidden className="text-plum" />
                <span className="font-figure text-[22px] font-semibold whitespace-nowrap text-ink">
                  {footer.phone}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-plum-soft px-3 py-1 text-[12px] font-semibold text-plum">
                  <BadgeCheck size={14} strokeWidth={1.5} aria-hidden />
                  {footer.verified}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-3 text-[14px] text-ink-soft">
                <Clock size={18} strokeWidth={1.5} aria-hidden className="shrink-0" />
                {footer.hours}
              </p>
              <div className="mt-5">
                <Button href={routes.whatsapp}>{footer.contactCta}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line pt-6 pb-8 text-[12px] text-ink-soft">
          <span className="text-[15px] font-semibold text-ink">Kostella</span>
          <span>{footer.disclaimer}</span>
          <span>{footer.copyright}</span>
        </div>
      </div>
    </footer>
  )
}
