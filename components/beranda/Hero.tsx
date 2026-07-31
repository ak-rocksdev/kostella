import Image from 'next/image'
import { SearchBar } from './SearchBar'
import { hero } from '@/lib/content/beranda'

/**
 * Overlay variant, for comparison against the stacked hero on main.
 *
 * The photograph runs full-bleed from directly under the navbar and the whole
 * argument — claim, supporting line, and the search row — layers over it. The
 * white pill on a photograph is the move this canon is known for; it is the one
 * place a search control reads as an object rather than as a form.
 *
 * The scrim is 68%, not the 55% that would look prettier. Against a fully
 * blown-out photograph that leaves solid stone at 5.3:1, which the 18px
 * supporting line needs — and the photograph here is a bright white room, so
 * this is the realistic case rather than the pessimistic one. The bottom
 * gradient is depth only; nothing legible depends on it.
 */
export function Hero() {
  return (
    <section aria-label="Cari kamar" className="relative isolate bg-ink">
      <div className="absolute inset-0 -z-10">
        <Image
          src={hero.photo.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/68" />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink/30 to-transparent to-55%"
        />
      </div>

      <div className="wrap flex min-h-[580px] flex-col justify-center py-20 text-center sm:min-h-[720px] sm:py-28">
        <h1 className="mx-auto max-w-[20ch] text-[clamp(2.25rem,5.2vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-stone text-balance">
          {hero.heading}
        </h1>

        <p className="mx-auto mt-6 max-w-[54ch] text-[18px] leading-[1.6] text-stone text-pretty">
          {hero.lead}
        </p>

        <SearchBar onDark />
      </div>
    </section>
  )
}
