import { ReceiptTable } from '@/components/ui/ReceiptTable'
import { biaya } from '@/lib/content/beranda'

/**
 * The second claim: exactly what you pay. Set as a receipt in mono figures,
 * because a receipt is a document you check rather than a pitch you read.
 */
export function Biaya() {
  return (
    <section id="biaya" className="border-t border-line bg-stone">
      <div className="wrap grid items-center gap-12 py-14 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* No section eyebrow: the heading already says what this is, and
            "Transparansi biaya" above "Yang kamu bayar, tanpa kejutan." was the
            same sentence twice. */}
        <div>
          <h2 className="text-[clamp(2rem,4.5vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.015em]">
            {biaya.heading}
          </h2>
          <p className="mt-5 max-w-[460px] text-[16px] leading-[1.65] text-ink-soft">{biaya.body}</p>

          {/* The two figures are the section's payload, so they get the brand's
              numeral treatment and a rule of their own rather than trailing the
              paragraph as an afterthought. */}
          <dl className="mt-8 flex gap-10 border-t border-line pt-6">
            {biaya.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="numeral text-[clamp(2.5rem,5vw,3.25rem)] leading-none">
                  {stat.value}
                </dd>
                <p aria-hidden className="mt-2 text-[14px] leading-[1.4] text-ink-soft">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-card border border-line border-t-[3px] border-t-plum bg-paper p-6 shadow-max sm:p-8">
          <p className="mb-4 font-figure text-[13px] font-medium text-ink-soft">{biaya.example}</p>
          <ReceiptTable rows={biaya.rows} total={biaya.total} />
        </div>
      </div>
    </section>
  )
}
