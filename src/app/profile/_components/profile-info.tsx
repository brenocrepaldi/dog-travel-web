"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PET_IMAGE_ACCEPT,
  validatePetImage,
} from "@/lib/validations/pet";
import { Camera, Edit2, Mail, Phone, Save, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { User as NextAuthUser } from "next-auth";
interface ProfileInfoProps {
  user: NextAuthUser;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// Campo de leitura (não editando)
function ReadonlyField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider leading-none mb-1">
          {label}
        </p>
        <p className="text-sm text-foreground font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

// Campo editável
function EditField({
  id,
  label,
  icon,
  value,
  type = "text",
  onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 pointer-events-none">
          {icon}
        </div>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>
    </div>
  );
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name ?? "",
    email: user.email ?? "",
    phone: "(11) 99999-9999",
    image: user.image ?? "",
  });
  const [draft, setDraft] = useState(formData);

  const initials = getInitials(formData.name);
  const displayImage = isEditing ? draft.image : formData.image;

  const processFile = (file: File) => {
    const error = validatePetImage(file);
    if (error) {
      toast.error(error);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setDraft((prev) => ({ ...prev, image: result }));
      }
    };
    reader.onerror = () => {
      toast.error("Não foi possível ler a imagem. Tente outro arquivo.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleEdit = () => {
    setDraft(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(formData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setFormData(draft);
    toast.success("Perfil atualizado com sucesso!");
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      {/* Faixa decorativa */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />

      <CardContent className="p-0">
        {/* ── Área superior: avatar + nome + ações ── */}
        <div className="relative px-6 pt-6 pb-5 flex flex-col sm:flex-row sm:items-center gap-5 border-b border-border/50">
          {/* Avatar */}
          <div className="relative shrink-0 self-start sm:self-auto">
            <Avatar className="h-20 w-20 ring-2 ring-border/40 ring-offset-2 ring-offset-card shadow-sm">
              <AvatarImage src={displayImage} alt={formData.name} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
                {initials || "?"}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={PET_IMAGE_ACCEPT}
                  className="sr-only"
                  onChange={handleFileChange}
                  aria-label="Enviar foto de perfil"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md ring-2 ring-card hover:bg-primary/90 transition-colors cursor-pointer"
                  aria-label="Trocar foto"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Nome e cargo */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground leading-tight truncate">
              {formData.name || "Sem nome"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {formData.email}
            </p>
          </div>

          {/* Botões de ação */}
          <div className="shrink-0 flex gap-2 sm:self-start">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="rounded-xl gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Editar perfil
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="rounded-xl gap-1.5 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="rounded-xl gap-1.5 shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  Salvar
                </Button>
              </>
            )}
          </div>
        </div>

        {/* ── Área inferior: campos ── */}
        <div className="px-6 py-5">
          {/* Cabeçalho da seção */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Informações de contato
            </span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {!isEditing ? (
            <div className="md:grid md:grid-cols-2 md:gap-x-8">
              <ReadonlyField
                icon={<User className="w-4 h-4" />}
                label="Nome completo"
                value={formData.name}
              />
              <ReadonlyField
                icon={<Mail className="w-4 h-4" />}
                label="E-mail"
                value={formData.email}
              />
              <ReadonlyField
                icon={<Phone className="w-4 h-4" />}
                label="Telefone"
                value={formData.phone}
              />
            </div>
          ) : (
            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-4 md:space-y-0">
              <EditField
                id="name"
                label="Nome completo"
                icon={<User className="w-3.5 h-3.5" />}
                value={draft.name}
                onChange={(v) => setDraft((p) => ({ ...p, name: v }))}
              />
              <EditField
                id="email"
                label="E-mail"
                type="email"
                icon={<Mail className="w-3.5 h-3.5" />}
                value={draft.email}
                onChange={(v) => setDraft((p) => ({ ...p, email: v }))}
              />
              <EditField
                id="phone"
                label="Telefone"
                icon={<Phone className="w-3.5 h-3.5" />}
                value={draft.phone}
                onChange={(v) => setDraft((p) => ({ ...p, phone: v }))}
              />
              <p className="text-[11px] text-muted-foreground/70 pt-1 md:col-span-2">
                Suas informações são usadas apenas para facilitar a comunicação com passeadores.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
