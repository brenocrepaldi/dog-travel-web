"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ClipboardList, CheckCircle2, XCircle,
  TrendingUp, ChevronRight, PawPrint,
  MapPin, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const mockRequests = [
  {
    id: "req-1",
    clientName: "Ana Silva",
    petNames: ["Rex"],
    durationMinutes: 30,
    price: 44,
    scheduledAt: "Hoje às 15:00",
    location: "Rua das Flores, 120",
  },
  {
    id: "req-2",
    clientName: "Julia Mendes",
    petNames: ["Mel", "Bob"],
    durationMinutes: 45,
    price: 58,
    scheduledAt: "Amanhã às 09:00",
    location: "Av. Paulista, 900",
  },
];

const mockCompletedWalks = [
  { id: "w1", clientName: "Ana Silva",    petNames: ["Rex"],        date: "22 Mar", earnings: 37 },
  { id: "w2", clientName: "Julia Mendes", petNames: ["Mel"],        date: "21 Mar", earnings: 37 },
  { id: "w3", clientName: "Carla Pinto",  petNames: ["Rex", "Bob"], date: "19 Mar", earnings: 48 },
];

export default function WalkerDashboardPage() {
  const [available, setAvailable] = useState(false);

  function handleToggle(checked: boolean) {
    setAvailable(checked);
    if (checked) toast.success("Você está disponível para passeios", { icon: "🟢" });
    else toast.warning("Você ficou indisponível", { icon: "⚪" });
  }

  function handleAccept(id: string) {
    toast.success("Passeio aceito!", { description: `Pedido ${id} confirmado e cliente notificado.` });
  }

  function handleDecline(id: string) {
    toast("Passeio recusado", { description: `Pedido ${id} devolvido para a fila.` });
  }

  return (
    <div className="space-y-7 pb-8">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 px-6 py-8 md:px-8 text-primary-foreground">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 right-8 h-72 w-72 rounded-full bg-white/[0.03]" />
        <PawPrint className="pointer-events-none absolute bottom-3 right-5 h-32 w-32 text-white/[0.07]" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground/65">Bem-vindo de volta</p>
            <h1 className="mt-0.5 text-3xl font-bold tracking-tight">Passeador!</h1>
            <p className="mt-1.5 text-sm text-primary-foreground/70">
              Gerencie sua disponibilidade e acompanhe seus ganhos.
            </p>

            {/* Availability toggle inline no hero */}
            <div className="mt-5 inline-flex items-center gap-3 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                {available && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span className={cn(
                  "relative inline-flex h-2.5 w-2.5 rounded-full transition-colors",
                  available ? "bg-emerald-400" : "bg-white/30"
                )} />
              </span>
              <span className="text-sm font-semibold text-primary-foreground">
                {available ? "Disponível" : "Indisponível"}
              </span>
              <Switch
                checked={available}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/20"
              />
            </div>
          </div>

          {/* Earnings stats */}
          <div className="flex gap-6 sm:flex-col sm:items-end sm:gap-3">
            <div className="sm:text-right">
              <p className="text-2xl font-bold leading-none text-emerald-300">R$ 74</p>
              <p className="mt-0.5 text-xs text-primary-foreground/60">hoje</p>
            </div>
            <div className="sm:text-right">
              <p className="text-2xl font-bold leading-none">R$ 840</p>
              <p className="mt-0.5 text-xs text-primary-foreground/60">este mês</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: "Passeios totais",   value: "47",      icon: ClipboardList, color: "text-primary",                    bg: "bg-primary/10"      },
          { label: "Este mês",          value: "12",      icon: TrendingUp,    color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10"     },
          { label: "Avaliação",         value: "4.8 ★",   icon: MapPin,        color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10"  },
        ] as const).map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl shrink-0", bg)}>
              <Icon className={cn("h-4 w-4", color)} />
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Incoming requests ──────────────────────────────────────────────── */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">Pedidos recebidos</h2>
          {mockRequests.length > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {mockRequests.length}
            </span>
          )}
        </div>

        {mockRequests.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Nenhum pedido no momento</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Ative sua disponibilidade para receber pedidos.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {mockRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Client info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                      {getInitials(req.clientName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{req.clientName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {req.petNames.join(", ")}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {req.scheduledAt}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <PawPrint className="h-3.5 w-3.5 shrink-0" />
                          {req.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {req.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price + actions */}
                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      R$ {req.price.toFixed(2).replace(".", ",")}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg gap-1.5 border-destructive/30 text-destructive hover:border-destructive hover:bg-destructive/10"
                        onClick={() => handleDecline(req.id)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Recusar
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-lg gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleAccept(req.id)}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Aceitar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Recent completed walks ─────────────────────────────────────────── */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Últimos passeios</h2>
          <Link
            href="/walks"
            className="flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver todos <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <Card className="overflow-hidden py-0 gap-0">
          <div className="divide-y divide-border/50">
            {mockCompletedWalks.map((walk) => (
              <div key={walk.id} className="group flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-muted/30">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary transition-transform duration-150 group-hover:scale-105">
                  {getInitials(walk.clientName)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{walk.clientName}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {walk.petNames.join(" & ")} · {walk.date}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden sm:inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    Concluído
                  </span>
                  <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    +R$ {walk.earnings.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

    </div>
  );
}
