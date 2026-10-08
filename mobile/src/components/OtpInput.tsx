import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { fontFamily } from '@/theme/fonts';
import { colors, radius, shadows } from '@/theme/tokens';

export const OTP_LENGTH = 6;

/** Applies typed or pasted text at `index`, returning the new digits and the box to focus next. */
export function applyOtpInput(digits: string[], index: number, text: string): { digits: string[]; focus: number } {
  const chars = text.replace(/\D/g, '').split('');
  const next = [...digits];
  if (chars.length === 0) {
    next[index] = '';
    return { digits: next, focus: index };
  }
  // A single typed character replaces the box; pasted/autofilled codes spread forward.
  const incoming = chars.length > 1 && digits[index] && chars[0] === digits[index] ? chars.slice(1) : chars;
  incoming.forEach((c, i) => {
    if (index + i < OTP_LENGTH) next[index + i] = c;
  });
  return { digits: next, focus: Math.min(index + incoming.length, OTP_LENGTH - 1) };
}

/**
 * Six single-digit boxes: auto-advance on entry, backspace on an empty box
 * moves back, and a pasted or SMS-autofilled code fills every box.
 */
export function OtpInput({
  value,
  onChange,
  label,
}: {
  value: string[];
  onChange: (digits: string[]) => void;
  label: string;
}) {
  const refs = useRef<(TextInput | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  return (
    <View style={styles.row}>
      {value.map((char, i) => (
        <TextInput
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          accessibilityLabel={`${label} digit ${i + 1} of ${OTP_LENGTH}`}
          value={char}
          onChangeText={(text) => {
            const res = applyOtpInput(value, i, text);
            onChange(res.digits);
            if (text.replace(/\D/g, '').length > 0) refs.current[res.focus]?.focus();
          }}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !value[i] && i > 0) {
              const next = [...value];
              next[i - 1] = '';
              onChange(next);
              refs.current[i - 1]?.focus();
            }
          }}
          onFocus={() => setFocusedIndex(i)}
          onBlur={() => setFocusedIndex((f) => (f === i ? null : f))}
          selectTextOnFocus
          keyboardType="number-pad"
          textContentType={i === 0 ? 'oneTimeCode' : 'none'}
          autoComplete={i === 0 ? 'sms-otp' : 'off'}
          maxLength={i === 0 ? OTP_LENGTH : 2}
          style={[
            styles.box,
            char ? styles.boxFilled : null,
            focusedIndex === i ? styles.boxFocused : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  box: {
    flex: 1,
    minWidth: 0,
    height: 54,
    padding: 0,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: fontFamily(700),
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    outlineStyle: 'none',
  } as object,
  boxFilled: { borderColor: colors.primaryAccent },
  boxFocused: { borderColor: colors.primaryAccent, boxShadow: shadows.focusRing },
});
