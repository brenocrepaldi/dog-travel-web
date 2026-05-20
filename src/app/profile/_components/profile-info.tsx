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
import { Camera, Edit2, FileText, Mail, MapPin, Phone, Save, User, X } from "lucide-react";
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
          className="pl-9 rounded-lg"
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
    cpf: "000.000.000-00",
    address: "Rua Example, 123, São Paulo - SP",
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
    <div className="space-y-6">
      {/* ── Bloco de identidade (nível de página, sem card) ── */}
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="relative">
          <Avatar className="h-20 w-20 ring-2 ring-border/40 ring-offset-2 ring-offset-background shadow-sm">
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
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md ring-2 ring-background hover:bg-primary/90 transition-colors cursor-pointer"
                aria-label="Trocar foto"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="text-center">
            <p className="text-base font-semibold text-foreground leading-tight">
              {formData.name || "Sem nome"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{formData.email}</p>
          </div>
        )}
      </div>

      {/* ── Card de contato (formulário puro) ── */}
      <Card className="overflow-hidden py-0 gap-0">
        <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />

        <CardContent className="p-0">
          {/* Cabeçalho do card */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Informações de contato
            </span>
            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Editar
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="px-5">
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
              <ReadonlyField
                icon={<FileText className="w-4 h-4" />}
                label="CPF"
                value={formData.cpf}
              />
              <ReadonlyField
                icon={<MapPin className="w-4 h-4" />}
                label="Endereço"
                value={formData.address}
              />
            </div>
          ) : (
            <div className="px-5 py-5 space-y-4">
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
              <EditField
                id="cpf"
                label="CPF"
                icon={<FileText className="w-3.5 h-3.5" />}
                value={draft.cpf}
                onChange={(v) => setDraft((p) => ({ ...p, cpf: v }))}
              />
              <EditField
                id="address"
                label="Endereço"
                icon={<MapPin className="w-3.5 h-3.5" />}
                value={draft.address}
                onChange={(v) => setDraft((p) => ({ ...p, address: v }))}
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="rounded-lg gap-1.5 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="rounded-lg gap-1.5 shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
