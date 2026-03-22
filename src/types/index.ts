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
