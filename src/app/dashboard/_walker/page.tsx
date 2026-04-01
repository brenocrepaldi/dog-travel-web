"use client";

import Link from "next/link";
import { useState } from "react";
import { ClipboardList, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";

// ─── Placeholder data ──────────────────────────────────────────────────────
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
  { id: "w1", clientName: "Ana Silva",   petNames: ["Rex"],       date: "22 Mar", earnings: 37 },
  { id: "w2", clientName: "Julia Mendes", petNames: ["Mel"],      date: "21 Mar", earnings: 37 },
  { id: "w3", clientName: "Carla Pinto",  petNames: ["Rex","Bob"], date: "19 Mar", earnings: 48 },
];

export default function WalkerDashboardPage() {
  const [available, setAvailable] = useState(false);

  function handleToggle(checked: boolean) {
    setAvailable(checked);
    if(checked) toast.success("Você está disponível para passeios", {icon: "🟢"})
    else toast.warning("Você ficou indisponível", {icon: "⚪"})
  }

  function handleAccept(_id: string) {
    toast.success("Passeio aceito!", { description: "O cliente foi notificado." });
  }

  function handleDecline(_id: string) {
    toast("Passeio recusado", { description: "O pedido foi devolvido à fila." });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Olá, Passeador! 👋"
        description="Gerencie sua disponibilidade e acompanhe seus ganhos."
      />

      {/* ─── Availability toggle ─── */}
      <Card className={cn(
        "transition-all duration-300",
        available ? "border-success/40 bg-success/5 shadow-md" : "border-border"
      )}>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              available ? "bg-success animate-pulse" : "bg-muted-foreground/30"
            )} />
            <div>
              <p className="font-semibold text-base text-foreground">Disponibilidade</p>
              <p className="text-muted-foreground text-sm mt-1">
                {available
                  ? "Você está visível para clientes"
                  : "Ative para receber pedidos de passeio"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={cn(
              "text-sm font-semibold transition-colors",
              available ? "text-success" : "text-muted-foreground"
            )}>
              {available ? "Ativo" : "Inativo"}
            </span>
            <Switch
              id="availability"
              checked={available}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-success"
            />
          </div>
        </CardContent>
      </Card>

      {/* ─── Stats row ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Ganhos hoje",      value: "R$ 74", highlight: true },
          { label: "Ganhos este mês",  value: "R$ 840", highlight: true },
          { label: "Passeios totais",  value: "47", highlight: false },
        ].map((stat) => (
          <Card key={stat.label} interactive className={cn(
            "group",
            stat.highlight && "border-success/20"
          )}>
            <CardContent className="p-6 space-y-2">
              <p className={cn(
                "text-3xl font-bold tracking-tight transition-colors",
                stat.highlight ? "text-success" : "text-foreground"
              )}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Incoming requests ─── */}
      <section className="space-y-5">
        <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
          Pedidos recebidos
          {mockRequests.length > 0 && (
            <Badge variant="info" size="sm">
              {mockRequests.length}
            </Badge>
          )}
        </h2>

        {mockRequests.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhum pedido no momento"
            description="Ative sua disponibilidade para começar a receber pedidos."
          />
        ) : (
          <div className="grid gap-4">
            {mockRequests.map((req) => (
              <Card key={req.id} interactive className="group">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Info */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 ring-2 ring-background shadow-sm">
                          {req.clientName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-base text-foreground">{req.clientName}</p>
                          <p className="text-sm text-muted-foreground">
                            🐕 {req.petNames.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pl-13">
                        <span className="flex items-center gap-1.5">⏰ {req.scheduledAt}</span>
                        <span className="flex items-center gap-1.5">🕐 {req.durationMinutes} min</span>
                        <span className="flex items-center gap-1.5">📍 {req.location}</span>
                      </div>
                    </div>

                    {/* Price + Actions */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className="text-2xl font-bold text-success">
                        R$ {req.price.toFixed(2).replace(".", ",")}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="default"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive gap-2"
                          onClick={() => handleDecline(req.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          Recusar
                        </Button>
                        <Button
                          size="default"
                          variant="success"
                          className="gap-2"
                          onClick={() => handleAccept(req.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Aceitar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ─── Recent completed walks ─── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-foreground">Últimos passeios</h2>
          <Link 
            href="/walks"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid gap-3">
          {mockCompletedWalks.map((walk) => (
            <Card key={walk.id} interactive className="group">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 ring-2 ring-background shadow-sm transition-transform group-hover:scale-110">
                    {walk.clientName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-base text-foreground truncate">{walk.clientName}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {walk.petNames.join(", ")} · {walk.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <Badge variant="success" size="default">
                    Concluído
                  </Badge>
                  <span className="text-base font-bold text-success min-w-[80px] text-right">
                    +R$ {walk.earnings.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
