import type { Metadata } from 'next'
import { DetailHeader } from '@/components/detail/DetailHeader'
import { HeroGallery } from '@/components/detail/HeroGallery'
import { RoomExplorer } from '@/components/detail/RoomExplorer'
import { property } from '@/lib/content/detail'

export const metadata: Metadata = {
  title: `Kostella ${property.number} — ${property.address}`,
  description: `${property.tenancy}. ${property.distances}. Lihat kamar yang benar-benar kosong dan rincian biayanya.`,
}

export default function DetailPage() {
  return (
    <>
      <DetailHeader />
      <main>
        <HeroGallery />
        <RoomExplorer />
      </main>
    </>
  )
}
