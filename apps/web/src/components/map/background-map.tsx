import { useEffect, useRef, useState } from 'react';

interface BackgroundMapProps {
  className?: string;
}

interface Landmark {
  name: string;
  lng: number;
  lat: number;
}

declare global {
  interface Window {
    mapboxgl: {
      accessToken: string;
      Map: new (options: any) => any;
      Marker: new (element: HTMLElement) => any;
      Popup: new (options?: any) => any;
    };
  }
}

const BackgroundMap = ({ className = '' }: BackgroundMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [lng] = useState(2.3522);
  const [lat] = useState(48.8566);
  const [zoom] = useState(2);

  useEffect(() => {
    // Check if mapboxgl is available (loaded via CDN)
    if (
      typeof window !== 'undefined' &&
      window.mapboxgl &&
      mapContainer.current &&
      !map.current
    ) {
      const mapboxgl = window.mapboxgl;

      // Using public demo token - replace with your own for production
      mapboxgl.accessToken =
        'pk.eyJ1IjoiYWVyb25tZW4iLCJhIjoiY21hemcxa2IxMGJnMDJsczhwZ3lkNTExZyJ9.4EJMuYXKPKUpvs2X3fdK1w';

      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-v9',
          center: [lng, lat],
          zoom: zoom,
          projection: 'globe',
          interactive: false, // Disable interaction for background use
          attributionControl: false,
        });

        map.current.on('load', () => {
          // Add atmosphere for 3D globe effect
          map.current.setFog({
            color: 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6,
          });

          // Auto-rotate the globe with smooth animation
          let userInteracting = false;

          function spinGlobe() {
            const zoom = map.current.getZoom();
            if (!userInteracting && zoom < 5) {
              const distancePerSecond = 360 / 180; // Complete rotation in 3 minutes
              const center = map.current.getCenter();
              center.lng -= distancePerSecond;
              map.current.easeTo({
                center,
                duration: 1000,
                easing: (n: number) => n,
              });
            }
          }

          // Start spinning
          const spinInterval = setInterval(spinGlobe, 1000);

          // Store cleanup function
          (map.current as any)._cleanup = () => {
            clearInterval(spinInterval);
          };
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    return () => {
      if (map.current) {
        if ((map.current as any)._cleanup) {
          (map.current as any)._cleanup();
        }
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom]);

  return (
    <>
      {/* Add CSS for marker animations */}
      <style>
        {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
              transform: scale(1);
            }
            50% {
              box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
              transform: scale(1.1);
            }
            100% {
              box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
              transform: scale(1);
            }
          }
          
          @keyframes glow {
            0% {
              opacity: 0.8;
            }
            100% {
              opacity: 1;
            }
          }
          
          .treasure-marker:hover {
            transform: scale(1.2) !important;
            box-shadow: 0 0 30px rgba(255, 215, 0, 1) !important;
          }
        `}
      </style>
      <div
        ref={mapContainer}
        className={`w-full h-full ${className}`}
        style={{ minHeight: '100%' }}
      />
    </>
  );
};

export default BackgroundMap;
