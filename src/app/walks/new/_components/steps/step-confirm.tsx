"use client";

import { Loader2, Check, Dog, Calendar, MapPin, CreditCard, ShieldCheck, Camera, MessageSquare } from "lucide-react";
import { FlowActions } from "@/components/common/flow-actions";
import { Badge } from "@/components/ui/badge";
import { managedPaymentMethods } from "@/lib/mock-data";
import { useAppStore } from "@/hooks/use-app-store";
import { DEFAULT_CLIENT_PETS } from "@/lib/pets";
import type { WalkFormData } from "../walk-request-form";

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
  const storedPets = useAppStore((state) => state.pets);
  const pets = storedPets.length > 0 ? storedPets : DEFAULT_CLIENT_PETS;
  const petNames = data.selectedPetIds.map((id) => pets.find((pet) => pet.id === id)?.name ?? id).join(", ");
  const selectedMethod = data.selectedMethodId
    ? managedPaymentMethods.find((method) => method.id === data.selectedMethodId)
    : null;
  const methodLabel = selectedMethod ? `${selectedMethod.brand} ${selectedMethod.label}` : "—";
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
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-xl bg-primary/5 border border-primary/20 px-4 py-3.5">
            <span className="text-sm font-semibold text-foreground">Total estimado</span>
            <span className="text-xl font-bold text-primary">{fmt(data.estimatedPrice)}</span>
          </div>
          {data.isFirstRide && (
            <Badge variant="success">Desconto de primeira contratacao aplicado</Badge>
          )}
        </div>
      )}

      <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Garantias deste passeio</p>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Passeador com identidade e antecedentes verificados.
          </p>
          <p className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            Atualizações por fotos/vídeos e rastreamento GPS durante o trajeto.
          </p>
          <p className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Chat ativo e suporte durante todo o passeio.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        ✅ Ao confirmar, você concorda com os{" "}
        <a href="#" className="text-primary underline">
          termos de uso
        </a>{" "}
        e autoriza a cobrança automática após a conclusão do passeio.
      </p>

      <FlowActions
        showBack
        onBack={onBack}
        cancelHref="/walks"
        primaryLabel="Concluir solicitacao"
        onPrimary={onSubmit}
        primaryDisabled={submitting}
        primaryLoading={submitting}
        primaryVariant="success"
        primaryIcon={
          submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />
        }
      />
    </div>
  );
}
