import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Check, Lock, Send } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { PageHeader } from '@/components/chrome';
import { Screen, ScrollBody } from '@/components/Screen';
import { Text } from '@/components/Text';
import { requestAccess } from '@/services/access';
import { useAppStore } from '@/state/store';
import { colors, radius, type } from '@/theme/tokens';

/**
 * What the Reviews tab shows to an account without access to Reviews: a
 * minimal, centred zero state with a way to ask the admin for access. Once
 * asked, it says so, including on later visits.
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
      <ScrollBody contentStyle={styles.page}>
        <PageHeader title="Reviews" />
        <View style={styles.center} accessibilityLiveRegion="polite">
          <View style={[styles.icon, requested && styles.iconDone]}>
            {requested ? (
              <Check size={28} color={colors.success} strokeWidth={2.6} />
            ) : (
              <Lock size={26} color={colors.textSecondary} strokeWidth={2.2} />
            )}
          </View>

          <Text size={type.title3} weight={700} color={colors.textPrimary} align="center" accessibilityRole="header">
            {requested ? 'Access requested' : "You don't have access to Reviews"}
          </Text>
          <Text size={type.callout} color={colors.textSecondary} align="center" style={styles.explainer}>
            {requested
              ? "We've let your admin know. You'll get a notification once Reviews is turned on for you."
              : 'Ask your admin for access to read and reply to customer reviews.'}
          </Text>

          {requested ? null : (
            <>
              {failed ? (
                <Text size={type.footnote} color={colors.error} align="center" style={styles.error} accessibilityRole="alert">
                  We couldn't send your request. Check your connection and try again.
                </Text>
              ) : null}
              <Button
                label={failed ? 'Try again' : 'Request access'}
                loading={sending}
                onPress={request}
                style={styles.cta}
                iconLeft={<Send size={16} color={colors.white} strokeWidth={2.2} />}
              />
              <Text size={type.footnote} color={colors.textTertiary} align="center" style={styles.support}>
                Your admin gets your request right away.
              </Text>
            </>
          )}
        </View>
      </ScrollBody>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingBottom: 40 },
  icon: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  iconDone: { backgroundColor: colors.successBg },
  explainer: { marginTop: 8, maxWidth: 300 },
  error: { marginTop: 16 },
  cta: { alignSelf: 'center', marginTop: 24, paddingHorizontal: 28 },
  support: { marginTop: 12 },
});
