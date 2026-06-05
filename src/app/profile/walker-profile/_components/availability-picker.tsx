'use client';

import { cn } from '@/lib/utils';
import { DAYS, TIME_SLOTS } from '@/lib/availability';
import type { AvailabilitySlot, DayKey } from '@/types';

interface Props {
  value: AvailabilitySlot[];
  onChange: (v: AvailabilitySlot[]) => void;
}

export function AvailabilityPicker({ value, onChange }: Props) {
  function getSlots(day: DayKey): string[] {
    return value.find((s) => s.day === day)?.slots ?? [];
  }

  function isDayActive(day: DayKey): boolean {
    return value.some((s) => s.day === day);
  }

  function toggleDay(day: DayKey, active: boolean) {
    if (active) {
      onChange([...value, { day, slots: [] }]);
    } else {
      onChange(value.filter((s) => s.day !== day));
    }
  }

  function toggleSlot(day: DayKey, slot: string) {
    const existing = value.find((s) => s.day === day);
    if (!existing) return;
    const hasSlot = existing.slots.includes(slot);
    const newSlots = hasSlot
      ? existing.slots.filter((s) => s !== slot)
      : [...existing.slots, slot];
    onChange(value.map((s) => (s.day === day ? { ...s, slots: newSlots } : s)));
  }

  return (
    <div className="space-y-2">
      {DAYS.map((day) => {
        const active = isDayActive(day.key);
        const slots = getSlots(day.key);

        return (
          <div
            key={day.key}
            className={cn(
              'rounded-xl border px-4 py-3 transition-colors',
              active
                ? 'border-primary/25 bg-primary/[0.03]'
                : 'border-border/50 bg-muted/20',
            )}
          >
            {/* Day row */}
            <div className="flex items-center justify-between gap-3">
              <span
                className={cn(
                  'text-sm font-medium',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {day.label}
              </span>

              {/* Custom toggle switch */}
              <button
                type="button"
                role="switch"
                aria-checked={active}
                onClick={() => toggleDay(day.key, !active)}
                className={cn(
                  'relative h-5 w-9 shrink-0 rounded-full border-2 transition-all duration-200',
                  active ? 'border-primary bg-primary' : 'border-border bg-muted',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-all duration-200',
                    active ? 'left-[18px]' : 'left-0.5',
                  )}
                />
              </button>
            </div>

            {/* Time slots — shown when day is active */}
            {active && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {TIME_SLOTS.map((ts) => {
                  const selected = slots.includes(ts.value);
                  return (
                    <button
                      key={ts.value}
                      type="button"
                      onClick={() => toggleSlot(day.key, ts.value)}
                      className={cn(
                        'rounded-lg border px-2.5 py-1 text-xs font-medium transition-all duration-150',
                        selected
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                      )}
                    >
                      {ts.label}
                    </button>
                  );
                })}
                {slots.length === 0 && (
                  <p className="text-xs text-muted-foreground/60 italic">
                    Selecione pelo menos um horário
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
