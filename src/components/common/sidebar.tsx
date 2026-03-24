"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  PawPrint,
  LayoutDashboard,
  Plus,
  ClipboardList,
  Dog,
  CreditCard,
  User,
  LogOut,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ─── Nav items per role ───────────────────────────────────────────────────────
const clientNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/walks/new", icon: Plus, label: "Solicitar passeio" },
  { href: "/walks", icon: ClipboardList, label: "Meus passeios" },
  { href: "/walkers", icon: Dog, label: "Passeadores" },
  { href: "/payments", icon: CreditCard, label: "Pagamentos" },
  { href: "/profile", icon: User, label: "Perfil" },
];

const walkerNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/walks", icon: ClipboardList, label: "Meus passeios" },
  { href: "/payments", icon: DollarSign, label: "Ganhos" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = (session?.user as { role?: string })?.role ?? "client";
  const navItems = role === "walker" ? walkerNav : clientNav;

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-background h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <PawPrint className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-base text-foreground tracking-tight">
          DogTravel
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User / Logout */}
      <div className="px-3 py-4 space-y-1">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-all duration-150 group"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-foreground">
              {session?.user?.name ?? "Usuário"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {role === "walker" ? "Passeador" : "Cliente"}
            </p>
          </div>
        </Link>

        <Button
          variant="ghost"
          // size="sm"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </Button>
      </div>
    </aside>
  );
}
