import {
  managedPaymentMethods,
  paymentHistory,
} from "@/lib/mock-data";
import type { ManagedPaymentMethod, PaymentHistoryItem } from "@/types";

let methodsStore: ManagedPaymentMethod[] = [...managedPaymentMethods];

export const PaymentsApi = {
  getMethods: async (): Promise<ManagedPaymentMethod[]> => {
    return [...methodsStore];
  },

  getHistory: async (): Promise<PaymentHistoryItem[]> => {
    return [...paymentHistory];
  },

  addMethod: async (method: Omit<ManagedPaymentMethod, "id">): Promise<ManagedPaymentMethod> => {
    const newMethod: ManagedPaymentMethod = {
      ...method,
      id: `pm_${Date.now()}`,
    };
    methodsStore = [...methodsStore, newMethod];
    return newMethod;
  },

  removeMethod: async (id: string): Promise<void> => {
    methodsStore = methodsStore.filter((m) => m.id !== id);
  },

  setDefault: async (id: string): Promise<void> => {
    methodsStore = methodsStore.map((m) => ({ ...m, isDefault: m.id === id }));
  },
};
