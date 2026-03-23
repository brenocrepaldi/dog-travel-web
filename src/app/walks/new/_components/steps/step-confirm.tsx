"use client";

import { Loader2, Check, Dog, Calendar, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WalkFormData } from "../walk-request-form";

// ─── Mock data (mirrors the other steps) ──────────────────────────────────
const MOCK_PETS: Record<string, string> = { "1": "Rex", "2": "Mel" };
const MOCK_METHODS: Record<string, string> = {
  m1: "Visa •••• 4242",
  m2: "Mastercard •••• 8888",
  m3: "PIX",
};

function fmt(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

export function StepConfirm({ data, onBack, onSubmit, submitting }: Props) {
  const petNames = data.selectedPetIds.map((id) => MOCK_PETS[id] ?? id).join(", ");
  const methodLabel = data.selectedMethodId ? MOCK_METHODS[data.selectedMethodId] ?? "—" : "—";
  const dateLabel = data.date
    ? new Date(data.date + "T" + (data.time || "00:00")).toLocaleString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Confirmar pedido</h2>
        <p className="text-sm text-muted-foreground">
          Revise as informações antes de solicitar o passeio.
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-muted/20 px-4">
        <SummaryRow icon={Dog}        label="Cães"              value={petNames || "—"} />
        <SummaryRow icon={Calendar}   label="Data e horário"    value={dateLabel} />
        <SummaryRow icon={MapPin}     label="Local de partida"  value={data.address || "—"} />
        <SummaryRow icon={CreditCard} label="Forma de pagamento" value={methodLabel} />
      </div>

      {/* Price highlight */}
      {data.estimatedPrice !== null && (
        <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 px-4 py-3.5">
          <span className="text-sm font-semibold text-foreground">Total estimado</span>
          <span className="text-xl font-bold text-primary">{fmt(data.estimatedPrice)}</span>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        ✅ Ao confirmar, você concorda com os{" "}
        <a href="#" className="text-primary underline">
          termos de uso
        </a>{" "}
        e autoriza a cobrança automática após a conclusão do passeio.
      </p>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack} disabled={submitting}>
          ← Voltar
        </Button>
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="gap-2 min-w-[180px]"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Solicitando...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Confirmar e buscar passeador
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
