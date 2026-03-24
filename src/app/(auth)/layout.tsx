import type { Metadata } from "next";
import Link from "next/link";
import { PawPrint } from "lucide-react";

export const metadata: Metadata = {
  title: "Autenticação",
};

/**
 * Auth route group layout.
 * Desktop-first split: decorative blue panel (left) + form (right).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ─── Left panel — brand / illustration ─── */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-700" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        {/* Logo */}
        <Link href="/">
          <div className="relative flex items-center gap-2 text-primary-foreground font-bold text-xl z-10 cursor-pointer">
            <PawPrint className="h-6 w-6" />
            DogTravel
          </div>
        </Link>

        {/* Headline */}
        <div className="relative z-10">
          <blockquote className="space-y-4">
            <p className="text-3xl font-bold text-primary-foreground leading-tight">
              "A plataforma que conecta passeadores{" "}
              <span className="text-white/70">com quem mais precisa deles"</span>
            </p>
            <footer className="text-primary-foreground/60 text-sm">
              Mais de 500 passeadores ativos em todo o Brasil
            </footer>
          </blockquote>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: "10k+", label: "Passeios" },
            { value: "4.9★", label: "Avaliação" },
            { value: "98%", label: "Satisfação" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-xs text-primary-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Right panel — form ─── */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Mobile logo */}
        <Link
          href="/"
          className="lg:hidden flex items-center gap-2 font-bold text-xl text-primary mb-8"
        >
          <PawPrint className="h-6 w-6" />
          DogTravel
        </Link>

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
