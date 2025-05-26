import Hero from "@/components/hero/hero-section"
import Mapbox3DMarkers from "@/components/map/map"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <Mapbox3DMarkers />
    </div>
  )
}
