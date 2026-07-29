'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMapInstance, Marker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/cn'

/** Light basemap — the brand's surfaces are pale, and a dark map would fight them. */
const TILE_URL = 'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png'
const TILE_ATTRIBUTION = '© OpenStreetMap contributors © CARTO'

export type MapMarker = {
  label: string
  position: [number, number]
  /** Buildings get the numbered plate; landmarks get a quiet label. */
  kind?: 'building' | 'landmark'
}

/* With iconSize cleared, Leaflet anchors the element by its top-left corner, so
   the plate would sit down and to the right of the place it marks. Centring it
   on the coordinate is the honest position. */
const CENTRED = 'transform:translate(-50%,-50%);'

/**
 * A building plate — the same treatment as everywhere else in the system: the
 * number is the identity, set in the figure face on a solid fill.
 *
 * DivIcon defaults to a 12×12 box that would clip the number, so the size is
 * cleared and the plate sizes to its own label.
 */

function buildingHtml(label: string, active: boolean) {
  const background = active ? 'var(--color-plum)' : 'var(--color-ink)'
  return `<div style="${CENTRED}background:${background};color:#fff;font:500 12px var(--font-figure);padding:3px 7px;border-radius:var(--radius-badge);white-space:nowrap;box-shadow:0 1px 3px rgba(22,23,26,.3)">${label}</div>`
}

function landmarkHtml(label: string) {
  return `<div style="${CENTRED}background:rgba(255,255,255,.88);color:var(--color-ink);font:500 11px var(--font-body);padding:2px 6px;border-radius:var(--radius-badge);white-space:nowrap;border:1px solid var(--color-line)">${label}</div>`
}

type LeafletMapProps = {
  center: [number, number]
  zoom: number
  markers: MapMarker[]
  /** Walking radius drawn around the centre, in metres. */
  radiusMetres?: number
  /**
   * Frame the view to fit everything rather than trusting a fixed zoom. The
   * buildings sit within a few hundred metres of each other, so a zoom that
   * suits one screen stacks the plates on another.
   */
  fitToContent?: boolean
  /** Building whose plate turns plum. Keeps a list and its map in step. */
  activeLabel?: string
  ariaLabel: string
  className?: string
}

/**
 * Every map in the product renders through here — the footer, the search
 * results, and a property's surroundings.
 *
 * Leaflet touches the DOM, so it loads on the client only. The container is
 * server-rendered at its final size, which keeps the layout stable while tiles
 * arrive. Scroll-wheel zoom stays off so the map never hijacks page scrolling.
 */
export function LeafletMap({
  center,
  zoom,
  markers,
  radiusMetres,
  fitToContent,
  activeLabel,
  ariaLabel,
  className,
}: LeafletMapProps) {
  const container = useRef<HTMLDivElement>(null)
  const markerRefs = useRef(new Map<string, Marker>())
  const leaflet = useRef<typeof import('leaflet') | null>(null)

  // The geography is static content, so it is captured once rather than treated
  // as reactive. Only `activeLabel` changes over the map's life.
  const config = useRef({ center, zoom, markers, radiusMetres, fitToContent })

  useEffect(() => {
    const element = container.current
    if (!element) return

    const { center, zoom, markers, radiusMetres, fitToContent } = config.current
    let map: LeafletMapInstance | undefined
    let cancelled = false

    void (async () => {
      const L = (await import('leaflet')).default
      if (cancelled) return
      leaflet.current = L

      map = L.map(element, { scrollWheelZoom: false }).setView(center, zoom)
      L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION }).addTo(map)

      if (radiusMetres) {
        const circle = L.circle(center, {
          radius: radiusMetres,
          color: '#5E5F62',
          weight: 1,
          dashArray: '4 4',
          fill: false,
        }).addTo(map)

        // The radius is the point of this map, so frame the whole of it.
        map.fitBounds(circle.getBounds(), { padding: [16, 16] })
      } else if (fitToContent && markers.length > 1) {
        map.fitBounds(L.latLngBounds(markers.map((marker) => marker.position)), {
          padding: [48, 48],
        })
      }

      for (const marker of markers) {
        const isBuilding = marker.kind !== 'landmark'
        const created = L.marker(marker.position, {
          icon: L.divIcon({
            className: '',
            iconSize: undefined,
            html: isBuilding
              ? buildingHtml(marker.label, marker.label === activeLabel)
              : landmarkHtml(marker.label),
          }),
          interactive: false,
          keyboard: false,
        }).addTo(map)

        if (isBuilding) markerRefs.current.set(marker.label, created)
      }
    })()

    const refs = markerRefs.current
    return () => {
      cancelled = true
      map?.remove()
      refs.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Repaint the plates when the selection moves, without rebuilding the map.
  useEffect(() => {
    const L = leaflet.current
    if (!L) return

    for (const [label, marker] of markerRefs.current) {
      marker.setIcon(
        L.divIcon({ className: '', iconSize: undefined, html: buildingHtml(label, label === activeLabel) }),
      )
    }
  }, [activeLabel])

  return (
    <div
      ref={container}
      role="region"
      aria-label={ariaLabel}
      className={cn('overflow-hidden rounded-card border border-line bg-map-bg', className)}
    />
  )
}
