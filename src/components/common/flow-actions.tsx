"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FlowActionsProps {
  showBack?: boolean;
  backLabel?: string;
  backHref?: string;
  onBack?: () => void;
  cancelLabel?: string;
  cancelHref?: string;
  onCancel?: () => void;
  primaryLabel: string;
  primaryHref?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  primaryVariant?: "default" | "success" | "secondary";
  primaryIcon?: React.ReactNode;
  className?: string;
}

/**
 * Shared actions footer used in multi-step flows to keep Back, Cancel and Complete consistent.
 */
export function FlowActions({
  showBack = true,
  backLabel = "Voltar",
  backHref,
  onBack,
  cancelLabel = "Cancelar",
  cancelHref,
  onCancel,
  primaryLabel,
  primaryHref,
  onPrimary,
  primaryDisabled,
  primaryLoading,
  primaryVariant = "default",
  primaryIcon,
  className,
}: FlowActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {showBack && (
          <FlowButton
            variant="ghost"
            label={backLabel}
            icon={<ArrowLeft className="h-4 w-4" />}
            href={backHref}
            onClick={onBack}
          />
        )}

        {(cancelHref ?? onCancel) && (
          <FlowButton
            variant="outline"
            label={cancelLabel}
            icon={<X className="h-4 w-4" />}
            href={cancelHref}
            onClick={onCancel}
          />
        )}
      </div>

      <FlowButton
        variant={primaryVariant}
        label={primaryLoading ? "Concluindo..." : primaryLabel}
        icon={primaryIcon ?? <CheckCircle2 className="h-4 w-4" />}
        href={primaryHref}
        onClick={onPrimary}
        disabled={primaryDisabled || primaryLoading}
      />
    </div>
  );
}

interface FlowButtonProps {
  variant: "default" | "ghost" | "outline" | "success" | "secondary";
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

function FlowButton({ variant, label, icon, href, onClick, disabled }: FlowButtonProps) {
  if (href) {
    return (
      <Button variant={variant} render={<Link href={href} />} disabled={disabled}>
        {icon}
        {label}
      </Button>
    );
  }

  return (
    <Button variant={variant} onClick={onClick} disabled={disabled}>
      {icon}
      {label}
    </Button>
  );
}
