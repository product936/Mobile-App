import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { AlarmClock, Eye, PhoneMissed, Star, TriangleAlert, UserPlus } from 'lucide-react-native';

import { BackButton } from '@/components/chrome';
import { PressableScale } from '@/components/PressableScale';
import { IconTile, layout } from '@/components/primitives';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { buildNotifications, type AppNotification, type NotificationType } from '@/data/content';
import { useAppStore, useRoleConfig } from '@/state/store';
import { colors, radius, type } from '@/theme/tokens';

function TypeIcon({ kind }: { kind: NotificationType }) {
  switch (kind) {
    case 'review':
      return (
        <IconTile size={38} background={colors.amberTile}>
          <Star size={19} color={colors.starAmber} fill={colors.starAmber} strokeWidth={1.5} />
        </IconTile>
      );
    case 'missed':
      return (
        <IconTile size={38} background={colors.red100}>
          <PhoneMissed size={19} color={colors.error} strokeWidth={2} />
        </IconTile>
      );
    case 'lead':
      return (
        <IconTile size={38}>
          <UserPlus size={19} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
      );
    case 'reminder':
      return (
        <IconTile size={38}>
          <AlarmClock size={19} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
      );
    case 'alert':
      return (
        <IconTile size={38} background={colors.amberTile}>
          <TriangleAlert size={19} color={colors.warning} strokeWidth={2} />
        </IconTile>
      );
    default:
      return (
        <IconTile size={38}>
          <Eye size={19} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
      );
  }
}

export default function NotificationsScreen() {
  const { weeklyReportDesc } = useRoleConfig();
  const items = useMemo(() => buildNotifications(weeklyReportDesc), [weeklyReportDesc]);
  const read = useAppStore((s) => s.readNotifications);
  const markRead = useAppStore((s) => s.markNotificationRead);
  const markAll = useAppStore((s) => s.markAllNotificationsRead);
  const unread = items.filter((n) => !read.includes(n.id)).length;

  return (
    <Screen bottomInset>
      <View style={styles.header}>
        <BackButton onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
        <View style={layout.flex1}>
          <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
            Notifications
          </Text>
          <Text size={type.footnote} color={colors.textTertiary}>
            {unread} unread
          </Text>
        </View>
        <PressableScale pressedScale={0.96} onPress={() => markAll(items.map((n) => n.id))} style={styles.markAll}>
          <Text size={type.footnote} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
            Mark all read
          </Text>
        </PressableScale>
      </View>
      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => <Row item={item} unread={!read.includes(item.id)} onPress={() => markRead(item.id)} />}
      />
    </Screen>
  );
}

function Row({ item, unread, onPress }: { item: AppNotification; unread: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${unread ? 'Unread. ' : ''}${item.title}. ${item.desc}. ${item.time}`}
      onPress={onPress}
      style={[styles.row, unread && { backgroundColor: colors.unreadTint }]}
    >
      <TypeIcon kind={item.type} />
      <View style={layout.flex1}>
        <Text size={type.callout} weight={600} color={colors.textPrimary}>
          {item.title}
        </Text>
        <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 2 }}>
          {item.desc}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text size={type.caption} color={colors.textTertiary} numberOfLines={1}>
          {item.time}
        </Text>
        {unread ? <View style={styles.dot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 4,
    paddingBottom: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  markAll: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  meta: { alignItems: 'flex-end', gap: 6 },
  dot: { width: 9, height: 9, borderRadius: radius.full, backgroundColor: colors.primaryAccent },
});
