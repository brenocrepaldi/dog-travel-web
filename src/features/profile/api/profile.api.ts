import type { User } from "@/types";

export const ProfileApi = {
  get: async (): Promise<Partial<User>> => {
    return {
      id: "1",
      name: "Breno Crepaldi",
      email: "client@example.com",
      role: "client",
      createdAt: "2024-01-01T00:00:00Z",
    };
  },

  update: async (data: Partial<Omit<User, "id" | "role" | "createdAt">>): Promise<void> => {
    // Phase 2: api.patch('/profile', data)
    void data;
  },
};
