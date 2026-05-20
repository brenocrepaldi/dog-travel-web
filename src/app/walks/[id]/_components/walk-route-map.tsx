"use client";

import Map, { Marker, Layer, Source } from "react-map-gl/mapbox";

// Mock route coordinates (São Paulo) keyed by walk ID.
// In production these would come from the GPS trail stored per walk.
const MOCK_ROUTES: Record<string, [number, number][]> = {
  "1": [
    [-46.6333, -23.5505],
    [-46.6340, -23.5512],
    [-46.6348, -23.5518],
    [-46.6356, -23.5526],
    [-46.6365, -23.5535],
    [-46.6374, -23.5545],
    [-46.6383, -23.5556],
  ],
  "2": [
    [-46.6536, -23.5651],
    [-46.6543, -23.5663],
    [-46.6550, -23.5676],
    [-46.6557, -23.5691],
    [-46.6563, -23.5706],
    [-46.6569, -23.5720],
    [-46.6574, -23.5745],
  ],
};

export default function WalkRouteMap({ walkId }: { walkId: string }) {
  const route = MOCK_ROUTES[walkId];
  if (!route) return null;

  const lngs   = route.map(([lng]) => lng);
  const lats   = route.map(([, lat]) => lat);
  const bounds: [[number, number], [number, number]] = [
    [Math.min(...lngs) - 0.0015, Math.min(...lats) - 0.0015],
    [Math.max(...lngs) + 0.0015, Math.max(...lats) + 0.0015],
  ];

  const [startLng, startLat] = route[0];
  const [endLng,   endLat]   = route[route.length - 1];

  const geojson = {
    type: "FeatureCollection" as const,
    features: [
      {
        type:       "Feature" as const,
        geometry:   { type: "LineString" as const, coordinates: route },
        properties: {},
      },
    ],
  };

  return (
    <div className="relative w-full h-full">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ bounds, fitBoundsOptions: { padding: 52 } }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        scrollZoom={false}
      >
        {/* Route: white halo behind primary line */}
        <Source id="walk-route" type="geojson" data={geojson}>
          <Layer
            id="route-halo"
            type="line"
            paint={{ "line-color": "#ffffff", "line-width": 7, "line-opacity": 0.7 }}
          />
          <Layer
            id="route-line"
            type="line"
            paint={{ "line-color": "#6366f1", "line-width": 4, "line-opacity": 0.95 }}
          />
        </Source>

        {/* Start marker */}
        <Marker longitude={startLng} latitude={startLat} anchor="center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[11px] font-bold text-white shadow-md">
            A
          </div>
        </Marker>

        {/* End marker */}
        <Marker longitude={endLng} latitude={endLat} anchor="center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-500 text-[11px] font-bold text-white shadow-md">
            B
          </div>
        </Marker>
      </Map>
    </div>
  );
}
