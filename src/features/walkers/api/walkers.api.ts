import { walkers, walkerAvailability } from "@/lib/mock-data";
import type { WalkerProfile } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable store for availability
const availabilityStore: Record<string, boolean> = { ...walkerAvailability };

export interface WalkerFilters {
  query?: string;
  size?: string;
}

export const WalkersApi = {
  list: async (filters?: WalkerFilters): Promise<WalkerProfile[]> => {
    if (!isApiConfigured) {
      if (!filters) return walkers;

      const { query = "", size = "" } = filters;
      return walkers.filter((w) => {
        const textSource =
          `${w.name} ${w.location} ${w.tags.join(" ")} ${w.behaviorExpertise.join(" ")}`.toLowerCase();
        const matchesQuery = !query.trim() || textSource.includes(query.toLowerCase());
        const matchesSize = !size || w.supportedSizes.includes(size as WalkerProfile["supportedSizes"][number]);
        return matchesQuery && matchesSize;
      });
    }
    return api
      .get<WalkerProfile[]>("/walkers", { params: filters })
      .then((r) => r.data);
  },

  getById: async (id: string): Promise<WalkerProfile | undefined> => {
    if (!isApiConfigured) {
      return walkers.find((w) => w.id === id);
    }
    return api.get<WalkerProfile>(`/walkers/${id}`).then((r) => r.data);
  },

  getAvailability: async (walkerId: string): Promise<boolean> => {
    if (!isApiConfigured) {
      return availabilityStore[walkerId] ?? false;
    }
    return api
      .get<{ available: boolean }>(`/walkers/${walkerId}/availability`)
      .then((r) => r.data.available);
  },

  updateAvailability: async (walkerId: string, available: boolean): Promise<void> => {
    availabilityStore[walkerId] = available;
    if (!isApiConfigured) return;
    await api.patch(`/walkers/${walkerId}/availability`, { available });
  },
};
