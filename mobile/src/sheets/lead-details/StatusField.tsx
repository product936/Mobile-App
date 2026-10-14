import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Check, ChevronDown } from 'lucide-react-native';

import { Text } from '@/components/Text';
import { EDITABLE_LEAD_STATUSES, type LeadStatus } from '@/data/leads';
import { leadStatusTint } from '@/lib/format';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { colors, motion, radius, shadows, sizes, type } from '@/theme/tokens';

/** Tinted pill with a dot, shown next to the "Lead details" title. */
export function StatusPill({ status }: { status: LeadStatus }) {
  const { bg, fg } = leadStatusTint(status);
  return (
    <View style={[styles.pill, { backgroundColor: bg }]} accessibilityLabel={`Status: ${status}`}>
      <View style={[styles.pillDot, { backgroundColor: fg }]} />
      <Text size={type.footnote} weight={700} color={fg} lineHeight={1.2} numberOfLines={1}>
        {status}
      </Text>
    </View>
  );
}

/**
 * Status dropdown: a field showing the current status that expands an inline
 * list below it. Picking an option closes the list.
 */
export function StatusSelect({
  value,
  open,
  onToggle,
  onChange,
}: {
  value: LeadStatus;
  open: boolean;
  onToggle: () => void;
  onChange: (status: LeadStatus) => void;
}) {
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
        accessibilityLabel={`Status, ${value}`}
        accessibilityHint="Opens the list of statuses"
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
        style={[styles.field, open && styles.fieldOpen]}
      >
        <Text size={type.headline} weight={600} color={colors.textPrimary} style={{ flex: 1 }}>
          {value}
        </Text>
        <Animated.View style={{ transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}>
          <ChevronDown size={16} color={colors.textTertiary} strokeWidth={2.2} />
        </Animated.View>
      </Pressable>
      {open ? (
        <View style={styles.list} accessibilityRole="radiogroup">
          {EDITABLE_LEAD_STATUSES.map((s) => {
            const selected = s === value;
            return (
              <Pressable
                key={s}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => onChange(s)}
                style={[styles.option, selected && { backgroundColor: colors.blue50 }]}
              >
                <Text
                  size={type.callout}
                  weight={selected ? 700 : 500}
                  color={selected ? colors.primaryAccent : colors.textPrimary}
                  style={{ flex: 1 }}
                >
                  {s}
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
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    flexShrink: 1,
  },
  pillDot: { width: 7, height: 7, borderRadius: radius.full },
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
