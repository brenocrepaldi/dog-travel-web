"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Filter, History, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { walks, walkReviews, getWalkerById } from "@/lib/mock-data";
import { PageHeader } from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "completed", label: "Concluidos" },
  { value: "in_progress", label: "Em andamento" },
  { value: "accepted", label: "Agendados" },
  { value: "cancelled", label: "Cancelados" },
  { value: "pending", label: "Aguardando" },
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number]["value"];

export default function WalkHistoryPage() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const filteredWalks = useMemo(() => {
    return walks.filter((walk) => {
      const statusMatch = status === "all" || walk.status === status;
      const searchMatch =
        query.trim().length === 0 ||
        walk.petNames.join(" ").toLowerCase().includes(query.toLowerCase()) ||
        getWalkerById(walk.walkerId)?.name.toLowerCase().includes(query.toLowerCase()) ||
        walk.startAddress.toLowerCase().includes(query.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [query, status]);

  const stats = useMemo(() => {
    const completed = walks.filter((walk) => walk.status === "completed").length;
    const active = walks.filter((walk) => walk.status === "in_progress").length;
    const reviewed = walkReviews.length;

    return { completed, active, reviewed };
  }, []);

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Historico detalhado"
        description="Filtre seus passeios por status, revise os detalhes e acesse a avaliacao em um clique."
        action={
          <Link href="/walks" className={cn(buttonVariants({ variant: "outline" }))}>
            Voltar para meus passeios
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Passeios concluidos" value={String(stats.completed)} />
        <StatCard label="Passeios ativos" value={String(stats.active)} />
        <StatCard label="Avaliacoes enviadas" value={String(stats.reviewed)} />
      </div>

      <Card>
        <CardContent className="grid gap-3 py-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por pet, passeador ou local"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as StatusFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredWalks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
              <History className="h-6 w-6" />
              Nenhum passeio encontrado para os filtros selecionados.
            </CardContent>
          </Card>
        ) : (
          filteredWalks.map((walk) => {
            const walker = getWalkerById(walk.walkerId);
            const hasReview = walkReviews.some((review) => review.walkId === walk.id);
            const ratingLabel = hasReview ? "Ver avaliacao" : "Avaliar";

            return (
              <Card key={walk.id}>
                <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      {walker?.name ?? "Passeador"} · {walk.petNames.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">{walk.startAddress}</p>
                    <p className="text-xs text-muted-foreground">{walk.dateLabel}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={badgeByStatus(walk.status)}>{statusLabel(walk.status)}</Badge>
                    <Badge variant="secondary">
                      <CalendarClock className="mr-1 h-3.5 w-3.5" />
                      {walk.durationMinutes} min
                    </Badge>
                    <Link
                      href={`/walks/${walk.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Ver detalhes
                    </Link>
                    {walk.status === "completed" && (
                      <Link
                        href={`/walks/${walk.id}/review`}
                        className={cn(buttonVariants({ variant: "secondary", size: "sm" }))}
                      >
                        {ratingLabel}
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function statusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Aguardando";
    case "accepted":
      return "Agendado";
    case "in_progress":
      return "Em andamento";
    case "completed":
      return "Concluido";
    case "cancelled":
      return "Cancelado";
    default:
      return "Indefinido";
  }
}

function badgeByStatus(status: string) {
  switch (status) {
    case "pending":
      return "warning" as const;
    case "accepted":
      return "info" as const;
    case "in_progress":
      return "default" as const;
    case "completed":
      return "success" as const;
    case "cancelled":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}
