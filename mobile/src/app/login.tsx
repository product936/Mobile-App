import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Check, CircleAlert } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Screen, Spacer } from '@/components/Screen';
import { SupportLink } from '@/components/SupportLink';
import { Text } from '@/components/Text';
import { onlyDigits } from '@/lib/format';
import { requestCodes } from '@/services/auth';
import { useAppStore } from '@/state/store';
import { fontFamily } from '@/theme/fonts';
import { colors, leading, radius, shadows, sizes, space, type } from '@/theme/tokens';

export default function LoginScreen() {
  const setPhone = useAppStore((s) => s.setPhone);
  const [phone, setLocalPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = phone.length === 10;
  const showError = touched && phone.length > 0 && !valid;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    try {
      await requestCodes(phone);
      setPhone(phone);
      router.push('/verify');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen bottomInset>
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Spacer h={40} />
          <Image source={require('../../assets/images/connect-logo.jpeg')} style={styles.logo} accessibilityLabel="Connect" />
          <Spacer h={96} />
          <Text size={type.title1} weight={700} lineHeight={leading.tight} tracking={-0.01} color={colors.textPrimary} accessibilityRole="header">
            Recover lost revenue
          </Text>
          <Spacer h={8} />
          <Text size={type.body} color={colors.textSecondary}>
            Sign in with your registered mobile number.
          </Text>

          <Spacer h={space.stackSection} />

          <Text size={type.subhead} weight={600} color={colors.textSecondary} style={styles.label}>
            Mobile Number
          </Text>
          <View
            style={[
              styles.field,
              showError ? styles.fieldError : focused ? styles.fieldFocused : null,
            ]}
          >
            <View style={styles.prefix}>
              <Text size={16} lineHeight={1}>
                🇮🇳
              </Text>
              <Text size={type.headline} weight={600} color={colors.textPrimary}>
                +91
              </Text>
            </View>
            <TextInput
              accessibilityLabel="Mobile number, ten digits"
              value={phone}
              onChangeText={(v) => {
                setLocalPhone(onlyDigits(v));
                setTouched(false);
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                setTouched(true);
              }}
              onSubmitEditing={submit}
              placeholder="00000 00000"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              textContentType="telephoneNumber"
              autoComplete="tel-national"
              returnKeyType="go"
              maxLength={10}
              style={styles.input}
            />
            {valid ? <Check size={20} color={colors.success} strokeWidth={2.4} /> : null}
          </View>
          {showError ? (
            <View style={styles.errorRow} accessibilityRole="alert" accessibilityLiveRegion="polite">
              <CircleAlert size={15} color={colors.error} strokeWidth={2.2} />
              <Text size={type.footnote} color={colors.error}>
                Please enter a valid 10-digit number.
              </Text>
            </View>
          ) : (
            <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 8 }}>
              We'll send codes to your registered mobile and email.
            </Text>
          )}

          <Spacer h={space.stackLoose} />
          <Button
            label="Send Verification Code"
            weight={600}
            disabled={!valid}
            loading={loading}
            onPress={submit}
          />
          <Spacer h={space.stackLoose} />
          <SupportLink />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  body: { paddingHorizontal: 24, paddingBottom: 24 },
  logo: { width: 36, height: 36 },
  label: { marginBottom: 8 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: sizes.inputH,
    paddingHorizontal: 14,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
  },
  fieldFocused: { borderColor: colors.primaryAccent, boxShadow: shadows.focusRing },
  fieldError: { borderColor: colors.error, backgroundColor: colors.errorBg, boxShadow: shadows.errorRing },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
    marginRight: 2,
    borderRightWidth: 1,
    borderRightColor: colors.borderDefault,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontFamily: fontFamily(600),
    fontSize: type.headline,
    letterSpacing: 0.06 * type.headline,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    outlineStyle: 'none',
  } as object,
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
});
