import { SectionEyebrow } from '@/components/ui/Eyebrow'
import { caraSewa } from '@/lib/content/beranda'

/**
 * Renting drawn as the route it is.
 *
 * The steps were four columns of equal weight separated by vertical rules, and
 * the 01–04 numerals were decoration — nothing connected them, so the sequence
 * had to be inferred. A single hairline now runs through the numerals like
 * stations on a line, and stops at the fourth. That is the section's own claim
 * made structural: from searching to holding the key is one continuous path,
 * and it ends.
 *
 * The line is the one new pattern this page introduces. It earns its place by
 * carrying information the reader needs — order and completion — rather than
 * decorating a list.
 *
 * The step icons are gone. They were generic and the brief already flags the
 * icon set as a substitution to be replaced; its own proof elements use no
 * icons at all, just numerals and a small label. The numbers were always doing
 * this work.
 */
export function CaraSewa() {
  const lastIndex = caraSewa.steps.length - 1

  return (
    <section className="border-t border-line bg-paper">
      <div className="wrap py-14 sm:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <SectionEyebrow as="h2">{caraSewa.eyebrow}</SectionEyebrow>
          <p className="text-[15px] text-ink-soft">{caraSewa.aside}</p>
        </div>

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {caraSewa.steps.map((step, i) => (
            <li key={step.number} className="relative">
              {/* Runs to the next station, across the column gutter. Absent on
                  the last step, so the route visibly terminates. */}
              {i < lastIndex && (
                <span
                  aria-hidden
                  className="absolute top-[21px] left-0 hidden h-px w-[calc(100%+2rem)] bg-line lg:block"
                />
              )}

              {/* The paper ground punches the line, so the numeral sits on the
                  route rather than being crossed out by it. */}
              <span className="numeral relative bg-paper pr-4 text-[44px] leading-none text-plum">
                {step.number}
              </span>

              <h3 className="mt-4 mb-2 text-[20px] leading-[1.3] font-semibold">{step.title}</h3>
              <p className="text-[15px] leading-[1.6] text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
