"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, LocateFixed } from "lucide-react";
import type { WalkFormData } from "../walk-request-form";

interface Props {
  data: WalkFormData;
  updateData: (partial: Partial<WalkFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepLocation({ data, updateData, onNext, onBack }: Props) {
  const [locating, setLocating] = useState(false);

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        updateData({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
        // TODO: reverse geocode with a real API
        setLocating(false);
      },
      () => setLocating(false)
    );
  }

  const isValid = !!data.address;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Local de partida</h2>
        <p className="text-sm text-muted-foreground">
          De onde o passeador buscará seu cão?
        </p>
      </div>

      {/* Address input */}
      <div className="space-y-1.5">
        <Label htmlFor="address">Endereço</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="address"
            className="pl-9"
            placeholder="Rua, número, bairro..."
            value={data.address}
            onChange={(e) => updateData({ address: e.target.value })}
          />
        </div>
      </div>

      {/* Use my location */}
      <Button
        variant="outline"
        type="button"
        onClick={useCurrentLocation}
        disabled={locating}
        className="gap-2 w-full sm:w-auto"
      >
        <LocateFixed className="h-4 w-4" />
        {locating ? "Obtendo localização..." : "Usar minha localização"}
      </Button>

      {/* Mini map placeholder */}
      {data.address && (
        <div className="rounded-xl border border-border bg-muted/40 h-40 flex items-center justify-center text-muted-foreground text-sm gap-2">
          <MapPin className="h-4 w-4" />
          {data.address}
        </div>
      )}

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
