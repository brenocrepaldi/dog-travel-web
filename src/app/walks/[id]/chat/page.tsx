import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChatInterface } from "./_components/chat-interface";

export const metadata: Metadata = { title: "Chat do Passeio" };

export default async function WalkChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const currentUserId = session.user?.id as string;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] lg:h-full overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <ChatInterface walkId={id} currentUserId={currentUserId} />
    </div>
  );
}
