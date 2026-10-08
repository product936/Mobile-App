import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Text } from '@/components/Text';
import { colors, radius, shadows, type } from '@/theme/tokens';

/** Elevated white card: 1px border, 14px radius, blue-tinted soft shadow. */
export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Square tile that holds a category/status icon, tinted to the icon's family. */
export function IconTile({
  children,
  size = 40,
  background = colors.blue50,
  rounded = radius.lg,
  style,
}: {
  children: ReactNode;
  size?: number;
  background?: string;
  rounded?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: rounded, backgroundColor: background },
        styles.center,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Small uppercase, letter-spaced section label ("Manage", "Opening hours"). */
export function SectionLabel({ children, style }: { children: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={style}>
      <Text size={11} weight={700} tracking={0.1} uppercase color={colors.textTertiary}>
        {children}
      </Text>
    </View>
  );
}

/** Red count badge used on the bell and tab icons. */
export function CountBadge({ count, ring = false }: { count: string; ring?: boolean }) {
  return (
    <View style={[styles.badge, ring && styles.badgeRing]}>
      <Text size={9} weight={700} color={colors.white} lineHeight={1.1}>
        {count}
      </Text>
    </View>
  );
}

/** Initials avatar. */
export function Avatar({
  initials,
  size = 36,
  background = colors.primaryAccent,
  color = colors.white,
  fontSize = 13,
}: {
  initials: string;
  size?: number;
  background?: string;
  color?: string;
  fontSize?: number;
}) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: background }, styles.center]}>
      <Text size={fontSize} weight={700} color={color} lineHeight={1.1}>
        {initials}
      </Text>
    </View>
  );
}

/** Rounded pill label, e.g. role chips and post type badges. */
export function Pill({
  label,
  background,
  color,
  height = 24,
  fontSize = type.footnote,
  style,
}: {
  label: string;
  background: string;
  color: string;
  height?: number;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.pill, { height, backgroundColor: background, paddingHorizontal: height <= 20 ? 8 : 10 }, style]}>
      <Text size={fontSize} weight={700} color={color} lineHeight={1.1}>
        {label}
      </Text>
    </View>
  );
}

/** Vertical hairline divider used between stats in a strip. */
export function StatDivider({ height = 34 }: { height?: number }) {
  return <View style={{ width: 1, height, backgroundColor: colors.borderSubtle }} />;
}

export const layout = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  flex1: { flex: 1, minWidth: 0 },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.card,
    boxShadow: shadows.card,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRing: {
    minWidth: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.surfaceBase,
  },
  pill: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
