'use client';

import { useRef } from 'react';
import Map, { Marker, Layer, Source } from 'react-map-gl/mapbox';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Phone, MessageSquare, Compass, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useWalkLocation } from '@/features/tracking/hooks/use-tracking';
import { useWalkById } from '@/features/walks/hooks/use-walks';
import { liveTrackingRoute } from '@/lib/mock-data';

export default function MapTracker({ walkId }: { walkId: string }) {
	const { data: walk } = useWalkById(walkId);
	const { data: location, isLoading } = useWalkLocation(walkId);

	// Fallback coordinates from mock when real location not available
	const fallbackRef = useRef(liveTrackingRoute[0]);
	const [lng, lat] = location
		? [location.lng, location.lat]
		: fallbackRef.current;

	const walkerParticipant = walk?.participants.find((p) => p.role === 'walker');
	const walkerName = walkerParticipant?.name ?? 'Passeador';
	const walkerPhone = walkerParticipant?.phone;
	const petNames = walk?.petNames?.join(', ') ?? 'Pet';

	// Build a simple path for the route line (just current point for live tracking)
	const routeFeatures = {
		type: 'FeatureCollection' as const,
		features: location
			? [
					{
						type: 'Feature' as const,
						geometry: { type: 'LineString' as const, coordinates: [[lng, lat]] },
						properties: {},
					},
				]
			: [],
	};

	if (isLoading) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center bg-muted/20 h-full w-full">
				<Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
				<div className="text-muted-foreground text-sm font-medium">Localizando passeador...</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-full flex-1">
			{/* ─── Mapbox Map ─── */}
			<Map
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
				initialViewState={{ longitude: lng, latitude: lat, zoom: 15 }}
				mapStyle="mapbox://styles/mapbox/streets-v12"
				style={{
					width: '100%',
					height: '100%',
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
				}}
				attributionControl={false}
			>
				{routeFeatures.features.length > 0 && (
					<Source id="route" type="geojson" data={routeFeatures}>
						<Layer
							id="route-line"
							type="line"
							paint={{ 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': 0.8 }}
						/>
					</Source>
				)}

				<Marker longitude={lng} latitude={lat} anchor="center">
					<div className="w-10 h-10 bg-primary text-primary-foreground rounded-full border-2 border-white flex items-center justify-center shadow-lg text-lg">
						🦮
					</div>
				</Marker>
			</Map>

			{/* ─── Status Bar (Top) ─── */}
			<div className="absolute top-4 left-4 right-4 z-[1000] flex justify-between items-start pointer-events-none">
				<Card className="pointer-events-auto shadow-lg border-primary/20 backdrop-blur-md bg-background/90 max-w-sm">
					<CardContent className="p-4 flex items-center gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<Badge
									variant="default"
									className="bg-green-500 hover:bg-green-600 text-[10px] px-1.5 py-0"
								>
									Em andamento
								</Badge>
								{walk && (
									<span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
										<Compass className="h-3 w-3" />
										{walk.durationMinutes} min
									</span>
								)}
							</div>
							<p className="font-semibold text-sm leading-tight text-foreground">
								Passeando com {petNames}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* ─── Walker Info Card (Bottom) ─── */}
			<div className="absolute bottom-4 left-4 right-4 z-[1000] flex justify-center pointer-events-none">
				<Card className="pointer-events-auto w-full max-w-md shadow-xl border-border bg-background">
					<CardContent className="p-4 sm:p-5">
						<div className="flex items-center justify-between gap-4 mb-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
									{walkerName.charAt(0)}
								</div>
								<div>
									<p className="font-semibold text-foreground">{walkerName}</p>
								</div>
							</div>
						</div>

						<div className="flex gap-2">
							{walkerPhone && (
								<Link
									href={`tel:${walkerPhone}`}
									className={cn(buttonVariants({ variant: 'outline' }), 'flex-1 bg-background')}
								>
									<Phone className="h-4 w-4 mr-2" />
									Ligar
								</Link>
							)}
							<Link
								href={`/walks/${walkId}/chat`}
								className={cn(
									buttonVariants({ variant: walkerPhone ? 'default' : 'outline' }),
									'flex-1',
									!walkerPhone && 'bg-background',
								)}
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
