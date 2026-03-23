"use client";

import { useState } from "react";
import { Plus, Edit2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PetFormSheet } from "./pet-form-sheet";

// Mock data
type Pet = {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: "Pequeno" | "Médio" | "Grande";
  behavior: string;
  image?: string;
};

const MOCK_PETS: Pet[] = [
  {
    id: "1",
    name: "Rex",
    breed: "Golden Retriever",
    age: 3,
    size: "Grande",
    behavior: "Brincalhão e dócil",
  },
  {
    id: "2",
    name: "Mel",
    breed: "Poodle",
    age: 1,
    size: "Pequeno",
    behavior: "Agitada, puxa a coleira nos primeiros 5 min.",
  },
];

export function PetsList() {
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setSheetOpen(true);
  };

  const handleAdd = () => {
    setEditingPet(null);
    setSheetOpen(true);
  };

  const handleSavePet = (savedPet: any) => {
    if (editingPet) {
      setPets((prev) => prev.map((p) => (p.id === editingPet.id ? { ...p, ...savedPet } : p)));
    } else {
      setPets((prev) => [...prev, { ...savedPet, id: Math.random().toString() }]);
    }
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
        {pets.length === 0 ? (
          <div className="col-span-1 md:col-span-2 p-8 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">Você ainda não adicionou nenhum cão.</p>
            <Button variant="outline" onClick={handleAdd}>Adicionar meu primeiro cão</Button>
          </div>
        ) : (
          pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden group flex flex-col transition-all hover:shadow-md border-border/60">
              <CardContent className="p-0 flex flex-1">
                {/* Visual placeholder for pet image */}
                <div className="w-24 shrink-0 bg-primary/5 flex items-center justify-center border-r border-border/50 text-4xl">
                  {pet.size === "Pequeno" ? "🐩" : "🦮"}
                </div>
                
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-foreground leading-none mb-1">
                          {pet.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {pet.breed} • {pet.age} {pet.age === 1 ? 'ano' : 'anos'}
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
                        {pet.size}
                      </Badge>
                    </div>
                  </div>

                  {pet.behavior && (
                    <div className="bg-muted/30 rounded-md p-2 flex items-start gap-2 max-w-full">
                      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {pet.behavior}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <PetFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        petToEdit={editingPet}
        onSave={handleSavePet}
      />
    </div>
  );
}
