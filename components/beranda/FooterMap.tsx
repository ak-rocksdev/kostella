'use client'

import { useEffect, useRef } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { grogolMap } from '@/lib/content'

/**
 * Neighbourhood level with the buildings pinned by number — never a national
 * map with five pins. Leaflet loads on the client only; the container renders
 * server-side so the footer's layout is stable before the tiles arrive.
 */
export function FooterMap() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = container.current
    if (!element) return

    let map: LeafletMap | undefined
    let cancelled = false

    void (async () => {
      const L = (await import('leaflet')).default
      if (cancelled) return

      map = L.map(element, { scrollWheelZoom: false }).setView(grogolMap.center, grogolMap.zoom)

      L.tileLayer('https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
      }).addTo(map)

      for (const marker of grogolMap.markers) {
        L.marker(marker.position, {
          icon: L.divIcon({
            className: '',
            // DivIcon defaults to a 12x12 box, which clips the number to one
            // digit. Clearing it lets the plate size to its own label.
            iconSize: undefined,
            html: `<div style="background:var(--color-plum);color:#fff;font:500 12px var(--font-mono);padding:3px 7px;border-radius:var(--radius-badge);white-space:nowrap;box-shadow:0 1px 3px rgba(22,23,26,.3)">${marker.label}</div>`,
          }),
        }).addTo(map)
      }
    })()

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [])

  return (
    <div
      ref={container}
      role="region"
      aria-label="Peta gedung Kostella di Grogol, Jakarta Barat"
      className="h-[300px] overflow-hidden rounded-card border border-line"
    />
  )
}
