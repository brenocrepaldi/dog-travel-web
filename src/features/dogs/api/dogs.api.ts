import { pets } from "@/lib/mock-data";
import type { Pet } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable store — mock only; not thread-safe across requests
let dogsStore: Pet[] = [...pets];

export const DogsApi = {
  list: async (): Promise<Pet[]> => {
    if (!isApiConfigured) {
      return [...dogsStore];
    }
    return api.get<Pet[]>("/dogs").then((r) => r.data);
  },

  create: async (pet: Omit<Pet, "id">): Promise<Pet> => {
    if (!isApiConfigured) {
      const maxId = dogsStore.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
      const newPet: Pet = { ...pet, id: String(maxId + 1) };
      dogsStore = [...dogsStore, newPet];
      return newPet;
    }
    return api.post<Pet>("/dogs", pet).then((r) => r.data);
  },

  update: async (id: string, data: Partial<Omit<Pet, "id">>): Promise<Pet> => {
    if (!isApiConfigured) {
      dogsStore = dogsStore.map((p) => (p.id === id ? { ...p, ...data } : p));
      const updated = dogsStore.find((p) => p.id === id);
      if (!updated) throw new Error("Pet não encontrado");
      return updated;
    }
    return api.patch<Pet>(`/dogs/${id}`, data).then((r) => r.data);
  },

  remove: async (id: string): Promise<void> => {
    if (!isApiConfigured) {
      dogsStore = dogsStore.filter((p) => p.id !== id);
      return;
    }
    await api.delete(`/dogs/${id}`);
  },
};
