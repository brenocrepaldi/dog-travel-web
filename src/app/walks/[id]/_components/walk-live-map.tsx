'use client';

import Image from 'next/image';
import Map, { Marker } from 'react-map-gl/mapbox';
import { useSession } from 'next-auth/react';
import { MapPin } from 'lucide-react';
import { useWalkLocation, useLocationBroadcast } from '@/features/tracking/hooks/use-tracking';

type Pet = { name: string; photoUrl?: string | null };

interface Props {
  walkId: string;
  startLat?: number | null;
  startLng?: number | null;
  pets?: Pet[];
  walkerAvatarUrl?: string | null;
}

function DogMarker({ pets = [], walkerAvatarUrl }: { pets: Pet[]; walkerAvatarUrl?: string | null }) {
  const firstPhoto = pets.find((p) => p.photoUrl)?.photoUrl ?? null;
  const count = pets.length;

  return (
    <div className="relative flex items-center justify-center">
      <span className="absolute h-14 w-14 animate-ping rounded-full bg-primary/20" />
      <div className="relative h-11 w-11 overflow-hidden rounded-full border-[3px] border-white bg-amber-100 shadow-lg">
        {firstPhoto ? (
          <Image src={firstPhoto} alt={pets[0]?.name ?? 'Cão'} fill sizes="44px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl">🦮</div>
        )}
      </div>
      {/* Walker avatar — overlaid bottom-right of the dog bubble */}
      {walkerAvatarUrl && (
        <div className="absolute -bottom-1 -right-1 h-5 w-5 overflow-hidden rounded-full border-2 border-white shadow-sm">
          <Image src={walkerAvatarUrl} alt="Passeador" fill sizes="20px" className="object-cover" />
        </div>
      )}
      {count > 1 && !walkerAvatarUrl && (
        <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary text-[10px] font-bold text-primary-foreground shadow">
          {count}
        </div>
      )}
    </div>
  );
}

export default function WalkLiveMap({ walkId, startLat, startLng, pets = [], walkerAvatarUrl }: Props) {
  const { data: session } = useSession();
  const isWalker = session?.user?.role === 'walker';

  const { data: location } = useWalkLocation(walkId);

  useLocationBroadcast(walkId, isWalker);

  const lat = location?.lat ?? startLat ?? -23.55;
  const lng = location?.lng ?? startLng ?? -46.63;

  return (
    <div className="relative w-full h-full">
      <Map
        key={`${lat},${lng}`}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude: lng, latitude: lat, zoom: 16 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
        scrollZoom={false}
        dragPan={false}
        doubleClickZoom={false}
        touchZoomRotate={false}
      >
        {/* Start point pin */}
        {startLat != null && startLng != null && (
          <Marker longitude={startLng} latitude={startLat} anchor="bottom">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-md">
              <MapPin className="h-3.5 w-3.5 text-white" />
            </div>
          </Marker>
        )}

        {/* Live walker position — dog photo or emoji fallback */}
        {location && (
          <Marker longitude={location.lng} latitude={location.lat} anchor="center">
            <DogMarker pets={pets} walkerAvatarUrl={walkerAvatarUrl} />
          </Marker>
        )}
      </Map>
    </div>
  );
}
