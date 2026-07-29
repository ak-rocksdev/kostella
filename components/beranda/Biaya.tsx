import { ReceiptTable } from '@/components/ui/ReceiptTable'
import { SectionEyebrow } from '@/components/ui/Eyebrow'
import { biaya } from '@/lib/content/beranda'

/**
 * The second claim: exactly what you pay. Set as a receipt in mono figures,
 * because a receipt is a document you check rather than a pitch you read.
 */
export function Biaya() {
  return (
    <section id="biaya" className="border-t border-line bg-stone">
      <div className="wrap grid items-center gap-12 py-14 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionEyebrow>{biaya.eyebrow}</SectionEyebrow>

          <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.01em]">
            {biaya.heading}
          </h2>
          <p className="mt-4 max-w-[460px] text-[16px] leading-[1.65] text-ink-soft">{biaya.body}</p>

          <div className="mt-7 flex gap-6">
            {biaya.stats.map((stat) => (
              <p key={stat.label}>
                <span className="numeral block text-[34px] leading-none">{stat.value}</span>
                <span className="mt-1 block text-[13px] text-ink-soft">{stat.label}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-line border-t-[3px] border-t-plum bg-paper p-6 shadow-max sm:p-8">
          <p className="mb-4 font-mono text-[13px] font-medium text-ink-soft">{biaya.example}</p>
          <ReceiptTable rows={biaya.rows} total={biaya.total} />
        </div>
      </div>
    </section>
  )
}
