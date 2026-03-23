"use client";

import { useEffect, useState } from "react";
import Map, { Marker, Layer, Source } from "react-map-gl/mapbox";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Phone, MessageSquare, Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_ROUTE: [number, number][] = [
  [-46.633308, -23.550520], // Start (longitude, latitude)
  [-46.634000, -23.551000],
  [-46.634500, -23.551500],
  [-46.635000, -23.552000], // Current pos (index 3)
];

export default function MapTracker({ walkId }: { walkId: string }) {
  const [currentPosIdx, setCurrentPosIdx] = useState(3);
  
  // Simulate live movement
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, listen to WebSockets here to update `currentPosIdx` or coordinates
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [lng, lat] = MOCK_ROUTE[currentPosIdx];
  const walkedPath = MOCK_ROUTE.slice(0, currentPosIdx + 1);

  // GeoJSON for the route line
  const routeFeatures = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        geometry: { type: "LineString" as const, coordinates: walkedPath },
        properties: {},
      },
    ],
  };

  return (
    <div className="relative w-full h-full flex-1">
      {/* ─── Mapbox Map ─── */}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 15,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        attributionControl={false}
      >
        <Source id="route" type="geojson" data={routeFeatures}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": "#3b82f6",
              "line-width": 5,
              "line-opacity": 0.8,
            }}
          />
        </Source>

        <Marker longitude={lng} latitude={lat} anchor="center">
          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full border-2 border-white flex items-center justify-center shadow-lg text-lg">
            🏃
          </div>
        </Marker>
      </Map>

      {/* ─── Overlay UI ─── */}
      {/* Status Bar (Top) */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
        <Card className="pointer-events-auto shadow-lg border-primary/20 backdrop-blur-md bg-background/90 max-w-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-[10px] px-1.5 py-0">
                  Em andamento
                </Badge>
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Compass className="h-3 w-3" />
                  12 min
                </span>
              </div>
              <p className="font-semibold text-sm leading-tight text-foreground">
                Passeando com Rex
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Walker Info Card (Bottom) */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
        <Card className="pointer-events-auto w-full max-w-md shadow-xl border-border bg-background">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                  C
                </div>
                <div>
                  <p className="font-semibold text-foreground">Carlos Silva</p>
                  <p className="text-xs font-medium text-amber-500">★ 4.9 (120 passeios)</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link
                href="tel:+5511999999999"
                className={cn(buttonVariants({ variant: "outline" }), "flex-1 bg-background")}
              >
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Link>
              <Link
                href={`/walks/${walkId}/chat`}
                className={cn(buttonVariants({ variant: "default" }), "flex-1")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
