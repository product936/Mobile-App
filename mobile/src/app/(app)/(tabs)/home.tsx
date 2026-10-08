import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight,
  ChevronDown,
  Eye,
  Globe,
  Layers,
  MapPin,
  Percent,
  Phone,
  PhoneMissed,
  Sparkle,
  Star,
  Truck,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

import { Button } from '@/components/Button';
import { FilterIconButtons, HeaderActions } from '@/components/chrome';
import { PressableScale } from '@/components/PressableScale';
import { Card, IconTile, StatDivider, layout } from '@/components/primitives';
import { Screen, ScrollBody, Spacer } from '@/components/Screen';
import { Text } from '@/components/Text';
import { STORE } from '@/config/roles';
import { isKarnatakaOnly } from '@/lib/format';
import { useAppStore, useRoleConfig } from '@/state/store';
import { colors, radius, shadows, type } from '@/theme/tokens';

export default function HomeScreen() {
  const config = useRoleConfig();
  const all = useAppStore((s) => s.locationAll);
  const selection = useAppStore((s) => s.locationSelection);
  const setLeadStatus = useAppStore((s) => s.setLeadStatus);
  const openAddLead = useAppStore((s) => s.openAddLead);
  const showEmpty = isKarnatakaOnly(selection, all);

  const onPrimaryCta = () => {
    if (config.home.cta.action === 'openLeaderboard') {
      router.navigate('/leaderboard');
    } else {
      setLeadStatus('Missed');
      router.navigate('/leads');
    }
  };

  return (
    <Screen>
      <ScrollBody>
        <View style={[layout.row, { gap: 10 }]}>
          <Pressable accessibilityRole="button" accessibilityLabel={`${STORE.brand}, ${STORE.storeCount} stores`} style={styles.storePill}>
            <Truck size={16} color={colors.primaryAccent} strokeWidth={2} />
            <Text size={type.subhead} weight={600} color={colors.textPrimary} numberOfLines={1} style={layout.flex1}>
              {STORE.brand}
            </Text>
            <View style={styles.countBubble}>
              <Text size={11} weight={700} color={colors.primaryAccent} lineHeight={1.1}>
                {STORE.storeCount}
              </Text>
            </View>
            <ChevronDown size={15} color={colors.textTertiary} strokeWidth={2.2} />
          </Pressable>
          <HeaderActions />
        </View>

        <Spacer h={18} />
        <View style={[layout.row, { alignItems: 'flex-start', gap: 12 }]}>
          <View style={layout.flex1}>
            <Text size={type.title1} weight={700} lineHeight={1.1} tracking={-0.01} color={colors.textPrimary} accessibilityRole="header">
              Welcome {config.user.firstName}
            </Text>
          </View>
          <View style={{ paddingTop: 2 }}>
            <FilterIconButtons />
          </View>
        </View>

        <Spacer h={20} />
        {showEmpty ? (
          <LinearGradient colors={['#FFFDF5', '#FEF8E4']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.emptyCard}>
            <Text size={26} weight={800} lineHeight={1.14} tracking={-0.01} color="#8A4B00">
              Let's get started. No calls missed yet
            </Text>
            <Spacer h={10} />
            <Text size={type.body} color="#7A5A1E">
              Connect with your first customers and start collecting reviews.
            </Text>
            <Spacer h={18} />
            <Button
              label="Ask for reviews"
              variant="amber"
              onPress={() => openAddLead('form')}
              iconRight={<ArrowRight size={18} color={colors.white} strokeWidth={2.4} />}
            />
          </LinearGradient>
        ) : (
          <LinearGradient colors={['#FEF2F2', '#FFF6F6']} style={styles.missedCard}>
            <View style={[layout.row, { gap: 8 }]}>
              <IconTile size={28} rounded={radius.md} background={colors.red100}>
                <PhoneMissed size={16} color={colors.error} strokeWidth={2} />
              </IconTile>
              <Text size={11} weight={700} tracking={0.08} uppercase color={colors.error}>
                Missed · Last 7 days
              </Text>
            </View>
            <Spacer h={12} />
            <Text size={30} weight={800} lineHeight={1.05} tracking={-0.02} color={colors.textPrimary}>
              {config.home.missedHeadline}
            </Text>
            <Spacer h={10} />
            <View style={[layout.row, { alignItems: 'baseline', gap: 8 }]}>
              <Text size={18} weight={800} color={colors.error}>
                {config.home.atStake}
              </Text>
              <Text size={type.subhead} color={colors.textTertiary}>
                at stake
              </Text>
            </View>
            <Spacer h={6} />
            <Text size={type.body} color={colors.textSecondary}>
              Win it back before they buy elsewhere.
            </Text>
            <Spacer h={16} />
            <Button
              label={config.home.cta.label}
              weight={600}
              onPress={onPrimaryCta}
              iconRight={<ArrowRight size={18} color={colors.white} strokeWidth={2.4} />}
            />
          </LinearGradient>
        )}

        <Spacer h={22} />

        {config.home.regionSummary ? (
          <>
            <SectionTitle Icon={Layers}>Across your region</SectionTitle>
            <Card style={styles.strip}>
              <StripStat value={config.home.regionSummary.locations} label="Locations" />
              <StatDivider height={32} />
              <StripStat value={config.home.regionSummary.missed} label="Missed" color={colors.error} />
              <StatDivider height={32} />
              <StripStat value={config.home.regionSummary.answered} label="Answered" color={colors.success} />
              <StatDivider height={32} />
              <StripStat value={config.home.regionSummary.recovery} label="Recovery" color={colors.success} />
            </Card>
            <Spacer h={22} />
          </>
        ) : null}

        <SectionTitle Icon={Zap}>Needs you now</SectionTitle>
        <Card style={styles.needsCard}>
          <IconTile size={40} background={colors.amberTile}>
            <Star size={20} color={colors.starAmber} fill={colors.starAmber} strokeWidth={1.5} />
          </IconTile>
          <View style={layout.flex1}>
            <Text size={type.callout} weight={700} color={colors.textPrimary}>
              36 reviews waiting for a reply
            </Text>
            <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 2 }}>
              Worst is 1<Text size={type.footnote} color={colors.starAmber}>★</Text> from Rohit Salvi
            </Text>
          </View>
          <PressableScale accessibilityLabel="Reply to reviews" onPress={() => router.navigate('/reviews')} style={styles.replyPill}>
            <Text size={type.subhead} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
              Reply
            </Text>
          </PressableScale>
        </Card>

        <Spacer h={22} />
        <SectionTitle Icon={Eye}>How customers found you</SectionTitle>
        <Card style={styles.discovery}>
          <View style={layout.row}>
            <Metric Icon={Eye} value="8,302" label="Saw your shop" />
            <Metric Icon={Sparkle} value="648" label="Interacted" />
            <Metric Icon={Percent} value="7.8%" label="Took action" tone="success" />
          </View>
          <View style={styles.discoveryDivider} />
          <View style={layout.row}>
            <Metric Icon={Phone} value="274" label="Tapped to call" />
            <Metric Icon={MapPin} value="219" label="Visited store" />
            <Metric Icon={Globe} value="155" label="Opened website" />
          </View>
        </Card>
        <Spacer h={8} />
      </ScrollBody>
    </Screen>
  );
}

