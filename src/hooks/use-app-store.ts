import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Walk, ChatMessage } from "@/types";

// ─── Auth Slice ───────────────────────────────────────────────────────────────
interface AuthSlice {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

// ─── Active Walk Slice (real-time tracking only) ──────────────────────────────
interface WalkSlice {
  activeWalk: Walk | null;
  setActiveWalk: (walk: Walk | null) => void;
  walkerLocation: { lat: number; lng: number } | null;
  setWalkerLocation: (location: { lat: number; lng: number } | null) => void;
}

// ─── Chat Slice (real-time messages) ─────────────────────────────────────────
interface ChatSlice {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

// ─── Payment Slice (ephemeral form state) ─────────────────────────────────────
interface PendingPayment {
  estimatedPrice: number;
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
type AppStore = AuthSlice & WalkSlice & ChatSlice & PaymentSlice & UISlice;

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // Active walk (real-time tracking only — not server state)
      activeWalk: null,
      setActiveWalk: (walk) => set({ activeWalk: walk }),
      walkerLocation: null,
      setWalkerLocation: (location) => set({ walkerLocation: location }),

      // Chat (real-time)
      messages: [],
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),

      // Payment — ephemeral, cleared after walk confirmation
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
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
