import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { ChevronRight, Phone, PhoneMissed, Search, Star, UserPlus, X } from 'lucide-react-native';

import { DropdownPill, FilterIconButtons, PageHeader } from '@/components/chrome';
import { FlameGlyph } from '@/components/glyphs';
import { PressableScale } from '@/components/PressableScale';
import { Card, IconTile, layout } from '@/components/primitives';
import { Screen, ScrollBody, Spacer } from '@/components/Screen';
import { Text } from '@/components/Text';
import type { Lead } from '@/data/leads';
import { leadStatusColor } from '@/lib/format';
import { dialableNumber, filterLeads, leadPresentation, searchLeads } from '@/lib/leads';
import { useAppStore, useLeads } from '@/state/store';
import { fontFamily } from '@/theme/fonts';
import { colors, radius, shadows, sizes, type } from '@/theme/tokens';

export default function LeadsScreen() {
  const leads = useLeads();
  const status = useAppStore((s) => s.leadStatus);
  const source = useAppStore((s) => s.leadSource);
  const openSheet = useAppStore((s) => s.openSheet);
  const openAddLead = useAppStore((s) => s.openAddLead);
  const [query, setQuery] = useState('');
  const rows = searchLeads(filterLeads(leads, status, source), query);
  const searching = query.trim().length > 0;

  return (
    <Screen>
      <ScrollBody contentStyle={{ paddingBottom: 96 }}>
        <PageHeader title="Leads" subtitle="Every enquiry, whatever brought it in" />
        <Spacer h={16} />
        <View style={styles.search}>
          <Search size={18} color={colors.textTertiary} strokeWidth={2} />
          <TextInput
            accessibilityLabel="Search leads by name or number"
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name or number"
            placeholderTextColor={colors.textTertiary}
            returnKeyType="search"
            autoCorrect={false}
            style={styles.searchInput}
          />
          {searching ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={8} style={styles.clear}>
              <X size={14} color={colors.textSecondary} strokeWidth={2.4} />
            </Pressable>
          ) : null}
        </View>
        <Spacer h={12} />
        <View style={[layout.row, { gap: 8 }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={layout.flex1} contentContainerStyle={{ gap: 8 }}>
            <DropdownPill label={status} onPress={() => openSheet('status')} />
            <DropdownPill label={source} onPress={() => openSheet('source')} />
          </ScrollView>
          <FilterIconButtons />
        </View>
        <Spacer h={16} />

        {rows.map((lead) => (
          <LeadRow key={lead.id} lead={lead} />
        ))}
        {rows.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Text size={type.callout} color={colors.textTertiary} align="center">
              {searching ? `No leads match "${query.trim()}".` : 'No leads match these filters.'}
            </Text>
            {searching ? (
              <Pressable accessibilityRole="button" onPress={() => setQuery('')} hitSlop={8} style={{ marginTop: 8 }}>
                <Text size={type.callout} weight={700} color={colors.primaryAccent}>
                  Clear search
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScrollBody>

      <PressableScale pressedScale={0.95} accessibilityLabel="Add lead" onPress={() => openAddLead('form')} style={styles.fab}>
        <UserPlus size={24} color={colors.white} strokeWidth={2.2} />
      </PressableScale>
    </Screen>
  );
}

function LeadRow({ lead }: { lead: Lead }) {
  const openLeadDetail = useAppStore((s) => s.openLeadDetail);
  const openAddLead = useAppStore((s) => s.openAddLead);
  const p = leadPresentation(lead);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${p.title}, ${lead.status}, ${lead.time}. Open lead details`}
      onPress={() => openLeadDetail(lead.id)}
    >
      <Card style={styles.row}>
        <IconTile size={44} background={p.missed ? colors.red100 : colors.blue50}>
          {p.missed ? (
            <PhoneMissed size={21} color={colors.error} strokeWidth={2} />
          ) : (
            <Phone size={21} color={colors.primaryAccent} strokeWidth={2} />
          )}
        </IconTile>
        <View style={layout.flex1}>
          <View style={[layout.row, { gap: 8 }]}>
            <Text
              size={type.headline}
              weight={p.missed ? 800 : 700}
              color={p.missed ? colors.error : colors.textPrimary}
              numberOfLines={1}
              style={{ flexShrink: 1 }}
            >
              {p.title}
            </Text>
            {lead.hot ? (
              <View style={styles.hot}>
                <FlameGlyph />
                <Text size={10} weight={700} color={colors.amber700} lineHeight={1.1}>
                  Hot lead
                </Text>
              </View>
            ) : null}
          </View>
          <View style={[layout.row, { gap: 7, marginTop: 3 }]}>
            <Text size={type.subhead} weight={600} color={leadStatusColor(lead.status)}>
              {lead.status}
            </Text>
            <View style={styles.dot} />
            <Text size={type.subhead} color={colors.textTertiary}>
              {lead.time}
            </Text>
            <ChevronRight size={13} color={colors.textTertiary} strokeWidth={2.4} />
          </View>
        </View>
        {p.converted ? (
          <PressableScale pressedScale={0.94} accessibilityLabel="Request review" onPress={() => openAddLead('review')} style={styles.action}>
            <Star size={18} color={colors.starAmber} fill={colors.starAmber} strokeWidth={1.4} />
          </PressableScale>
        ) : (
          <PressableScale
            pressedScale={0.94}
            accessibilityLabel="Call back"
            onPress={() => Linking.openURL(`tel:${dialableNumber(lead.number).replace(/\s/g, '')}`)}
            style={styles.action}
          >
            <Phone size={19} color={colors.primaryAccent} strokeWidth={2} />
          </PressableScale>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: sizes.inputH,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.surfaceElevated,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: fontFamily(500),
    fontSize: type.callout,
    color: colors.textPrimary,
    outlineStyle: 'none',
  } as object,
  clear: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 10 },
  hot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 19,
    paddingHorizontal: 7,
    borderRadius: radius.full,
    backgroundColor: colors.amber100,
  },
  dot: { width: 4, height: 4, borderRadius: radius.full, backgroundColor: colors.textTertiary },
  action: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 54,
    height: 54,
    borderRadius: radius.full,
    backgroundColor: colors.primaryAccent,
    boxShadow: shadows.fab,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
