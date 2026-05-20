"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors duration-150 hover:bg-destructive/5 cursor-pointer group"
    >
      <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
        <LogOut className="w-4 h-4 text-destructive" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-destructive">Sair da conta</p>
        <p className="text-xs text-muted-foreground">Encerrar sessão atual</p>
      </div>
    </button>
  );
}
