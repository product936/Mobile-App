import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Check, Mail, Smartphone, type LucideIcon } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { BackButton } from '@/components/chrome';
import { OTP_LENGTH, OtpInput } from '@/components/OtpInput';
import { IconTile } from '@/components/primitives';
import { Screen, Spacer } from '@/components/Screen';
import { SupportLink } from '@/components/SupportLink';
import { Text } from '@/components/Text';
import { maskLoginNumber } from '@/lib/format';
import { useCountdown } from '@/lib/useCountdown';
import { requestCodes, verifyCodes } from '@/services/auth';
import { useAppStore } from '@/state/store';
import { colors, leading, sizes, space, type } from '@/theme/tokens';

const empty = () => Array<string>(OTP_LENGTH).fill('');
const isComplete = (d: string[]) => d.every((c) => c !== '');

export default function VerifyScreen() {
  const phone = useAppStore((s) => s.phone);
  const signIn = useAppStore((s) => s.signIn);
  const [mobileCode, setMobileCode] = useState(empty);
  const [emailCode, setEmailCode] = useState(empty);
  const [verifying, setVerifying] = useState(false);
  const mobileTimer = useCountdown(30);
  const emailTimer = useCountdown(30);

  const ready = isComplete(mobileCode) && isComplete(emailCode);

  const verify = async () => {
    if (!ready || verifying) return;
    setVerifying(true);
    try {
      const { role } = await verifyCodes(phone, mobileCode.join(''), emailCode.join(''));
      signIn(role);
      router.replace('/welcome');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Screen bottomInset>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.nav}>
            <BackButton offset={-8} onPress={() => (router.canGoBack() ? router.back() : router.replace('/login'))} />
          </View>
          <Spacer h={8} />
          <Text size={type.title1} weight={700} lineHeight={leading.tight} tracking={-0.01} color={colors.textPrimary} accessibilityRole="header">
            Verify It's You
          </Text>
          <Spacer h={8} />
          <Text size={type.body} color={colors.textSecondary}>
            Enter the two codes we just sent to keep your account secure.
          </Text>

          <Spacer h={space.stackSection} />
          <CodeSection
            Icon={Smartphone}
            title="Mobile code"
            destination={`Sent via SMS to +91 ${maskLoginNumber(phone)}`}
            value={mobileCode}
            onChange={setMobileCode}
            timer={mobileTimer}
            onResend={() => {
              mobileTimer.restart();
              void requestCodes(phone);
            }}
          />
          <Spacer h={space.stackLoose} />
          <CodeSection
            Icon={Mail}
            title="Email code"
            destination="Sent to r••••••@company.com"
            value={emailCode}
            onChange={setEmailCode}
            timer={emailTimer}
            onResend={() => {
              emailTimer.restart();
              void requestCodes(phone);
            }}
          />

          <Spacer h={space.stackSection} />
          <Button label="Verify & Continue" weight={600} disabled={!ready} loading={verifying} onPress={verify} />
          <Spacer h={12} />
          <SupportLink />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function CodeSection({
  Icon,
  title,
  destination,
  value,
  onChange,
  timer,
  onResend,
}: {
  Icon: LucideIcon;
  title: string;
  destination: string;
  value: string[];
  onChange: (d: string[]) => void;
  timer: { left: number; label: string };
  onResend: () => void;
}) {
  return (
    <View>
      <View style={styles.sectionHead}>
        <IconTile size={32}>
          <Icon size={17} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
        <View style={styles.flex1}>
          <Text size={type.subhead} weight={600} color={colors.textPrimary}>
            {title}
          </Text>
          <Text size={type.footnote} color={colors.textTertiary}>
            {destination}
          </Text>
        </View>
        {isComplete(value) ? <Check size={18} color={colors.success} strokeWidth={2.6} accessibilityLabel="Code complete" /> : null}
      </View>
      <OtpInput value={value} onChange={onChange} label={title} />
      <View style={styles.resendRow}>
        <Text size={type.footnote}>Didn't get it?</Text>
        {timer.left === 0 ? (
          <Pressable accessibilityRole="link" onPress={onResend} hitSlop={10}>
            <Text size={type.footnote} weight={600} color={colors.primaryAccent}>
              Resend code
            </Text>
          </Pressable>
        ) : (
          <Text size={type.footnote}>Resend in {timer.label}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  flex1: { flex: 1, minWidth: 0 },
  body: { paddingHorizontal: 24, paddingBottom: 24 },
  nav: { height: sizes.navbar, justifyContent: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  resendRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
});
