import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaymentsApi } from "../api/payments.api";
import type { ManagedPaymentMethod } from "@/types";

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: PaymentsApi.getMethods,
  });
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payment-history"],
    queryFn: PaymentsApi.getHistory,
  });
}

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (method: Omit<ManagedPaymentMethod, "id">) =>
      PaymentsApi.addMethod(method),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
}

export function useRemovePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PaymentsApi.removeMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
}

export function useSetDefaultMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => PaymentsApi.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });
}
