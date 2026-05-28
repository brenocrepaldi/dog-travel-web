import { clientStats as seedClientStats, walkerStats as seedWalkerStats } from "@/lib/mock-data";
import type { ClientStats, WalkerStats } from "@/types";
import api, { isApiConfigured } from "@/services/api";

export const StatsApi = {
  getClientStats: async (): Promise<ClientStats> => {
    if (!isApiConfigured) {
      return { ...seedClientStats };
    }
    return api.get<ClientStats>("/me/stats").then((r) => r.data);
  },

  getWalkerStats: async (): Promise<WalkerStats> => {
    if (!isApiConfigured) {
      return { ...seedWalkerStats };
    }
    return api.get<WalkerStats>("/walkers/me/stats").then((r) => r.data);
  },
};
