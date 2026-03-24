import type { Metadata } from "next";
import Link from "next/link";
import { Search, MapPin, Star, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/common/page-header";

export const metadata: Metadata = { title: "Passeadores | DogTravel" };

// ─── Placeholder data ───────────────────────────────────────────────────────
const mockWalkers = [
  {
    id: "1",
    name: "Carlos Silva",
    rating: "4.9",
    reviews: 124,
    location: "Zona Sul, São Paulo",
    description: "Especialista em cães de grande porte. Amo correr com eles no parque!",
    tags: ["Grande Porte", "Energéticos", "Adestrador"],
    verified: true,
  },
  {
    id: "2",
    name: "Ana Lima",
    rating: "5.0",
    reviews: 89,
    location: "Centro, Rio de Janeiro",
    description: "Paciência e carinho para cães idosos ou com necessidades especiais.",
    tags: ["Idosos", "Medicação", "Pequeno Porte"],
    verified: true,
  },
  {
    id: "3",
    name: "Pedro Santos",
    rating: "4.7",
    reviews: 56,
    location: "Zona Norte, São Paulo",
    description: "Passeios tranquilos para cães reativos. Treinamento positivo.",
    tags: ["Reativos", "Ansiosos"],
    verified: false,
  },
  {
    id: "4",
    name: "Márcia Souza",
    rating: "4.8",
    reviews: 201,
    location: "Vila Mariana, São Paulo",
    description: "Mais de 5 anos de experiência. Foco na segurança e diversão.",
    tags: ["Experiente", "Primeiros Socorros"],
    verified: true,
  },
];

export default function WalkersPage() {
  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Passeadores Parceiros"
        description="Encontre o profissional perfeito para passear com o seu melhor amigo. Todos os passeadores verificados passam por checagem de antecedentes."
      />

      {/* ─── Search & Filters ─── */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome, região ou especialidade..."
            className="pl-9 bg-background w-full h-11"
          />
        </div>
      </div>

      {/* ─── Walkers Grid ─── */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockWalkers.map((walker) => (
          <Card key={walker.id} className="hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
            <CardHeader className="pb-4 relative">
              {/* Optional header background pattern */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-primary/5 border-b border-border/50 group-hover:bg-primary/10 transition-colors" />
              
              <div className="relative flex flex-col items-center pt-2">
                <Avatar className="w-20 h-20 border-4 border-background shadow-sm mb-3">
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {walker.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-foreground flex items-center justify-center gap-1.5">
                    {walker.name}
                    {walker.verified && (
                      <ShieldCheck className="w-4 h-4 text-primary" aria-label="Verificado" />
                    )}
                  </h3>
                  <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{walker.rating}</span>
                      <span>({walker.reviews})</span>
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{walker.location}</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-6 pt-2">
              <p className="text-sm text-muted-foreground line-clamp-2 text-center mb-5">
                "{walker.description}"
              </p>
              
              <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                {walker.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="font-normal text-xs bg-muted/60">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3 w-full">
                <Link 
                  href={`/walkers/${walker.id}`}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  Ver Perfil
                </Link>
                <Link 
                  href={`/walks/new?walker=${walker.id}`}
                  className={cn(buttonVariants({ variant: "default" }), "w-full")}
                >
                  Agendar
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
