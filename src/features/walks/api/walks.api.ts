import {
  walks as seedWalks,
  walkRequests as seedWalkRequests,
  walkers,
} from "@/lib/mock-data";
import type { WalkRecord, WalkRequest, UserRole } from "@/types";

// Module-level mutable stores — replaced by real API calls in production
let walksStore: WalkRecord[] = [...seedWalks];
let walkRequestsStore: WalkRequest[] = [...seedWalkRequests];

// ─── Read ─────────────────────────────────────────────────────────────────────

export const WalksApi = {
  list: async (role: UserRole, walkerId = "1"): Promise<WalkRecord[]> => {
    if (role === "client") {
      return [...walksStore].filter((w) =>
        w.participants.some((p) => p.role === "client" && p.id === "client_1")
      );
    }
    return [...walksStore].filter((w) => w.walkerId === walkerId);
  },

  getById: async (id: string): Promise<WalkRecord | undefined> => {
    return walksStore.find((w) => w.id === id);
  },

  listRequests: async (): Promise<WalkRequest[]> => {
    return [...walkRequestsStore];
  },

  getWalkerNameById: (walkerId: string): string => {
    return walkers.find((w) => w.id === walkerId)?.name ?? "Passeador";
  },

  hasReview: async (walkId: string): Promise<boolean> => {
    const { walkReviews } = await import("@/lib/mock-data");
    return walkReviews.some((r) => r.walkId === walkId);
  },

  // ─── Mutations ──────────────────────────────────────────────────────────────

  create: async (walk: Omit<WalkRecord, 'id'>): Promise<WalkRecord> => {
    const newWalk: WalkRecord = { ...walk, id: `local-${crypto.randomUUID()}` };
    walksStore = [newWalk, ...walksStore];
    return newWalk;
  },

  cancel: async (id: string): Promise<void> => {
    walksStore = walksStore.map((w) =>
      w.id === id ? { ...w, status: "cancelled" as const } : w
    );
  },

  accept: async (request: WalkRequest, walkerName: string): Promise<WalkRecord> => {
    walkRequestsStore = walkRequestsStore.filter((r) => r.id !== request.id);

    const now = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newWalk: WalkRecord = {
      id: `accepted-${request.id}`,
      walkerId: "1",
      clientName: request.clientName,
      petNames: request.petNames,
      status: "accepted",
      dateLabel: request.scheduledLabel,
      scheduledAt: request.scheduledAt,
      durationMinutes: request.durationMinutes,
      price: request.price,
      distanceKm: 0,
      startAddress: request.startAddress,
      participants: [
        { id: request.clientId, name: request.clientName, role: "client" },
        { id: "1", name: walkerName, role: "walker" },
      ],
      timeline: [
        { id: "t1", label: "Pedido aceito", at: now, state: "done" },
        { id: "t2", label: "Aguardando passeio", at: request.scheduledLabel, state: "current" },
        { id: "t3", label: "Passeio em andamento", at: "--", state: "pending" },
        { id: "t4", label: "Passeio concluído", at: "--", state: "pending" },
      ],
    };

    walksStore = [newWalk, ...walksStore];
    return newWalk;
  },

  decline: async (requestId: string): Promise<void> => {
    walkRequestsStore = walkRequestsStore.filter((r) => r.id !== requestId);
  },
};
