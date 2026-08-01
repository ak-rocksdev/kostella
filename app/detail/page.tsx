import type { Metadata } from 'next'
import { DetailHeader } from '@/components/detail/DetailHeader'
import { HeroGallery } from '@/components/detail/HeroGallery'
import { RoomExplorer } from '@/components/detail/RoomExplorer'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { property } from '@/lib/content/detail'
import { buildings, buildingName } from '@/lib/content/management/buildings'

/* The seeded records, not the live ones: metadata is generated at build time
   and a browser's localStorage is not available to it. The name is the same
   either way unless a manager has since renamed something. */
const name = buildingName(
  buildings.find((b) => b.number === property.number) ?? buildings[0],
  buildings,
)

export const metadata: Metadata = {
  title: `${name} — ${property.address}`,
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
      <SiteFooter />
    </>
  )
}
