import { useCallback, useEffect, useState } from 'react';

/** Seconds countdown that can be restarted (used for "Resend in 0:30"). */
export function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [left]);

  const restart = useCallback(() => setLeft(seconds), [seconds]);
  return { left, restart, label: `0:${String(left).padStart(2, '0')}` };
}
