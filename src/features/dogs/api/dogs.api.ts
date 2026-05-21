import { DEFAULT_CLIENT_PETS } from "@/lib/pets";
import type { Pet } from "@/types";

// Module-level store initialized with mock client pets
let dogsStore: Pet[] = DEFAULT_CLIENT_PETS.filter((p) => p.ownerId === "client_1");

export const DogsApi = {
  list: async (): Promise<Pet[]> => {
    return [...dogsStore];
  },

  create: async (pet: Omit<Pet, "id">): Promise<Pet> => {
    const maxId = dogsStore.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0);
    const newPet: Pet = { ...pet, id: String(maxId + 1) };
    dogsStore = [...dogsStore, newPet];
    return newPet;
  },

  update: async (id: string, data: Partial<Omit<Pet, "id">>): Promise<Pet> => {
    dogsStore = dogsStore.map((p) => (p.id === id ? { ...p, ...data } : p));
    const updated = dogsStore.find((p) => p.id === id);
    if (!updated) throw new Error("Pet não encontrado");
    return updated;
  },

  remove: async (id: string): Promise<void> => {
    dogsStore = dogsStore.filter((p) => p.id !== id);
  },
};
