import {
  managedPaymentMethods,
  paymentHistory,
} from "@/lib/mock-data";
import type { ManagedPaymentMethod, PaymentHistoryItem, EarningsParams } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable store — used only when API is not configured
let methodsStore: ManagedPaymentMethod[] = [...managedPaymentMethods];

export const PaymentsApi = {
  getMethods: async (): Promise<ManagedPaymentMethod[]> => {
    if (!isApiConfigured) {
      return [...methodsStore];
    }
    return api.get<ManagedPaymentMethod[]>("/payment-methods").then((r) => r.data);
  },

  getHistory: async (params?: EarningsParams): Promise<PaymentHistoryItem[]> => {
    if (!isApiConfigured) {
      return [...paymentHistory];
    }
    return api.get<PaymentHistoryItem[]>("/payment-history", { params }).then((r) => r.data);
  },

  addMethod: async (method: Omit<ManagedPaymentMethod, "id">): Promise<ManagedPaymentMethod> => {
    if (!isApiConfigured) {
      const newMethod: ManagedPaymentMethod = {
        ...method,
        id: `pm_${Date.now()}`,
      };
      methodsStore = [...methodsStore, newMethod];
      return newMethod;
    }
    return api.post<ManagedPaymentMethod>("/payment-methods", method).then((r) => r.data);
  },

  removeMethod: async (id: string): Promise<void> => {
    if (!isApiConfigured) {
      methodsStore = methodsStore.filter((m) => m.id !== id);
      return;
    }
    await api.delete(`/payment-methods/${id}`);
  },

  setDefault: async (id: string): Promise<void> => {
    if (!isApiConfigured) {
      methodsStore = methodsStore.map((m) => ({ ...m, isDefault: m.id === id }));
      return;
    }
    await api.patch(`/payment-methods/${id}/default`);
  },
};
