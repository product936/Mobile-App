import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Bell, Calendar, ChevronDown, ChevronLeft, MapPin } from 'lucide-react-native';

import { PressableScale } from '@/components/PressableScale';
import { Avatar, CountBadge, layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { formatIN, selectedLocationCount, selectionSize } from '@/lib/format';
import { useAppStore, useRoleConfig } from '@/state/store';
import { colors, radius, type } from '@/theme/tokens';

/** Notification bell (with 9+ badge) and the user's avatar, which opens Profile. */
export function HeaderActions() {
  const { user } = useRoleConfig();
  return (
    <View style={[layout.row, { gap: 10 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Notifications, 9 or more unread"
        onPress={() => router.push('/notifications')}
        style={styles.bell}
      >
        <Bell size={18} color={colors.textSecondary} strokeWidth={1.9} />
        <View style={styles.bellBadge}>
          <CountBadge count="9+" ring />
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={() => router.push('/profile')}>
        <Avatar initials={user.initials} />
      </Pressable>
    </View>
  );
}

/** Large page title with an optional subtitle and the header actions on the right. */
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={[layout.row, { alignItems: 'flex-start', gap: 10 }]}>
      <View style={layout.flex1}>
        <Text size={type.title1} weight={700} lineHeight={1.1} tracking={-0.01} color={colors.textPrimary} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text size={type.subhead} color={colors.textTertiary} style={{ marginTop: 4 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <HeaderActions />
    </View>
  );
}

/**
 * Location and date filter buttons. Once specific locations are applied the
 * location button turns into a pill showing how many locations are in scope.
 */
export function FilterIconButtons() {
  const all = useAppStore((s) => s.locationAll);
  const selection = useAppStore((s) => s.locationSelection);
  const openSheet = useAppStore((s) => s.openSheet);
  const applied = !all && selectionSize(selection) > 0;

  return (
    <View style={[layout.row, { gap: 8 }]}>
      {applied ? (
        <PressableScale
          pressedScale={0.96}
          accessibilityLabel={`Locations applied: ${selectedLocationCount(selection)}`}
          onPress={() => openSheet('location')}
          style={[styles.filterBtn, styles.locationPill]}
        >
          <MapPin size={18} color={colors.primaryAccent} strokeWidth={2} />
          <Text size={type.subhead} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
            {formatIN(selectedLocationCount(selection))}
          </Text>
        </PressableScale>
      ) : (
        <PressableScale
          pressedScale={0.96}
          accessibilityLabel="Filter by location"
          onPress={() => openSheet('location')}
          style={[styles.filterBtn, styles.square, styles.locationIdle]}
        >
          <MapPin size={19} color={colors.primaryAccent} strokeWidth={2} />
        </PressableScale>
      )}
      <PressableScale
        pressedScale={0.96}
        accessibilityLabel="Filter by date"
        onPress={() => openSheet('date')}
        style={[styles.filterBtn, styles.square, styles.dateBtn]}
      >
        <Calendar size={19} color={colors.textSecondary} strokeWidth={2} />
      </PressableScale>
    </View>
  );
}

/** Dropdown-style filter pill ("All status ▾"). */
export function DropdownPill({ label, onPress, icon }: { label: string; onPress: () => void; icon?: ReactNode }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${label}, change filter`} onPress={onPress} style={styles.dropdown}>
      {icon}
      <Text size={type.subhead} weight={600} color={colors.textSecondary} lineHeight={1.2} numberOfLines={1}>
        {label}
      </Text>
      <ChevronDown size={13} color={colors.textTertiary} strokeWidth={2.2} />
    </Pressable>
  );
}

/** 40px back button with a chevron. */
export function BackButton({ onPress, offset = 0 }: { onPress: () => void; offset?: number }) {
  return (
    <PressableScale
      pressedScale={1}
      pressedBackground={colors.borderSubtle}
      accessibilityLabel="Back"
      onPress={onPress}
      hitSlop={4}
      style={[styles.back, { marginLeft: offset }]}
    >
      <ChevronLeft size={24} color={colors.textPrimary} strokeWidth={2.2} />
    </PressableScale>
  );
}

/** Sub-page header: back button and title over a hairline divider. */
export function BackHeader({ title, onBack, right }: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <View style={styles.backHeader}>
      <BackButton onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/home')))} />
      <View style={layout.flex1}>
        <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bell: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: { position: 'absolute', top: -6, right: -6 },
  filterBtn: { height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  square: { width: 40, borderRadius: radius.lg },
  locationIdle: { backgroundColor: colors.blue50, borderColor: colors.infoBorder },
  locationPill: {
    flexDirection: 'row',
    gap: 6,
    paddingLeft: 10,
    paddingRight: 12,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    borderColor: colors.infoBorder,
  },
  dateBtn: { backgroundColor: colors.surfaceElevated, borderColor: colors.borderDefault },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.full,
  },
  back: { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
    paddingBottom: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
});
