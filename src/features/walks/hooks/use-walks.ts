import { useQuery } from "@tanstack/react-query";
import { WalksApi } from "../api/walks.api";
import type { UserRole } from "@/types";

export function useWalks(role: UserRole, walkerId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["walks", role, walkerId],
    queryFn: () => WalksApi.list(role, walkerId),
    enabled: options?.enabled ?? true,
  });
}

export function useWalkById(id: string) {
  return useQuery({
    queryKey: ["walks", id],
    queryFn: () => WalksApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useWalkRequests() {
  return useQuery({
    queryKey: ["walk-requests"],
    queryFn: WalksApi.listRequests,
  });
}
