"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

import { StepPets }     from "./steps/step-pets";
import { StepDateTime } from "./steps/step-datetime";
import { StepLocation } from "./steps/step-location";
import { StepPrice }    from "./steps/step-price";
import { StepPayment }  from "./steps/step-payment";
import { StepConfirm }  from "./steps/step-confirm";
import { WalkSummary }  from "./walk-summary";

// ─── Form state shape ──────────────────────────────────────────────────────
export interface WalkFormData {
  selectedPetIds: string[];
  date: string;           // ISO date string
  time: string;           // "HH:mm"
  durationMinutes: number;
  address: string;
  lat: number | null;
  lng: number | null;
  estimatedPrice: number | null;
  selectedMethodId: string | null;
}

const INITIAL_DATA: WalkFormData = {
  selectedPetIds:  [],
  date:            "",
  time:            "",
  durationMinutes: 30,
  address:         "",
  lat:             null,
  lng:             null,
  estimatedPrice:  null,
  selectedMethodId: null,
};

// ─── Step definitions ──────────────────────────────────────────────────────
const STEPS = [
  { label: "Pets" },
  { label: "Data" },
  { label: "Local" },
  { label: "Preço" },
  { label: "Pagamento" },
  { label: "Confirmar" },
];

// ─── Step indicator ────────────────────────────────────────────────────────
function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive    = index === currentStep;

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 border-2",
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isActive
                    ? "bg-background border-primary text-primary"
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap",
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-primary/70"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-4 transition-all duration-300",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main form component ───────────────────────────────────────────────────
export function WalkRequestForm() {
  const router = useRouter();
  const [step, setStep]         = useState(0);
  const [data, setData]         = useState<WalkFormData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);

  function updateData(partial: Partial<WalkFormData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function next() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      // TODO: call WalkService.create({ ...data }) when backend is ready
      await new Promise((res) => setTimeout(res, 1500));
      toast.success("Passeio solicitado!", {
        description: "Aguardando aceitação de um passeador.",
      });
      router.push("/dashboard");
    } catch {
      toast.error("Erro ao solicitar passeio", {
        description: "Tente novamente em instantes.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const stepProps = { data, updateData, onNext: next, onBack: back };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Solicitar passeio</h1>
        <p className="text-sm text-muted-foreground">
          Passo {step + 1} de {STEPS.length}
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator currentStep={step} totalSteps={STEPS.length} />

      {/* Content: form (left 60%) + summary (right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* ── Step panel ── */}
        <div className="lg:col-span-3 bg-background rounded-2xl border border-border p-6 shadow-sm">
          {step === 0 && <StepPets      {...stepProps} />}
          {step === 1 && <StepDateTime  {...stepProps} />}
          {step === 2 && <StepLocation  {...stepProps} />}
          {step === 3 && <StepPrice     {...stepProps} />}
          {step === 4 && <StepPayment   {...stepProps} />}
          {step === 5 && (
            <StepConfirm
              {...stepProps}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        {/* ── Live summary ── */}
        <div className="lg:col-span-2 lg:sticky lg:top-8">
          <WalkSummary data={data} currentStep={step} />
        </div>
      </div>
    </div>
  );
}
