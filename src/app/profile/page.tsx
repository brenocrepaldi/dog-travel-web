import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileInfo } from "./_components/profile-info";
import { PetsList } from "./_components/pets-list";
import { Separator } from "@/components/ui/separator";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "client";

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Meu Perfil
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e métodos de contato.
        </p>
      </div>

      {/* ─── Profile Section ─── */}
      <ProfileInfo user={session.user} />

      {/* ─── Pets Section (Clients Only) ─── */}
      {role === "client" && (
        <>
          <Separator className="my-8" />
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Meus Cães
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Adicione e gerencie os cães que passeiam com o DogTravel.
              </p>
            </div>
            <PetsList />
          </div>
        </>
      )}
    </div>
  );
}
