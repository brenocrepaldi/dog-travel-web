import { walkers } from "@/lib/mock-data";
import type { WalkerProfile } from "@/types";

export interface WalkerFilters {
  query?: string;
  size?: string;
}

export const WalkersApi = {
  list: async (filters?: WalkerFilters): Promise<WalkerProfile[]> => {
    if (!filters) return walkers;

    const { query = "", size = "" } = filters;
    return walkers.filter((w) => {
      const textSource =
        `${w.name} ${w.location} ${w.tags.join(" ")} ${w.behaviorExpertise.join(" ")}`.toLowerCase();
      const matchesQuery = !query.trim() || textSource.includes(query.toLowerCase());
      const matchesSize = !size || w.supportedSizes.includes(size as WalkerProfile["supportedSizes"][number]);
      return matchesQuery && matchesSize;
    });
  },

  getById: async (id: string): Promise<WalkerProfile | undefined> => {
    return walkers.find((w) => w.id === id);
  },
};
