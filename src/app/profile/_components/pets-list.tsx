"use client";

import { useMemo, useState } from "react";
import { Edit2, Info, Plus } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { DEFAULT_CLIENT_PETS, DOG_SIZE_LABEL, petEmojiBySize } from "@/lib/pets";
import type { Pet } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PetFormSheet, type PetDraft } from "./pet-form-sheet";

function toDraft(pet: Pet): PetDraft {
  return {
    name: pet.name,
    breed: pet.breed,
    age: pet.age,
    size: pet.size,
    behavior: pet.notes ?? "",
  };
}

export function PetsList() {
  const pets = useAppStore((state) => state.pets);
  const setPets = useAppStore((state) => state.setPets);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [sheetVersion, setSheetVersion] = useState(0);

  const hasPets = pets.length > 0;
  const list = hasPets ? pets : DEFAULT_CLIENT_PETS;

  const nextPetId = useMemo(() => {
    const numericIds = pets
      .map((pet) => Number.parseInt(pet.id, 10))
      .filter((id) => Number.isFinite(id));
    return String((numericIds.length > 0 ? Math.max(...numericIds) : 0) + 1);
  }, [pets]);

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setSheetVersion((current) => current + 1);
    setSheetOpen(true);
  };

  const handleAdd = () => {
    setEditingPet(null);
    setSheetVersion((current) => current + 1);
    setSheetOpen(true);
  };

  const handleSavePet = (savedPet: PetDraft) => {
    if (!hasPets) {
      setPets(DEFAULT_CLIENT_PETS);
    }

    const currentPets = hasPets ? pets : DEFAULT_CLIENT_PETS;

    if (editingPet) {
      setPets(
        currentPets.map((pet) =>
          pet.id === editingPet.id
            ? {
                ...pet,
                name: savedPet.name,
                breed: savedPet.breed,
                age: savedPet.age,
                size: savedPet.size,
                notes: savedPet.behavior,
              }
            : pet
        )
      );
      return;
    }

    const newPet: Pet = {
      id: nextPetId,
      ownerId: "client_1",
      name: savedPet.name,
      breed: savedPet.breed,
      age: savedPet.age,
      size: savedPet.size,
      notes: savedPet.behavior,
    };
    setPets([...currentPets, newPet]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.length === 0 ? (
          <div className="col-span-1 md:col-span-2 p-8 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">Você ainda não adicionou nenhum cão.</p>
            <Button variant="outline" onClick={handleAdd}>
              Adicionar meu primeiro cão
            </Button>
          </div>
        ) : (
          list.map((pet) => (
            <Card key={pet.id} className="overflow-hidden group flex flex-col transition-all hover:shadow-md border-border/60">
              <CardContent className="p-0 flex flex-1">
                <div className="w-24 shrink-0 bg-primary/5 flex items-center justify-center border-r border-border/50 text-4xl">
                  {petEmojiBySize(pet.size)}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-foreground leading-none mb-1">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {pet.breed} • {pet.age} {pet.age === 1 ? "ano" : "anos"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEdit(pet)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="font-normal text-xs bg-secondary/50">
                        {DOG_SIZE_LABEL[pet.size]}
                      </Badge>
                    </div>
                  </div>

                  {pet.notes && (
                    <div className="bg-muted/30 rounded-md p-2 flex items-start gap-2 max-w-full">
                      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{pet.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <PetFormSheet
        key={`${editingPet?.id ?? "new"}-${sheetVersion}`}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        petToEdit={editingPet ? toDraft(editingPet) : null}
        onSave={handleSavePet}
      />
    </div>
  );
}
