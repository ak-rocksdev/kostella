import { ReceiptTable } from '@/components/ui/ReceiptTable'
import { biaya } from '@/lib/content/beranda'

/**
 * The second claim: exactly what you pay. Still a receipt, because a receipt is
 * a document you check rather than a pitch you read — but it now sits on a card
 * with the world's own radius and elevation instead of a hairline-ruled panel.
 */
export function Biaya() {
  return (
    <section id="biaya" className="bg-canvas">
      <div className="wrap grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <h2 className="text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
            {biaya.heading}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.65] text-ink-soft">{biaya.body}</p>

          <dl className="mt-10 flex gap-12">
            {biaya.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-[clamp(2.25rem,4.5vw,3rem)] leading-none font-semibold tracking-[-0.03em]">
                  {stat.value}
                </dd>
                <p aria-hidden className="mt-2.5 text-[14px] leading-[1.4] text-ink-soft">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-card bg-paper p-6 shadow-card sm:p-9">
          <p className="mb-5 text-[13px] font-semibold text-ink-soft">{biaya.example}</p>
          <ReceiptTable rows={biaya.rows} total={biaya.total} />
        </div>
      </div>
    </section>
  )
}
