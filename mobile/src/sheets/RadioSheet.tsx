import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { RadioDot } from '@/components/controls';
import { Sheet, SheetBottomInset, SheetGrabber, SheetHeader } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { colors, type } from '@/theme/tokens';

/** Action sheet with a single-choice radio list; choosing an option closes it. */
export function RadioSheet<T extends string>({
  title,
  visible,
  onClose,
  options,
  value,
  onSelect,
  maxHeightRatio,
}: {
  title: string;
  visible: boolean;
  onClose: () => void;
  options: readonly T[];
  value: T;
  onSelect: (value: T) => void;
  maxHeightRatio?: number;
}) {
  return (
    <Sheet visible={visible} onClose={onClose} maxHeightRatio={maxHeightRatio} accessibilityLabel={title}>
      <SheetGrabber />
      <SheetHeader title={title} onClose={onClose} />
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.list} accessibilityRole="radiogroup">
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <Pressable
              key={opt}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => {
                onSelect(opt);
                onClose();
              }}
              style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceAlt }]}
            >
              <Text
                size={type.body}
                weight={selected ? 700 : 500}
                color={selected ? colors.textPrimary : colors.textSecondary}
              >
                {opt}
              </Text>
              <RadioDot selected={selected} />
            </Pressable>
          );
        })}
        <SheetBottomInset />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  list: { paddingTop: 6, paddingBottom: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
