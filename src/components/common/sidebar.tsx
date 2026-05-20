"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  PawPrint,
  LayoutDashboard,
  ClipboardList,
  Dog,
  User,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// ─── Nav items per role ───────────────────────────────────────────────────────
const clientNav = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"      },
  { href: "/walks",      icon: ClipboardList,   label: "Meus passeios"  },
  { href: "/walkers",    icon: PawPrint,         label: "Passeadores"   },
  { href: "/dogs",       icon: Dog,              label: "Meus Cães"     },
  { href: "/profile",    icon: User,             label: "Perfil"        },
];

const walkerNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard"     },
  { href: "/walks",     icon: ClipboardList,   label: "Meus passeios" },
  { href: "/profile",   icon: User,            label: "Perfil"        },
];

// ─── Walker profile completion (mock — matches dashboard state) ───────────────
type DocStatus = "idle" | "pending" | "verified";

interface CompletionStep {
  icon: React.ElementType;
  label: string;
  required: boolean;
  status: DocStatus;
  href: string;
}

const COMPLETION_STEPS: CompletionStep[] = [
  { icon: ShieldCheck, label: "Identidade",     required: true,  status: "idle",    href: "/profile/documents" },
  { icon: FileCheck2,  label: "Antecedentes",   required: false, status: "idle",    href: "/profile/documents" },
  { icon: Award,       label: "Certificações",  required: false, status: "pending", href: "/profile/documents" },
  { icon: User,        label: "Foto de perfil", required: false, status: "idle",    href: "/profile/details"   },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role ?? "client";
  const navItems = role === "walker" ? walkerNav : clientNav;

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const activeHref = navItems
    .filter(({ href }) => pathname === href || pathname.startsWith(href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;

  // Walker completion state
  const identityVerified = COMPLETION_STEPS[0].status === "verified";
  const score = COMPLETION_STEPS.filter((s, i) =>
    i === 0 ? s.status === "verified" : s.status !== "idle"
  ).length;
  const pct = Math.round((score / COMPLETION_STEPS.length) * 100);
  const profileComplete = score === COMPLETION_STEPS.length;

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
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px]",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 shrink-0 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Walker profile completion widget */}
      {role === "walker" && !profileComplete && (
        <div className="px-3 pb-3">
          <div
            className={cn(
              "overflow-hidden rounded-xl border",
              !identityVerified ? "border-amber-500/20" : "border-border/60",
            )}
          >
            {/* Colored accent bar */}
            <div
              className={cn(
                "h-0.5 w-full",
                !identityVerified
                  ? "bg-gradient-to-r from-amber-400/60 via-amber-500 to-amber-400/40"
                  : "bg-gradient-to-r from-primary/60 via-primary to-primary/40",
              )}
            />

            <div className="space-y-3 p-3">
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    "text-[11px] font-semibold leading-none",
                    !identityVerified
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-foreground",
                  )}
                >
                  {!identityVerified ? "Ação necessária" : "Complete seu perfil"}
                </p>
                <span
                  className={cn(
                    "shrink-0 text-[10px] font-bold tabular-nums",
                    !identityVerified
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground",
                  )}
                >
                  {pct}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    !identityVerified
                      ? "bg-gradient-to-r from-amber-500 to-amber-400"
                      : "bg-gradient-to-r from-primary to-primary/70",
                  )}
                  style={{ width: `${Math.max(pct, 3)}%` }}
                />
              </div>

              {/* Compact step list */}
              <div className="space-y-2.5">
                {COMPLETION_STEPS.map((step) => {
                  const isDone    = step.status === "verified";
                  const isPending = step.status === "pending";
                  const isReq     = step.required && step.status === "idle";
                  const Icon      = step.icon;

                  const statusLabel =
                    isDone    ? "Verificado"  :
                    isPending ? "Em análise"  : "Não enviado";

                  const statusColor =
                    isDone    ? "text-emerald-600 dark:text-emerald-400"  :
                    isPending ? "text-amber-600 dark:text-amber-400"      :
                    isReq     ? "text-amber-700 dark:text-amber-400"      : "text-muted-foreground/60";

                  return (
                    <div key={step.label} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md",
                          isDone    ? "bg-emerald-500/10" :
                          isPending ? "bg-amber-500/10"   :
                          isReq     ? "bg-amber-500/10"   : "bg-muted",
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        ) : isPending ? (
                          <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Icon
                            className={cn(
                              "h-3 w-3",
                              isReq ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
                            )}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate text-[11px] font-medium leading-none",
                            isDone ? "text-muted-foreground" : "text-foreground",
                          )}
                        >
                          {step.label}
                        </p>
                        <p className={cn("mt-0.5 text-[10px] leading-none", statusColor)}>
                          {statusLabel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <Link
                href="/profile/documents"
                className={cn(
                  "flex items-center gap-0.5 pt-0.5 text-[11px] font-semibold transition-opacity hover:opacity-75",
                  !identityVerified
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-primary",
                )}
              >
                {!identityVerified ? "Verificar identidade" : "Ver progresso"}
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* User */}
      <div className="px-3 py-4">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 min-h-[44px]",
            pathname === "/profile" || pathname.startsWith("/profile/")
              ? "bg-accent/80 ring-1 ring-accent"
              : "hover:bg-accent/50 active:bg-accent"
          )}
        >
          <Avatar className="h-8 w-8 ring-2 ring-background shadow-sm">
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
      </div>
    </aside>
  );
}
