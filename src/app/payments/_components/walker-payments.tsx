"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, ArrowUpRight, Wallet } from "lucide-react";

const MOCK_EARNINGS = [
  { id: 1, date: "22/03/2026", client: "Ana Silva", pets: "Rex", duration: "30 min", amount: "R$ 37,00" },
  { id: 2, date: "21/03/2026", client: "Julia M.", pets: "Mel", duration: "45 min", amount: "R$ 44,00" },
  { id: 3, date: "15/03/2026", client: "Roberto K.", pets: "Thor", duration: "60 min", amount: "R$ 52,00" },
];

export function WalkerPayments() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Meus Ganhos</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe o seu faturamento e repasses pendentes.
          </p>
        </div>
        <Button className="hidden sm:flex">
          <Wallet className="h-4 w-4 mr-2" />
          Solicitar Saque
        </Button>
      </div>

      {/* ─── Highlights ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">Esta semana</CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tighter text-emerald-600 dark:text-emerald-500">
              R$ 210,00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span>+12% vs. sem. passada</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">Este mês</CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tighter">
              R$ 840,00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">18 passeios concluídos</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm sm:col-span-2 lg:col-span-1 bg-primary text-primary-foreground">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium text-primary-foreground/80">Saldo Disponível</CardDescription>
            <CardTitle className="text-3xl font-bold tracking-tighter">
              R$ 450,00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" size="sm" className="w-full sm:hidden mt-2">
              Solicitar Saque
            </Button>
            <p className="text-xs text-primary-foreground/70 hidden sm:block">Pronto para transferência bancária.</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── History ─── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Histórico de Serviços
          </h2>
        </div>
        
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {MOCK_EARNINGS.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                  <span className="text-sm font-medium text-foreground min-w-[90px]">{item.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{item.client}</span>
                    <span className="text-muted-foreground text-sm">· {item.pets}</span>
                  </div>
                  <span className="text-muted-foreground text-xs px-2 py-0.5 rounded-full bg-secondary/50 self-start sm:self-auto">
                    {item.duration}
                  </span>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  <span className="text-base font-bold text-foreground">{item.amount}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Concluído</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
