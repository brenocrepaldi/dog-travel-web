import { walkers } from "@/lib/mock-data";
import type { WalkerProfile } from "@/types";
import api, { isApiConfigured } from "@/services/api";

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
};
