import { walkLocations, liveTrackingRoute } from "@/lib/mock-data";
import type { WalkLocation } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable store
const locationStore: Record<string, WalkLocation> = { ...walkLocations };

export const TrackingApi = {
  getLocation: async (walkId: string): Promise<WalkLocation | null> => {
    if (!isApiConfigured) {
      return locationStore[walkId] ?? null;
    }
    return api
      .get<WalkLocation>(`/walks/${walkId}/location`)
      .then((r) => r.data)
      .catch(() => null);
  },

  // Walker reports their GPS position
  updateLocation: async (walkId: string, lat: number, lng: number): Promise<void> => {
    locationStore[walkId] = { walkId, lat, lng, updatedAt: new Date().toISOString() };
    if (!isApiConfigured) return;
    await api.patch(`/walks/${walkId}/location`, { lat, lng });
  },

  // Returns the full recorded GPS trail for a completed walk
  getRoute: async (walkId: string): Promise<[number, number][]> => {
    if (!isApiConfigured) {
      const { walkRoutes } = await import("@/lib/mock-data");
      return walkRoutes[walkId] ?? liveTrackingRoute;
    }
    return api
      .get<[number, number][]>(`/walks/${walkId}/route`)
      .then((r) => r.data);
  },
};
