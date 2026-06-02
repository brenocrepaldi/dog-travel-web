"use client";

import { useEffect, useState } from "react";

export function useCountdown(startedAt?: string | null, durationMinutes?: number) {
  const [remaining, setRemaining] = useState<number>(() => {
    if (!startedAt || !durationMinutes) return 0;
    const endMs = new Date(startedAt).getTime() + durationMinutes * 60 * 1000;
    return Math.max(0, Math.ceil((endMs - Date.now()) / 1000));
  });

  const done = remaining === 0;

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [done]);

  const total = (durationMinutes ?? 0) * 60;
  const progress = total > 0 ? Math.min(100, ((total - remaining) / total) * 100) : 100;

  return { remaining, progress, done };
}
