import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WalksApi } from "../api/walks.api";
import type { WalkRecord, WalkRequest } from "@/types";

export function useCreateWalk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (walk: Omit<WalkRecord, "id">) => WalksApi.create(walk),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walks"] });
    },
  });
}

export function useCancelWalk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => WalksApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walks"] });
    },
  });
}

export function useAcceptWalk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ request, walkerName }: { request: WalkRequest; walkerName: string }) =>
      WalksApi.accept(request, walkerName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walks"] });
      queryClient.invalidateQueries({ queryKey: ["walk-requests"] });
    },
  });
}

export function useDeclineWalk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => WalksApi.decline(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walk-requests"] });
    },
  });
}
