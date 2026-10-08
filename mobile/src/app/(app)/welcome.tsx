import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { SparkleGlyph } from '@/components/glyphs';
import { Screen, Spacer } from '@/components/Screen';
import { Text } from '@/components/Text';
import { useRoleConfig } from '@/state/store';
import { colors, radius, shadows, space, type } from '@/theme/tokens';

export default function WelcomeScreen() {
  const { welcome } = useRoleConfig();

  return (
    <Screen bottomInset>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <Image
            source={require('../../../assets/images/tata-motors-logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
            accessibilityLabel="Tata Motors"
          />
          <LinearGradient colors={colors.aiGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.aiMark}>
            <SparkleGlyph />
          </LinearGradient>
          <Spacer h={20} />
          <Text size={type.largeTitle} weight={700} lineHeight={1.1} tracking={-0.02} color={colors.textPrimary} align="center" accessibilityRole="header">
            Welcome to Store App.
          </Text>
          <Spacer h={8} />
          <Text size={type.headline} weight={600} color={colors.primaryAccent} align="center">
            {welcome.scope}
          </Text>
          <Spacer h={14} />
          <Text size={type.body} color={colors.textSecondary} align="center">
            {welcome.message}
          </Text>
        </View>

        <Spacer h={space.stackSection} />
        <Text size={10} weight={700} tracking={0.12} uppercase color={colors.textTertiary} align="center" style={{ marginBottom: 12 }}>
          Last 7 days
        </Text>
        <View style={styles.stats}>
          <Stat value={welcome.missed} label="Calls missed" tone="error" />
          <Stat value={welcome.recoverable} label="Recoverable" />
          <Stat value={welcome.negativeReviews} label="Negative reviews" valueColor={colors.error} small />
        </View>

        <Spacer h={space.stackSection} />
        <Button label="Take me in" weight={600} onPress={() => router.replace('/home')} />
        <Spacer h={12} />
        <View style={styles.note}>
          <ShieldCheck size={14} color={colors.textTertiary} strokeWidth={2} />
          <Text size={type.footnote} color={colors.textTertiary} style={{ flexShrink: 1 }}>
            Next time, you'll land on what changed since your last visit.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({
  value,
  label,
  tone,
  valueColor,
  small,
}: {
  value: string;
  label: string;
  tone?: 'error';
  valueColor?: string;
  small?: boolean;
}) {
  return (
    <View style={[styles.stat, tone === 'error' ? styles.statError : styles.statPlain]}>
      <Text
        size={26}
        weight={800}
        lineHeight={1.1}
        align="center"
        color={tone === 'error' ? colors.error : (valueColor ?? colors.textPrimary)}
      >
        {value}
      </Text>
      <Text size={small ? 11 : type.subhead} weight={600} color={colors.textSecondary} numberOfLines={1} align="center">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24 },
  hero: { alignItems: 'center' },
  brandLogo: { height: 22, width: 22 * (428 / 78), marginBottom: 22 },
  aiMark: {
    width: 66,
    height: 66,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.aiMark,
  },
  stats: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  stat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: radius.card,
    boxShadow: shadows.card,
  },
  statError: { backgroundColor: colors.errorBg, borderColor: colors.errorBorder },
  statPlain: { backgroundColor: colors.surfaceElevated, borderColor: colors.borderDefault },
  note: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});
