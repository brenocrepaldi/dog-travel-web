"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileCheck2,
  Lock,
  MapPin,
  PawPrint,
  Star,
  TrendingUp,
  Wallet,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWalkRequests } from "@/features/walks/hooks/use-walks";
import { useAcceptWalk, useDeclineWalk } from "@/features/walks/hooks/use-walk-actions";
import type { WalkRequest } from "@/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getHeroSubtitle(
  identityVerified: boolean,
  available: boolean,
  requestCount: number,
): string {
  if (!identityVerified) return "Conclua a verificação de identidade para começar a trabalhar.";
  if (!available)        return "Ative sua disponibilidade para receber pedidos.";
  if (requestCount > 0)  return `${requestCount} pedido${requestCount > 1 ? "s" : ""} aguardando sua resposta.`;
  return "Você está online. Aguardando novos pedidos.";
}

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {linkLabel} <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

type DocStatus = "idle" | "pending" | "verified";

const mockCompletedWalks = [
  { id: "w1", clientName: "Ana Silva",    petNames: ["Rex"],        date: "22 Mar", earnings: 37 },
  { id: "w2", clientName: "Julia Mendes", petNames: ["Mel"],        date: "21 Mar", earnings: 37 },
  { id: "w3", clientName: "Carla Pinto",  petNames: ["Rex", "Bob"], date: "19 Mar", earnings: 48 },
];

// ─── Main component ──────────────────────────────────────────────────────────

