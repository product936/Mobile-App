import { StyleSheet, View } from 'react-native';

import { Select } from '@/components/Select';
import { Text } from '@/components/Text';
import { EDITABLE_LEAD_STATUSES, type LeadStatus } from '@/data/leads';
import { leadStatusTint } from '@/lib/format';
import { radius, type } from '@/theme/tokens';

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

const STATUS_OPTIONS = EDITABLE_LEAD_STATUSES.map((s) => ({ value: s, label: s }));

/** The lead's status as a dropdown. */
export function StatusSelect(props: {
  value: LeadStatus;
  open: boolean;
  onToggle: () => void;
  onChange: (status: LeadStatus) => void;
}) {
  return <Select label="Status" options={STATUS_OPTIONS} {...props} />;
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
});
