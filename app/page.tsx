import { Biaya } from '@/components/beranda/Biaya'
import { CaraSewa } from '@/components/beranda/CaraSewa'
import { Footer } from '@/components/beranda/Footer'
import { Franchise } from '@/components/beranda/Franchise'
import { Header } from '@/components/beranda/Header'
import { Hero } from '@/components/beranda/Hero'
import { Kawasan } from '@/components/beranda/Kawasan'
import { ProofBar } from '@/components/ui/ProofBar'
import { proofPoints } from '@/lib/content/beranda'

export default function BerandaPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProofBar items={proofPoints} />
        <Kawasan />
        <Biaya />
        <CaraSewa />
        <Franchise />
      </main>
      <Footer />
    </>
  )
}
