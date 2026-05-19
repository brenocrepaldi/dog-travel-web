"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, Check, CreditCard, Smartphone } from "lucide-react";
import { FlowActions } from "@/components/common/flow-actions";
import Link from "next/link";
import { managedPaymentMethods } from "@/lib/mock-data";
import type { WalkFormData } from "../walk-request-form";

const METHOD_ICON = {
  credit_card: CreditCard,
  debit_card: CreditCard,
  pix: Smartphone,
} as const;

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepPayment({ data, updateData, onNext, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Forma de pagamento</h2>
        <p className="text-sm text-muted-foreground">
          Selecione o método que será usado após a conclusão do passeio.
        </p>
      </div>

      <div className="space-y-2">
        {managedPaymentMethods.map((method) => {
          const Icon = METHOD_ICON[method.type];
          const selected = data.selectedMethodId === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => updateData({ selectedMethodId: method.id })}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                "hover:border-primary/60 hover:bg-primary/5",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border bg-background"
              )}
            >
              {/* Method icon */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-sm">{method.brand}</p>
                <p className="text-xs text-muted-foreground">{method.label}</p>
              </div>

              {/* Radio indicator */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  selected ? "bg-primary border-primary" : "border-border"
                )}
              >
                {selected && <Check className="h-3 w-3 text-primary-foreground" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add new method */}
      <p className="text-sm text-muted-foreground">
        Não encontrou o método?{" "}
        <Link href="/payments/methods?action=add" className="text-primary hover:underline font-medium">
          Adicionar cartão
        </Link>
      </p>

      <FlowActions
        showBack
        onBack={onBack}
        primaryLabel="Continuar"
        primaryIcon={<ArrowRight className="h-4 w-4" />}
        onPrimary={onNext}
        primaryDisabled={!data.selectedMethodId}
      />
    </div>
  );
}
