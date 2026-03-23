import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/common/sidebar";

export const metadata: Metadata = {
  title: {
    template: "%s | DogTravel",
    default: "Dashboard | DogTravel",
  },
};

/**
 * Authenticated app shell layout.
 * Server Component — checks session server-side and redirects if not authenticated.
 * Renders the fixed sidebar + scrollable main content area.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main scrollable area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
