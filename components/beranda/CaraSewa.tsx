import { Reveal } from "@/components/ui/Reveal";
import { caraSewa } from "@/lib/content/beranda";

/**
 * Four steps, stated plainly.
 *
 * The previous world drew a hairline route through the numerals — a good device,
 * and a bespoke one. This world is the category standard taken straight, and a
 * connector nobody else in it draws is exactly the sort of quirk that would be
 * smuggled in rather than committed to. The sequence carries itself: the numbers
 * are ordered, and the aside already says it takes a day.
 */
export function CaraSewa() {
  return (
    <section className="bg-canvas">
      <div className="wrap py-20 sm:py-28">
        <div className="max-w-[36ch]">
          <h2 className="text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.025em]">
            {caraSewa.eyebrow}
          </h2>
          <p className="mt-4 text-[17px] leading-[1.6] text-ink-soft">
            {caraSewa.aside}
          </p>
        </div>

        <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {caraSewa.steps.map((step, i) => (
            <li key={step.number}>
              <Reveal delay={i * 90}>
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-plum-soft font-figure text-[15px] font-semibold text-plum">
                  {step.number}
                </span>
                <h3 className="mt-5 mb-2.5 text-[19px] leading-[1.3] font-semibold">
                  {step.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-ink-soft">
                  {step.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
