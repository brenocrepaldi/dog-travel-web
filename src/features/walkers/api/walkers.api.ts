import { walkers, walkerAvailability, walkerEarningsHistory, walkerBankAccountDefault } from "@/lib/mock-data";
import type { EarningsParams, PaymentHistoryItem, WalkerBankAccount, WalkerProfile, WalkerProfileUpdate } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable stores
const availabilityStore: Record<string, boolean> = { ...walkerAvailability };
let myWalkerProfileStore: WalkerProfile | null = null;
let myBankAccountStore: WalkerBankAccount = { ...walkerBankAccountDefault };

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

  getMe: async (): Promise<WalkerProfile | null> => {
    if (!isApiConfigured) {
      return myWalkerProfileStore ?? (walkers[0] ? { ...walkers[0] } : null);
    }
    return api.get<WalkerProfile>("/walkers/me").then((r) => r.data);
  },

  updateMe: async (data: WalkerProfileUpdate): Promise<void> => {
    if (!isApiConfigured) {
      const base = myWalkerProfileStore ?? walkers[0];
      if (base) myWalkerProfileStore = { ...base, ...data };
      return;
    }
    await api.patch("/walkers/me", data);
  },

  getEarnings: async (params?: EarningsParams): Promise<PaymentHistoryItem[]> => {
    if (!isApiConfigured) {
      return [...walkerEarningsHistory];
    }
    return api
      .get<PaymentHistoryItem[]>("/walkers/me/earnings", { params })
      .then((r) => r.data);
  },

  getBankAccount: async (): Promise<WalkerBankAccount> => {
    if (!isApiConfigured) {
      return { ...myBankAccountStore };
    }
    return api.get<WalkerBankAccount>("/walkers/me/bank-account").then((r) => r.data);
  },

  updateBankAccount: async (data: WalkerBankAccount): Promise<void> => {
    if (!isApiConfigured) {
      myBankAccountStore = { ...data };
      return;
    }
    await api.patch("/walkers/me/bank-account", data);
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
