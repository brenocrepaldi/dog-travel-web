"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { WalkFormData } from "../walk-request-form";

const DURATION_OPTIONS = [15, 30, 45, 60] as const;

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDateTime({ data, updateData, onNext, onBack }: Props) {
  const isValid = data.date && data.time && data.durationMinutes > 0;

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Data, horário e duração</h2>
        <p className="text-sm text-muted-foreground">
          Quando você quer que o passeio aconteça?
        </p>
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          min={today}
          value={data.date}
          onChange={(e) => updateData({ date: e.target.value })}
          className="max-w-xs"
        />
      </div>

      {/* Time */}
      <div className="space-y-1.5">
        <Label htmlFor="time">Horário</Label>
        <Input
          id="time"
          type="time"
          value={data.time}
          onChange={(e) => updateData({ time: e.target.value })}
          className="max-w-xs"
        />
      </div>

      {/* Duration chips */}
      <div className="space-y-2">
        <Label>Duração</Label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => updateData({ durationMinutes: min })}
              className={cn(
                "px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150",
                data.durationMinutes === min
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              )}
            >
              {min} min
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>
          ← Voltar
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Continuar →
        </Button>
      </div>
    </div>
  );
}
