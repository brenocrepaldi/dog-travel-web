import type { User } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable store — used only when API is not configured
let myProfileStore: Partial<User> = {
  id: "1",
  name: "Breno Crepaldi",
  email: "client@example.com",
  role: "client",
  createdAt: "2024-01-01T00:00:00Z",
};

export const ProfileApi = {
  get: async (): Promise<Partial<User>> => {
    if (!isApiConfigured) {
      return { ...myProfileStore };
    }
    return api.get<Partial<User>>("/profile").then((r) => r.data);
  },

  update: async (data: Partial<Omit<User, "id" | "role" | "createdAt">>): Promise<void> => {
    if (!isApiConfigured) {
      myProfileStore = { ...myProfileStore, ...data };
      return;
    }
    await api.patch("/profile", data);
  },
};
