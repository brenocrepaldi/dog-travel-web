"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, ClipboardList, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
    toast(checked ? "Você está disponível para passeios" : "Você ficou indisponível", {
      icon: checked ? "🟢" : "⚪",
    });
  }

  function handleAccept(id: string) {
    toast.success("Passeio aceito!", { description: "O cliente foi notificado." });
  }

  function handleDecline(id: string) {
    toast("Passeio recusado", { description: "O pedido foi devolvido à fila." });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Olá, Carlos! 👋"
        description="Gerencie sua disponibilidade e acompanhe seus ganhos."
      />

      {/* ─── Availability toggle ─── */}
      <Card className={available ? "border-green-400/40 bg-green-50/50" : ""}>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="font-semibold text-sm">Disponibilidade</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              {available
                ? "Você está visível para clientes"
                : "Ative para receber pedidos de passeio"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium ${available ? "text-green-600" : "text-muted-foreground"}`}>
              {available ? "Ativo" : "Inativo"}
            </span>
            <Switch
              id="availability"
              checked={available}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* ─── Stats row ─── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Ganhos hoje",      value: "R$ 74" },
          { label: "Ganhos este mês",  value: "R$ 840" },
          { label: "Passeios totais",  value: "47" },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Incoming requests ─── */}
      <section className="space-y-4">
        <h2 className="font-semibold text-foreground">
          Pedidos recebidos
          {mockRequests.length > 0 && (
            <Badge className="ml-2 text-xs" variant="secondary">
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
          <div className="grid gap-3">
            {mockRequests.map((req) => (
              <Card key={req.id} className="hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Info */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {req.clientName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{req.clientName}</p>
                          <p className="text-xs text-muted-foreground">
                            🐕 {req.petNames.join(", ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>⏰ {req.scheduledAt}</span>
                        <span>🕐 {req.durationMinutes} min</span>
                        <span>📍 {req.location}</span>
                      </div>
                    </div>

                    {/* Price + Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="font-bold text-foreground">
                        R$ {req.price.toFixed(2).replace(".", ",")}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5"
                          onClick={() => handleDecline(req.id)}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Recusar
                        </Button>
                        <Button
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleAccept(req.id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
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
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Últimos passeios</h2>
          <Button variant="ghost" size="sm" render={<Link href="/walks" />}>
            Ver todos →
          </Button>
        </div>

        <div className="grid gap-2">
          {mockCompletedWalks.map((walk) => (
            <Card key={walk.id} className="hover:shadow-sm hover:border-primary/20 transition-all">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {walk.clientName[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{walk.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {walk.petNames.join(", ")} · {walk.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Concluído</Badge>
                  <span className="text-sm font-semibold text-green-600">
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
