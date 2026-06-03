'use client';

import Map, { Marker } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';

interface Props {
  lat: number;
  lng: number;
}

export default function RequestStartMapInner({ lat, lng }: Props) {
  return (
    <Map
      initialViewState={{ longitude: lng, latitude: lat, zoom: 14 }}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100%' }}
      attributionControl={false}
      interactive={false}
    >
      <Marker longitude={lng} latitude={lat} anchor="bottom">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg shadow-emerald-500/30">
          <MapPin className="h-5 w-5 text-white" />
        </div>
      </Marker>
    </Map>
  );
}
