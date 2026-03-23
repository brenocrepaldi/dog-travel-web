import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientPayments } from "./_components/client-payments";
import { WalkerPayments } from "./_components/walker-payments";

export default async function PaymentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "client";

  return role === "walker" ? <WalkerPayments /> : <ClientPayments />;
}
