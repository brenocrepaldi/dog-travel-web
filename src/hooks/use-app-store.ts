import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Pet, Walk, ChatMessage } from "@/types";

// ─── Auth Slice ───────────────────────────────────────────────────────────────
interface AuthSlice {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

// ─── Pets Slice ───────────────────────────────────────────────────────────────
interface PetsSlice {
  pets: Pet[];
  setPets: (pets: Pet[]) => void;
  addPet: (pet: Pet) => void;
  removePet: (petId: string) => void;
}

// ─── Walk Slice ───────────────────────────────────────────────────────────────
interface WalkSlice {
  activeWalk: Walk | null;
  setActiveWalk: (walk: Walk | null) => void;
  walkerLocation: { lat: number; lng: number } | null;
  setWalkerLocation: (location: { lat: number; lng: number } | null) => void;
}

// ─── Chat Slice ───────────────────────────────────────────────────────────────
interface ChatSlice {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

// ─── Combined Store ───────────────────────────────────────────────────────────
type AppStore = AuthSlice & PetsSlice & WalkSlice & ChatSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // Pets
      pets: [],
      setPets: (pets) => set({ pets }),
      addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
      removePet: (petId) =>
        set((state) => ({ pets: state.pets.filter((p) => p.id !== petId) })),

      // Walk
      activeWalk: null,
      setActiveWalk: (walk) => set({ activeWalk: walk }),
      walkerLocation: null,
      setWalkerLocation: (location) => set({ walkerLocation: location }),

      // Chat
      messages: [],
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "dogtravel-storage",
      // Only persist user and pets to localStorage; walk/chat should not be persisted
      partialize: (state) => ({ user: state.user, pets: state.pets }),
    }
  )
);