export default function WalkerDashboardPage() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Passeador";
  const greeting  = getGreeting();
  const router    = useRouter();

  const { data: walkerRequests = [] } = useWalkRequests();
  const { mutate: acceptWalk } = useAcceptWalk();
  const { mutate: declineWalk } = useDeclineWalk();

  const [available, setAvailable] = useState(false);

  const [identityStatus] = useState<DocStatus>("verified");

  const identityVerified = identityStatus === "verified";
  const activeWalk       = null;

  const totalEarnings = mockCompletedWalks.reduce((acc, w) => acc + w.earnings, 0);

  // ── Handlers ──
  function handleAvailabilityClick() {
    if (!identityVerified) {
      toast.warning("Verificação de identidade necessária", {
        description: "Complete a verificação antes de ativar sua disponibilidade.",
        action: {
          label: "Verificar agora",
          onClick: () => router.push("/profile/documents"),
        },
      });
      return;
    }
    const next = !available;
    setAvailable(next);
    if (next) toast.success("Você está disponível para passeios");
    else      toast.warning("Você ficou indisponível");
  }

  function handleAccept(request: WalkRequest) {
    const walkerName = session?.user?.name ?? "Carlos Silva";
    acceptWalk(
      { request, walkerName },
      {
        onSuccess: () => {
          toast.success("Passeio aceito!", {
            description: `${request.clientName} foi notificado. Veja em Meus passeios.`,
            action: {
              label: "Ver passeios",
              onClick: () => router.push("/walks"),
            },
          });
        },
      },
    );
  }

  function handleDecline(request: WalkRequest) {
    declineWalk(request.id, {
      onSuccess: () => {
        toast("Passeio recusado", {
          description: `Pedido de ${request.clientName} devolvido para a fila.`,
        });
      },
    });
  }

  return (
    <div className="space-y-7 pb-8">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl px-6 py-8 md:px-8 text-primary-foreground transition-all duration-500",
          available && identityVerified
            ? "bg-gradient-to-br from-primary via-primary to-emerald-700/60"
            : "bg-gradient-to-br from-primary via-primary to-primary/80",
        )}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 right-8 h-72 w-72 rounded-full bg-white/[0.03]" />
        <PawPrint className="pointer-events-none absolute bottom-3 right-5 h-32 w-32 text-white/[0.07]" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground/65">{greeting}</p>
            <h1 className="mt-0.5 text-3xl font-bold tracking-tight">{firstName}!</h1>
            <p className="mt-1.5 text-sm text-primary-foreground/70">
              {getHeroSubtitle(identityVerified, available, walkerRequests.length)}
            </p>

            {/* ── Availability toggle ── */}
            <button
              type="button"
              onClick={handleAvailabilityClick}
              className={cn(
                "mt-5 flex w-52 cursor-pointer select-none items-center justify-between rounded-xl px-4 py-3 transition-all duration-200",
                available && identityVerified
                  ? "bg-emerald-500/20 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25"
                  : "bg-white/10 hover:bg-white/[0.15]",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  {available && identityVerified && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={cn(
                      "relative inline-flex h-2.5 w-2.5 rounded-full transition-colors duration-300",
                      available && identityVerified ? "bg-emerald-400" : "bg-white/30",
                    )}
                  />
                </span>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-primary-foreground/50">
                    {!identityVerified ? "Disponibilidade" : "Status"}
                  </p>
                  <p className="text-sm font-semibold leading-tight text-primary-foreground">
                    {!identityVerified ? "Bloqueada" : available ? "Disponível" : "Indisponível"}
                  </p>
                  {!identityVerified && (
                    <p className="mt-0.5 text-[10px] leading-snug text-primary-foreground/50">
                      Verifique identidade para ativar
                    </p>
                  )}
                </div>
              </div>

              {!identityVerified ? (
                <Lock className="h-4 w-4 shrink-0 text-white/40" />
              ) : (
                <div
                  className={cn(
                    "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300",
                    available ? "bg-emerald-400" : "bg-white/25",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300",
                      available ? "left-[calc(100%-1.125rem)]" : "left-0.5",
                    )}
                  />
                </div>
              )}
            </button>
          </div>

          {/* Earnings stats */}
          <div className="flex gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:flex-col sm:gap-0">
            <div className="flex-1 px-5 py-3 text-center sm:text-right">
              <p className="text-2xl font-bold leading-none text-emerald-300">R$ 74</p>
              <p className="mt-0.5 text-xs text-primary-foreground/60">hoje</p>
            </div>
            <div className="w-px bg-white/10 sm:h-px sm:w-auto" />
            <div className="flex-1 px-5 py-3 text-center sm:text-right">
              <p className="text-2xl font-bold leading-none">R$ 840</p>
              <p className="mt-0.5 text-xs text-primary-foreground/60">este mês</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active walk banner ─────────────────────────────────────────────── */}
      {activeWalk && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Passeio em andamento</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Rex · 12 min restantes</p>
            </div>
          </div>
          <Link
            href="/walks/1/tracking"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
          >
            <MapPin className="h-3.5 w-3.5" />
            Acompanhar
          </Link>
        </div>
      )}

      {/* ── Quick actions ──────────────────────────────────────────────────── */}
      <section className="space-y-3.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Acesso rápido
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            { href: "/walks",               icon: ClipboardList, label: "Meus passeios", bg: "bg-primary/10",     fg: "text-primary"                          },
            { href: "/profile/payments",    icon: Wallet,        label: "Ganhos",        bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400" },
            { href: "/profile/documents",   icon: FileCheck2,    label: "Documentos",    bg: "bg-blue-500/10",    fg: "text-blue-600 dark:text-blue-400"       },
            { href: "/profile",             icon: User,          label: "Meu perfil",    bg: "bg-amber-500/10",   fg: "text-amber-600 dark:text-amber-400"     },
          ] as const).map(({ href, icon: Icon, label, bg, fg }) => (
            <Link key={href} href={href}>
              <div className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-150 hover:border-border hover:bg-accent/40">
                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", bg)}>
                  <Icon className={cn("h-5 w-5", fg)} />
                </div>
                <span className="text-xs font-semibold leading-tight text-foreground">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats row — clicáveis e com contexto ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { label: "passeios totais", value: "47",       href: "/walks",   icon: ClipboardList, color: "text-primary",                      bg: "bg-primary/10"   },
          { label: "passeios em abr", value: "12",       href: "/walks",   icon: TrendingUp,    color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-500/10"  },
          { label: "124 avaliações",  value: "4.8 ★",    href: "/profile", icon: Star,          color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
        ] as const).map(({ label, value, href, icon: Icon, color, bg }) => (
          <Link key={label} href={href}>
            <div className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all duration-150 hover:border-border hover:bg-accent/40">
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", bg)}>
                <Icon className={cn("h-4 w-4", color)} />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Incoming requests ──────────────────────────────────────────────── */}
      <section className="space-y-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">Pedidos recebidos</h2>
          {available && walkerRequests.length > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {walkerRequests.length}
            </span>
          )}
        </div>

        {/* Sem disponibilidade ou identidade bloqueada — empty state contextual */}
        {!available ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/60 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Nenhum pedido no momento</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {!identityVerified
                  ? "Verifique sua identidade para poder receber pedidos."
                  : "Ative sua disponibilidade para começar a receber pedidos."}
              </p>
            </div>
            {identityVerified && (
              <button
                type="button"
                onClick={handleAvailabilityClick}
                className="mt-1 cursor-pointer text-xs font-semibold text-primary hover:underline"
              >
                Ativar agora
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {walkerRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  {/* Client info */}
                  <div className="flex flex-1 min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                      {getInitials(req.clientName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {req.clientName}
                        </p>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                          {req.receivedMinutes < 2
                            ? "Agora"
                            : `${req.receivedMinutes} min atrás`}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {req.petNames.join(", ")}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {req.scheduledLabel}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <PawPrint className="h-3.5 w-3.5 shrink-0" />
                          {req.durationMinutes} min
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {req.startAddress}
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
                        onClick={() => handleDecline(req)}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Recusar
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-lg gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => handleAccept(req)}
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
        <SectionHeader title="Últimos passeios" href="/walks" linkLabel="Ver todos" />
        <Card className="overflow-hidden py-0 gap-0">
          <div className="divide-y divide-border/50">
            {mockCompletedWalks.map((walk) => (
              <div
                key={walk.id}
                className="group flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-muted/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary transition-transform duration-150 group-hover:scale-105">
                  {getInitials(walk.clientName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {walk.clientName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {walk.petNames.join(" & ")} · {walk.date}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 sm:inline-flex">
                    Concluído
                  </span>
                  <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    +R$ {walk.earnings.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-5 py-3">
            <span className="text-xs text-muted-foreground">
              Total dos últimos {mockCompletedWalks.length} passeios
            </span>
            <span className="text-sm font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              +R$ {totalEarnings.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </Card>
      </section>

    </div>
  );
}
