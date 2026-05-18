"use client";

import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { DEFAULT_CLIENT_PETS, DOG_SIZE_LABEL, petEmojiBySize } from "@/lib/pets";
import { cn } from "@/lib/utils";
import { FlowActions } from "@/components/common/flow-actions";
import type { WalkFormData } from "../walk-request-form";

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function petBehaviorTag(notes: string | undefined) {
  const text = (notes ?? "").toLowerCase();
  if (text.includes("reativ") || text.includes("agitado")) return "Requer manejo calmo";
  if (text.includes("puxa")) return "Puxa no inicio";
  if (text.includes("medo")) return "Pode ter receio em rua movimentada";
  return "Perfil tranquilo";
}

export function StepPets({ data, updateData, onNext }: Props) {
  const storedPets = useAppStore((state) => state.pets);
  const pets = storedPets.length > 0 ? storedPets : DEFAULT_CLIENT_PETS;

  function togglePet(id: string) {
    const already = data.selectedPetIds.includes(id);
    updateData({
      selectedPetIds: already ? data.selectedPetIds.filter((petId) => petId !== id) : [...data.selectedPetIds, id],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Quais cães vão passear?</h2>
        <p className="text-sm text-muted-foreground">Selecione os pets para validar compatibilidade com o passeador.</p>
      </div>

      {pets.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6 text-center">
          Nenhum cão cadastrado. Adicione um na aba{" "}
          <Link href="/profile" className="text-primary underline">
            Perfil
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pets.map((pet) => {
            const selected = data.selectedPetIds.includes(pet.id);
            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => togglePet(pet.id)}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-200",
                  "hover:border-primary/60 hover:bg-primary/5",
                  selected ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border bg-background"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  {petEmojiBySize(pet.size)}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="font-semibold text-sm">{pet.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {pet.breed} · {pet.age} {pet.age === 1 ? "ano" : "anos"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                      Porte {DOG_SIZE_LABEL[pet.size]}
                    </span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                      {petBehaviorTag(pet.notes)}
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-1",
                    selected ? "bg-primary border-primary" : "border-border"
                  )}
                >
                  {selected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Usamos essas informações para destacar passeadores com experiência no perfil do seu cão.
        </p>
      </div>

      <FlowActions
        showBack={false}
        cancelHref="/walks"
        primaryLabel="Continuar"
        primaryIcon={<ArrowRight className="h-4 w-4" />}
        onPrimary={onNext}
        primaryDisabled={data.selectedPetIds.length === 0}
      />
    </div>
  );
}
