"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { FlowActions } from "@/components/common/flow-actions";
import type { WalkFormData } from "../walk-request-form";
import {
  DURATION_BASE_PRICE,
  EXTRA_PET_FEE,
  PLATFORM_AND_SAFETY_FEE_RATE,
  FIRST_RIDE_DISCOUNT_RATE,
} from "@/config/pricing";

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

function calcEstimate(durationMinutes: number, petCount: number, isFirstRide: boolean) {
  const durationBase          = DURATION_BASE_PRICE[durationMinutes] ?? 18;
  const extraPetFee           = Math.max(0, petCount - 1) * EXTRA_PET_FEE;
  const subtotal              = durationBase + extraPetFee;
  const platformAndSafetyFee  = +(subtotal * PLATFORM_AND_SAFETY_FEE_RATE).toFixed(2);
  const totalBeforeDiscount   = subtotal + platformAndSafetyFee;
  const firstRideDiscount     = isFirstRide
    ? +(totalBeforeDiscount * FIRST_RIDE_DISCOUNT_RATE).toFixed(2)
    : 0;
  const total = +(totalBeforeDiscount - firstRideDiscount).toFixed(2);
  return { durationBase, extraPetFee, platformAndSafetyFee, firstRideDiscount, total };
}

function fmt(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function StepPrice({ data, updateData, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState({
    durationBase:         0,
    extraPetFee:          0,
    platformAndSafetyFee: 0,
    firstRideDiscount:    0,
    total:                0,
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
    // updateData intentionally omitted to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.durationMinutes, data.selectedPetIds.length, data.isFirstRide]);

  const rows = [
    { label: `Passeio (${data.durationMinutes} min)`, value: estimate.durationBase },
    ...(estimate.extraPetFee > 0
      ? [{ label: "Taxa por cão extra", value: estimate.extraPetFee }]
      : []),
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
          Valor calculado com base na duração, número de cães e taxas aplicáveis.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Calculando estimativa...
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={row.value < 0 ? "font-medium text-emerald-600 dark:text-emerald-400" : "font-medium"}>
                  {fmt(row.value)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 bg-primary/5 border-t border-border">
            <span className="font-semibold text-foreground">Total estimado</span>
            <span className="text-xl font-bold text-primary">{fmt(estimate.total)}</span>
          </div>
        </div>
      )}

      <FlowActions
        showBack
        onBack={onBack}
        primaryLabel="Continuar"
        primaryIcon={<ArrowRight className="h-4 w-4" />}
        onPrimary={onNext}
        primaryDisabled={loading}
      />
    </div>
  );
}
