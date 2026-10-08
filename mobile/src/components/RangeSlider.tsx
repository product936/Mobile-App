import { useRef, useState } from 'react';
import { PanResponder, StyleSheet, View, type AccessibilityActionEvent } from 'react-native';

import { colors, radius, shadows } from '@/theme/tokens';

const THUMB = 22;

/** Snaps a horizontal position on the track to the nearest step. */
export function valueAt(x: number, width: number, min: number, max: number): number {
  const usable = Math.max(1, width - THUMB);
  const ratio = Math.min(1, Math.max(0, (x - THUMB / 2) / usable));
  return Math.round(min + ratio * (max - min));
}

/**
 * Which thumb a touch at value `v` should move. Outside the range, the nearer
 * end; inside, the closer thumb. When both thumbs overlap, pick the one that
 * still has room to move (the max thumb, unless it is already at the top).
 */
export function pickThumb(v: number, low: number, high: number, max: number): 'low' | 'high' {
  if (v < low) return 'low';
  if (v > high) return 'high';
  if (low === high) return high === max ? 'low' : 'high';
  return v - low < high - v ? 'low' : 'high';
}

/**
 * Two-thumb range slider (used for the 1★–5★ rating range). Drag either
 * thumb; the thumbs cannot cross. Each thumb is an accessible "adjustable".
 */
export function RangeSlider({
  min,
  max,
  low,
  high,
  onChange,
  label,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
  label: (v: number) => string;
}) {
  const [width, setWidth] = useState(0);
  const latest = useRef({ low, high, width, onChange });
  latest.current = { low, high, width, onChange };
  const active = useRef<'low' | 'high'>('low');

  const pos = (v: number) => (width ? THUMB / 2 + ((v - min) / (max - min)) * (width - THUMB) : 0);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { low: l, high: h, width: w } = latest.current;
        const v = valueAt(e.nativeEvent.locationX, w, min, max);
        active.current = pickThumb(v, l, h, max);
        update(v);
      },
      onPanResponderMove: (e) => update(valueAt(e.nativeEvent.locationX, latest.current.width, min, max)),
    }),
  ).current;

  function update(v: number) {
    const { low: l, high: h, onChange: cb } = latest.current;
    if (active.current === 'low') {
      const next = Math.min(v, h);
      if (next !== l) cb(next, h);
    } else {
      const next = Math.max(v, l);
      if (next !== h) cb(l, next);
    }
  }

  const adjust = (which: 'low' | 'high') => (e: AccessibilityActionEvent) => {
    const delta = e.nativeEvent.actionName === 'increment' ? 1 : -1;
    if (which === 'low') onChange(Math.min(Math.max(min, low + delta), high), high);
    else onChange(low, Math.max(Math.min(max, high + delta), low));
  };

  return (
    <View style={styles.wrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} {...responder.panHandlers}>
      <View style={styles.track} pointerEvents="none" />
      <View style={[styles.fill, { left: pos(low), width: Math.max(0, pos(high) - pos(low)) }]} pointerEvents="none" />
      {(['low', 'high'] as const).map((which) => {
        const v = which === 'low' ? low : high;
        return (
          <View
            key={which}
            pointerEvents="none"
            accessible
            accessibilityRole="adjustable"
            accessibilityLabel={which === 'low' ? 'Minimum rating' : 'Maximum rating'}
            accessibilityValue={{ text: label(v) }}
            accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
            onAccessibilityAction={adjust(which)}
            style={[styles.thumb, { left: pos(v) - THUMB / 2 }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 36, justifyContent: 'center' },
  track: { position: 'absolute', left: 0, right: 0, height: 5, borderRadius: radius.full, backgroundColor: colors.borderDefault },
  fill: { position: 'absolute', height: 5, borderRadius: radius.full, backgroundColor: colors.primaryAccent },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primaryAccent,
    boxShadow: shadows.thumb,
  },
});
