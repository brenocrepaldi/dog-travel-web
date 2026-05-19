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
  CreditCard,
  CheckCircle2,
  History,
  Receipt,
  ChevronRight,
} from "lucide-react";

const MOCK_HISTORY = [
  { id: 1, walkId: "1", date: "22/03/2026", walker: "João Silva", pets: "Rex", duration: "30 min", amount: "R$ 44,00", status: "Pago" },
  { id: 2, walkId: "2", date: "18/03/2026", walker: "João Silva", pets: "Rex", duration: "30 min", amount: "R$ 44,00", status: "Pago" },
  { id: 3, walkId: "3", date: "10/03/2026", walker: "João Silva", pets: "Rex + Mel", duration: "45 min", amount: "R$ 53,00", status: "Pago" },
];

function PaymentMethodsSidebar() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">Forma de pagamento</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Cartão usado nos seus passeios
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3.5">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Cartão padrão</p>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-6 rounded-md bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <CreditCard className="w-3.5 h-3.5 text-primary/70" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">•••• 4242</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Mastercard · expira 12/29
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          className="w-full py-4"
          render={<Link href="/payments/methods" />}
        >
          Gerenciar formas de pagamento
        </Button>
      </CardContent>
    </Card>
  );
}

// Linha do histórico
function TransactionRow({
  item,
}: {
  item: (typeof MOCK_HISTORY)[number];
}) {
  return (
    <Link href={`/walks/${item.walkId}`}>
      <div className="group flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors duration-150 cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 text-muted-foreground group-hover:bg-muted transition-colors">
          <Receipt className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{item.walker}</span>
            <span className="inline-flex items-center rounded-full bg-secondary/60 border border-border/50 px-2 py-0.5 text-[11px] text-muted-foreground font-medium">
              {item.duration}
            </span>
            <span className="text-xs text-muted-foreground">{item.pets}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            {item.status}
          </div>
          <span className="text-sm font-bold text-foreground tabular-nums">{item.amount}</span>
          <div
            className="hidden sm:flex w-7 h-7 rounded-lg border border-border/50 bg-muted/40 items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/5 hover:border-primary/30 hover:text-primary"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ClientPayments() {
  return (
    <div className="flex flex-col gap-8 pb-8 lg:flex-row lg:items-start lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <header className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                  Pagamentos
                </h1>
                <p className="text-sm text-muted-foreground">
                  Acompanhe suas transações e métodos de pagamento.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <History className="w-3 h-3 text-primary" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Histórico de transações
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
            {MOCK_HISTORY.map((item) => (
              <TransactionRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>

      <aside className="w-full shrink-0 lg:w-72 lg:sticky lg:top-37 lg:self-start">
        <PaymentMethodsSidebar />
      </aside>
    </div>
  );
}
