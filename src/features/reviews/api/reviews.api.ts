import { walkReviews } from "@/lib/mock-data";
import type { WalkReview } from "@/types";
import api, { isApiConfigured } from "@/services/api";

// Module-level mutable store — used only when API is not configured
let reviewsStore: WalkReview[] = [...walkReviews];

export const ReviewsApi = {
  getByWalkId: async (walkId: string): Promise<WalkReview | null> => {
    if (!isApiConfigured) {
      return reviewsStore.find((r) => r.walkId === walkId) ?? null;
    }
    return api
      .get<WalkReview | null>(`/walks/${walkId}/review`)
      .then((r) => r.data)
      .catch(() => null);
  },

  submit: async (walkId: string, payload: { rating: number; comment: string }): Promise<WalkReview> => {
    if (!isApiConfigured) {
      const existing = reviewsStore.find((r) => r.walkId === walkId);
      if (existing) {
        reviewsStore = reviewsStore.map((r) =>
          r.walkId === walkId ? { ...r, ...payload } : r
        );
        return { ...existing, ...payload };
      }
      const newReview: WalkReview = {
        walkId,
        walkerId: "1",
        rating: payload.rating,
        comment: payload.comment,
        createdAt: new Date().toISOString(),
      };
      reviewsStore = [newReview, ...reviewsStore];
      return newReview;
    }
    return api
      .post<WalkReview>(`/walks/${walkId}/review`, payload)
      .then((r) => r.data);
  },

  update: async (walkId: string, payload: { rating: number; comment: string }): Promise<WalkReview> => {
    if (!isApiConfigured) {
      reviewsStore = reviewsStore.map((r) =>
        r.walkId === walkId ? { ...r, ...payload } : r
      );
      return reviewsStore.find((r) => r.walkId === walkId)!;
    }
    return api
      .patch<WalkReview>(`/walks/${walkId}/review`, payload)
      .then((r) => r.data);
  },
};
