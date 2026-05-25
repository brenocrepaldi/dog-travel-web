import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useWalkerAvailability(walkerId: string) {
  return useQuery({
    queryKey: ["walkers", walkerId, "availability"],
    queryFn: () => WalkersApi.getAvailability(walkerId),
    enabled: Boolean(walkerId),
  });
}

export function useUpdateWalkerAvailability(walkerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (available: boolean) => WalkersApi.updateAvailability(walkerId, available),
    onMutate: async (available) => {
      await queryClient.cancelQueries({ queryKey: ["walkers", walkerId, "availability"] });
      const prev = queryClient.getQueryData<boolean>(["walkers", walkerId, "availability"]);
      queryClient.setQueryData(["walkers", walkerId, "availability"], available);
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev !== undefined) {
        queryClient.setQueryData(["walkers", walkerId, "availability"], context.prev);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["walkers", walkerId, "availability"] });
    },
  });
}
