import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Pet, Walk, ChatMessage } from "@/types";
import type { WalkRecord, WalkRequest } from "@/lib/mock-data";
import { walkRequests as initialWalkRequests } from "@/lib/mock-data";

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

// ─── Local Walks Slice ────────────────────────────────────────────────────────
interface LocalWalksSlice {
  localWalks: WalkRecord[];
  addLocalWalk: (walk: WalkRecord) => void;
  cancelLocalWalk: (id: string) => void;
  clearLocalWalks: () => void;
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

// ─── Walker Slice ─────────────────────────────────────────────────────────────
interface WalkerSlice {
  walkerRequests: WalkRequest[];
  declineWalkerRequest: (id: string) => void;
  walkerAcceptedWalks: WalkRecord[];
  acceptWalkerRequest: (request: WalkRequest, walkerName: string) => void;
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
type AppStore = AuthSlice & PetsSlice & LocalWalksSlice & WalkSlice & ChatSlice & PaymentSlice & WalkerSlice & UISlice;

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

      // Local Walks
      localWalks: [],
      addLocalWalk: (walk) => set((state) => ({ localWalks: [walk, ...state.localWalks] })),
      cancelLocalWalk: (id) =>
        set((state) => ({
          localWalks: state.localWalks.map((w) =>
            w.id === id ? { ...w, status: 'cancelled' as const } : w
          ),
        })),
      clearLocalWalks: () => set({ localWalks: [] }),

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

      // Walker — requests reset on each load (simulates fresh API data); accepted walks are persisted
      walkerRequests: initialWalkRequests,
      declineWalkerRequest: (id) =>
        set((state) => ({
          walkerRequests: state.walkerRequests.filter((r) => r.id !== id),
        })),
      walkerAcceptedWalks: [],
      acceptWalkerRequest: (request, walkerName) =>
        set((state) => {
          const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          const newWalk: WalkRecord = {
            id: `accepted-${request.id}`,
            walkerId: '1',
            clientName: request.clientName,
            petNames: request.petNames,
            status: 'accepted',
            dateLabel: request.scheduledLabel,
            scheduledAt: request.scheduledAt,
            durationMinutes: request.durationMinutes,
            price: request.price,
            distanceKm: 0,
            startAddress: request.startAddress,
            participants: [
              { id: request.clientId, name: request.clientName, role: 'client' },
              { id: '1', name: walkerName, role: 'walker' },
            ],
            timeline: [
              { id: 't1', label: 'Pedido aceito', at: now, state: 'done' },
              { id: 't2', label: 'Aguardando passeio', at: request.scheduledLabel, state: 'current' },
              { id: 't3', label: 'Passeio em andamento', at: '--', state: 'pending' },
              { id: 't4', label: 'Passeio concluido', at: '--', state: 'pending' },
            ],
          };
          return {
            walkerRequests: state.walkerRequests.filter((r) => r.id !== request.id),
            walkerAcceptedWalks: [newWalk, ...state.walkerAcceptedWalks],
          };
        }),

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
        pets: state.pets,
        localWalks: state.localWalks,
        walkerAcceptedWalks: state.walkerAcceptedWalks,
      }),
    }
  )
);
