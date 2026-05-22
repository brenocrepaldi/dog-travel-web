import type { User } from "@/types";
import api, { isApiConfigured } from "@/services/api";

export const ProfileApi = {
  get: async (): Promise<Partial<User>> => {
    if (!isApiConfigured) {
      return {
        id: "1",
        name: "Breno Crepaldi",
        email: "client@example.com",
        role: "client",
        createdAt: "2024-01-01T00:00:00Z",
      };
    }
    return api.get<Partial<User>>("/profile").then((r) => r.data);
  },

  update: async (data: Partial<Omit<User, "id" | "role" | "createdAt">>): Promise<void> => {
    if (!isApiConfigured) {
      void data;
      return;
    }
    await api.patch("/profile", data);
  },
};
