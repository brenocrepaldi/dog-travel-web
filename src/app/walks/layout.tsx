import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/common/sidebar";

export const metadata: Metadata = {
  title: "Solicitar Passeio | DogTravel",
};

/**
 * Walk request layout — inherits sidebar from parent but uses a full-width
 * content area suited for the multi-step form + summary panel split.
 */
export default async function WalksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
