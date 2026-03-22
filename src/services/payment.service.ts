import api from "./api";
import type {
  Payment,
  PaymentMethod,
  PriceBreakdown,
  EarningsSummary,
  ApiResponse,
  PaginatedResponse,
  WalkEstimateDto,
  PaginationParams,
  EarningsParams,
} from "@/types";

/**
 * PaymentService — all payment-related API calls.
 *
 * Client side:
 *  - Fetch a price estimate before confirming a walk
 *  - Manage saved payment methods (list, add, remove, set default)
 *  - View payment history and receipts
 *
 * Walker side:
 *  - View earnings summary and history
 */
export const PaymentService = {
  // ─── Price Estimate ──────────────────────────────────────────────────────
  /**
   * Get a price estimate for a walk before the client confirms.
   * Called during the walk request flow, before payment method selection.
   */
  getEstimate: (data: WalkEstimateDto) =>
    api.post<ApiResponse<{ price: number; breakdown: PriceBreakdown }>>(
      "/payments/estimate",
      data
    ),

  // ─── Payment Methods (client) ────────────────────────────────────────────
  /** List all saved payment methods for the current user */
  getMethods: () => api.get<ApiResponse<PaymentMethod[]>>("/payments/methods"),

  /** Add a new payment method via a tokenized card/PIX reference */
  addMethod: (token: string) =>
    api.post<ApiResponse<PaymentMethod>>("/payments/methods", { token }),

  /** Remove a saved payment method */
  removeMethod: (methodId: string) =>
    api.delete(`/payments/methods/${methodId}`),

  /** Set a payment method as the default */
  setDefaultMethod: (methodId: string) =>
    api.patch(`/payments/methods/${methodId}/default`),

  // ─── Payment History (client) ────────────────────────────────────────────
  /** List all payments for the current client */
  getHistory: (params?: PaginationParams) =>
    api.get<PaginatedResponse<Payment>>("/payments", { params }),

  /** Get a single payment / receipt by ID */
  getById: (id: string) => api.get<ApiResponse<Payment>>(`/payments/${id}`),

  // ─── Earnings (walker) ───────────────────────────────────────────────────
  /** Get earnings summary and per-period breakdown for the current walker */
  getEarnings: (params?: EarningsParams) =>
    api.get<ApiResponse<EarningsSummary>>("/payments/earnings", { params }),
};
