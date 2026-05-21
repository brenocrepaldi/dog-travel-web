import { useQuery } from "@tanstack/react-query";
import { WalkersApi, type WalkerFilters } from "../api/walkers.api";

export function useWalkers(filters?: WalkerFilters) {
  return useQuery({
    queryKey: ["walkers", filters],
    queryFn: () => WalkersApi.list(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWalkerById(id: string) {
  return useQuery({
    queryKey: ["walkers", id],
    queryFn: () => WalkersApi.getById(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}
