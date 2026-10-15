import { StyleSheet, View } from 'react-native';
import { ClipboardList } from 'lucide-react-native';

import { IconTile, layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { colors, radius, type } from '@/theme/tokens';

/** "Lead summary": a short, conversational read of the lead. */
export function LeadSummaryCard({ summary }: { summary: string }) {
  return (
    <View style={styles.card}>
      <View style={[layout.row, { gap: 10, marginBottom: 10 }]}>
        <IconTile size={30} rounded={radius.md}>
          <ClipboardList size={15} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
        <Text size={type.headline} weight={700} color={colors.textPrimary} accessibilityRole="header">
          Lead summary
        </Text>
      </View>
      <Text size={type.callout} color={colors.textSecondary} lineHeight={1.5}>
        {summary}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
});
