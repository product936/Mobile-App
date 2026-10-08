import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Mic } from 'lucide-react-native';

import { Text } from '@/components/Text';
import { fontFamily } from '@/theme/fonts';
import { colors, radius, shadows, sizes, type } from '@/theme/tokens';

/** Persistent label above a field, with an optional "Optional" hint on the right. */
export function FieldLabel({ children, optional }: { children: string; optional?: boolean }) {
  return (
    <View style={styles.labelRow}>
      <Text size={type.subhead} weight={600} color={colors.textSecondary}>
        {children}
      </Text>
      {optional ? (
        <Text size={type.footnote} color={colors.textTertiary}>
          Optional
        </Text>
      ) : null}
    </View>
  );
}

function useFocusRing() {
  const [focused, setFocused] = useState(false);
  return {
    focused,
    handlers: { onFocus: () => setFocused(true), onBlur: () => setFocused(false) },
  };
}

/** Single-line input (44px, 10px radius, 1.5px border, focus ring). */
export function TextField(props: TextInputProps) {
  const { focused, handlers } = useFocusRing();
  return (
    <TextInput
      placeholderTextColor={colors.textTertiary}
      {...props}
      {...handlers}
      style={[styles.input, focused && styles.focused, props.style]}
    />
  );
}

/** +91 prefixed mobile number input. */
export function PhoneField(props: TextInputProps) {
  const { focused, handlers } = useFocusRing();
  return (
    <View style={[styles.phoneWrap, focused && styles.focused]}>
      <View style={styles.prefix}>
        <Text size={type.headline} weight={600} color={colors.textPrimary}>
          🇮🇳 +91
        </Text>
      </View>
      <TextInput
        placeholderTextColor={colors.textTertiary}
        keyboardType="number-pad"
        maxLength={10}
        {...props}
        {...handlers}
        style={styles.phoneInput}
      />
    </View>
  );
}

/**
 * Multi-line notes box with a mic button. The mic focuses the field so the
 * keyboard's dictation can be used for voice notes.
 */
export function NotesField({ minHeight = 96, ...props }: TextInputProps & { minHeight?: number }) {
  const ref = useRef<TextInput>(null);
  const { focused, handlers } = useFocusRing();
  return (
    <View>
      <TextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        placeholderTextColor={colors.textTertiary}
        {...props}
        {...handlers}
        style={[styles.notes, { minHeight }, focused && styles.focused]}
      />
      <Pressable accessibilityRole="button" accessibilityLabel="Dictate note" onPress={() => ref.current?.focus()} style={styles.mic}>
        <Mic size={17} color={colors.primaryAccent} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

/** Multi-line description box without the mic (support tickets). */
export function TextArea({ minHeight = 110, ...props }: TextInputProps & { minHeight?: number }) {
  const { focused, handlers } = useFocusRing();
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      placeholderTextColor={colors.textTertiary}
      {...props}
      {...handlers}
      style={[styles.notes, { minHeight, paddingRight: 14 }, focused && styles.focused]}
    />
  );
}

const base = {
  borderWidth: 1.5,
  borderColor: colors.borderDefault,
  borderRadius: radius.input,
  backgroundColor: colors.surfaceElevated,
  color: colors.textPrimary,
  outlineStyle: 'none',
} as const;

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 },
  input: {
    ...base,
    height: sizes.inputH,
    paddingHorizontal: 14,
    fontFamily: fontFamily(500),
    fontSize: type.headline,
  } as object,
  focused: { borderColor: colors.primaryAccent, boxShadow: shadows.focusRing },
  phoneWrap: {
    ...base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: sizes.inputH,
    paddingHorizontal: 14,
  } as object,
  prefix: { paddingRight: 12, borderRightWidth: 1, borderRightColor: colors.borderDefault },
  phoneInput: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontFamily: fontFamily(600),
    fontSize: type.headline,
    letterSpacing: 0.04 * type.headline,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    outlineStyle: 'none',
  } as object,
  notes: {
    ...base,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 14,
    paddingRight: 52,
    fontFamily: fontFamily(400),
    fontSize: type.body,
  } as object,
  mic: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
