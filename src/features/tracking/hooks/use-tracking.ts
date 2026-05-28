import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrackingApi } from "../api/tracking.api";

export function useWalkLocation(walkId: string) {
  return useQuery({
    queryKey: ["tracking", walkId],
    queryFn: () => TrackingApi.getLocation(walkId),
    enabled: Boolean(walkId),
    refetchInterval: 5_000, // poll every 5s — replace with WebSocket subscription when available
    staleTime: 0,
  });
}

export function useWalkRoute(walkId: string) {
  return useQuery({
    queryKey: ["tracking", walkId, "route"],
    queryFn: () => TrackingApi.getRoute(walkId),
    enabled: Boolean(walkId),
  });
}

/**
 * Used by the walker during an active walk to continuously broadcast their GPS
 * position to the backend. Starts watching when `active` is true and stops on
 * unmount or when `active` becomes false.
 */
export function useLocationBroadcast(walkId: string, active: boolean) {
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || !walkId || typeof navigator === "undefined") return;

    if (!navigator.geolocation) {
      console.warn("[tracking] Geolocation API not available in this browser.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        TrackingApi.updateLocation(walkId, coords.latitude, coords.longitude).catch(() => {
          // Silent fail — next position update will retry automatically
        });
      },
      (err) => {
        console.warn("[tracking] Geolocation error:", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 10_000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [walkId, active]);
}
