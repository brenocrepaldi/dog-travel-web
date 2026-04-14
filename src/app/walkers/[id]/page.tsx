import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { getWalkerById, walks } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Detalhe do Passeador | DogTravel" };

export default async function WalkerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const walker = getWalkerById(id);

  if (!walker) {
    notFound();
  }

  const recentWalks = walks
    .filter((walk) => walk.walkerId === walker.id)
    .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={walker.name}
        description={walker.description}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/walkers"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar
            </Link>
            <Link
              href={`/walks/new?walker=${walker.id}`}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Agendar passeio
            </Link>
          </div>
        }
      />

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
                {walker.name
                  .split(" ")
                  .map((chunk) => chunk[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {walker.name}
                  {walker.verified && (
                    <ShieldCheck className="h-5 w-5 text-success" aria-label="Verificado" />
                  )}
                </CardTitle>
                <CardDescription className="mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {walker.rating.toFixed(1)} ({walker.reviews} avaliacoes)
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {walker.location}
                  </span>
                </CardDescription>
              </div>
            </div>
            <Badge variant="success" size="lg">
              {walker.availability}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoBlock icon={Wallet} label="Faixa de preco" value={walker.priceRange} />
          <InfoBlock icon={MapPin} label="Area de atendimento" value={walker.serviceArea} />
          <InfoBlock icon={CalendarClock} label="Passeios concluidos" value={String(walker.completedWalks)} />
          <InfoBlock icon={Clock3} label="Tempo medio de resposta" value={walker.responseTime} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Especialidades</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-0">
          {walker.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historico recente com clientes</CardTitle>
          <CardDescription>Ultimos passeios atendidos por este profissional.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentWalks.map((walk) => (
            <div
              key={walk.id}
              className="flex flex-col gap-3 rounded-xl border border-border/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">
                  {walk.petNames.join(", ")} · {walk.dateLabel}
                </p>
                <p className="text-sm text-muted-foreground">
                  {walk.startAddress}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={walk.status === "completed" ? "success" : "info"}>
                  {statusLabel(walk.status)}
                </Badge>
                <Link
                  href={`/walks/${walk.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Ver passeio
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/20 p-4">
      <p className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}

function statusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Concluido";
    case "in_progress":
      return "Em andamento";
    case "accepted":
      return "Agendado";
    case "cancelled":
      return "Cancelado";
    default:
      return "Aguardando";
  }
}
