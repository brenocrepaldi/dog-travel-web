'use client';

import { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquare,
  PawPrint,
  Phone,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useWalkLocation, useLocationBroadcast } from '@/features/tracking/hooks/use-tracking';
import { useWalkById } from '@/features/walks/hooks/use-walks';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Pet = { name: string; photoUrl?: string | null };

function DogMarker({ pets }: { pets: Pet[] }) {
  const firstPhoto = pets.find((p) => p.photoUrl)?.photoUrl ?? null;
  const count = pets.length;
  return (
    <div className="relative flex items-center justify-center">
      <span className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
      <div className="relative h-12 w-12 overflow-hidden rounded-full border-[3px] border-white bg-amber-100 shadow-lg">
        {firstPhoto ? (
          <img src={firstPhoto} alt={pets[0]?.name ?? 'Cão'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">🦮</div>
        )}
      </div>
      {count > 1 && (
        <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-primary text-[10px] font-bold text-primary-foreground shadow">
          {count}
        </div>
      )}
    </div>
  );
}

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

function formatCountdown(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function useCountdown(startedAt?: string | null, durationMinutes?: number) {
  const [remaining, setRemaining] = useState<number>(() => {
    if (!startedAt || !durationMinutes) return 0;
    const endMs = new Date(startedAt).getTime() + durationMinutes * 60 * 1000;
    return Math.max(0, Math.ceil((endMs - Date.now()) / 1000));
  });

  const done = remaining === 0;

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [done]);

  const total = (durationMinutes ?? 0) * 60;
  const progress = total > 0 ? Math.min(100, ((total - remaining) / total) * 100) : 100;
  return { remaining, progress, done };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MapTracker({ walkId }: { walkId: string }) {
  const { data: session } = useSession();
  const { data: walk } = useWalkById(walkId);
  const { data: location, isLoading } = useWalkLocation(walkId);

  const isWalker = session?.user?.role === 'walker';
  const isInProgress = walk?.status === 'in_progress';

  useLocationBroadcast(walkId, isWalker && isInProgress);

  const pets: Pet[] = walk?.pets?.length
    ? walk.pets
    : (walk?.petNames?.map((name) => ({ name })) ?? []);

  const walkerParticipant = walk?.participants.find((p) => p.role === 'walker');
  const walkerName = walkerParticipant?.name ?? 'Passeador';
  const walkerPhone = walkerParticipant?.phone ?? null;

  const { remaining, progress, done: timeDone } = useCountdown(walk?.startedAt, walk?.durationMinutes);

  // ── Loading state ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <span className="absolute h-full w-full animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Localizando o passeador…</p>
      </div>
    );
  }

  const hasLocation = !!location;
  const mapLat = location?.lat ?? walk?.startLat ?? -23.55;
  const mapLng = location?.lng ?? walk?.startLng ?? -46.63;

  return (
    <div className="relative h-full w-full flex-1">

      {/* ── Map ───────────────────────────────────────────────────── */}
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{ longitude: mapLng, latitude: mapLat, zoom: hasLocation ? 17 : 15 }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        attributionControl={false}
      >
        {/* Start location pin */}
        {walk?.startLat != null && walk?.startLng != null && (
          <Marker longitude={walk.startLng} latitude={walk.startLat} anchor="bottom">
            <div className="group relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-md">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              {/* label */}
              <div className="mt-1 whitespace-nowrap rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow backdrop-blur-sm">
                Partida
              </div>
            </div>
          </Marker>
        )}

        {/* Dog/walker marker */}
        {location && (
          <Marker longitude={location.lng} latitude={location.lat} anchor="center">
            <DogMarker pets={pets} />
          </Marker>
        )}
      </Map>

      {/* ── No-location overlay (shows over the static start-centred map) ── */}
      {!hasLocation && (
        <div className="pointer-events-none absolute inset-0 z-[500] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/20 bg-background/90 px-6 py-5 text-center shadow-xl backdrop-blur-md">
            <PawPrint className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-semibold text-foreground">Aguardando localização…</p>
            <p className="max-w-[220px] text-xs leading-relaxed text-muted-foreground">
              O mapa será atualizado assim que o passeador enviar sua posição
            </p>
          </div>
        </div>
      )}

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute left-4 right-4 top-4 z-[1000] flex items-center gap-2.5">

        {/* Back button */}
        <Link
          href={`/walks/${walkId}`}
          aria-label="Voltar"
          className="pointer-events-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-background/85 shadow-lg backdrop-blur-md text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        {/* Status pill */}
        <div className="pointer-events-auto flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-white/20 bg-background/85 px-4 py-2.5 shadow-lg backdrop-blur-md">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="truncate text-sm font-semibold text-foreground">
            {walk?.petNames?.join(' & ') ?? 'Passeio em andamento'}
          </span>
          {walk?.durationMinutes && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">
              {walk.durationMinutes} min
            </span>
          )}
        </div>

        {/* Countdown chip (walker only) */}
        {isWalker && isInProgress && walk?.startedAt && (
          <div className={cn(
            'pointer-events-auto flex shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-background/85 px-3.5 py-2.5 shadow-lg backdrop-blur-md',
            timeDone && 'border-emerald-500/40 bg-emerald-500/10',
          )}>
            {timeDone
              ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              : <Timer className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className={cn(
              'font-mono text-sm font-bold tabular-nums',
              timeDone ? 'text-emerald-600' : 'text-foreground',
            )}>
              {timeDone ? '00:00' : formatCountdown(remaining)}
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom card ───────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-[1000] flex justify-center">
        {isWalker ? (
          /* ── Walker card ── */
          <div className="pointer-events-auto w-full max-w-md space-y-4 rounded-2xl border border-white/20 bg-background/92 p-5 shadow-xl backdrop-blur-md">

            {/* Pet row */}
            <div className="flex flex-wrap items-center gap-3">
              {pets.map((pet, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-amber-200 bg-amber-50 shadow-sm">
                    {pet.photoUrl ? (
                      <img src={pet.photoUrl} alt={pet.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <PawPrint className="h-4 w-4 text-amber-500" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{pet.name}</span>
                </div>
              ))}
              {walk?.startAddress && (
                <div className="flex min-w-0 items-center gap-1.5 ml-auto">
                  <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <span className="truncate text-xs text-muted-foreground">{walk.startAddress}</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {walk?.startedAt && (
              <div className="space-y-1.5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-1000 ease-linear',
                      timeDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-primary/70',
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Math.round(progress)}% do passeio concluído</span>
                  {timeDone
                    ? <span className="font-medium text-emerald-600">Tempo cumprido ✓</span>
                    : <span>{formatCountdown(remaining)} restantes</span>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href={`/walks/${walkId}`}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'flex-1 gap-1.5 bg-background/60',
                )}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar
              </Link>
              <Link
                href={`/walks/${walkId}/chat`}
                className={cn(buttonVariants({ size: 'sm' }), 'flex-1 gap-1.5')}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat com cliente
              </Link>
            </div>
          </div>
        ) : (
          /* ── Client card ── */
          <div className="pointer-events-auto w-full max-w-md space-y-4 rounded-2xl border border-white/20 bg-background/92 p-5 shadow-xl backdrop-blur-md">

            {/* Walker info */}
            <div className="flex items-center gap-3">
              {walk?.walkerAvatarUrl ? (
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm">
                  <img src={walk.walkerAvatarUrl} alt={walkerName} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                  {initials(walkerName)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{walkerName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Passeando com {walk?.petNames?.join(' & ') ?? '…'}
                </p>
              </div>
              {/* Live indicator */}
              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Ao vivo
              </div>
            </div>

            {/* Pet row */}
            {pets.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5">
                {pets.map((pet, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-amber-200 bg-amber-50 shadow-sm">
                      {pet.photoUrl ? (
                        <img src={pet.photoUrl} alt={pet.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PawPrint className="h-3 w-3 text-amber-500" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-foreground">{pet.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {walkerPhone && (
                <Link
                  href={`tel:${walkerPhone}`}
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'flex-1 gap-1.5 bg-background/60',
                  )}
                >
                  <Phone className="h-3.5 w-3.5" />
                  Ligar
                </Link>
              )}
              <Link
                href={`/walks/${walkId}/chat`}
                className={cn(
                  buttonVariants({ variant: walkerPhone ? 'default' : 'outline', size: 'sm' }),
                  'flex-1 gap-1.5',
                  !walkerPhone && 'bg-background/60',
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
