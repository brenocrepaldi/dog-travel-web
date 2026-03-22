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

// ─── Payment Slice ────────────────────────────────────────────────────────────
interface PendingPayment {
  /** Price estimate shown to the client before confirming the walk */
  estimatedPrice: number;
  /** ID of the selected saved payment method */
  selectedMethodId: string | null;
}

interface PaymentSlice {
  pendingPayment: PendingPayment | null;
  setPendingPayment: (payment: PendingPayment) => void;
  clearPendingPayment: () => void;
}

// ─── UI Slice ─────────────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
  read: boolean;
}

interface UISlice {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  dismissNotification: (id: string) => void;
}

// ─── Combined Store ───────────────────────────────────────────────────────────
type AppStore = AuthSlice & PetsSlice & WalkSlice & ChatSlice & PaymentSlice & UISlice;

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

      // Payment — ephemeral, cleared after walk is confirmed
      pendingPayment: null,
      setPendingPayment: (payment) => set({ pendingPayment: payment }),
      clearPendingPayment: () => set({ pendingPayment: null }),

      // UI
      isSidebarOpen: true,
      setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              read: false,
            },
          ],
        })),
      dismissNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: "dogtravel-storage",
      // Only persist user and pets; all real-time + ephemeral state starts fresh
      partialize: (state) => ({ user: state.user, pets: state.pets }),
    }
  )
);
