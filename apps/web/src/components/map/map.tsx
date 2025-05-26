import { useEffect, useRef, useState } from "react"
// @ts-ignore
import mapboxgl from "mapbox-gl"

const TreasureHuntMap = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng] = useState(2.3522)
  const [lat] = useState(48.8566)
  const [zoom] = useState(15)

  // Game state
  const [score, setScore] = useState(0)
  const [digCount, setDigCount] = useState(0)
  const [digSites, setDigSites] = useState<
    Array<{
      id: number
      lng: number
      lat: number
      type: string
      treasureType?: string
      treasureName?: string
      treasureValue?: number
    }>
  >([])
  const [foundTreasures, setFoundTreasures] = useState<number[]>([])
  const [recentDig, setRecentDig] = useState<
    { type: "treasure"; treasure: any } | { type: "empty" } | null
  >(null)

  // Hidden treasures in Paris (invisible to user initially)
  const hiddenTreasures = useRef([
    {
      id: 1,
      lng: 2.2945,
      lat: 48.8584,
      type: "gold",
      value: 100,
      name: "Napoléon Gold Coin",
    },
    {
      id: 2,
      lng: 2.3522,
      lat: 48.8566,
      type: "gem",
      value: 200,
      name: "Royal Ruby",
    },
    {
      id: 3,
      lng: 2.3376,
      lat: 48.8606,
      type: "artifact",
      value: 300,
      name: "Medieval Chalice",
    },
    {
      id: 4,
      lng: 2.3488,
      lat: 48.8534,
      type: "gold",
      value: 150,
      name: "Louis XIV Gold Bar",
    },
    {
      id: 5,
      lng: 2.2735,
      lat: 48.8606,
      type: "gem",
      value: 250,
      name: "Crown Jewel Diamond",
    },
    {
      id: 6,
      lng: 2.32,
      lat: 48.8867,
      type: "artifact",
      value: 400,
      name: "Sacred Grail",
    },
  ])

  useEffect(() => {
    if (typeof mapboxgl === "undefined") {
      console.error("Mapbox GL JS is not loaded")
      return
    }

    if (map.current) return

    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWVyb25tZW4iLCJhIjoiY21hemcxa2IxMGJnMDJsczhwZ3lkNTExZyJ9.4EJMuYXKPKUpvs2X3fdK1w"

    // Try to load camera state from localStorage
    let initialCenter: [number, number] = [lng, lat]
    let initialZoom = zoom
    let initialPitch = 60
    let initialBearing = -17.6
    const savedCamera = localStorage.getItem("treasurehunt_camera")
    if (savedCamera) {
      try {
        const cam = JSON.parse(savedCamera)
        if (cam.center && Array.isArray(cam.center)) {
          initialCenter = cam.center
        } else if (
          cam.center &&
          cam.center.lng !== undefined &&
          cam.center.lat !== undefined
        ) {
          initialCenter = [cam.center.lng, cam.center.lat]
        }
        if (typeof cam.zoom === "number") initialZoom = cam.zoom
        if (typeof cam.pitch === "number") initialPitch = cam.pitch
        if (typeof cam.bearing === "number") initialBearing = cam.bearing
      } catch {}
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      center: initialCenter,
      zoom: initialZoom,
      pitch: initialPitch,
      bearing: initialBearing,
      antialias: true,
    })

    // Set cursor after map is created
    map.current.on("load", () => {
      map.current!.getCanvas().style.cursor = "crosshair"

      // Add 3D buildings first
      add3DBuildingsLayer()

      // Add click event for digging
      map.current!.on("click", handleDigAction)

      // Initialize dig sites layer
      initializeDigSitesLayer()

      // Add custom 3D controls
      addCustom3DControls()
    })

    // Add controls
    map.current.addControl(new mapboxgl.NavigationControl())
  }, [lng, lat, zoom])

  const add3DBuildingsLayer = () => {
    // Wait for the style to load
    const layers = map.current!.getStyle().layers as any[]
    if (!layers) return

    // Find the first symbol layer to insert 3D buildings before labels
    const labelLayerId = layers.find(
      (layer) => layer.type === "symbol" && layer.layout["text-field"],
    )?.id

    // Add 3D buildings layer
    map.current.addLayer(
      {
        id: "add-3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["get", "height"],
            0,
            "#e0e0e0",
            50,
            "#d0d0d0",
            100,
            "#c0c0c0",
            200,
            "#b0b0b0",
          ],
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "height"],
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "min_height"],
          ],
          "fill-extrusion-opacity": 0.8,
        },
      },
      labelLayerId,
    )
  }

  const addCustom3DControls = () => {
    // Create custom control for 3D navigation
    class Custom3DControl {
      _map: mapboxgl.Map | undefined
      _container: HTMLDivElement | undefined
      onAdd(map: mapboxgl.Map) {
        this._map = map
        this._container = document.createElement("div")
        this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group"
        this._container.innerHTML = `
          <button type="button" title="Increase pitch (more 3D)" style="background: white; border: none; padding: 8px; font-size: 12px;">
            ⬆️
          </button>
          <button type="button" title="Decrease pitch (less 3D)" style="background: white; border: none; padding: 8px; font-size: 12px;">
            ⬇️
          </button>
          <button type="button" title="Rotate left" style="background: white; border: none; padding: 8px; font-size: 12px;">
            ⬅️
          </button>
          <button type="button" title="Rotate right" style="background: white; border: none; padding: 8px; font-size: 12px;">
            ➡️
          </button>
          <button type="button" title="Reset 3D view" style="background: white; border: none; padding: 8px; border-top: 1px solid #ddd; font-size: 12px;">
            🏠
          </button>
        `

        const buttons = this._container.querySelectorAll("button")

        // Increase pitch (more 3D)
        buttons[0].addEventListener("click", () => {
          const currentPitch = this._map!.getPitch()
          this._map!.easeTo({
            pitch: Math.min(60, currentPitch + 10),
            duration: 500,
          })
        })

        // Decrease pitch (less 3D)
        buttons[1].addEventListener("click", () => {
          const currentPitch = this._map!.getPitch()
          this._map!.easeTo({
            pitch: Math.max(0, currentPitch - 10),
            duration: 500,
          })
        })

        // Rotate left (counter-clockwise)
        buttons[2].addEventListener("click", () => {
          const currentBearing = this._map!.getBearing()
          this._map!.easeTo({ bearing: currentBearing - 30, duration: 500 })
        })

        // Rotate right (clockwise)
        buttons[3].addEventListener("click", () => {
          const currentBearing = this._map!.getBearing()
          this._map!.easeTo({ bearing: currentBearing + 30, duration: 500 })
        })

        // Reset 3D view
        buttons[4].addEventListener("click", () => {
          this._map!.easeTo({
            center: [lng, lat],
            zoom: zoom,
            pitch: 60,
            bearing: -17.6,
            duration: 1000,
          })
        })

        return this._container
      }

      onRemove() {
        if (this._container && this._container.parentNode) {
          this._container.parentNode.removeChild(this._container)
        }
        this._map = undefined
      }
    }

    map.current!.addControl(new Custom3DControl(), "top-right")
  }

  const initializeDigSitesLayer = () => {
    // Add source for dig sites
    map.current.addSource("dig-sites", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    })

    // Add layer for empty dig sites (holes)
    map.current.addLayer({
      id: "dig-holes",
      type: "circle",
      source: "dig-sites",
      filter: ["==", ["get", "type"], "empty"],
      paint: {
        "circle-radius": 8,
        "circle-color": "#8B4513",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#654321",
      },
    })

    // Add layer for treasure sites with 3D effect
    map.current.addLayer({
      id: "treasure-sites",
      type: "circle",
      source: "dig-sites",
      filter: ["==", ["get", "type"], "treasure"],
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 15, 8, 18, 15],
        "circle-color": [
          "match",
          ["get", "treasureType"],
          "gold",
          "#FFD700",
          "gem",
          "#FF1493",
          "artifact",
          "#9370DB",
          "#FFA500",
        ],
        "circle-stroke-width": 3,
        "circle-stroke-color": "#FFFFFF",
        "circle-opacity": 0.9,
        "circle-blur": 0.5,
        "circle-stroke-opacity": 1,
      },
    })

    // Add treasure icons with better visibility in 3D
    map.current.addLayer({
      id: "treasure-icons",
      type: "symbol",
      source: "dig-sites",
      filter: ["==", ["get", "type"], "treasure"],
      layout: {
        "text-field": [
          "match",
          ["get", "treasureType"],
          "gold",
          "💰",
          "gem",
          "💎",
          "artifact",
          "🏺",
          "✨",
        ],
        "text-size": ["interpolate", ["linear"], ["zoom"], 15, 16, 18, 24],
        "text-allow-overlap": true,
        "text-ignore-placement": true,
        "text-offset": [0, 0],
      },
      paint: {
        "text-halo-color": "#FFFFFF",
        "text-halo-width": 2,
        "text-halo-blur": 1,
      },
    })
  }

  const handleDigAction = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    const clickedLng = e.lngLat.lng
    const clickedLat = e.lngLat.lat

    // Check if we've already dug here (within 50m radius)
    const alreadyDug = digSites.some(
      (site) =>
        getDistance(clickedLat, clickedLng, site.lat, site.lng) < 0.0005,
    )

    if (alreadyDug) {
      showMessage("You've already dug here!", "warning")
      return
    }

    // Check for nearby treasures (within 100m radius)
    const nearbyTreasure = hiddenTreasures.current.find(
      (treasure) =>
        !foundTreasures.includes(treasure.id) &&
        getDistance(clickedLat, clickedLng, treasure.lat, treasure.lng) < 0.001,
    )

    const newDigSite = {
      id: Date.now(),
      lng: clickedLng,
      lat: clickedLat,
      type: nearbyTreasure ? "treasure" : "empty",
      treasureType: nearbyTreasure?.type,
      treasureName: nearbyTreasure?.name,
      treasureValue: nearbyTreasure?.value,
    }

    // Update dig sites
    const updatedDigSites = [...digSites, newDigSite]
    setDigSites(updatedDigSites)
    setDigCount((prev) => prev + 1)

    if (nearbyTreasure) {
      // Found treasure!
      setFoundTreasures((prev) => [...prev, nearbyTreasure.id])
      setScore((prev) => prev + nearbyTreasure.value)
      setRecentDig({ type: "treasure", treasure: nearbyTreasure })
      showTreasurePopup(e.lngLat, nearbyTreasure)
    } else {
      // Empty hole
      setRecentDig({ type: "empty" })
      showEmptyPopup(e.lngLat)
    }

    // Update map data
    updateDigSitesOnMap(updatedDigSites)
  }

  const updateDigSitesOnMap = (sites: typeof digSites) => {
    const geojsonData = {
      type: "FeatureCollection",
      features: sites.map((site) => ({
        type: "Feature",
        properties: {
          type: site.type,
          treasureType: site.treasureType,
          treasureName: site.treasureName,
          treasureValue: site.treasureValue,
        },
        geometry: {
          type: "Point",
          coordinates: [site.lng, site.lat],
        },
      })),
    }

    map.current.getSource("dig-sites").setData(geojsonData)
  }

  const showTreasurePopup = (
    lngLat: mapboxgl.LngLatLike,
    treasure: {
      id: number
      lng: number
      lat: number
      type: string
      value: number
      name: string
    },
  ) => {
    new mapboxgl.Popup({ closeOnClick: true, closeButton: true })
      .setLngLat(lngLat)
      .setHTML(
        `
        <div class="p-4 text-center">
          <div class="text-3xl mb-2">${getTreasureIcon(treasure.type)}</div>
          <h3 class="font-bold text-lg text-green-600">Treasure Found!</h3>
          <p class="font-semibold">${treasure.name}</p>
          <p class="text-sm text-gray-600">Value: $${treasure.value}</p>
          <div class="mt-2 text-yellow-500">✨ Amazing discovery! ✨</div>
        </div>
      `,
      )
      .addTo(map.current!)
  }

  const showEmptyPopup = (lngLat: mapboxgl.LngLatLike) => {
    new mapboxgl.Popup({ closeOnClick: true, closeButton: true })
      .setLngLat(lngLat)
      .setHTML(
        `
        <div class="p-3 text-center">
          <div class="text-2xl mb-2">🕳️</div>
          <h3 class="font-bold text-gray-600">Empty Hole</h3>
          <p class="text-sm text-gray-500">Nothing here... keep digging!</p>
        </div>
      `,
      )
      .addTo(map.current!)
  }

  const showMessage = (message: string, type: string = "info") => {
    const colors = {
      info: "bg-blue-100 text-blue-800",
      warning: "bg-yellow-100 text-yellow-800",
      success: "bg-green-100 text-green-800",
    }

    // You could implement a toast notification system here
    alert(message)
  }

  const getTreasureIcon = (type: string) => {
    switch (type) {
      case "gold":
        return "💰"
      case "gem":
        return "💎"
      case "artifact":
        return "🏺"
      default:
        return "✨"
    }
  }

  const getDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) => {
    return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2))
  }

  const resetGame = () => {
    setScore(0)
    setDigCount(0)
    setFoundTreasures([])
    setDigSites([])
    setRecentDig(null)

    // Clear map data
    if (map.current.getSource("dig-sites")) {
      map.current.getSource("dig-sites").setData({
        type: "FeatureCollection",
        features: [],
      })
    }
  }

  const saveCameraPosition = () => {
    if (!map.current) return
    const cameraState = {
      center: map.current.getCenter(),
      zoom: map.current.getZoom(),
      pitch: map.current.getPitch(),
      bearing: map.current.getBearing(),
    }
    localStorage.setItem("treasurehunt_camera", JSON.stringify(cameraState))
    showMessage("Camera position saved!", "success")
  }

  const getGameStatus = () => {
    const totalTreasures = hiddenTreasures.current.length
    const foundCount = foundTreasures.length
    const efficiency =
      digCount > 0 ? Math.round((foundCount / digCount) * 100) : 0

    return { totalTreasures, foundCount, efficiency }
  }

  const gameStatus = getGameStatus()

  return (
    <div className="w-full h-screen">
      {/* Game UI */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10 border-2 border-pink-200">
        <h2 className="text-xl font-bold mb-3 flex items-center text-purple-800">
          🇫🇷 Treasure Hunt Paris
        </h2>
        <button
          onClick={saveCameraPosition}
          className="mb-3 w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Save Camera Position
        </button>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className="font-bold text-green-600">${score}</span>
          </div>
          <div className="flex justify-between">
            <span>Digs:</span>
            <span className="font-bold">{digCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Treasures:</span>
            <span className="font-bold text-blue-600">
              {gameStatus.foundCount}/{gameStatus.totalTreasures}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Efficiency:</span>
            <span className="font-bold text-purple-600">
              {gameStatus.efficiency}%
            </span>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="mt-3 w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
        >
          Reset Game
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10 max-w-xs">
        <h3 className="font-bold mb-2">🏗️ 3D Treasure Hunt:</h3>
        <ul className="text-sm space-y-1">
          <li>🖱️ Click anywhere to dig</li>
          <li>🏢 Navigate around 3D buildings</li>
          <li>🎮 Use 3D controls (top-right)</li>
          <li>💰 Find hidden treasures</li>
          <li>⭐ Explore from different angles!</li>
        </ul>

        <div className="mt-3 pt-3 border-t">
          <h4 className="font-semibold text-sm mb-1">3D Controls:</h4>
          <div className="text-xs space-y-1">
            <div>🔺 More 3D view</div>
            <div>🔻 Less 3D view</div>
            <div>🔄 Rotate view</div>
            <div>🏠 Reset position</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <h4 className="font-semibold text-sm mb-1">Treasure Types:</h4>
          <div className="text-xs space-y-1">
            <div>💰 Gold ($100-150)</div>
            <div>💎 Gems ($200-250)</div>
            <div>🏺 Artifacts ($300-400)</div>
          </div>
        </div>
      </div>

      {/* Recent dig result */}
      {recentDig && (
        <div
          className={`absolute bottom-4 left-4 p-3 rounded-lg shadow-lg z-10 ${
            recentDig.type === "treasure"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {recentDig.type === "treasure" ? (
            <div className="flex items-center space-x-2">
              <span className="text-xl">
                {getTreasureIcon(recentDig.treasure.type)}
              </span>
              <div>
                <div className="font-bold">
                  Found: {recentDig.treasure.name}
                </div>
                <div className="text-sm">+${recentDig.treasure.value}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xl">🕳️</span>
              <div className="font-bold">Empty hole!</div>
            </div>
          )}
        </div>
      )}

      {/* Map */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Game completion */}
      {gameStatus.foundCount === gameStatus.totalTreasures && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-lg text-center shadow-xl">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="mb-2">You found all treasures!</p>
            <p className="text-lg font-bold text-green-600">
              Final Score: ${score}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Efficiency: {gameStatus.efficiency}% ({digCount} digs)
            </p>
            <button
              onClick={resetGame}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TreasureHuntMap
