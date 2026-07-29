import { BadgeCheck, Clock, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionEyebrow } from '@/components/ui/Eyebrow'
import { FooterMap } from './FooterMap'
import { footer } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="wrap pt-14 sm:pt-18">
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <SectionEyebrow>{footer.mapEyebrow}</SectionEyebrow>
            <div className="mt-5">
              <FooterMap />
            </div>
            <p className="mt-2 text-[12px] text-ink-soft">{footer.mapCaption}</p>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <SectionEyebrow>{footer.addressEyebrow}</SectionEyebrow>
              <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {footer.buildings.map((building) => (
                  <li
                    key={building.number}
                    className="flex items-baseline gap-2 font-mono text-[13px] leading-[1.5] text-ink-soft"
                  >
                    <span className="numeral min-w-[34px] text-[15px] text-ink">
                      {building.number}
                    </span>
                    {building.street}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] text-ink-soft">{footer.addressNote}</p>
            </div>

            <div className="rounded-card border border-line bg-stone p-6">
              <SectionEyebrow>{footer.contactEyebrow}</SectionEyebrow>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <MessageCircle size={22} strokeWidth={1.5} aria-hidden className="text-plum" />
                <span className="font-mono text-[22px] font-medium whitespace-nowrap text-ink">
                  {footer.phone}
                </span>
                <span className="inline-flex items-center gap-1 rounded-badge bg-plum-soft px-2.5 py-1 text-[12px] font-semibold text-plum">
                  <BadgeCheck size={14} strokeWidth={1.5} aria-hidden />
                  {footer.verified}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-3 text-[14px] text-ink-soft">
                <Clock size={18} strokeWidth={1.5} aria-hidden className="shrink-0" />
                {footer.hours}
              </p>
              <div className="mt-4">
                <Button href={routes.whatsapp}>{footer.contactCta}</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line pt-5 pb-6 text-[12px] text-ink-soft">
          <span className="text-[15px] font-semibold text-ink">Kostella</span>
          <span>{footer.disclaimer}</span>
          <span>{footer.copyright}</span>
        </div>
      </div>
    </footer>
  )
}
