import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Plus, MapPin, ClipboardList, Dog } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";

export const metadata: Metadata = { title: "Dashboard - Cliente" };

// ─── Placeholder data (replace with API calls) ─────────────────────────────
const mockWalks = [
  {
    id: "1",
    walkerName: "Carlos Silva",
    petNames: ["Rex"],
    status: "completed" as const,
    date: "22 Mar · 14:30",
    price: "R$ 44,00",
  },
  {
    id: "2",
    walkerName: "Ana Lima",
    petNames: ["Rex", "Mel"],
    status: "completed" as const,
    date: "18 Mar · 09:00",
    price: "R$ 53,00",
  },
  {
    id: "3",
    walkerName: "Pedro Santos",
    petNames: ["Mel"],
    status: "cancelled" as const,
    date: "10 Mar · 16:00",
    price: "R$ 44,00",
  },
];

const mockPets = [
  { id: "1", name: "Rex", breed: "Golden Retriever", age: 3 },
  { id: "2", name: "Mel", breed: "Poodle", age: 1 },
];

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending:     { label: "Aguardando",   variant: "secondary" },
  accepted:    { label: "Confirmado",   variant: "default" },
  in_progress: { label: "Em andamento", variant: "default" },
  completed:   { label: "Concluído",    variant: "outline" },
  cancelled:   { label: "Cancelado",    variant: "destructive" },
};

export default async function ClientDashboardPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Cliente";

  // TODO: fetch activeWalk, recentWalks, pets from API
  const activeWalk = null; // replace with API call

  return (
    <div className="space-y-8">
      <PageHeader
        title={firstName ? `Olá, ${firstName}! 👋` : "Olá! 👋"}
        description="Bem-vindo ao DogTravel. Confira seus passeios e pets."
        action={
        <Link 
          href="/walks/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus className="h-4 w-4 mr-2" />
          Solicitar passeio
        </Link>
        }
      />

      {/* ─── Active walk banner ─── */}
      {activeWalk ? (
        <Card className="border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 shadow-sm">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-success/30 animate-ping" />
              </div>
              <div>
                <p className="font-semibold text-base text-foreground">Passeio em andamento</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Rex está sendo passeado · 12 min restantes
                </p>
              </div>
            </div>
            <Link 
              href="/walks/1/tracking"
              className={cn(buttonVariants({ variant: "default" }))}
            >
                <MapPin className="h-4 w-4 mr-2" />
                Acompanhar
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {/* ─── Stats row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Passeios realizados", value: "23", icon: ClipboardList },
          { label: "Pets cadastrados",    value: "2",  icon: Dog },
          { label: "Avaliação média",     value: "4.9★", icon: null },
          { label: "Gasto este mês",      value: "R$ 132", icon: null },
        ].map((stat) => (
          <Card key={stat.label} interactive className="group">
            <CardContent className="p-6 space-y-2">
              {stat.icon && (
                <stat.icon className="h-5 w-5 text-primary mb-2 transition-transform group-hover:scale-110" />
              )}
              <p className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ─── Recent walks ─── */}
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

        {mockWalks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhum passeio ainda"
            description="Solicite seu primeiro passeio e seu cão vai adorar!"
            actionLabel="Solicitar passeio"
            actionHref="/walks/new"
          />
        ) : (
          <div className="grid gap-3">
            {mockWalks.map((walk) => (
              <Card key={walk.id} interactive className="group">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 ring-2 ring-background shadow-sm transition-transform group-hover:scale-110">
                      {walk.walkerName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-base text-foreground truncate">{walk.walkerName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {walk.petNames.join(", ")} · {walk.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <Badge variant={statusMap[walk.status].variant} size="default">
                      {statusMap[walk.status].label}
                    </Badge>
                    <span className="text-base font-semibold text-foreground min-w-[80px] text-right">{walk.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ─── My pets ─── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-foreground">Meus cães</h2>
          <Link 
            href="/profile"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Gerenciar →
          </Link>
        </div>

        {mockPets.length === 0 ? (
          <EmptyState
            icon={Dog}
            title="Nenhum cão cadastrado"
            description="Adicione seu cão para começar a solicitar passeios."
            actionLabel="Adicionar cão"
            actionHref="/profile"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockPets.map((pet) => (
              <Card key={pet.id} interactive className="group">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0 ring-2 ring-background shadow-sm transition-transform group-hover:scale-110">
                    🐕
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-foreground truncate">{pet.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {pet.breed}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {pet.age} {pet.age === 1 ? "ano" : "anos"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Link href="/profile">
              <Card className="border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 p-5 h-full text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center shrink-0">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-base font-medium">Adicionar cão</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
