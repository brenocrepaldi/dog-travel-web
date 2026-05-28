import {
  walks as seedWalks,
  walkRequests as seedWalkRequests,
} from "@/lib/mock-data";
import {
  DURATION_BASE_PRICE,
  EXTRA_PET_FEE,
  PLATFORM_AND_SAFETY_FEE_RATE,
  FIRST_RIDE_DISCOUNT_RATE,
} from "@/config/pricing";
import type {
  WalkRecord,
  WalkRequest,
  UserRole,
  WalkEstimateRequest,
  WalkEstimateResult,
  CreateWalkDto,
} from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable stores — used only when API is not configured
let walksStore: WalkRecord[] = [...seedWalks];
let walkRequestsStore: WalkRequest[] = [...seedWalkRequests];

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export const WalksApi = {
  list: async (role: UserRole, walkerId?: string): Promise<WalkRecord[]> => {
    if (!isApiConfigured) {
      if (role === "client") {
        return [...walksStore].filter((w) =>
          w.participants.some((p) => p.role === "client" && p.id === "client_1")
        );
      }
      return [...walksStore].filter((w) => w.walkerId === walkerId);
    }
    const params: Record<string, string> = { role };
    if (role === "walker" && walkerId) params.walkerId = walkerId;
    return api
      .get<WalkRecord[]>("/walks", { params })
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

  // Delegates to ReviewsApi — kept here for backwards-compat call sites
  hasReview: async (walkId: string): Promise<boolean> => {
    const { ReviewsApi } = await import("@/features/reviews/api/reviews.api");
    return ReviewsApi.getByWalkId(walkId).then((r) => r !== null);
  },

  // ─── Estimate ───────────────────────────────────────────────────────────────

  estimate: async (input: WalkEstimateRequest): Promise<WalkEstimateResult> => {
    if (!isApiConfigured) {
      const { durationMinutes, petCount, isFirstRide } = input;
      const durationBase         = DURATION_BASE_PRICE[durationMinutes] ?? 18;
      const extraPetFee          = Math.max(0, petCount - 1) * EXTRA_PET_FEE;
      const subtotal             = durationBase + extraPetFee;
      const platformAndSafetyFee = +(subtotal * PLATFORM_AND_SAFETY_FEE_RATE).toFixed(2);
      const totalBeforeDiscount  = subtotal + platformAndSafetyFee;
      const firstRideDiscount    = isFirstRide
        ? +(totalBeforeDiscount * FIRST_RIDE_DISCOUNT_RATE).toFixed(2)
        : 0;
      const total = +(totalBeforeDiscount - firstRideDiscount).toFixed(2);
      return { durationBase, extraPetFee, platformAndSafetyFee, firstRideDiscount, total };
    }
    return api
      .post<WalkEstimateResult>("/walks/estimate", input)
      .then((r) => r.data);
  },

  // ─── Mutations ──────────────────────────────────────────────────────────────

  create: async (dto: CreateWalkDto): Promise<WalkRecord> => {
    if (!isApiConfigured) {
      const dateLabel = new Date(dto.scheduledAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      const now = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const newWalk: WalkRecord = {
        id: `local-${crypto.randomUUID()}`,
        walkerId: dto.walkerId ?? null,
        clientName: "Cliente",
        petIds: dto.petIds,
        petNames: dto.petNames,
        status: "pending",
        dateLabel,
        scheduledAt: dto.scheduledAt,
        durationMinutes: dto.durationMinutes,
        price: dto.price,
        distanceKm: 0,
        startAddress: dto.startAddress,
        startLat: dto.lat,
        startLng: dto.lng,
        notes: dto.notes,
        paymentMethodId: dto.paymentMethodId,
        participants: [],
        timeline: [
          { id: "ev-1", label: "Pedido criado", at: now, state: "done" },
          { id: "ev-2", label: "Aguardando passeador", at: dateLabel, state: "pending" },
        ],
      };
      const newRequest: WalkRequest = {
        id: newWalk.id,
        clientId: "client_1",
        clientName: "Cliente",
        petNames: dto.petNames,
        petIds: dto.petIds,
        durationMinutes: dto.durationMinutes,
        price: dto.price,
        scheduledAt: dto.scheduledAt,
        scheduledLabel: dateLabel,
        startAddress: dto.startAddress,
        receivedMinutes: 0,
      };
      walksStore = [newWalk, ...walksStore];
      walkRequestsStore = [newRequest, ...walkRequestsStore];
      return newWalk;
    }
    return api.post<WalkRecord>("/walks", dto).then((r) => r.data);
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

  complete: async (walkId: string): Promise<WalkRecord> => {
    if (!isApiConfigured) {
      const walk = walksStore.find((w) => w.id === walkId);
      if (!walk) throw new Error("WALK_NOT_FOUND");

      const now = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      walksStore = walksStore.map((w) => {
        if (w.id !== walkId) return w;
        return {
          ...w,
          status: "completed" as const,
          timeline: w.timeline.map((t) => ({
            ...t,
            state: "done" as const,
            at: t.state === "pending" ? now : t.at,
          })),
        };
      });

      return walksStore.find((w) => w.id === walkId)!;
    }
    return api.patch<WalkRecord>(`/walks/${walkId}/complete`).then((r) => r.data);
  },

  start: async (walkId: string, code: string): Promise<WalkRecord> => {
    if (!isApiConfigured) {
      const walk = walksStore.find((w) => w.id === walkId);
      if (!walk) throw new Error("WALK_NOT_FOUND");
      if (walk.startCode !== code) throw new Error("INVALID_CODE");

      const now = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const currentIdx     = walk.timeline.findIndex((t) => t.state === "current");
      const firstPendingIdx = walk.timeline.findIndex((t) => t.state === "pending");

      walksStore = walksStore.map((w) => {
        if (w.id !== walkId) return w;
        return {
          ...w,
          status: "in_progress" as const,
          timeline: w.timeline.map((t, i) => {
            if (i === currentIdx)      return { ...t, state: "done" as const };
            if (i === firstPendingIdx) return { ...t, state: "current" as const, at: now };
            return t;
          }),
        };
      });

      return walksStore.find((w) => w.id === walkId)!;
    }
    return api
      .patch<WalkRecord>(`/walks/${walkId}/start`, { code })
      .then((r) => r.data);
  },

  accept: async (request: WalkRequest, walkerName: string, walkerId: string): Promise<WalkRecord> => {
    if (!isApiConfigured) {
      walkRequestsStore = walkRequestsStore.filter((r) => r.id !== request.id);

      const now = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const newWalk: WalkRecord = {
        id: `accepted-${request.id}`,
        walkerId,
        clientName: request.clientName,
        petNames: request.petNames,
        status: "accepted",
        dateLabel: request.scheduledLabel,
        scheduledAt: request.scheduledAt,
        durationMinutes: request.durationMinutes,
        price: request.price,
        distanceKm: 0,
        startAddress: request.startAddress,
        startCode: randomCode(),
        participants: [
          { id: request.clientId, name: request.clientName, role: "client" },
          { id: walkerId, name: walkerName, role: "walker" },
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
