import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Check } from 'lucide-react-native';

import { PressableScale } from '@/components/PressableScale';
import { Text } from '@/components/Text';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { colors, motion, radius, shadows, type } from '@/theme/tokens';

/**
 * Selectable chip. Selected chips use a light-blue fill with accent text and
 * border, never a solid blue fill (a direct request from the design review).
 */
export function Chip({
  label,
  selected,
  onPress,
  style,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff, style]}
    >
      <Text
        size={type.subhead}
        weight={600}
        lineHeight={1.2}
        color={selected ? colors.primaryAccent : colors.textSecondary}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** 22px rounded-square checkbox indicator. */
export function CheckboxBox({ checked }: { checked: boolean }) {
  return checked ? (
    <View style={[styles.box, styles.boxOn]}>
      <Check size={14} color={colors.white} strokeWidth={3} />
    </View>
  ) : (
    <View style={[styles.box, styles.boxOff]} />
  );
}

/** 22px radio indicator: thick accent ring when selected. */
export function RadioDot({ selected }: { selected: boolean }) {
  return <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]} />;
}

/** iOS-style switch (46×26 track, 20px knob). */
export function Toggle({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) {
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(x, {
      toValue: value ? 1 : 0,
      duration: reduced ? 0 : motion.fast,
      easing: motion.easeOut,
      useNativeDriver: false,
    }).start();
  }, [value, reduced, x]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={onChange}
      hitSlop={9}
    >
      <Animated.View
        style={[
          styles.track,
          { backgroundColor: x.interpolate({ inputRange: [0, 1], outputRange: [colors.borderDefault, colors.primaryAccent] }) },
        ]}
      >
        <Animated.View
          style={[styles.knob, { left: x.interpolate({ inputRange: [0, 1], outputRange: [3, 23] }) }]}
        />
      </Animated.View>
    </Pressable>
  );
}

/**
 * Pill segmented control on a light-blue track. The active segment is white
 * with accent text and a soft shadow; inactive segments use secondary text.
 */
export function SegmentedTabs<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.segTrack, style]} accessibilityRole="tablist">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <PressableScale
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(opt.value)}
            style={[styles.seg, active && styles.segActive]}
          >
            <Text
              size={type.subhead}
              weight={700}
              lineHeight={1.2}
              color={active ? colors.primaryAccent : colors.textSecondary}
            >
              {opt.label}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { backgroundColor: colors.blue50, borderColor: colors.primaryAccent },
  chipOff: { backgroundColor: colors.surfaceElevated, borderColor: colors.borderDefault },
  box: { width: 22, height: 22, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.primaryAccent },
  boxOff: { borderWidth: 2, borderColor: colors.borderDefault },
  radio: { width: 22, height: 22, borderRadius: radius.full, backgroundColor: colors.white },
  radioOn: { borderWidth: 6, borderColor: colors.primaryAccent },
  radioOff: { borderWidth: 2, borderColor: colors.borderDefault },
  track: { width: 46, height: 26, borderRadius: radius.full },
  knob: {
    position: 'absolute',
    top: 3,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    boxShadow: shadows.thumb,
  },
  segTrack: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: radius.full,
  },
  seg: { flex: 1, height: 36, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  segActive: { backgroundColor: colors.surfaceElevated, boxShadow: shadows.sm },
});
