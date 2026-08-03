import Link from 'next/link'
import { BadgeCheck, Clock, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { cn } from '@/lib/cn'
import { footer, nav } from '@/lib/content/beranda'
import { routes } from '@/lib/routes'

/**
 * One footer, on every screen.
 *
 * It used to exist on Beranda only, so the search and detail screens simply
 * stopped — no contact, no way back, nothing. Detail is where a visitor is most
 * ready to get in touch, and it was the page with the least to touch.
 *
 * Three columns, three jobs: who this is, where you can go, where the buildings
 * are. The action lives in the contact card and nowhere else.
 *
 * The map is gone. It was a Leaflet instance with unclickable pins repeating
 * addresses printed beside it; on the two screens that already carry a real map
 * it would have been the page's second or third. The addresses are the
 * information, and they now render as text with no tiles to fetch.
 */
export function SiteFooter({ wide }: { wide?: boolean }) {
  // The footer takes the column of the page it sits under. The search screen
  // runs on wrap-wide because it puts inventory beside a map, and a footer stuck
  // on the 1200px column started its first word 88px inside the results above
  // it.
  return (
    <footer className="border-t border-line bg-canvas">
      <div className={cn(wide ? 'wrap-wide' : 'wrap', 'py-14 sm:py-20')}>
        <div className="grid gap-x-16 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-[1.25fr_0.7fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="text-[20px] font-semibold tracking-[-0.01em]">Kostella</p>
            <p className="mt-3 max-w-[42ch] text-[14px] leading-[1.65] text-ink-soft">
              {footer.positioning}
            </p>

            <div className="mt-7 max-w-[400px] rounded-card bg-paper p-6 shadow-card">
              <SectionLabel>{footer.contactEyebrow}</SectionLabel>

              {/* A phone number that is not a link is a phone number you retype
                  by hand. Plum on hover because dialling is an action. */}
              <a
                href={footer.phoneHref}
                className="mt-3 inline-flex min-h-11 items-center gap-2.5 font-figure text-[22px] leading-none font-semibold tracking-[-0.01em] transition-colors hover:text-plum"
              >
                <Phone size={19} strokeWidth={1.75} aria-hidden className="text-plum" />
                <span className="whitespace-nowrap">{footer.phone}</span>
              </a>

              <p className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={15} strokeWidth={1.75} aria-hidden className="shrink-0" />
                  {footer.hours}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-plum-soft px-2.5 py-1 text-[12px] font-semibold text-plum">
                  <BadgeCheck size={13} strokeWidth={1.75} aria-hidden />
                  {footer.verified}
                </span>
              </p>

              <div className="mt-5">
                <Button href={routes.whatsapp} className="w-full">
                  <MessageCircle size={18} strokeWidth={1.75} aria-hidden className="mr-2" />
                  {footer.contactCta}
                </Button>
              </div>
            </div>
          </div>

          <nav aria-label="Tautan footer">
            <SectionLabel>{footer.navLabel}</SectionLabel>
            {/* min-h-11 on each link rather than on the list: the text is 21px
                tall, which clears the 24px floor but not the 44px one. Two
                columns on a phone, where the block runs full width and a single
                file of four 44px rows added 88px of footer for nothing. */}
            <ul className="mt-1 grid grid-cols-2 sm:grid-cols-1">
              {nav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[15px] text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <SectionLabel>{footer.addressEyebrow}</SectionLabel>
            <ul className="mt-4 flex flex-col gap-2.5">
              {footer.buildings.map((building) => (
                <li
                  key={building.number}
                  className="flex items-baseline gap-2.5 text-[13px] leading-[1.5] text-ink-soft"
                >
                  <span className="rounded-badge bg-stone px-1.5 py-0.5 font-figure text-[13px] leading-[1.4] font-semibold text-ink">
                    <span className="sr-only">Kostella </span>
                    {building.number}
                  </span>
                  {building.street}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-[1.5] text-ink-soft">{footer.addressNote}</p>
            <p className="mt-2 text-[12px] leading-[1.5] text-ink-soft">{footer.addressCaption}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between sm:mt-14 gap-x-6 gap-y-2 border-t border-line pt-6 text-[12px] text-ink-soft">
          <span>{footer.copyright}</span>
          <span>{footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  )
}
