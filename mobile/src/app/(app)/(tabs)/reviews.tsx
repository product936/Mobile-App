import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, ListFilter, MapPin, Reply, Star, Trash2 } from 'lucide-react-native';

import { DropdownPill, FilterIconButtons, PageHeader } from '@/components/chrome';
import { AiSparkGlyph } from '@/components/glyphs';
import { PressableScale } from '@/components/PressableScale';
import { Avatar, Card, StatDivider, layout } from '@/components/primitives';
import { Screen, ScrollBody, Spacer } from '@/components/Screen';
import { Text } from '@/components/Text';
import { STORE } from '@/config/roles';
import { AVATAR_COLORS, REVIEW_AVG_RATING, REVIEWS, type Review } from '@/data/content';
import { filterReviews } from '@/lib/reviews';
import { useAppStore } from '@/state/store';
import { colors, radius, type } from '@/theme/tokens';

export default function ReviewsScreen() {
  const filters = useAppStore((s) => s.reviewFilters);
  const deletedReplies = useAppStore((s) => s.deletedReplies);
  const openSheet = useAppStore((s) => s.openSheet);

  const reviews = REVIEWS.map((r) => (deletedReplies.includes(r.id) ? { ...r, reply: undefined } : r));
  const rows = filterReviews(reviews, filters);
  const unreplied = reviews.filter((r) => !r.reply).length;

  return (
    <Screen>
      <ScrollBody>
        <PageHeader title="Reviews" subtitle="What customers are saying, and how fast you reply" />
        <Spacer h={16} />
        <View style={[layout.row, { gap: 8 }]}>
          <View style={[layout.flex1, layout.row]}>
            <DropdownPill
              label="Filters"
              onPress={() => openSheet('reviewFilter')}
              icon={<ListFilter size={15} color={colors.textTertiary} strokeWidth={2} />}
            />
          </View>
          <FilterIconButtons />
        </View>

        <Spacer h={16} />
        <Card style={styles.overview}>
          <OverviewStat label="Total reviews">
            <Text size={22} weight={800} lineHeight={1} color={colors.textPrimary}>
              {reviews.length}
            </Text>
          </OverviewStat>
          <StatDivider />
          <OverviewStat label="Avg rating">
            <View style={[layout.row, { gap: 3 }]}>
              <Star size={17} color={colors.starAmber} fill={colors.starAmber} strokeWidth={0} />
              <Text size={22} weight={800} lineHeight={1} color={colors.textPrimary}>
                {REVIEW_AVG_RATING}
              </Text>
            </View>
          </OverviewStat>
          <StatDivider />
          <OverviewStat label="Unreplied">
            <Text size={22} weight={800} lineHeight={1} color={colors.starAmber}>
              {unreplied}
            </Text>
          </OverviewStat>
        </Card>

        <Spacer h={18} />
        {rows.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
        {rows.length === 0 ? (
          <Text size={type.callout} color={colors.textTertiary} align="center" style={{ marginTop: 12 }}>
            No reviews match these filters.
          </Text>
        ) : null}
      </ScrollBody>
    </Screen>
  );
}

function OverviewStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {children}
      <Text size={type.caption} color={colors.textTertiary} style={{ marginTop: 4 }}>
        {label}
      </Text>
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const confirmDelete = useAppStore((s) => s.setConfirmDeleteReply);
  const avatar = AVATAR_COLORS[review.initials] ?? { fg: colors.white, bg: colors.primaryAccent };

  const trash = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Delete reply"
      onPress={() => confirmDelete(review.id)}
      style={({ pressed }) => [styles.trash, pressed && { backgroundColor: colors.surfaceBase }]}
    >
      <Trash2 size={17} color={colors.textTertiary} strokeWidth={2} />
    </Pressable>
  );

  return (
    <Card style={styles.card}>
      <View style={[layout.row, { alignItems: 'flex-start', gap: 12 }]}>
        <Avatar initials={review.initials} size={42} fontSize={14} background={avatar.bg} color={avatar.fg} />
        <View style={layout.flex1}>
          <Text size={type.headline} weight={700} color={colors.textPrimary}>
            {review.name}
          </Text>
          <View style={[layout.row, { marginTop: 2 }]} accessibilityLabel={`${review.rating} out of 5 stars, Google, ${review.time}`}>
            <Text size={type.subhead} color={colors.starAmber} tracking={0.08}>
              {'★'.repeat(review.rating)}
            </Text>
            <Text size={type.subhead} color={colors.starAmberEmpty} tracking={0.08}>
              {'★'.repeat(5 - review.rating)}
            </Text>
            <Text size={type.subhead} color={colors.textTertiary} style={{ marginLeft: 8 }}>
              · Google · {review.time}
            </Text>
          </View>
        </View>
      </View>
      <Text size={type.body} color={colors.textPrimary} style={{ marginTop: 12 }}>
        {review.text}
      </Text>
      <View style={[layout.row, { gap: 6, marginTop: 8 }]}>
        <MapPin size={13} color={colors.textTertiary} strokeWidth={2} />
        <Text size={type.footnote} color={colors.textTertiary} numberOfLines={1} style={layout.flex1}>
          {STORE.locationShort}
        </Text>
      </View>

      {review.reply ? (
        <>
          <View style={styles.reply}>
            <Text size={type.caption} weight={700} tracking={0.06} uppercase color={colors.textTertiary} style={{ marginBottom: 4 }}>
              Your reply
            </Text>
            <Text size={type.callout} lineHeight={1.5} color={colors.textSecondary}>
              {review.reply}
            </Text>
          </View>
          <View style={[layout.row, { justifyContent: 'space-between', marginTop: 12 }]}>
            <View style={styles.repliedChip}>
              <Check size={12} color={colors.success} strokeWidth={3} />
              <Text size={type.footnote} weight={700} color={colors.success} lineHeight={1.2}>
                Replied
              </Text>
            </View>
            {trash}
          </View>
        </>
      ) : (
        <View style={[layout.row, { justifyContent: 'space-between', gap: 10, marginTop: 14 }]}>
          <View style={[layout.row, { gap: 8 }]}>
            <PressableScale pressedScale={0.97} accessibilityLabel={`Reply to ${review.name}`} style={styles.replyBtn}>
              <Reply size={15} color={colors.white} strokeWidth={2} />
              <Text size={type.subhead} weight={700} color={colors.white} lineHeight={1.2}>
                Reply
              </Text>
            </PressableScale>
            <PressableScale pressedScale={0.97} accessibilityLabel="Draft a reply with AI">
              <LinearGradient colors={colors.aiGradientLight} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.aiBtn}>
                <AiSparkGlyph />
                <Text size={type.subhead} weight={700} color={colors.primaryDeep} lineHeight={1.2}>
                  Draft with AI
                </Text>
              </LinearGradient>
            </PressableScale>
          </View>
          {trash}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  overview: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8 },
  card: { padding: 16, marginBottom: 12 },
  reply: { marginTop: 12, borderLeftWidth: 3, borderLeftColor: colors.infoBorder, paddingLeft: 12 },
  repliedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
  },
  trash: { width: 34, height: 34, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    backgroundColor: colors.primaryAccent,
  },
  aiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: radius.full,
  },
});
