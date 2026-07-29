import { LeafletMap } from '@/components/ui/LeafletMap'
import { buildingMarkers, grogolCentre } from '@/lib/content/geography'

/**
 * Neighbourhood level with the buildings pinned by number — never a national
 * map with five pins.
 */
export function FooterMap() {
  return (
    <LeafletMap
      center={grogolCentre}
      zoom={16}
      markers={buildingMarkers(['362', '361', '351', '2A3'])}
      ariaLabel="Peta gedung Kostella di Grogol, Jakarta Barat"
      className="h-[300px]"
    />
  )
}
