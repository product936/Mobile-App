import { useMemo } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/tokens';

/** AI sparkle mark used on the welcome hero. */
export function SparkleGlyph({ size = 30, color = colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2.5l1.9 5.6 5.6 1.9-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.9z" />
      <Circle cx={18.5} cy={5.5} r={1.6} />
      <Circle cx={6} cy={17.5} r={1.3} />
    </Svg>
  );
}

/** Small filled sparkle for the "Draft with AI" action. */
export function AiSparkGlyph({ size = 14, color = colors.primaryAccent }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2.5l1.6 4.9 4.9 1.6-4.9 1.6L12 15.5l-1.6-4.9L5.5 9l4.9-1.6z" />
    </Svg>
  );
}

/** Flame for the "Hot lead" chip. */
export function FlameGlyph({ size = 10, color = colors.amber700 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .2-1.6.5-2.2C9 9 9 10 10 10c0-2 1-6 2-8z" />
    </Svg>
  );
}

export function WhatsAppGlyph({ size = 18, color = colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0 1 12 4zm-2.5 3.8c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.3-.3-.2-1.5-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.6.9-.8 1-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.8-.7-1.2-1.5-1.4-1.7-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.4-.4-.4-.6-.4h-.4z" />
    </Svg>
  );
}

/**
 * Placeholder QR pattern (25×25 modules with the three finder squares).
 * It is not scannable; replace with a real QR generated from the review link.
 */
export function QrPlaceholder({ size = 150 }: { size?: number }) {
  const modules = useMemo(() => {
    const out: { x: number; y: number }[] = [];
    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        if ((x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)) continue;
        if ((x * 29 + y * 43 + x * y * 13 + 7) % 100 < 48) out.push({ x, y });
      }
    }
    return out;
  }, []);
  const dark = colors.textPrimary;
  const finder = (x: number, y: number) => (
    <>
      <Rect x={x} y={y} width={7} height={7} fill={dark} />
      <Rect x={x + 1} y={y + 1} width={5} height={5} fill={colors.white} />
      <Rect x={x + 2} y={y + 2} width={3} height={3} fill={dark} />
    </>
  );
  return (
    <Svg width={size} height={size} viewBox="0 0 25 25" accessibilityLabel="Review QR code">
      {finder(0, 0)}
      {finder(18, 0)}
      {finder(0, 18)}
      {modules.map((m) => (
        <Rect key={`${m.x}-${m.y}`} x={m.x} y={m.y} width={1} height={1} fill={dark} />
      ))}
    </Svg>
  );
}
