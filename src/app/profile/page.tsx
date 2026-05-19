import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileInfo } from "./_components/profile-info";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  UserCircle2,
  ShieldCheck,
  Lightbulb,
  Mail,
  Phone,
  User,
} from "lucide-react";

const PROFILE_TIPS = [
  {
    icon: User,
    text: "Mantenha seu nome completo atualizado para facilitar o contato com passeadores.",
  },
  {
    icon: Mail,
    text: "Use um e-mail válido — é por ele que você recebe confirmações e notificações.",
  },
  {
    icon: Phone,
    text: "Informe um telefone ativo para que passeadores possam entrar em contato rapidamente.",
  },
] as const;

function ProfileTipsSidebar() {
  return (
    <Card className="overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-primary/60 via-primary to-primary/40" />

      <CardHeader className="pb-2 pt-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">Dicas rápidas</CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Mantenha seu perfil sempre atualizado
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-5">
        <ul className="space-y-3.5 mt-1">
          {PROFILE_TIPS.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5 text-muted-foreground">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tip.text}
                </p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

function ProtectedDataFooter() {
  return (
    <footer className="pt-2">
      <div className="rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Seus dados estão seguros</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-1">
            Suas informações são usadas apenas para facilitar o contato com passeadores.
            Nunca compartilhamos seus dados com terceiros.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex flex-col gap-8 pb-8 lg:flex-row lg:items-start lg:gap-10">
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <header className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Meu Perfil
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gerencie suas informações pessoais e dados de contato.
              </p>
            </div>
          </div>
          <Separator className="mt-6" />
        </header>

        <section className="min-w-0">
          <ProfileInfo user={session.user} />
        </section>

        <ProtectedDataFooter />
      </div>

      <aside className="w-full shrink-0 lg:w-72 lg:sticky lg:top-37 lg:self-start">
        <ProfileTipsSidebar />
      </aside>
    </div>
  );
}
