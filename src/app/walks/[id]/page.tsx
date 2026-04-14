import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CreditCard,
  MapPin,
  MessageSquare,
  Route,
  Star,
  Timer,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { getWalkById, getWalkerById, managedPaymentMethods } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Detalhe do Passeio | DogTravel" };

export default async function WalkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const walk = getWalkById(id);

  if (!walk) {
    notFound();
  }

  const walker = getWalkerById(walk.walkerId);
  const paymentMethod = managedPaymentMethods.find((method) => method.id === walk.paymentMethodId);
  const status = statusConfig(walk.status);
  const primaryAction = getPrimaryAction(walk.id, walk.status);

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={`Passeio #${walk.id}`}
        description={`${walk.petNames.join(", ")} · ${walk.dateLabel}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/walks"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar
            </Link>
            {walk.status === "in_progress" && (
              <Link
                href={`/walks/${walk.id}/chat`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <MessageSquare className="mr-1.5 h-4 w-4" />
                Chat
              </Link>
            )}
            <Link
              href={primaryAction.href}
              className={cn(buttonVariants({ variant: primaryAction.variant }))}
            >
              {primaryAction.label}
            </Link>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border/70 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Resumo do passeio</CardTitle>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 pt-5 sm:grid-cols-2">
            <Info label="Data e horario" value={walk.dateLabel} icon={CalendarClock} />
            <Info label="Duracao" value={`${walk.durationMinutes} min`} icon={Timer} />
            <Info label="Preco" value={toMoney(walk.price)} icon={CreditCard} />
            <Info label="Distancia" value={`${walk.distanceKm.toFixed(1)} km`} icon={Route} />
            <Info label="Endereco de inicio" value={walk.startAddress} icon={MapPin} />
            <Info
              label="Pagamento"
              value={paymentMethod ? `${paymentMethod.brand} ${paymentMethod.label}` : "Nao informado"}
              icon={CreditCard}
            />
          </CardContent>
          {walk.notes && (
            <div className="border-t border-border/70 px-4 py-4 text-sm text-muted-foreground">
              <strong className="text-foreground">Observacoes:</strong> {walk.notes}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pessoas envolvidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {walk.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{participant.name}</span>
                </div>
                <Badge variant={participant.role === "walker" ? "info" : "secondary"} size="sm">
                  {participant.role === "walker" ? "Passeador" : "Cliente"}
                </Badge>
              </div>
            ))}

            {walker && (
              <Link
                href={`/walkers/${walker.id}`}
                className={cn(buttonVariants({ variant: "outline" }), "mt-2 w-full")}
              >
                <Star className="mr-1.5 h-4 w-4" />
                Ver perfil do passeador
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Linha do tempo</CardTitle>
          <CardDescription>Status completo deste passeio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {walk.timeline.map((event) => (
            <div key={event.id} className="flex items-start gap-3 rounded-xl border border-border/60 p-3.5">
              <span
                className={cn(
                  "mt-1 h-2.5 w-2.5 rounded-full",
                  event.state === "done" && "bg-success",
                  event.state === "current" && "bg-primary",
                  event.state === "pending" && "bg-muted-foreground/40"
                )}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-foreground">{event.label}</p>
                  <span className="text-xs text-muted-foreground">{event.at}</span>
                </div>
                {event.note && (
                  <p className="mt-1 text-sm text-muted-foreground">{event.note}</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function statusConfig(status: string) {
  switch (status) {
    case "pending":
      return { label: "Aguardando", variant: "warning" as const };
    case "accepted":
      return { label: "Agendado", variant: "info" as const };
    case "in_progress":
      return { label: "Em andamento", variant: "default" as const };
    case "completed":
      return { label: "Concluido", variant: "success" as const };
    case "cancelled":
      return { label: "Cancelado", variant: "destructive" as const };
    default:
      return { label: "Indefinido", variant: "outline" as const };
  }
}

function getPrimaryAction(walkId: string, status: string) {
  if (status === "in_progress") {
    return { label: "Acompanhar ao vivo", href: `/walks/${walkId}/tracking`, variant: "default" as const };
  }

  if (status === "completed") {
    return { label: "Avaliar passeio", href: `/walks/${walkId}/review`, variant: "success" as const };
  }

  if (status === "cancelled") {
    return { label: "Solicitar novo passeio", href: "/walks/new", variant: "default" as const };
  }

  return { label: "Abrir chat", href: `/walks/${walkId}/chat`, variant: "secondary" as const };
}

function toMoney(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
      <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
