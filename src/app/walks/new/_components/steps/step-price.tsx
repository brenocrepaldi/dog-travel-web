"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FlowActions } from "@/components/common/flow-actions";
import type { WalkFormData } from "../walk-request-form";

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DURATION_BASE_PRICE: Record<number, number> = {
  15: 12,
  30: 18,
  45: 24,
  60: 27,
};
const EXTRA_PET_FEE = 4;
const PLATFORM_AND_SAFETY_FEE_RATE = 0.08;
const FIRST_RIDE_DISCOUNT_RATE = 0.15;

function calcEstimate(durationMinutes: number, petCount: number, isFirstRide: boolean) {
  const durationBase = DURATION_BASE_PRICE[durationMinutes] ?? 18;
  const extraPetFee = Math.max(0, petCount - 1) * EXTRA_PET_FEE;
  const subtotal = durationBase + extraPetFee;
  const platformAndSafetyFee = +(subtotal * PLATFORM_AND_SAFETY_FEE_RATE).toFixed(2);
  const totalBeforeDiscount = subtotal + platformAndSafetyFee;
  const firstRideDiscount = isFirstRide ? +(totalBeforeDiscount * FIRST_RIDE_DISCOUNT_RATE).toFixed(2) : 0;
  const total = +(totalBeforeDiscount - firstRideDiscount).toFixed(2);

  return {
    durationBase,
    extraPetFee,
    platformAndSafetyFee,
    firstRideDiscount,
    total,
  };
}

function fmt(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function StepPrice({ data, updateData, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState({
    durationBase: 0,
    extraPetFee: 0,
    platformAndSafetyFee: 0,
    firstRideDiscount: 0,
    total: 0,
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const est = calcEstimate(data.durationMinutes, data.selectedPetIds.length, data.isFirstRide);
      setEstimate(est);
      updateData({ estimatedPrice: est.total });
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
    // updateData is intentionally omitted to avoid triggering the estimate loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.durationMinutes, data.selectedPetIds.length, data.isFirstRide]);

  const rows = [
    { label: `Passeio (${data.durationMinutes} min)`, value: estimate.durationBase },
    ...(estimate.extraPetFee > 0 ? [{ label: "Taxa por cão extra", value: estimate.extraPetFee }] : []),
    { label: "Taxa de plataforma e segurança (8%)", value: estimate.platformAndSafetyFee },
    ...(estimate.firstRideDiscount > 0
      ? [{ label: "Desconto de primeira contratação", value: -estimate.firstRideDiscount }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Estimativa de preço</h2>
        <p className="text-sm text-muted-foreground">
          Valor previsível antes da confirmação, com taxas e desconto já aplicados.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <p className="text-sm font-medium text-foreground">É seu primeiro passeio no DogTravel?</p>
        <p className="mt-1 text-xs text-muted-foreground">Aplicamos 15% de desconto na primeira contratação.</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateData({ isFirstRide: true })}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              data.isFirstRide ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"
            )}
          >
            Sim, aplicar desconto
          </button>
          <button
            type="button"
            onClick={() => updateData({ isFirstRide: false })}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              !data.isFirstRide ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"
            )}
          >
            Não
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-10 justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Calculando estimativa...
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{fmt(row.value)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border">
            <span className="font-semibold text-foreground">Total estimado</span>
            <span className="text-xl font-bold text-primary">{fmt(estimate.total)}</span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
        💡 Na pesquisa com donos de cães, a faixa mais buscada para 60 minutos ficou até R$30.
      </div>

      <FlowActions
        showBack
        onBack={onBack}
        cancelHref="/walks"
        primaryLabel="Continuar"
        primaryIcon={<ArrowRight className="h-4 w-4" />}
        onPrimary={onNext}
        primaryDisabled={loading}
      />
    </div>
  );
}
