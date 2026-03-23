"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, History } from "lucide-react";

const MOCK_HISTORY = [
  { id: 1, date: "22/03/2026", pets: "Rex", duration: "30 min", amount: "R$ 44,00", status: "Pago" },
  { id: 2, date: "18/03/2026", pets: "Rex", duration: "30 min", amount: "R$ 44,00", status: "Pago" },
  { id: 3, date: "10/03/2026", pets: "Rex + Mel", duration: "45 min", amount: "R$ 53,00", status: "Pago" },
];

export function ClientPayments() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Pagamentos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus métodos de pagamento e visualize o histórico de gastos.
        </p>
      </div>

      {/* ─── Highlights ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">Gasto no mês (Março)</CardDescription>
            <CardTitle className="text-4xl font-bold tracking-tighter">R$ 141,00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">3 passeios realizados neste mês.</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardDescription className="text-sm font-medium">Forma de pagamento padrão</CardDescription>
              <CardTitle className="text-xl font-bold mt-1 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                •••• 4242
              </CardTitle>
            </div>
            <Button variant="outline" size="sm">
              Gerenciar
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Mastercard expira em 12/29.</p>
          </CardContent>
        </Card>
      </div>

      {/* ─── History ─── */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-foreground" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Histórico de Transações
          </h2>
        </div>
        
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {MOCK_HISTORY.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 sm:p-5 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <span className="text-sm font-medium text-foreground min-w-[90px]">{item.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{item.pets}</span>
                    <span className="text-muted-foreground text-xs px-2 py-0.5 rounded-full bg-secondary/50">
                      {item.duration}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-right">
                  <span className="text-base font-bold text-foreground">{item.amount}</span>
                  <div className="hidden sm:flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium dark:bg-green-950/40 dark:text-green-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
