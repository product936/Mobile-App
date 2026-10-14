import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Simulated playback for a call recording of `duration` seconds: play/pause,
 * one-second ticks, stops at the end and restarts from zero when played again.
 * Swap for real audio once recordings come from the API.
 */
export function usePlayback(duration: number) {
  const [seconds, setSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (timer.current) {
      stop();
      return;
    }
    setSeconds((s) => (s >= duration ? 0 : s));
    setPlaying(true);
    timer.current = setInterval(() => setSeconds((s) => Math.min(s + 1, duration)), 1000);
  }, [duration, stop]);

  // Stop at the end of the recording.
  useEffect(() => {
    if (playing && seconds >= duration) stop();
  }, [playing, seconds, duration, stop]);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return { seconds, playing, toggle, progress: duration ? seconds / duration : 0, label: `${clock(seconds)} / ${clock(duration)}` };
}
