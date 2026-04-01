import type { Metadata } from "next";
import Link from "next/link";
import { Plus, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";

export const metadata: Metadata = { title: "Meus Passeios | DogTravel" };

// ─── Placeholder data ───────────────────────────────────────────────────────
type WalkStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";

interface MockWalk {
  id: string;
  walkerName: string;
  petNames: string[];
  status: WalkStatus;
  date: string;
  price: string;
  duration: string;
}

const mockWalks: MockWalk[] = [
  {
    id: "1",
    walkerName: "Carlos Silva",
    petNames: ["Rex"],
    status: "in_progress",
    date: "Hoje · 14:30",
    price: "R$ 44,00",
    duration: "45 min",
  },
  {
    id: "2",
    walkerName: "Ana Lima",
    petNames: ["Rex", "Mel"],
    status: "completed",
    date: "18 Mar · 09:00",
    price: "R$ 53,00",
    duration: "60 min",
  },
  {
    id: "3",
    walkerName: "Pedro Santos",
    petNames: ["Mel"],
    status: "cancelled",
    date: "10 Mar · 16:00",
    price: "R$ 44,00",
    duration: "45 min",
  },
  {
    id: "4",
    walkerName: "Márcia Souza",
    petNames: ["Rex"],
    status: "accepted",
    date: "25 Mar · 10:00",
    price: "R$ 44,00",
    duration: "45 min",
  },
];

const statusMap: Record<WalkStatus, { label: string; variant: "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" }> = {
  pending:     { label: "Aguardando",   variant: "warning" },
  accepted:    { label: "Agendado",     variant: "info" },
  in_progress: { label: "Em andamento", variant: "default" },
  completed:   { label: "Concluído",    variant: "success" },
  cancelled:   { label: "Cancelado",    variant: "destructive" },
};

export default function WalksPage() {
  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Meus passeios"
        description="Histórico completo e acompanhamento de todos os passeios solicitados."
        action={
          <Link 
            href="/walks/new"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo passeio
          </Link>
        }
      />

      <Tabs defaultValue="todos" className="w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-muted/50 border border-border p-1 h-auto">
            <TabsTrigger value="todos" className="min-h-[44px] px-4">Todos</TabsTrigger>
            <TabsTrigger value="agendados" className="min-h-[44px] px-4">Agendados</TabsTrigger>
            <TabsTrigger value="em_andamento" className="min-h-[44px] px-4">Em andamento</TabsTrigger>
            <TabsTrigger value="concluidos" className="min-h-[44px] px-4">Concluídos</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por pet ou passeador..."
              className="pl-9 bg-background w-full"
            />
          </div>
        </div>

        <TabsContent value="todos" className="m-0 focus-visible:outline-none focus-visible:ring-0">
          <WalksGrid walks={mockWalks} />
        </TabsContent>
        <TabsContent value="agendados" className="m-0 focus-visible:outline-none focus-visible:ring-0">
          <WalksGrid walks={mockWalks.filter(w => w.status === "accepted" || w.status === "pending")} />
        </TabsContent>
        <TabsContent value="em_andamento" className="m-0 focus-visible:outline-none focus-visible:ring-0">
          <WalksGrid walks={mockWalks.filter(w => w.status === "in_progress")} />
        </TabsContent>
        <TabsContent value="concluidos" className="m-0 focus-visible:outline-none focus-visible:ring-0">
          <WalksGrid walks={mockWalks.filter(w => w.status === "completed")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WalksGrid({ walks }: { walks: MockWalk[] }) {
  if (walks.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="Nenhum passeio encontrado"
        description="Você ainda não tem passeios com este status."
        actionLabel="Solicitar novo passeio"
        actionHref="/walks/new"
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {walks.map((walk) => {
        const statusConfig = statusMap[walk.status];
        const isActive = walk.status === "in_progress";

        return (
          <Card key={walk.id} className={cn(
            "flex flex-col hover:shadow-md transition-all duration-200",
            isActive && "border-primary/50 shadow-sm bg-primary/5"
          )}>
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant={statusConfig.variant} className={cn(
                    "mb-2.5 font-medium",
                    isActive && "bg-green-500 hover:bg-green-600 text-white border-transparent"
                  )}>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />}
                    {statusConfig.label}
                  </Badge>
                  <CardTitle className="text-base font-semibold leading-tight">
                    {walk.walkerName}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {walk.date} · {walk.duration}
                  </CardDescription>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex flex-col items-center justify-center text-primary font-bold text-sm">
                  {walk.walkerName[0]}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <span className="text-base">🐕</span> {walk.petNames.join(", ")}
                </span>
                <span className="font-semibold text-foreground">{walk.price}</span>
              </div>

              <div className="mt-auto grid grid-cols-2 gap-2">
                {isActive ? (
                  <Link 
                    href={`/walks/${walk.id}/tracking`}
                    className={cn(buttonVariants({ variant: "default", size: "sm" }), "col-span-2")}
                  >
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    Acompanhar ao vivo
                  </Link>
                ) : (
                  <>
                    <Link 
                      href={`/walks/${walk.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                    >
                      Detalhes
                    </Link>
                    <Link 
                      href={walk.status === "completed" ? `/walkers/${walk.walkerName}` : `/walks/new`}
                      className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-full")}
                    >
                      {walk.status === "completed" ? "Avaliar" : "Reagendar"}
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
