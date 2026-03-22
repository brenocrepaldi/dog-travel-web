import Link from "next/link";
import { PawPrint, MapPin, Star, Shield, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Feature card data
const features = [
  {
    icon: MapPin,
    title: "Rastreamento em tempo real",
    description:
      "Acompanhe o passeio do seu cão ao vivo no mapa, com atualizações a cada poucos segundos.",
  },
  {
    icon: Star,
    title: "Passeadores verificados",
    description:
      "Todos os nossos passeadores passam por verificação de antecedentes e avaliações da comunidade.",
  },
  {
    icon: Shield,
    title: "Segurança garantida",
    description:
      "Passeios cobertos por seguro e suporte 24/7 para você e seu melhor amigo.",
  },
  {
    icon: Clock,
    title: "Agendamento flexível",
    description:
      "Agende passeios com antecedência ou solicite sob demanda — quando e onde quiser.",
  },
];

const stats = [
  { value: "10.000+", label: "Passeios realizados" },
  { value: "500+", label: "Passeadores ativos" },
  { value: "4.9", label: "Avaliação média" },
  { value: "98%", label: "Clientes satisfeitos" },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <PawPrint className="h-6 w-6" />
            DogTravel
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#como-funciona" className="hover:text-foreground transition-colors">
              Como funciona
            </Link>
            <Link href="#recursos" className="hover:text-foreground transition-colors">
              Recursos
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative flex-1 flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/30">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-sm font-medium">
              <PawPrint className="h-3.5 w-3.5" />
              Novo jeito de cuidar do seu cão
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
              Passeios para o seu cão{" "}
              <span className="text-primary">com quem você pode confiar</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Conectamos donos de cães com passeadores verificados perto de você.
              Acompanhe em tempo real, converse pelo chat e avalie ao final.
              Simples, seguro e feito com carinho.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 px-8 h-12 text-base shadow-lg shadow-primary/20">
                  Solicitar um passeio
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register?role=walker">
                <Button size="lg" variant="outline" className="gap-2 px-8 h-12 text-base">
                  Quero ser passeador
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Works ─────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Como funciona?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Em poucos passos, seu cão estará pronto para o melhor passeio do dia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Crie sua conta",
                description: "Cadastre-se em minutos e adicione os dados do seu cão.",
              },
              {
                step: "02",
                title: "Escolha um passeador",
                description: "Veja passeadores próximos, leia avaliações e escolha o melhor.",
              },
              {
                step: "03",
                title: "Acompanhe ao vivo",
                description: "Receba atualizações em tempo real e fotos durante o passeio.",
              },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────────── */}
      <section id="recursos" className="py-24 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Desenvolvemos cada funcionalidade pensando na segurança e conforto do seu cão.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group border-border/60 hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <PawPrint className="h-12 w-12 text-primary-foreground/60 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
            Pronto para começar?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto">
            Junte-se a milhares de donos que já confiam no DogTravel para cuidar do seu melhor amigo.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 px-8 h-12 text-base font-semibold shadow-xl"
            >
              Criar conta gratuita
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <PawPrint className="h-5 w-5 text-primary" />
            DogTravel
          </div>
          <p>© 2026 DogTravel. Feito com ❤️ para os cãezinhos.</p>
        </div>
      </footer>
    </main>
  );
}
