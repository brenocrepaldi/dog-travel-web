import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { WalkersApi } from "@/features/walkers/api/walkers.api";
import { WalkersExplorer } from "./_components/walkers-explorer";

export const metadata: Metadata = { title: "Passeadores | DogTravel" };

export default async function WalkersPage() {
  const walkers = await WalkersApi.list();

  return (
    <div className="flex flex-col gap-8 pb-8">
      <header className="space-y-1.5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Passeadores Parceiros
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Encontre passeadores verificados com experiência comprovada e porte compatível com seu cão.
          </p>
        </div>
        <Separator className="mt-6" />
      </header>

      <WalkersExplorer walkers={walkers} />
    </div>
  );
}
