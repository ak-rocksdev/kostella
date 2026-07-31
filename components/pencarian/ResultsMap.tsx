import { LeafletMap } from '@/components/ui/LeafletMap'
import { buildingMarkers, grogolCentre, landmarkMarkers } from '@/lib/content/geography'
import { mapLandmarks, results } from '@/lib/content/pencarian'

/**
 * The map answers what the list cannot: how these buildings sit relative to the
 * campus you go to every day. The selected result turns plum, so the list and
 * the map stay in step.
 */
export function ResultsMap({ activeNumber }: { activeNumber: string }) {
  return (
    <div className="lg:sticky lg:top-24">
      <LeafletMap
        center={grogolCentre}
        zoom={15}
        fitToContent
        activeLabel={activeNumber}
        markers={[
          ...buildingMarkers(results.map((result) => result.number)),
          ...landmarkMarkers(mapLandmarks),
        ]}
        ariaLabel="Peta hasil pencarian di Grogol, Jakarta Barat"
        className="h-120 lg:h-[calc(100vh-140px)] lg:min-h-120"
      />
    </div>
  )
}
