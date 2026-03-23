"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Compass } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Fix missing marker icons in leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icon for the dog walker
const walkerIcon = L.divIcon({
  html: `<div class="w-10 h-10 bg-primary text-primary-foreground rounded-full border-2 border-white flex items-center justify-center shadow-lg text-lg">🏃</div>`,
  className: "bg-transparent",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_ROUTE: [number, number][] = [
  [-23.550520, -46.633308], // Start
  [-23.551000, -46.634000],
  [-23.551500, -46.634500],
  [-23.552000, -46.635000], // Current pos (index 3)
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

  const currentPos = MOCK_ROUTE[currentPosIdx];
  const walkedPath = MOCK_ROUTE.slice(0, currentPosIdx + 1);

  return (
    <div className="relative w-full h-full">
      {/* ─── Leaflet Map ─── */}
      <MapContainer
        center={currentPos}
        zoom={16}
        className="w-full h-full absolute inset-0 z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={walkedPath} color="hsl(var(--primary))" weight={5} opacity={0.8} />
        <Marker position={currentPos} icon={walkerIcon} />
      </MapContainer>

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
              <Button variant="outline" className="flex-1 bg-background" render={<Link href="tel:+5511999999999" />}>
                <Phone className="h-4 w-4 mr-2" />
                Ligar
              </Button>
              <Button className="flex-1" render={<Link href={`/walks/${walkId}/chat`} />}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
