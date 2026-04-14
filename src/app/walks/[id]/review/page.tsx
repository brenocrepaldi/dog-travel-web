import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getReviewByWalkId, getWalkById, getWalkerById } from "@/lib/mock-data";
import { WalkReviewForm } from "./_components/walk-review-form";

export const metadata: Metadata = { title: "Avaliacao do Passeio | DogTravel" };

export default async function WalkReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const walk = getWalkById(id);

  if (!walk) {
    notFound();
  }

  const walker = getWalkerById(walk.walkerId);
  if (!walker) {
    notFound();
  }

  const existingReview = getReviewByWalkId(walk.id);

  return (
    <WalkReviewForm
      walkId={walk.id}
      walkDate={walk.dateLabel}
      walkerName={walker.name}
      petNames={walk.petNames}
      existingReview={existingReview}
    />
  );
}
