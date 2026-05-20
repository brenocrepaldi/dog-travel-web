"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowUpRight,
  History,
  Wallet,
  ChevronRight,
} from "lucide-react";

const MOCK_EARNINGS = [
  { id: 1, walkId: "1", date: "22/03/2026", client: "Ana Silva", pets: "Rex", duration: "30 min", amount: "R$ 37,00" },
  { id: 2, walkId: "2", date: "21/03/2026", client: "Julia M.", pets: "Mel", duration: "45 min", amount: "R$ 44,00" },
  { id: 3, walkId: "3", date: "15/03/2026", client: "Roberto K.", pets: "Thor", duration: "60 min", amount: "R$ 52,00" },
];

function AvailableBalanceSidebar() {
  return (
    <Card className="overflow-hidden bg-primary border-primary/80">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
            <Wallet className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-primary-foreground">
              Saldo disponível
            </CardTitle>
            <CardDescription className="text-xs mt-0.5 text-primary-foreground/70">
              Pronto para transferência bancária
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-3xl font-bold tracking-tight text-primary-foreground leading-none">
          R$ 450,00
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="w-full rounded-md gap-1.5"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          Solicitar saque
        </Button>
      </CardContent>
    </Card>
  );
}

function EarningRow({ item }: { item: (typeof MOCK_EARNINGS)[number] }) {
  const initials = item.client
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link href={`/walks/${item.walkId}`}>
      <div className="group flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors duration-150 cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-primary/8 ring-1 ring-primary/15 flex items-center justify-center shrink-0 text-xs font-semibold text-primary">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{item.client}</span>
            <span className="text-muted-foreground text-sm">· {item.pets}</span>
            <span className="inline-flex items-center rounded-full bg-secondary/60 border border-border/50 px-2 py-0.5 text-[11px] text-muted-foreground font-medium">
              {item.duration}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-sm font-bold text-foreground tabular-nums">{item.amount}</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide">
              Concluído
            </p>
          </div>
          <div className="hidden sm:flex w-7 h-7 rounded-lg border border-border/50 bg-muted/40 items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/5 hover:border-primary/30 hover:text-primary">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function WalkerPayments() {
  return (
    <div className="flex flex-col gap-8 pb-8 lg:flex-row lg:items-start lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <header className="space-y-1.5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href="/profile" />}
              aria-label="Voltar ao perfil"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                Meus Ganhos
              </h1>
              <p className="text-sm text-muted-foreground">
                Acompanhe seus repasses e histórico de serviços.
              </p>
            </div>
          </div>
        </header>

        <section className="space-y-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <History className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Histórico de ganhos
            </span>

            <div className="flex-1 h-px bg-border/60" />

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              render={<Link href="/walks/history" />}
            >
              <History className="w-4 h-4" />
              Histórico completo
            </Button>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card overflow-hidden divide-y divide-border/50">
            {MOCK_EARNINGS.map((item) => (
              <EarningRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>

      <aside className="w-full shrink-0 lg:w-72 lg:sticky lg:top-37 lg:self-start">
        <AvailableBalanceSidebar />
      </aside>
    </div>
  );
}
