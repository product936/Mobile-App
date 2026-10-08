import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { House, Star, Trophy, Users, type LucideIcon } from 'lucide-react-native';

import { CountBadge } from '@/components/primitives';
import { Text } from '@/components/Text';
import { useRoleConfig } from '@/state/store';
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
  const routes = state.routes.filter((r) => tabs.includes(r.name as (typeof tabs)[number]));

  return (
    <View style={[styles.bar, { paddingBottom: 7 + insets.bottom }]} accessibilityRole="tablist">
      {routes.map((route) => {
        const meta = TAB_META[route.name];
        if (!meta) return null;
        const focused = state.routes[state.index]?.key === route.key;
        const tint = focused ? colors.primaryAccent : colors.textTertiary;
        const { Icon } = meta;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.badge ? `${meta.label}, ${meta.badge} new` : meta.label}
            onPress={onPress}
            style={styles.item}
          >
            <View style={styles.iconBox}>
              {focused && meta.fillWhenActive ? (
                <Icon size={24} color={tint} fill={tint} strokeWidth={1.5} />
              ) : (
                <Icon size={24} color={tint} strokeWidth={focused ? 2.1 : 2} />
              )}
              {meta.badge ? (
                <View style={styles.badge}>
                  <CountBadge count={meta.badge} />
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
});
