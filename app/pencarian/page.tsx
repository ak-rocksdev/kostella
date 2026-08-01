import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PencarianHeader } from '@/components/pencarian/PencarianHeader'
import { SearchResults, SearchResultsFromUrl } from '@/components/pencarian/SearchResults'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { context } from '@/lib/content/pencarian'

export const metadata: Metadata = {
  title: `Kostella — Kos dekat ${context.area}`,
  description: `Kos di Grogol dekat ${context.area}. Kamar yang tampil benar-benar kosong, ${context.sort}.`,
}

export default function PencarianPage() {
  return (
    <>
      <PencarianHeader />
      <main>
        <Suspense fallback={<SearchResults />}>
          <SearchResultsFromUrl />
        </Suspense>
      </main>
      <SiteFooter wide />
    </>
  )
}
