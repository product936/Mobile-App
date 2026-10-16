import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckCircle2, Lock, MessageSquareReply, Send, Star, TrendingUp, type LucideIcon } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { PageHeader } from '@/components/chrome';
import { Card, layout } from '@/components/primitives';
import { Screen, ScrollBody, Spacer } from '@/components/Screen';
import { Text } from '@/components/Text';
import { requestAccess } from '@/services/access';
import { useAppStore } from '@/state/store';
import { colors, radius, shadows, type } from '@/theme/tokens';

const BENEFITS: { Icon: LucideIcon; text: string }[] = [
  { Icon: Star, text: 'Read every Google review for your store' },
  { Icon: MessageSquareReply, text: 'Reply quickly, with AI-drafted replies' },
  { Icon: TrendingUp, text: 'Track your rating and how fast you reply' },
];

/**
 * What the Reviews tab shows to an account without access to Reviews: what
 * Reviews offers and a way to ask the admin for access. Once asked, it says
 * so, including on later visits.
 */
export function ReviewsLocked() {
  const requested = useAppStore((s) => s.accessRequested.includes('reviews'));
  const markRequested = useAppStore((s) => s.markAccessRequested);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const request = async () => {
    if (sending || requested) return;
    setSending(true);
    setFailed(false);
    try {
      await requestAccess('reviews');
      markRequested('reviews');
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen>
      <ScrollBody>
        <PageHeader title="Reviews" subtitle="What customers are saying, and how fast you reply" />
        <Spacer h={24} />
        <Card style={styles.card}>
          <View style={styles.badge}>
            <Star size={30} color={colors.starAmber} fill={colors.starAmber} strokeWidth={1.5} />
            <View style={styles.lock}>
              <Lock size={13} color={colors.white} strokeWidth={2.6} />
            </View>
          </View>

          {requested ? (
            <View accessibilityLiveRegion="polite" style={{ alignItems: 'center' }}>
              <Text size={type.title3} weight={700} color={colors.textPrimary} align="center" accessibilityRole="header">
                Access requested
              </Text>
              <Text size={type.callout} color={colors.textSecondary} align="center" style={styles.body}>
                We've let your admin know. You'll get a notification as soon as Reviews is turned on for you.
              </Text>
              <View style={styles.sent}>
                <CheckCircle2 size={16} color={colors.success} strokeWidth={2.4} />
                <Text size={type.subhead} weight={600} color={colors.success}>
                  Request sent
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text size={type.title3} weight={700} color={colors.textPrimary} align="center" accessibilityRole="header">
                You don't have access to Reviews yet
              </Text>
              <Text size={type.callout} color={colors.textSecondary} align="center" style={styles.body}>
                Ask your admin to turn it on, and you can start replying to customers from here.
              </Text>

              <View style={styles.benefits}>
                {BENEFITS.map(({ Icon, text }) => (
                  <View key={text} style={[layout.row, { gap: 10 }]}>
                    <View style={styles.benefitIcon}>
                      <Icon size={15} color={colors.primaryAccent} strokeWidth={2.2} />
                    </View>
                    <Text size={type.subhead} color={colors.textSecondary} style={layout.flex1}>
                      {text}
                    </Text>
                  </View>
                ))}
              </View>

              {failed ? (
                <Text size={type.footnote} color={colors.error} align="center" style={{ marginBottom: 10 }} accessibilityRole="alert">
                  We couldn't send your request. Check your connection and try again.
                </Text>
              ) : null}
              <Button
                label={failed ? 'Try again' : 'Request access'}
                loading={sending}
                onPress={request}
                iconLeft={<Send size={16} color={colors.white} strokeWidth={2.2} />}
              />
              <Text size={type.footnote} color={colors.textTertiary} align="center" style={{ marginTop: 10 }}>
                Your admin will get your request right away.
              </Text>
            </>
          )}
        </Card>
      </ScrollBody>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'stretch', paddingTop: 28, paddingHorizontal: 20, paddingBottom: 22, boxShadow: shadows.card },
  badge: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.amber100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  lock: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.textPrimary,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { marginTop: 8 },
  benefits: {
    gap: 12,
    marginTop: 20,
    marginBottom: 22,
    padding: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceBase,
  },
  benefitIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colors.blue50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: colors.successBg,
  },
});
