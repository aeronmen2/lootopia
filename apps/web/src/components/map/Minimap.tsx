import { useEffect, useRef } from "react"
// @ts-ignore
import mapboxgl from "mapbox-gl"

interface MinimapProps {
  onSelect: (lngLat: mapboxgl.LngLat) => void
  initialCenter: [number, number]
  initialZoom?: number
}

export default function Minimap({
  onSelect,
  initialCenter,
  initialZoom = 13,
}: MinimapProps) {
  const minimapContainer = useRef<HTMLDivElement | null>(null)
  const minimap = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (minimap.current) return
    minimap.current = new mapboxgl.Map({
      container: minimapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialCenter,
      zoom: initialZoom,
      interactive: true,
      attributionControl: false,
    })
    minimap.current.on("click", (e: mapboxgl.MapMouseEvent) => {
      onSelect(e.lngLat)
    })
    return () => {
      minimap.current?.remove()
    }
  }, [initialCenter, initialZoom, onSelect])

  return (
    <div
      ref={minimapContainer}
      style={{
        width: 220,
        height: 220,
        borderRadius: 8,
        overflow: "hidden",
        border: "2px solid #e5e7eb",
      }}
    />
  )
}
