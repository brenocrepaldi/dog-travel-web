"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WalkFormData } from "../walk-request-form";

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Simulate a price estimate based on duration + pet count
function calcEstimate(durationMinutes: number, petCount: number) {
  const BASE_RATE  = 1.0;   // R$/min
  const EXTRA_PET  = 5;     // R$ per extra dog
  const PLATFORM   = 0.10;  // 10% fee
  const subtotal   = durationMinutes * BASE_RATE + Math.max(0, petCount - 1) * EXTRA_PET;
  const platformFee = +(subtotal * PLATFORM).toFixed(2);
  const total       = +(subtotal + platformFee).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), platformFee, total };
}

function fmt(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function StepPrice({ data, updateData, onNext, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [estimate, setEstimate] = useState({ subtotal: 0, platformFee: 0, total: 0 });

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const est = calcEstimate(data.durationMinutes, data.selectedPetIds.length);
      setEstimate(est);
      updateData({ estimatedPrice: est.total });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = [
    { label: `Taxa base (${data.durationMinutes} min)`, value: estimate.subtotal - Math.max(0, data.selectedPetIds.length - 1) * 5 },
    ...(data.selectedPetIds.length > 1
      ? [{ label: `Taxa por cão extra (${data.selectedPetIds.length - 1}x)`, value: (data.selectedPetIds.length - 1) * 5 }]
      : []),
    { label: "Taxa da plataforma (10%)", value: estimate.platformFee },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Estimativa de preço</h2>
        <p className="text-sm text-muted-foreground">
          Valor calculado com base nos dados informados.
        </p>
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

      <p className="text-xs text-muted-foreground">
        💳 Você será cobrado automaticamente após a conclusão do passeio.
      </p>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>← Voltar</Button>
        <Button onClick={onNext} disabled={loading}>Continuar →</Button>
      </div>
    </div>
  );
}
