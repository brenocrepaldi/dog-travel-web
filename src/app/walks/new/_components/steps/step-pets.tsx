"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WalkFormData } from "../walk-request-form";

// ─── Mock pets (replace with API/store data) ───────────────────────────────
const MOCK_PETS = [
  { id: "1", name: "Rex",  breed: "Golden Retriever", age: 3, emoji: "🐕" },
  { id: "2", name: "Mel",  breed: "Poodle",           age: 1, emoji: "🐩" },
];

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepPets({ data, updateData, onNext }: Props) {
  function togglePet(id: string) {
    const already = data.selectedPetIds.includes(id);
    updateData({
      selectedPetIds: already
        ? data.selectedPetIds.filter((p) => p !== id)
        : [...data.selectedPetIds, id],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Quais cães vão passear?</h2>
        <p className="text-sm text-muted-foreground">
          Selecione um ou mais cães cadastrados no seu perfil.
        </p>
      </div>

      {MOCK_PETS.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6 text-center">
          Nenhum cão cadastrado. Adicione um na aba{" "}
          <a href="/profile/pets" className="text-primary underline">
            Perfil
          </a>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MOCK_PETS.map((pet) => {
            const selected = data.selectedPetIds.includes(pet.id);
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => togglePet(pet.id)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200",
                  "hover:border-primary/60 hover:bg-primary/5",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border bg-background"
                )}
              >
                {/* Pet avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  {pet.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{pet.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {pet.breed} · {pet.age} {pet.age === 1 ? "ano" : "anos"}
                  </p>
                </div>

                {/* Checkmark */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    selected
                      ? "bg-primary border-primary"
                      : "border-border"
                  )}
                >
                  {selected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={onNext}
          disabled={data.selectedPetIds.length === 0}
        >
          Continuar →
        </Button>
      </div>
    </div>
  );
}
