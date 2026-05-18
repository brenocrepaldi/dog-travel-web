import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import type { DogSize } from "@/types";
import { DOG_SIZE_TEXT_OPTIONS } from "@/lib/pets";

export interface PetDraft {
  name: string;
  breed: string;
  age: number;
  size: DogSize;
  behavior: string;
}

interface PetFormState {
  name: string;
  breed: string;
  age: string;
  size: DogSize;
  behavior: string;
}

function toFormState(petToEdit?: PetDraft | null): PetFormState {
  if (!petToEdit) {
    return {
      name: "",
      breed: "",
      age: "",
      size: "medium",
      behavior: "",
    };
  }

  return {
    name: petToEdit.name,
    breed: petToEdit.breed,
    age: String(petToEdit.age),
    size: petToEdit.size,
    behavior: petToEdit.behavior,
  };
}

interface PetFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petToEdit?: PetDraft | null;
  onSave: (pet: PetDraft) => void;
}

export function PetFormSheet({ open, onOpenChange, petToEdit, onSave }: PetFormSheetProps) {
  const [formData, setFormData] = useState<PetFormState>(() => toFormState(petToEdit));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.breed || !formData.age) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }
    
    // Save
    onSave({ ...formData, age: Number.parseInt(formData.age, 10) });
    toast.success(petToEdit ? "Dados do cão atualizados!" : "Cão adicionado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto border-l-border">
        <SheetHeader>
          <SheetTitle>{petToEdit ? "Editar Cão" : "Cadastrar Novo Cão"}</SheetTitle>
          <SheetDescription>
            Preencha os dados do seu pet para facilitar os passeios.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Photo Upload Mock */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:bg-primary/20 transition-colors">
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-foreground">Enviar foto do pet</p>
            <p className="text-xs text-muted-foreground mt-1">Carregue imagens JPG, PNG (máx. 5MB)</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pet-name">Nome do cão <span className="text-destructive">*</span></Label>
              <Input
                id="pet-name"
                placeholder="Ex: Rex"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet-breed">Raça <span className="text-destructive">*</span></Label>
                <Input
                  id="pet-breed"
                  placeholder="Ex: Poodle"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pet-age">Idade (anos) <span className="text-destructive">*</span></Label>
                <Input
                  id="pet-age"
                  type="number"
                  min="0"
                  max="30"
                  placeholder="Ex: 3"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet-size">Porte <span className="text-destructive">*</span></Label>
              <Select
                value={formData.size}
                onValueChange={(value) => setFormData({ ...formData, size: value as DogSize })}
              >
                <SelectTrigger id="pet-size" className="w-full">
                  <SelectValue placeholder="Selecione o porte" />
                </SelectTrigger>
                <SelectContent>
                  {DOG_SIZE_TEXT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet-behavior">Comportamento / Observações especiais</Label>
              <textarea
                id="pet-behavior"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Ex: Muito brincalhão, mas tem medo de motos. Puxa muito a guia no começo do passeio."
                value={formData.behavior}
                onChange={(e) => setFormData({ ...formData, behavior: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar Cão
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
