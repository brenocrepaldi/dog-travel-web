"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Dog,
  PawPrint,
  Star,
  Trophy,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientProfile } from "@/features/clients/hooks/use-clients";
import type { ClientProfile } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SIZE_LABEL: Record<string, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
  giant: "Gigante",
};

const GENDER_LABEL: Record<string, string> = {
  male: "Macho",
  female: "Fêmea",
};

function clientInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function clientGradient(name: string) {
  const gradients = [
    "from-violet-400 to-purple-600",
    "from-sky-400 to-blue-600",
    "from-emerald-400 to-teal-600",
    "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-500",
    "from-indigo-400 to-violet-600",
  ];
  const i = name.charCodeAt(0) % gradients.length;
  return gradients[i];
}

function memberSinceLabel(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function ClientAvatar({
  name,
  avatarUrl,
  size = "lg",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeCls = size === "lg" ? "h-24 w-24 text-2xl" : size === "md" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  if (avatarUrl) {
    return (
      <div className={cn("shrink-0 overflow-hidden rounded-2xl ring-2 ring-background shadow-md", sizeCls)}>
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br ring-2 ring-background shadow-md font-bold text-white",
        clientGradient(name),
        sizeCls,
      )}
    >
      {clientInitials(name)}
    </div>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={cn(
      "flex flex-col gap-1 rounded-xl border px-4 py-3.5",
      accent ? "border-primary/20 bg-primary/5" : "border-border/50 bg-card",
    )}>
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 shrink-0" />
        {label}
      </div>
      <p className={cn("text-base font-bold", accent ? "text-primary" : "text-foreground")}>
        {value}
      </p>
    </div>
  );
}

// ─── Dog card ─────────────────────────────────────────────────────────────────

function DogCard({ dog }: { dog: ClientProfile["dogs"][number] }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 hover:border-border transition-colors">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        {dog.photoUrl ? (
          <img src={dog.photoUrl} alt={dog.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-amber-500/10">
            <PawPrint className="h-6 w-6 text-amber-500" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground text-sm">{dog.name}</p>
        <p className="truncate text-xs text-muted-foreground mt-0.5">{dog.breed}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <span className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">
            {SIZE_LABEL[dog.size] ?? dog.size}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {GENDER_LABEL[dog.gender] ?? dog.gender}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {dog.age} {dog.age === 1 ? "ano" : "anos"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: ClientProfile["reviews"][number] }) {
  const date = new Date(review.createdAt).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex gap-3">
      {review.walkerAvatarUrl ? (
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl">
          <img src={review.walkerAvatarUrl} alt={review.walkerName} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-[11px] font-bold text-primary">
          {clientInitials(review.walkerName || "?")}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm font-semibold text-foreground truncate">{review.walkerName}</p>
          <span className="text-[11px] text-muted-foreground shrink-0">{date}</span>
        </div>
        <div className="mt-0.5 flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30",
              )}
            />
          ))}
        </div>
        {review.comment && (
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            &quot;{review.comment}&quot;
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ClientDetailSkeleton() {
  return (
    <div className="space-y-6 pb-10 animate-pulse">
      <Skeleton className="h-8 w-24 rounded-lg" />
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-muted" />
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Skeleton className="h-24 w-24 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: client, isLoading, isError } = useClientProfile(id);

  if (isLoading) return <ClientDetailSkeleton />;

  if (isError || !client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Cliente não encontrado</p>
          <p className="text-xs text-muted-foreground mt-1">Este perfil pode não existir ou ter sido removido.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Voltar
        </Button>
      </div>
    );
  }

  const joinedLabel = memberSinceLabel(client.memberSince);

  return (
    <div className="flex flex-col gap-6 pb-10">

      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="-ml-2 self-start text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Voltar
      </Button>

      {/* Hero card */}
      <Card className="overflow-hidden py-0 gap-0">
        <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <ClientAvatar name={client.name} avatarUrl={client.avatarUrl} size="lg" />
            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-xl font-bold text-foreground leading-tight truncate">{client.name}</h1>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                <span>Membro desde {joinedLabel}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  <Dog className="h-3 w-3" />
                  {client.totalDogs} {client.totalDogs === 1 ? "cão" : "cães"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <Trophy className="h-3 w-3" />
                  {client.totalWalks} passeios concluídos
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatChip icon={Trophy} label="Passeios" value={String(client.totalWalks)} />
        <StatChip icon={PawPrint} label="Cães" value={String(client.totalDogs)} />
        <StatChip
          icon={Star}
          label="Média dada"
          value={client.avgRatingGiven > 0 ? client.avgRatingGiven.toFixed(1) : "—"}
          accent={client.avgRatingGiven > 0}
        />
      </div>

      {/* Dogs */}
      {client.dogs.length > 0 && (
        <Card className="overflow-hidden py-0 gap-0">
          <div className="flex items-center gap-2.5 border-b border-border/60 px-5 py-3.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
              <PawPrint className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Cães</h2>
              <p className="text-[11px] text-muted-foreground">
                {client.dogs.length} {client.dogs.length === 1 ? "cão cadastrado" : "cães cadastrados"}
              </p>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {client.dogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews given */}
      <Card className="overflow-hidden py-0 gap-0">
        <div className="flex items-center gap-2.5 border-b border-border/60 px-5 py-3.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
            <Star className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Avaliações dadas</h2>
            <p className="text-[11px] text-muted-foreground">
              {client.reviews.length > 0
                ? `${client.reviews.length} avaliação${client.reviews.length > 1 ? "ões" : ""} · média ${client.avgRatingGiven.toFixed(1)}`
                : "Nenhuma avaliação ainda"}
            </p>
          </div>
        </div>
        <CardContent className="p-5">
          {client.reviews.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <Star className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">Nenhuma avaliação feita ainda</p>
            </div>
          ) : (
            <div className="space-y-5">
              {client.reviews.map((review, i) => (
                <div key={review.walkId}>
                  <ReviewCard review={review} />
                  {i < client.reviews.length - 1 && <Separator className="mt-5 opacity-50" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
