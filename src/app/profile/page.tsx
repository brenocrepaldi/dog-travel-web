import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileInfo } from "./_components/profile-info";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

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
    </div>
  );
}
