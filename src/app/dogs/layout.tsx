import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/common/sidebar";
import { MobileTopBar } from "@/components/common/mobile-top-bar";

export const metadata: Metadata = {
  title: "Cães | DogTravel",
};

export default async function DogsLayout({
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
      <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
