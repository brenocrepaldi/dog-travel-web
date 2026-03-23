import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * /dashboard — role-aware redirect.
 * Sends clients to /dashboard/client and walkers to /dashboard/walker.
 */
export default async function DashboardPage() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role ?? "client";

  if (role === "walker") {
    redirect("/dashboard/walker");
  }

  redirect("/dashboard/client");
}
