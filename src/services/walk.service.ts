import api from "./api";
import type { ApiResponse, Walk } from "@/types";

export interface CreateWalkPayload {
  petIds: string[];
  scheduledAt: string;
  durationMinutes: number;
  startLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  paymentMethodId: string;
}

export const WalkService = {
  create: (payload: CreateWalkPayload) => api.post<ApiResponse<Walk>>("/walks", payload),
};
