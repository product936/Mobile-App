import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { CheckboxBox, Chip } from '@/components/controls';
import { layout } from '@/components/primitives';
import { RangeSlider } from '@/components/RangeSlider';
import { Sheet, SheetFooter, SheetGrabber, SheetHeader } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { DEFAULT_REVIEW_FILTERS, useAppStore, type ReviewFilters } from '@/state/store';
import { colors, type } from '@/theme/tokens';

const SENTIMENTS: ReviewFilters['sentiment'][] = ['All', 'Positive', 'Neutral', 'Negative'];
const RATING_TYPES: ReviewFilters['ratingType'][] = ['Both', 'Rating with text', 'Rating without text'];
const STATUSES: ReviewFilters['status'][] = ['Both', 'Replied', 'Unreplied'];

/** Review filters. Edits are a draft until "Apply Filters"; "Reset" restores the defaults. */
export function ReviewFilterSheet() {
  const visible = useAppStore((s) => s.sheet === 'reviewFilter');
  const close = useAppStore((s) => s.closeSheet);
  const applied = useAppStore((s) => s.reviewFilters);
  const apply = useAppStore((s) => s.setReviewFilters);
  const [draft, setDraft] = useState<ReviewFilters>(applied);

  useEffect(() => {
    if (visible) setDraft(applied);
  }, [visible, applied]);

  const patch = (p: Partial<ReviewFilters>) => setDraft((d) => ({ ...d, ...p }));

  return (
    <Sheet visible={visible} onClose={close} maxHeightRatio={0.92} accessibilityLabel="Review filters">
      <SheetGrabber />
      <SheetHeader title="Filters" onClose={close} paddingX={22} />
      <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.body}>
        <Label>Rating range</Label>
        <RangeSlider
          min={1}
          max={5}
          low={draft.ratingMin}
          high={draft.ratingMax}
          onChange={(ratingMin, ratingMax) => patch({ ratingMin, ratingMax })}
          label={(v) => `${v} stars`}
        />
        <View style={styles.rangeLabels}>
          <Text size={type.footnote} weight={600}>
            {draft.ratingMin}★
          </Text>
          <Text size={type.footnote} weight={600}>
            {draft.ratingMax}★
          </Text>
        </View>

        <Label>Sentiment</Label>
        <ChipGroup options={SENTIMENTS} value={draft.sentiment} onChange={(sentiment) => patch({ sentiment })} />
        <Label>Rating type</Label>
        <ChipGroup options={RATING_TYPES} value={draft.ratingType} onChange={(ratingType) => patch({ ratingType })} />
        <Label>Review status</Label>
        <ChipGroup options={STATUSES} value={draft.status} onChange={(status) => patch({ status })} />

        <CheckRow
          checked={draft.showRemoved}
          onPress={() => patch({ showRemoved: !draft.showRemoved })}
          title="Show removed from Google"
          sub="Taken down by Google."
        />
        <CheckRow
          checked={draft.editedOnly}
          onPress={() => patch({ editedOnly: !draft.editedOnly })}
          title="Edited reviews"
          sub="Edited after posting."
        />
      </ScrollView>
      <SheetFooter style={[layout.row, { gap: 10 }]}>
        <Button label="Reset" variant="soft" style={{ flex: 2 }} onPress={() => setDraft(DEFAULT_REVIEW_FILTERS)} />
        <Button
          label="Apply Filters"
          style={{ flex: 3 }}
          onPress={() => {
            apply(draft);
            close();
          }}
        />
      </SheetFooter>
    </Sheet>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <Text size={type.subhead} weight={700} color={colors.textSecondary} style={{ marginBottom: 10 }}>
      {children}
    </Text>
  );
}

function ChipGroup<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.chips}>
      {options.map((o) => (
        <Chip key={o} label={o} selected={o === value} onPress={() => onChange(o)} />
      ))}
    </View>
  );
}

function CheckRow({ checked, onPress, title, sub }: { checked: boolean; onPress: () => void; title: string; sub: string }) {
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={onPress} style={styles.checkRow}>
      <View style={{ marginTop: 1 }}>
        <CheckboxBox checked={checked} />
      </View>
      <View style={layout.flex1}>
        <Text size={type.callout} weight={700} color={colors.textPrimary}>
          {title}
        </Text>
        <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 2 }}>
          {sub}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: { paddingTop: 16, paddingHorizontal: 22, paddingBottom: 20 },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginBottom: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 12 },
});
