import { AreaShowcase } from './AreaShowcase'
import { areas } from '@/lib/content/beranda'

/**
 * `overflow-x: clip` rather than `hidden`: the track and the end cap both reach
 * past the right edge of the screen on purpose, and this is what stops that
 * from becoming a horizontal page scroll. `hidden` would do the same job and
 * quietly kill the sticky column inside, because it makes this element a scroll
 * container.
 */
export function Kawasan() {
  return (
    <section id="kawasan" className="overflow-x-clip bg-canvas">
      <div className="py-20 sm:py-28">
        {areas.map((area) => (
          <AreaShowcase key={area.name} area={area} />
        ))}
      </div>
    </section>
  )
}
