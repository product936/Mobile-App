import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { House, Lock, Star, Trophy, Users, type LucideIcon } from 'lucide-react-native';

import { CountBadge } from '@/components/primitives';
import { Text } from '@/components/Text';
import { useAppStore, useRoleConfig } from '@/state/store';
import { colors } from '@/theme/tokens';

const TAB_META: Record<string, { label: string; Icon: LucideIcon; badge?: string; fillWhenActive?: boolean }> = {
  home: { label: 'Home', Icon: House },
  leads: { label: 'Leads', Icon: Users, badge: '50' },
  reviews: { label: 'Reviews', Icon: Star, badge: '36', fillWhenActive: true },
  leaderboard: { label: 'Leaderboard', Icon: Trophy },
};

/**
 * Bottom tab bar. Every icon sits in the same 26px box and every label uses
 * the same 10px size, so icons and labels align on one line; badges float off
 * the icon box without moving it.
 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { tabs } = useRoleConfig();
  const access = useAppStore((s) => s.access);
  const routes = state.routes.filter((r) => tabs.includes(r.name as (typeof tabs)[number]));

  return (
    <View style={[styles.bar, { paddingBottom: 7 + insets.bottom }]} accessibilityRole="tablist">
      {routes.map((route) => {
        const meta = TAB_META[route.name];
        if (!meta) return null;
        const focused = state.routes[state.index]?.key === route.key;
        const tint = focused ? colors.primaryAccent : colors.textTertiary;
        const { Icon } = meta;
        // A tab the account can't use shows a small lock instead of its count.
        const locked = route.name === 'reviews' && !access.reviews;
        const badge = locked ? undefined : meta.badge;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={locked ? `${meta.label}, no access` : badge ? `${meta.label}, ${badge} new` : meta.label}
            onPress={onPress}
            style={styles.item}
          >
            <View style={styles.iconBox}>
              {focused && meta.fillWhenActive ? (
                <Icon size={24} color={tint} fill={tint} strokeWidth={1.5} />
              ) : (
                <Icon size={24} color={tint} strokeWidth={focused ? 2.1 : 2} />
              )}
              {badge ? (
                <View style={styles.badge}>
                  <CountBadge count={badge} />
                </View>
              ) : null}
              {locked ? (
                <View style={styles.lock}>
                  <Lock size={9} color={colors.white} strokeWidth={3} />
                </View>
              ) : null}
            </View>
            <Text size={10} lineHeight={1} weight={focused ? 700 : 600} color={tint}>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: colors.borderDefault,
    paddingTop: 9,
    paddingHorizontal: 6,
  },
  item: { flex: 1, alignItems: 'center', gap: 4 },
  iconBox: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -3, right: -8 },
  lock: {
    position: 'absolute',
    top: -3,
    right: -7,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.textTertiary,
    borderWidth: 2,
    borderColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
