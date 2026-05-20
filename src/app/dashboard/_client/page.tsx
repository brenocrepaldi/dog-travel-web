import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  Plus, MapPin, ClipboardList, Dog,
  CreditCard, ChevronRight, PawPrint,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { DashboardDogs } from "./dashboard-dogs";

export const metadata: Metadata = { title: "Dashboard | DogTravel" };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const mockWalks = [
  { id: "1", walkerName: "Carlos Silva",  petNames: ["Rex"],        status: "completed" as const, date: "22 Mar · 14:30", price: "R$ 44,00" },
  { id: "2", walkerName: "Ana Lima",      petNames: ["Rex", "Mel"], status: "completed" as const, date: "18 Mar · 09:00", price: "R$ 53,00" },
  { id: "3", walkerName: "Pedro Santos",  petNames: ["Mel"],        status: "cancelled" as const, date: "10 Mar · 16:00", price: "R$ 44,00" },
];

const statusConfig = {
  pending:     { label: "Aguardando",   className: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400" },
  accepted:    { label: "Confirmado",   className: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400" },
  in_progress: { label: "Em andamento", className: "bg-primary/10 text-primary border-primary/20" },
  completed:   { label: "Concluído",    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400" },
  cancelled:   { label: "Cancelado",    className: "bg-muted text-muted-foreground border-border/60" },
};

function SectionHeader({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
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

export default async function ClientDashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Cliente";
  const greeting  = getGreeting();

  const activeWalk = null;

  return (
    <div className="space-y-7 pb-8">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 px-6 py-8 md:px-8 text-primary-foreground">
        <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 right-8 h-72 w-72 rounded-full bg-white/[0.03]" />
        <PawPrint className="pointer-events-none absolute bottom-3 right-5 h-32 w-32 text-white/[0.07]" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Greeting */}
          <div>
            <p className="text-sm font-medium text-primary-foreground/65">{greeting}</p>
            <h1 className="mt-0.5 text-3xl font-bold tracking-tight">{firstName}!</h1>
            <p className="mt-1.5 text-sm text-primary-foreground/70">
              Pronto para o próximo passeio?
            </p>
            <Link
              href="/walks/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              Solicitar passeio
            </Link>
          </div>

          {/* Mini stats — encapsulados num container sutil */}
          <div className="flex gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:flex-col sm:gap-0">
            <div className="flex-1 px-5 py-3 text-center sm:text-right">
              <p className="text-2xl font-bold leading-none">23</p>
              <p className="mt-0.5 text-xs text-primary-foreground/60">passeios</p>
            </div>
            <div className="w-px bg-white/10 sm:h-px sm:w-auto" />
            <div className="flex-1 px-5 py-3 text-center sm:text-right">
              <p className="text-2xl font-bold leading-none">4.9 ★</p>
              <p className="mt-0.5 text-xs text-primary-foreground/60">avaliação</p>
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
              <p className="text-xs text-muted-foreground mt-0.5">Rex está sendo passeado · 12 min restantes</p>
            </div>
          </div>
          <Link
            href="/walks/1/tracking"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:text-emerald-400"
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
            { href: "/walks/new",        icon: Plus,          label: "Solicitar passeio", bg: "bg-primary/10",     fg: "text-primary"                          },
            { href: "/walks",            icon: ClipboardList, label: "Meus passeios",     bg: "bg-blue-500/10",    fg: "text-blue-600 dark:text-blue-400"       },
            { href: "/dogs",             icon: Dog,           label: "Meus cães",         bg: "bg-amber-500/10",   fg: "text-amber-600 dark:text-amber-400"     },
            { href: "/profile/payments", icon: CreditCard,    label: "Pagamentos",        bg: "bg-emerald-500/10", fg: "text-emerald-600 dark:text-emerald-400" },
          ] as const).map(({ href, icon: Icon, label, bg, fg }) => (
            <Link key={href} href={href}>
              <div className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-center transition-all duration-150 hover:border-border hover:bg-accent/40">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl shrink-0", bg)}>
                  <Icon className={cn("h-5 w-5", fg)} />
                </div>
                <span className="text-xs font-semibold leading-tight text-foreground">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── My dogs — antes dos passeios, pets são a estrela ───────────────── */}
      <section className="space-y-3.5">
        <SectionHeader title="Meus cães" href="/dogs" linkLabel="Gerenciar" />
        <DashboardDogs />
      </section>

      {/* ── Recent walks ───────────────────────────────────────────────────── */}
      <section className="space-y-3.5">
        <SectionHeader title="Últimos passeios" href="/walks" linkLabel="Ver todos" />

        <Card className="overflow-hidden py-0 gap-0">
          <div className="divide-y divide-border/50">
            {mockWalks.map((walk) => {
              const s = statusConfig[walk.status];
              const isCancelled = walk.status === "cancelled";

              return (
                <Link key={walk.id} href={`/walks/${walk.id}`}>
                  <div className={cn(
                    "group flex items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-muted/30",
                    isCancelled && "opacity-50"
                  )}>
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-transform duration-150 group-hover:scale-105",
                      isCancelled ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    )}>
                      {getInitials(walk.walkerName)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{walk.walkerName}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {walk.petNames.join(" & ")} · {walk.date}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className={cn(
                        "hidden sm:inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
                        s.className
                      )}>
                        {s.label}
                      </span>
                      {!isCancelled && (
                        <span className="text-sm font-bold tabular-nums text-foreground">
                          {walk.price}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </section>

    </div>
  );
}
