import { Clock, SprayCan, SquareParking, Users } from 'lucide-react'
import { houseRules, type HouseRuleIcon } from '@/lib/content/detail'

/**
 * Icons keyed by the rule's own `icon` field rather than by its title, so
 * rewording a heading cannot silently drop its icon.
 */
const icons: Record<HouseRuleIcon, typeof Clock> = {
  jam: Clock,
  tamu: Users,
  kebersihan: SprayCan,
  parkir: SquareParking,
}

/**
 * Rules stated plainly. The brand surfaces what competitors bury, on the
 * argument that honesty presented with confidence reads as professionalism.
 *
 * The icons are lucide, the same set every other icon on the site comes from —
 * one stroke weight, one corner language, and each is an SVG component rather
 * than a glyph in an icon font, so it inherits `currentColor` and never reaches
 * a screen reader as a stray character.
 *
 * They are decorative and marked as such. Every icon here sits beside a heading
 * that already names the rule, so it buys recognition speed and nothing a reader
 * would lose without it.
 *
 * The block used to be bare text on the page ground while every other block on
 * this screen was a white card, which made the page look like it had stopped
 * rather than ended. It is a card now.
 *
 * The icon sits on the heading's line rather than in a left rail. A rail is the
 * better-looking arrangement in the abstract, but this block lives in the
 * narrower of two columns, and 56px of rail took enough width off each rule to
 * push its sentence onto a third line.
 */
export function HouseRules() {
  return (
    <div className="rounded-card bg-paper p-6 shadow-card sm:p-8">
      <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {houseRules.map((rule) => {
          const Icon = icons[rule.icon]

          return (
            <div key={rule.title}>
              <dt className="flex items-center gap-2.5 text-[15px] leading-[1.4] font-semibold">
                <span
                  aria-hidden
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-stone text-ink"
                >
                  <Icon size={18} strokeWidth={1.6} />
                </span>
                {rule.title}
              </dt>
              <dd className="mt-2.5 text-[14px] leading-[1.6] text-ink-soft">{rule.body}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
