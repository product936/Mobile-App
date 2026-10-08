import { Text as RNText, type TextProps as RNTextProps, type TextStyle, StyleSheet } from 'react-native';

import { fontFamily, type FontWeight } from '@/theme/fonts';
import { colors, leading } from '@/theme/tokens';

export type TextProps = RNTextProps & {
  size?: number;
  weight?: FontWeight;
  color?: string;
  /** Line height as a multiple of `size`. Defaults to the body leading (1.45). */
  lineHeight?: number;
  /** Letter spacing in em, like the CSS source. */
  tracking?: number;
  align?: TextStyle['textAlign'];
  uppercase?: boolean;
};

/**
 * Base text. Defaults mirror the design system's global CSS: Hanken Grotesk,
 * `--si-body` colour, 1.45 leading and tabular numerals everywhere.
 */
export function Text({
  size = 15,
  weight = 400,
  color = colors.body,
  lineHeight = leading.normal,
  tracking,
  align,
  uppercase,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        {
          fontSize: size,
          fontFamily: fontFamily(weight),
          color,
          lineHeight: Math.round(size * lineHeight),
          letterSpacing: tracking !== undefined ? tracking * size : undefined,
          textAlign: align,
          textTransform: uppercase ? 'uppercase' : undefined,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontVariant: ['tabular-nums'],
  },
});
