import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/Text';
import type { FontWeight } from '@/theme/fonts';
import { colors, radius, shadows, sizes, type } from '@/theme/tokens';

export type ButtonVariant =
  | 'primary'
  | 'outline'
  | 'outlineAccent'
  | 'soft'
  | 'muted'
  | 'amber'
  | 'danger'
  | 'whatsapp';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  height?: number;
  fontSize?: number;
  weight?: FontWeight;
  /** Text colour override (e.g. the muted "Remind me tomorrow" row uses primary text). */
  textColor?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<ButtonVariant, { box: ViewStyle; text: string }> = {
  primary: { box: { backgroundColor: colors.primaryAccent, boxShadow: shadows.primaryButton }, text: colors.white },
  outline: {
    box: { backgroundColor: colors.surfaceElevated, borderWidth: 1.5, borderColor: colors.borderDefault },
    text: colors.textSecondary,
  },
  outlineAccent: {
    box: { backgroundColor: colors.surfaceElevated, borderWidth: 1.5, borderColor: colors.primaryAccent },
    text: colors.primaryAccent,
  },
  soft: { box: { backgroundColor: colors.blue50 }, text: colors.primaryAccent },
  muted: {
    box: { backgroundColor: colors.surfaceBase, borderWidth: 1, borderColor: colors.borderDefault },
    text: colors.textSecondary,
  },
  amber: { box: { backgroundColor: colors.amber600, boxShadow: shadows.amberButton }, text: colors.white },
  danger: { box: { backgroundColor: colors.error, boxShadow: shadows.dangerButton }, text: colors.white },
  whatsapp: { box: { backgroundColor: colors.whatsapp }, text: colors.white },
};

/**
 * Design-system button. The primary variant follows the mobile spec: 48px,
 * 12px radius, accent fill, grey fill with tertiary text when disabled, and a
 * spinner in place of the label while loading.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  height = sizes.btnH,
  fontSize = type.headline,
  weight = 700,
  textColor,
  iconLeft,
  iconRight,
  accessibilityLabel,
  style,
}: Props) {
  // A loading button keeps its active look, like the prototype.
  const inactive = disabled && !loading;
  const v = variantStyles[variant];
  const box: ViewStyle = inactive ? { backgroundColor: colors.borderDefault } : v.box;
  const color = inactive ? colors.textTertiary : (textColor ?? v.text);

  return (
    <PressableScale
      onPress={inactive || loading ? undefined : onPress}
      disabled={inactive}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={[styles.base, { height }, box, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={styles.row}>
          {iconLeft}
          <Text size={fontSize} weight={weight} color={color} lineHeight={1.2}>
            {label}
          </Text>
          {iconRight}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    // Stretch to fill a column; in a row, callers size it with flex or width.
    alignSelf: 'stretch',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