function SectionTitle({ Icon, children }: { Icon: LucideIcon; children: ReactNode }) {
  return (
    <View style={[layout.row, { gap: 7, marginBottom: 10 }]}>
      <Icon size={17} color={colors.primaryAccent} strokeWidth={2} />
      <Text size={type.headline} weight={600} color={colors.textPrimary} accessibilityRole="header">
        {children}
      </Text>
    </View>
  );
}

function StripStat({ value, label, color = colors.textPrimary }: { value: string; label: string; color?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text size={20} weight={800} color={color}>
        {value}
      </Text>
      <Text size={type.caption} color={colors.textTertiary} style={{ marginTop: 3 }}>
        {label}
      </Text>
    </View>
  );
}

function Metric({ Icon, value, label, tone }: { Icon: LucideIcon; value: string; label: string; tone?: 'success' }) {
  const accent = tone === 'success' ? colors.success : colors.primaryAccent;
  return (
    <View style={styles.metric}>
      <Icon size={18} color={accent} strokeWidth={2} />
      <Text size={18} weight={800} color={tone === 'success' ? colors.success : colors.textPrimary}>
        {value}
      </Text>
      <Text size={type.caption} color={colors.textTertiary} align="center">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  storePill: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.full,
  },
  countBubble: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missedCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: radius.card,
    boxShadow: shadows.card,
  },
  emptyCard: {
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: '#F3E6B4',
    borderRadius: radius.card,
    boxShadow: shadows.card,
  },
  strip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 8 },
  needsCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  replyPill: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discovery: { paddingVertical: 6, paddingHorizontal: 4 },
  discoveryDivider: { height: 1, backgroundColor: colors.borderSubtle, marginVertical: 2, marginHorizontal: 10 },
  metric: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 14, paddingHorizontal: 6 },
});
