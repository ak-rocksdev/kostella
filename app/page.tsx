import { Biaya } from '@/components/beranda/Biaya'
import { CaraSewa } from '@/components/beranda/CaraSewa'
import { Franchise } from '@/components/beranda/Franchise'
import { Header } from '@/components/beranda/Header'
import { Hero } from '@/components/beranda/Hero'
import { Kawasan } from '@/components/beranda/Kawasan'
import { SiteFooter } from '@/components/ui/SiteFooter'

export default function BerandaPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Kawasan />
        <Biaya />
        <CaraSewa />
        <Franchise />
      </main>
      <SiteFooter />
    </>
  )
}
