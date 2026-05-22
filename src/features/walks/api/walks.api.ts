import {
  walks as seedWalks,
  walkRequests as seedWalkRequests,
  walkers,
} from "@/lib/mock-data";
import type { WalkRecord, WalkRequest, UserRole } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable stores — used only when API is not configured
let walksStore: WalkRecord[] = [...seedWalks];
let walkRequestsStore: WalkRequest[] = [...seedWalkRequests];

// ─── Read ─────────────────────────────────────────────────────────────────────

export const WalksApi = {
  list: async (role: UserRole, walkerId = "1"): Promise<WalkRecord[]> => {
    if (!isApiConfigured) {
      if (role === "client") {
        return [...walksStore].filter((w) =>
          w.participants.some((p) => p.role === "client" && p.id === "client_1")
        );
      }
      return [...walksStore].filter((w) => w.walkerId === walkerId);
    }
    return api
      .get<WalkRecord[]>("/walks", { params: { role, walkerId } })
      .then((r) => r.data);
  },

  getById: async (id: string): Promise<WalkRecord | undefined> => {
    if (!isApiConfigured) {
      return walksStore.find((w) => w.id === id);
    }
    return api.get<WalkRecord>(`/walks/${id}`).then((r) => r.data);
  },

  listRequests: async (): Promise<WalkRequest[]> => {
    if (!isApiConfigured) {
      return [...walkRequestsStore];
    }
    return api.get<WalkRequest[]>("/walk-requests").then((r) => r.data);
  },

  // Synchronous helper — always reads from walkers array (no async API boundary)
  getWalkerNameById: (walkerId: string): string => {
    return walkers.find((w) => w.id === walkerId)?.name ?? "Passeador";
  },

  hasReview: async (walkId: string): Promise<boolean> => {
    if (!isApiConfigured) {
      const { walkReviews } = await import("@/lib/mock-data");
      return walkReviews.some((r) => r.walkId === walkId);
    }
    return api
      .get<{ exists: boolean }>(`/walks/${walkId}/review`)
      .then((r) => r.data.exists);
  },

  // ─── Mutations ──────────────────────────────────────────────────────────────

  create: async (walk: Omit<WalkRecord, "id">): Promise<WalkRecord> => {
    if (!isApiConfigured) {
      const newWalk: WalkRecord = { ...walk, id: `local-${crypto.randomUUID()}` };
      walksStore = [newWalk, ...walksStore];
      return newWalk;
    }
    return api.post<WalkRecord>("/walks", walk).then((r) => r.data);
  },

  cancel: async (id: string): Promise<void> => {
    if (!isApiConfigured) {
      walksStore = walksStore.map((w) =>
        w.id === id ? { ...w, status: "cancelled" as const } : w
      );
      return;
    }
    await api.patch(`/walks/${id}/cancel`);
  },

  accept: async (request: WalkRequest, walkerName: string): Promise<WalkRecord> => {
    if (!isApiConfigured) {
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
    }
    return api
      .post<WalkRecord>(`/walk-requests/${request.id}/accept`)
      .then((r) => r.data);
  },

  decline: async (requestId: string): Promise<void> => {
    if (!isApiConfigured) {
      walkRequestsStore = walkRequestsStore.filter((r) => r.id !== requestId);
      return;
    }
    await api.post(`/walk-requests/${requestId}/decline`);
  },
};
