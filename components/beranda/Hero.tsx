import Image from 'next/image'
import { SearchBar } from './SearchBar'
import { hero } from '@/lib/content/beranda'

/**
 * The category standard, taken deliberately and finished properly.
 *
 * A light ground with real air, the claim set large and centred, one elevated
 * search row, and a wide photograph anchoring the composition. The previous
 * hero put white type over a darkened photo — dramatic, but it read austere,
 * and this brand is asking someone to picture living somewhere.
 *
 * The photo sits below the fold-line on purpose rather than behind the words:
 * at this craft level a photograph earns its own frame, and text over an image
 * is where the contrast problems and the art-direction compromises live.
 */
export function Hero() {
  return (
    <section aria-label="Cari kamar" className="bg-canvas">
      <div className="wrap pt-14 pb-16 text-center sm:pt-24 sm:pb-24">
        <h1 className="mx-auto max-w-[20ch] text-[clamp(2.25rem,5.2vw,3.75rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-balance">
          {hero.heading}
        </h1>

        <p className="mx-auto mt-6 max-w-[54ch] text-[18px] leading-[1.6] text-ink-soft text-pretty">
          {hero.lead}
        </p>

        <SearchBar />

        {/* 16:9, not 21:9. The source frames are 3:2, and a cinematic slice
            through one lands on wall rather than on the room. */}
        <div className="relative mt-14 aspect-4/3 overflow-hidden rounded-[20px] bg-photo-bg sm:mt-20 sm:aspect-16/9">
          <Image
            src={hero.photo.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
