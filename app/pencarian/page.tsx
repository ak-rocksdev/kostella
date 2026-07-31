import type { Metadata } from 'next'
import { PencarianHeader } from '@/components/pencarian/PencarianHeader'
import { SearchResults } from '@/components/pencarian/SearchResults'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { context } from '@/lib/content/pencarian'

export const metadata: Metadata = {
  title: `Kostella — Kos dekat ${context.area}`,
  description: `${context.resultsLabel}. Kamar yang tampil benar-benar kosong, ${context.sort}.`,
}

export default function PencarianPage() {
  return (
    <>
      <PencarianHeader />
      <main>
        <SearchResults />
      </main>
      <SiteFooter wide />
    </>
  )
}
