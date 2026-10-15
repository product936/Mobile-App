import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowRight, ClipboardList } from 'lucide-react-native';

import { IconTile, layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import type { LeadSummary } from '@/lib/leadSummary';
import { StatusPill } from '@/sheets/lead-details/StatusField';
import { colors, radius, type } from '@/theme/tokens';

/** "Lead summary": where the lead stands, the customer's intent, interactions so far and the next step. */
export function LeadSummaryCard({ summary }: { summary: LeadSummary }) {
  return (
    <View style={styles.card} accessibilityLabel="Lead summary">
      <View style={[layout.row, { gap: 10, marginBottom: 14 }]}>
        <IconTile size={32} rounded={radius.md}>
          <ClipboardList size={16} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
        <Text size={type.headline} weight={700} color={colors.textPrimary} accessibilityRole="header">
          Lead summary
        </Text>
      </View>

      <Row label="Stage">
        <View style={{ alignSelf: 'flex-start' }}>
          <StatusPill status={summary.stage} />
        </View>
      </Row>
      <Row label="Intent">
        <Text size={type.callout} weight={600} color={colors.textPrimary}>
          {summary.intent ?? 'Not qualified yet'}
        </Text>
        {summary.intent ? (
          <Text size={type.footnote} color={colors.textTertiary}>
            Qualified by the AI bot
          </Text>
        ) : null}
      </Row>
      <Row label="Interactions">
        <Text size={type.callout} weight={600} color={colors.textPrimary}>
          {summary.total} so far
        </Text>
        <Text size={type.footnote} color={colors.textTertiary}>
          {summary.interactions}
        </Text>
      </Row>
      {summary.latest ? (
        <Row label="Latest">
          <Text size={type.callout} weight={600} color={colors.textPrimary}>
            {summary.latest.title}
          </Text>
          <Text size={type.footnote} color={colors.textTertiary}>
            {summary.latest.when}
          </Text>
        </Row>
      ) : null}

      <View style={styles.next}>
        <ArrowRight size={15} color={colors.primaryAccent} strokeWidth={2.4} />
        <Text size={type.subhead} weight={600} color={colors.textPrimary} style={layout.flex1}>
          Next step: {summary.nextStep}
        </Text>
      </View>
    </View>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.row}>
      <Text size={type.footnote} weight={600} color={colors.textTertiary} style={styles.label}>
        {label}
      </Text>
      <View style={[layout.flex1, { gap: 2 }]}>{children}</View>
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
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 8 },
  label: { width: 86, paddingTop: 2 },
  next: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    padding: 12,
    borderRadius: radius.input,
    backgroundColor: colors.blue50,
  },
});
