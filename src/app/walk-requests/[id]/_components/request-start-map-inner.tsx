'use client';

import { useEffect, useRef, useState } from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';

interface Props {
  lat: number;
  lng: number;
  walkerAvatarUrl?: string | null;
  walkerName?: string;
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function RequestStartMapInner({ lat, lng, walkerAvatarUrl, walkerName }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [walkerPos, setWalkerPos] = useState<{ lat: number; lng: number } | null>(null);

  // Get walker's current position
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setWalkerPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}, // silently ignore permission denied / unavailable
      { enableHighAccuracy: true, timeout: 8_000 },
    );
  }, []);

  // Fit bounds to show both pins once map is ready and walker position is known
  useEffect(() => {
    if (!mapLoaded || !walkerPos || !mapRef.current) return;
    mapRef.current.fitBounds(
      [
        [Math.min(lng, walkerPos.lng), Math.min(lat, walkerPos.lat)],
        [Math.max(lng, walkerPos.lng), Math.max(lat, walkerPos.lat)],
      ],
      { padding: 80, duration: 800, maxZoom: 15 },
    );
  }, [mapLoaded, walkerPos, lat, lng]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: lng, latitude: lat, zoom: 14 }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100%' }}
      attributionControl={false}
      onLoad={() => setMapLoaded(true)}
    >
      {/* Walk start — green pin */}
      <Marker longitude={lng} latitude={lat} anchor="bottom">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg shadow-emerald-500/30">
          <MapPin className="h-5 w-5 text-white" />
        </div>
      </Marker>

      {/* Walker position — avatar bubble with pulsing ring */}
      {walkerPos && (
        <Marker longitude={walkerPos.lng} latitude={walkerPos.lat} anchor="center">
          <div className="relative">
            <span className="absolute inset-0 -m-2 animate-ping rounded-full bg-primary/25" />
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-[3px] border-white shadow-lg">
              {walkerAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={walkerAvatarUrl} alt={walkerName ?? 'Você'} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                  {walkerName ? getInitials(walkerName) : '?'}
                </div>
              )}
            </div>
          </div>
        </Marker>
      )}
    </Map>
  );
}
