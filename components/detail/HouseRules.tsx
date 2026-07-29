import { houseRules } from '@/lib/content/detail'

/**
 * Rules stated plainly. The brand surfaces what competitors bury, on the
 * argument that honesty presented with confidence reads as professionalism.
 */
export function HouseRules() {
  return (
    <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {houseRules.map((rule) => (
        <div key={rule.title}>
          <dt className="mb-1 text-[15px] font-semibold">{rule.title}</dt>
          <dd className="text-[14px] leading-[1.6] text-ink-soft">{rule.body}</dd>
        </div>
      ))}
    </dl>
  )
}
