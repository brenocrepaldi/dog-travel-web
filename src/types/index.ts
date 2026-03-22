/**
 * Global TypeScript types and interfaces for DogTravel.
 */

// ─── User Roles ───────────────────────────────────────────────────────────────
export type UserRole = "client" | "walker";

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
}

// ─── Pet ──────────────────────────────────────────────────────────────────────
export type DogSize = "small" | "medium" | "large" | "giant";

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  breed: string;
  age: number;
  size: DogSize;
  photoUrl?: string;
  notes?: string;
}

// ─── Walk ─────────────────────────────────────────────────────────────────────
export type WalkStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Walk {
  id: string;
  clientId: string;
  walkerId?: string;
  petIds: string[];
  status: WalkStatus;
  scheduledAt: string;
  durationMinutes: number;
  startLocation: GeoLocation;
  endLocation?: GeoLocation;
  price: number;
  paymentMethodId?: string;
  paymentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Geolocation ──────────────────────────────────────────────────────────────
export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  walkId: string;
  authorId: string;
  targetId: string;
  rating: number; // 1–5
  comment?: string;
  createdAt: string;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  walkId: string;
  senderId: string;
  text: string;
  sentAt: string;
  read: boolean;
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "refunded";

export interface Payment {
  id: string;
  walkId: string;
  clientId: string;
  walkerId: string;
  amount: number; // in cents (BRL)
  currency: string; // "BRL"
  status: PaymentStatus;
  methodId?: string;
  paidAt?: string;
  createdAt: string;
}

// ─── Payment Method ───────────────────────────────────────────────────────────
export type PaymentMethodType = "credit_card" | "debit_card" | "pix";

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  /** Last 4 digits for cards, or "PIX" key label */
  label: string;
  brand?: string; // "visa" | "mastercard" | etc.
  isDefault: boolean;
  createdAt: string;
}

// ─── Price Breakdown ──────────────────────────────────────────────────────────
export interface PriceBreakdown {
  baseRate: number;       // per-minute rate
  durationMinutes: number;
  subtotal: number;
  platformFee: number;    // platform cut
  total: number;
  currency: string;
}

// ─── Earnings ─────────────────────────────────────────────────────────────────
export interface EarningsSummary {
  totalEarned: number;
  totalWalks: number;
  pendingPayout: number;
  currency: string;
  breakdown: {
    period: string;
    amount: number;
    walks: number;
  }[];
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────
export interface WalkEstimateDto {
  petIds: string[];
  durationMinutes: number;
  location: GeoLocation;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface EarningsParams extends PaginationParams {
  from?: string;
  to?: string;
}
