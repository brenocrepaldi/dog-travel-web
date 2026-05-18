import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { walkers } from "@/lib/mock-data";
import { WalkersExplorer } from "./_components/walkers-explorer";

export const metadata: Metadata = { title: "Passeadores | DogTravel" };

export default function WalkersPage() {
  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Passeadores Parceiros"
        description="Encontre passeadores verificados com experiência comprovada e porte compatível com seu cão."
      />

      <WalkersExplorer walkers={walkers} />
    </div>
  );
}
