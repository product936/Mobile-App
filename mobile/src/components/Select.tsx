import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';

import { Text } from '@/components/Text';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { colors, motion, radius, shadows, sizes, type } from '@/theme/tokens';

/**
 * Dropdown: a field showing the current value that expands an inline list
 * below it. Picking an option closes the list.
 */
export function Select<T extends string>({
  label,
  value,
  options,
  open,
  onToggle,
  onChange,
}: {
  /** Field name for screen readers, e.g. "Status". */
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  open: boolean;
  onToggle: () => void;
  onChange: (value: T) => void;
}) {
  const current = options.find((o) => o.value === value)?.label ?? value;
  const reduced = useReducedMotion();
  const turn = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(turn, {
      toValue: open ? 1 : 0,
      duration: reduced ? 0 : motion.fast,
      easing: motion.easeOut,
      useNativeDriver: true,
    }).start();
  }, [open, reduced, turn]);

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${current}`}
        accessibilityHint="Opens the list of options"
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={[styles.field, open && styles.fieldOpen]}
      >
        <Text size={type.headline} weight={600} color={colors.textPrimary} style={{ flex: 1 }}>
          {current}
        </Text>
        <Animated.View style={{ transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
          <ChevronDown size={16} color={colors.textTertiary} strokeWidth={2.2} />
        </Animated.View>
      </Pressable>
      {open ? (
        <View style={styles.list} accessibilityRole="radiogroup">
          {options.map((o) => {
            const selected = o.value === value;
            return (
              <Pressable
                key={o.value}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => onChange(o.value)}
                style={[styles.option, selected && { backgroundColor: colors.blue50 }]}
              >
                <Text
                  size={type.callout}
                  weight={selected ? 700 : 500}
                  color={selected ? colors.primaryAccent : colors.textPrimary}
                  style={{ flex: 1 }}
                >
                  {o.label}
                </Text>
                {selected ? <Check size={16} color={colors.primaryAccent} strokeWidth={2.6} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: sizes.inputH,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
    backgroundColor: colors.surfaceElevated,
  },
  fieldOpen: { borderColor: colors.primaryAccent },
  list: {
    marginTop: 6,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
    boxShadow: shadows.md,
    overflow: 'hidden',
  },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14 },
});
