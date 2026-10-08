import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Globe } from 'lucide-react-native';

import { BackHeader } from '@/components/chrome';
import { Card, SectionLabel, layout } from '@/components/primitives';
import { Screen, ScrollBody, Spacer } from '@/components/Screen';
import { Text } from '@/components/Text';
import { BUSINESS_PROFILE, OPENING_HOURS } from '@/data/content';
import { colors, radius, type } from '@/theme/tokens';

export default function BusinessProfileScreen() {
  const b = BUSINESS_PROFILE;
  return (
    <Screen>
      <BackHeader title="Business profile" />
      <ScrollBody contentStyle={{ paddingTop: 16, paddingBottom: 28 }}>
        <View style={[layout.row, { gap: 6, marginBottom: 8 }]}>
          <Globe size={15} color={colors.primaryAccent} strokeWidth={2} />
          <Text size={type.footnote} color={colors.textTertiary}>
            Synced with Google Business Profile
          </Text>
        </View>
        <Card style={{ overflow: 'hidden' }}>
          <Field label="Store name">
            <Value>{b.storeName}</Value>
          </Field>
          <Field label="Store address">
            <Value>{b.address}</Value>
          </Field>
          <Field label="Primary category">
            <Value>{b.primaryCategory}</Value>
          </Field>
          <Field label="Additional categories" gap={6}>
            <View style={styles.tags}>
              {b.additionalCategories.map((c) => (
                <View key={c} style={styles.tag}>
                  <Text size={type.footnote} weight={600} color={colors.textSecondary} lineHeight={1.2}>
                    {c}
                  </Text>
                </View>
              ))}
            </View>
          </Field>
          <Field label="Description">
            <Text size={type.callout} lineHeight={1.5} color={colors.textSecondary}>
              {b.description}
            </Text>
          </Field>
          <Field label="Phone number">
            <Value>{b.phone}</Value>
          </Field>
          <Field label="Website" last>
            <Value color={colors.primaryAccent}>{b.website}</Value>
          </Field>
        </Card>

        <Spacer h={20} />
        <SectionLabel style={{ marginBottom: 10 }}>Opening hours</SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          {OPENING_HOURS.map(([day, hours], i) => (
            <View key={day} style={[styles.hoursRow, i < OPENING_HOURS.length - 1 && styles.divider]}>
              <Text size={type.callout} weight={600} color={colors.textPrimary}>
                {day}
              </Text>
              <Text size={type.callout} color={colors.textSecondary}>
                {hours}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollBody>
    </Screen>
  );
}

function Field({ label, children, last, gap = 3 }: { label: string; children: ReactNode; last?: boolean; gap?: number }) {
  return (
    <View style={[styles.field, !last && styles.divider]}>
      <Text size={type.caption} weight={700} tracking={0.06} uppercase color={colors.textTertiary} style={{ marginBottom: gap }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function Value({ children, color = colors.textPrimary }: { children: string; color?: string }) {
  return (
    <Text size={type.callout} weight={600} color={color}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  field: { paddingVertical: 14, paddingHorizontal: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    justifyContent: 'center',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
});
