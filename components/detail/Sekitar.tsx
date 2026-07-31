import { LeafletMap } from '@/components/ui/LeafletMap'
import {
  buildingMarkers,
  buildings,
  landmarkMarkers,
  walkingRadiusMetres,
} from '@/lib/content/geography'
import { property, surroundings } from '@/lib/content/detail'

/**
 * Distance is what renters actually weigh, so the property sits at the centre
 * of a ten-minute walking radius rather than as one pin on a city map.
 */
export function Sekitar() {
  const centre = buildings[property.number]

  return (
    <>
      <LeafletMap
        center={[centre[0], centre[1]]}
        zoom={15}
        radiusMetres={walkingRadiusMetres}
        activeLabel={property.number}
        markers={[
          ...buildingMarkers([property.number]),
          ...landmarkMarkers(surroundings.places),
        ]}
        ariaLabel={`Peta sekitar Kostella ${property.number} dengan radius jalan kaki 10 menit`}
        className="h-80"
      />
      <p className="mt-3 text-[12px] text-ink-soft">{surroundings.caption}</p>
    </>
  )
}
