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
