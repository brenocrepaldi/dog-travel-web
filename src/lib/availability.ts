import type { AvailabilitySlot, DayKey } from '@/types';

export const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: 'monday', label: 'Segunda-feira', short: 'Seg' },
  { key: 'tuesday', label: 'Terça-feira', short: 'Ter' },
  { key: 'wednesday', label: 'Quarta-feira', short: 'Qua' },
  { key: 'thursday', label: 'Quinta-feira', short: 'Qui' },
  { key: 'friday', label: 'Sexta-feira', short: 'Sex' },
  { key: 'saturday', label: 'Sábado', short: 'Sáb' },
  { key: 'sunday', label: 'Domingo', short: 'Dom' },
];

export const TIME_SLOTS: { label: string; value: string }[] = [
  { label: '07–09h', value: '07:00-09:00' },
  { label: '09–11h', value: '09:00-11:00' },
  { label: '11–13h', value: '11:00-13:00' },
  { label: '13–15h', value: '13:00-15:00' },
  { label: '15–17h', value: '15:00-17:00' },
  { label: '17–19h', value: '17:00-19:00' },
  { label: '19–21h', value: '19:00-21:00' },
];

export function formatSlotLabel(slot: string): string {
  const [start, end] = slot.split('-');
  return `${start.slice(0, 2)}–${end.slice(0, 2)}h`;
}

export function formatAvailabilityLabel(slots: AvailabilitySlot[]): string {
  const active = slots.filter((s) => s.slots.length > 0);
  if (active.length === 0) return 'Sem horários configurados';

  const dayShort: Record<DayKey, string> = Object.fromEntries(
    DAYS.map((d) => [d.key, d.short]),
  ) as Record<DayKey, string>;

  // If all active days share the same slots, collapse the time part
  const firstSlotsSorted = [...active[0].slots].sort().join(',');
  const allSame = active.every((s) => [...s.slots].sort().join(',') === firstSlotsSorted);

  const dayList = active.map((s) => dayShort[s.day]).join(', ');

  if (allSame) {
    const times = active[0].slots.map(formatSlotLabel).join(', ');
    return `${dayList} · ${times}`;
  }

  return `${active.length} dia${active.length > 1 ? 's' : ''}`;
}
