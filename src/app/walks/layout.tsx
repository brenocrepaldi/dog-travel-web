import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/common/sidebar";
import { MobileTopBar } from "@/components/common/mobile-top-bar";

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
    <div className="flex h-dvh bg-muted/30 overflow-hidden">
      <MobileTopBar />
      <Sidebar />
      <div className="flex-1 overflow-y-auto flex flex-col pt-14 lg:pt-0">
        <div className="max-w-screen-xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
