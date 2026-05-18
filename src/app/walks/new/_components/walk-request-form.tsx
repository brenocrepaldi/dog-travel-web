"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { walks as mockWalks } from "@/lib/mock-data";
import { useAppStore } from "@/hooks/use-app-store";
import { DEFAULT_CLIENT_PETS } from "@/lib/pets";
import { WalkService } from "@/services/walk.service";
import { trackMetricEvent } from "@/lib/metrics";

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
  isFirstRide: boolean;
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
  isFirstRide:     true,
};

function toDateAndTime(iso: string) {
  const dateTime = new Date(iso);
  const localDateTime = new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000);
  const [date, time] = localDateTime.toISOString().split("T");
  return { date, time: time.slice(0, 5) };
}

interface LocalWalkRequest {
  id: string;
  payload: {
    petIds: string[];
    scheduledAt: string;
    durationMinutes: number;
    address: string;
    paymentMethodId: string;
  };
  createdAt: string;
}

function saveLocalRequest(request: LocalWalkRequest) {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem("dogtravel.local-walk-requests");
  let current: LocalWalkRequest[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      current = Array.isArray(parsed) ? (parsed as LocalWalkRequest[]) : [];
    } catch {
      current = [];
    }
  }
  const next = [...current, request].slice(-50);
  window.localStorage.setItem("dogtravel.local-walk-requests", JSON.stringify(next));
}

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
}: {
  currentStep: number;
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
  const searchParams = useSearchParams();
  const storedPets = useAppStore((state) => state.pets);
  const [step, setStep]         = useState(0);
  const [data, setData]         = useState<WalkFormData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const hasPrefilledRepeat = useRef(false);
  const pets = storedPets.length > 0 ? storedPets : DEFAULT_CLIENT_PETS;

  useEffect(() => {
    if (hasPrefilledRepeat.current) {
      return;
    }

    const repeatWalkId = searchParams.get("repeat");
    if (!repeatWalkId) {
      return;
    }

    const walkToRepeat = mockWalks.find((walk) => walk.id === repeatWalkId);
    if (!walkToRepeat) {
      return;
    }

    hasPrefilledRepeat.current = true;
    const { date, time } = toDateAndTime(walkToRepeat.scheduledAt);
    const selectedPetIds = walkToRepeat.petNames
      .map((petName) => pets.find((pet) => pet.name.toLowerCase() === petName.toLowerCase())?.id)
      .filter((petId): petId is string => Boolean(petId));

    setData((previous) => ({
      ...previous,
      selectedPetIds: selectedPetIds.length > 0 ? selectedPetIds : previous.selectedPetIds,
      durationMinutes: walkToRepeat.durationMinutes,
      date,
      time,
      address: walkToRepeat.startAddress,
      isFirstRide: false,
      estimatedPrice: null,
    }));

    toast("Dados do ultimo passeio carregados", {
      description: "Revise os detalhes e confirme quando quiser.",
    });
    trackMetricEvent({
      name: "walk_repeat_prefill_used",
      payload: { walkId: walkToRepeat.id },
    });
  }, [pets, searchParams]);

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
      const scheduledAt = new Date(`${data.date}T${data.time || "00:00"}:00`).toISOString();
      const paymentMethodId = data.selectedMethodId ?? "";

      if (!paymentMethodId) {
        toast.error("Selecione uma forma de pagamento antes de concluir.");
        return;
      }

      await WalkService.create({
        petIds: data.selectedPetIds,
        scheduledAt,
        durationMinutes: data.durationMinutes,
        startLocation: {
          lat: data.lat ?? 0,
          lng: data.lng ?? 0,
          address: data.address,
        },
        paymentMethodId,
      });

      trackMetricEvent({
        name: "walk_request_submitted",
        payload: {
          petCount: data.selectedPetIds.length,
          durationMinutes: data.durationMinutes,
          isFirstRide: data.isFirstRide,
        },
      });
      toast.success("Passeio solicitado!", {
        description: "Aguardando aceitação de um passeador.",
      });
      router.push("/walks");
    } catch {
      const localRequest: LocalWalkRequest = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        payload: {
          petIds: data.selectedPetIds,
          scheduledAt: `${data.date}T${data.time || "00:00"}`,
          durationMinutes: data.durationMinutes,
          address: data.address,
          paymentMethodId: data.selectedMethodId ?? "",
        },
      };
      saveLocalRequest(localRequest);
      trackMetricEvent({
        name: "walk_request_failed",
        payload: { savedLocally: true },
      });
      toast.warning("API indisponível no momento", {
        description: "Pedido salvo localmente no navegador para não perder os dados.",
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
      <StepIndicator currentStep={step} />

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
