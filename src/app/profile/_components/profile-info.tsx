'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PET_IMAGE_ACCEPT, validatePetImage } from '@/lib/validations/pet';
import { Camera, Edit2, FileText, Mail, MapPin, Phone, Save, User, X } from 'lucide-react';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/features/profile/hooks/use-profile';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

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
        <p className="text-sm text-foreground font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

function EditField({
  id,
  label,
  icon,
  value,
  type = 'text',
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
      <Label
        htmlFor={id}
        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
      >
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

// ─── Profile skeleton ─────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="h-20 w-20 rounded-full bg-muted" />
        <div className="space-y-1.5 text-center">
          <div className="h-4 w-32 rounded bg-muted mx-auto" />
          <div className="h-3 w-44 rounded bg-muted mx-auto" />
        </div>
      </div>
      <div className="rounded-xl border bg-card h-56" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfileInfo() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);

  const { data: profile, isLoading } = useProfile();
  const { mutateAsync: saveProfileAsync, isPending: isSavingProfile } = useUpdateProfile();
  const { mutateAsync: uploadAvatarAsync, isPending: isUploading } = useUploadAvatar();
  const isSaving = isSavingProfile || isUploading;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatarUrl: '',
  });
  const [draft, setDraft] = useState(formData);

  // Sync form data when profile loads
  useEffect(() => {
    if (!profile) return;
    const next = {
      name: profile.name ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      avatarUrl: profile.avatarUrl ?? '',
    };
    setFormData(next);
    setDraft(next);
  }, [profile]);

  const displayName = isEditing ? draft.name : formData.name;
  const displayImage = isEditing ? draft.avatarUrl : formData.avatarUrl;

  const processFile = (file: File) => {
    const error = validatePetImage(file);
    if (error) {
      toast.error(error);
      return;
    }
    setPendingAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setDraft((prev) => ({ ...prev, avatarUrl: result }));
      }
    };
    reader.onerror = () => {
      toast.error('Não foi possível ler a imagem. Tente outro arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleEdit = () => {
    setDraft(formData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(formData);
    setPendingAvatarFile(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      let avatarUrl = draft.avatarUrl;
      if (pendingAvatarFile) {
        const result = await uploadAvatarAsync(pendingAvatarFile);
        avatarUrl = result.avatarUrl;
      }
      await saveProfileAsync({ name: draft.name, email: draft.email, phone: draft.phone });
      setFormData({ ...draft, avatarUrl });
      setPendingAvatarFile(null);
      toast.success('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch {
      toast.error('Erro ao salvar. Tente novamente.');
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      {/* ── Identidade ── */}
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="relative">
          <Avatar className="h-20 w-20 ring-2 ring-border/40 ring-offset-2 ring-offset-background shadow-sm">
            <AvatarImage src={displayImage} alt={displayName} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
              {getInitials(displayName) || '?'}
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
              {formData.name || 'Sem nome'}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">{formData.email}</p>
          </div>
        )}
      </div>

      {/* ── Card de contato ── */}
      <Card className="overflow-hidden py-0 gap-0">
        <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />
        <CardContent className="p-0">
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
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-lg gap-1.5 text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-lg gap-1.5 shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
