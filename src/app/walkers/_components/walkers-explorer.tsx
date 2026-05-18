"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock3, Info, MapPin, Search, ShieldCheck, Star } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { cn } from "@/lib/utils";
import type { DogSize } from "@/types";
import type { WalkerProfile } from "@/lib/mock-data";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/common/empty-state";
import { trackMetricEvent } from "@/lib/metrics";

interface WalkersExplorerProps {
  walkers: WalkerProfile[];
}

const SIZE_LABEL: Record<DogSize, string> = {
  small: "Pequeno",
  medium: "Médio",
  large: "Grande",
  giant: "Gigante",
};

function inferBehaviorNeeds(notes: string | undefined) {
  const text = (notes ?? "").toLowerCase();
  return {
    needsReactiveSupport: text.includes("reativ") || text.includes("agitado") || text.includes("medo"),
    needsMultiDogSupport: text.includes("puxa") || text.includes("mais de 1") || text.includes("dois"),
  };
}

function WalkerCard({ walker }: { walker: WalkerProfile }) {
  const initials = walker.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  const hasTrustPack =
    walker.trustChecks.identityVerified &&
    walker.trustChecks.backgroundCheck &&
    walker.trustChecks.firstAidCertified;

  return (
    <Card interactive className="group flex flex-col overflow-hidden">
      <CardContent className="flex flex-col flex-1 p-5 py-2.5 gap-4">
        {/* Avatar + name + rating row */}
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-border shrink-0">
            <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap" title="Verificado">
              <h3 className="text-base font-semibold text-foreground leading-tight">{walker.name}</h3>
              {walker.verified && (
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-label="Verificado" />
              )}
            </div>

            <div className="flex items-center gap-3 mt-0.5 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-medium text-foreground">{walker.rating.toFixed(1)}</span>
                <span>({walker.reviews} avaliações)</span>
              </span>
              <span className="flex items-center gap-1 truncate max-w-[200px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{walker.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {walker.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {walker.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Sizes + trust badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {walker.supportedSizes.map((size) => (
            <Badge key={`${walker.id}-${size}`} variant="outline" className="text-xs">
              {SIZE_LABEL[size]}
            </Badge>
          ))}
        </div>

        {/* Walks count + availability */}
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            <span className="font-semibold text-foreground">{walker.completedWalks}</span>
            {" "}passeios realizados
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {walker.availability}
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link
            href={`/walkers/${walker.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
          >
            Ver perfil
          </Link>
          <Link
            href={`/walks/new?walker=${walker.id}`}
            className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
          >
            Agendar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function WalkersExplorer({ walkers }: WalkersExplorerProps) {
  const pets = useAppStore((state) => state.pets);
  const [query, setQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState<"all" | DogSize>("all");
  const [onlyWithTrustPack, setOnlyWithTrustPack] = useState(false);
  const [fitMyPets, setFitMyPets] = useState(false);

  const derivedProfile = useMemo(() => {
    const sizes = new Set<DogSize>();
    let needsReactiveSupport = false;
    let needsMultiDogSupport = false;

    for (const pet of pets) {
      sizes.add(pet.size);
      const behaviorNeeds = inferBehaviorNeeds(pet.notes);
      needsReactiveSupport ||= behaviorNeeds.needsReactiveSupport;
      needsMultiDogSupport ||= behaviorNeeds.needsMultiDogSupport;
    }

    return {
      sizes: Array.from(sizes),
      needsReactiveSupport,
      needsMultiDogSupport: needsMultiDogSupport || pets.length > 1,
    };
  }, [pets]);

  const filteredWalkers = useMemo(() => {
    return walkers.filter((walker) => {
      const search = query.trim().toLowerCase();
      const textSource = `${walker.name} ${walker.location} ${walker.tags.join(" ")} ${walker.behaviorExpertise.join(" ")}`.toLowerCase();
      const matchesSearch = search.length === 0 || textSource.includes(search);

      const matchesSize = sizeFilter === "all" || walker.supportedSizes.includes(sizeFilter);

      const hasTrustPack =
        walker.trustChecks.identityVerified &&
        walker.trustChecks.backgroundCheck &&
        walker.trustChecks.firstAidCertified;
      const matchesTrust = !onlyWithTrustPack || hasTrustPack;

      if (!fitMyPets) {
        return matchesSearch && matchesSize && matchesTrust;
      }

      const supportsAllMySizes =
        derivedProfile.sizes.length === 0 ||
        derivedProfile.sizes.every((size) => walker.supportedSizes.includes(size));
      const supportsReactive = !derivedProfile.needsReactiveSupport || walker.behaviorExpertise.includes("reativo");
      const supportsMultiDog = !derivedProfile.needsMultiDogSupport || walker.behaviorExpertise.includes("multiplos-caes");

      return (
        matchesSearch &&
        matchesSize &&
        matchesTrust &&
        supportsAllMySizes &&
        supportsReactive &&
        supportsMultiDog
      );
    });
  }, [derivedProfile, fitMyPets, onlyWithTrustPack, query, sizeFilter, walkers]);

  useEffect(() => {
    if (fitMyPets) {
      trackMetricEvent({
        name: "walkers_fit_my_pets_enabled",
        payload: {
          petsCount: pets.length,
          needsReactiveSupport: derivedProfile.needsReactiveSupport,
          needsMultiDogSupport: derivedProfile.needsMultiDogSupport,
        },
      });
    }
  }, [derivedProfile.needsMultiDogSupport, derivedProfile.needsReactiveSupport, fitMyPets, pets.length]);

  useEffect(() => {
    const hasActiveFilters = Boolean(query.trim()) || sizeFilter !== "all" || onlyWithTrustPack || fitMyPets;
    if (!hasActiveFilters) return;
    trackMetricEvent({
      name: "walkers_filters_applied",
      payload: {
        queryLength: query.trim().length,
        sizeFilter,
        onlyWithTrustPack,
        fitMyPets,
        resultCount: filteredWalkers.length,
      },
    });
  }, [filteredWalkers.length, fitMyPets, onlyWithTrustPack, query, sizeFilter]);

  function getSizeLabel(sizeFilter: "all" | DogSize) {
    if (sizeFilter === "small") return "Pequeno";
    if (sizeFilter === "medium") return "Médio";
    if (sizeFilter === "large") return "Grande";
    if (sizeFilter === "giant") return "Gigante";
    return "Todos os portes";
  }

  return (
    <div className="space-y-6">
      {/* Filter panel */}
      <Card className="border-border/70 bg-muted/20">
        <CardContent className="px-4 space-y-4">
          {/* Search + selects */}
          <div className="flex gap-3">
            {/* Search */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Nome, região ou especialidade</Label>
              <div className="relative">
                <Search className="absolute left-3 top-4 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Digite aqui..."
                  className="pl-9 bg-background w-[428px]"
                />
              </div>
            </div>

            {/* Size select */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-muted-foreground">Porte do cão</Label>
              <Select value={getSizeLabel(sizeFilter)} onValueChange={(value) => setSizeFilter(value as "all" | DogSize)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Todos os portes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os portes</SelectItem>
                  <SelectItem value="small">Pequeno</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="giant">Gigante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Toggles + pet badges */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Switch id="trust-pack" checked={onlyWithTrustPack} onCheckedChange={setOnlyWithTrustPack} />
              <Label htmlFor="trust-pack" className="text-sm cursor-pointer">
                Pack completo de confiança
              </Label>
            </div>

            <div className="flex items-center gap-2 cursor-pointer">
              <Switch id="fit-my-pets" checked={fitMyPets} onCheckedChange={setFitMyPets} />
              <Label htmlFor="fit-my-pets" className="text-sm cursor-pointer">
                Compatível com meus cães
              </Label>
            </div>

            {pets.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {pets.map((pet) => (
                  <Badge key={pet.id} variant="secondary">
                    {pet.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tip */}
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground border-t border-border/40 pt-3">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/60" />
            Use os filtros para encontrar passeadores com experiência no porte e comportamento do seu cão. Ative "Compatível com meus cães" para uma seleção personalizada.
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredWalkers.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhum passeador encontrado"
          description="Ajuste os filtros para ampliar a busca e encontrar um perfil mais compatível."
          actionLabel="Limpar filtros"
          actionHref="/walkers"
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWalkers.map((walker) => (
              <WalkerCard key={walker.id} walker={walker} />
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground py-4">Todos os perfis são verificados pela equipe DogTravel.
          </p>
        </>
      )}
    </div>
  );
}
