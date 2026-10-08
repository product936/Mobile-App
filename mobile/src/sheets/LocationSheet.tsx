import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { CheckboxBox, Toggle } from '@/components/controls';
import { layout } from '@/components/primitives';
import { Sheet, SheetCloseButton, SheetFooter, SheetGrabber } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { STORE } from '@/config/roles';
import { LOCATION_FILTERS, type FilterLevel } from '@/data/locations';
import { useAppStore } from '@/state/store';
import { fontFamily } from '@/theme/fonts';
import { colors, radius, type } from '@/theme/tokens';

const TABS: { key: FilterLevel; label: string }[] = [
  { key: 'state', label: 'State' },
  { key: 'city', label: 'City' },
  { key: 'store', label: 'Store' },
];

/**
 * "Choose locations": everything starts unchecked. Picking any state, city or
 * store turns "All locations" off and selects that item; Apply closes.
 */
export function LocationSheet() {
  const visible = useAppStore((s) => s.sheet === 'location');
  const close = useAppStore((s) => s.closeSheet);
  const all = useAppStore((s) => s.locationAll);
  const selection = useAppStore((s) => s.locationSelection);
  const tab = useAppStore((s) => s.locationTab);
  const setTab = useAppStore((s) => s.setLocationTab);
  const toggleAll = useAppStore((s) => s.toggleAllLocations);
  const toggle = useAppStore((s) => s.toggleLocation);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const rows = (LOCATION_FILTERS[tab] as { name: string; count?: number; address?: string }[])
    .filter((r) => r.name.toLowerCase().includes(q))
    .map((r) => ({
      name: r.name,
      sub: tab === 'store' ? (r.address ?? '') : `${r.count} locations`,
      checked: all || selection[tab].includes(r.name),
    }));

  return (
    <Sheet visible={visible} onClose={close} heightRatio={0.86} accessibilityLabel="Choose locations">
      <SheetGrabber />
      <View style={styles.head}>
        <View style={[layout.row, { justifyContent: 'space-between' }]}>
          <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
            Choose locations
          </Text>
          <SheetCloseButton onPress={close} />
        </View>
        <View style={styles.allCard}>
          <View style={layout.flex1}>
            <Text size={type.callout} weight={700} color={colors.textPrimary}>
              All locations
            </Text>
            <Text size={type.footnote} color={colors.textTertiary}>
              {STORE.totalLocations} locations included
            </Text>
          </View>
          <Toggle value={all} onChange={toggleAll} label="All locations" />
        </View>
        <View style={styles.search}>
          <Search size={18} color={colors.textTertiary} strokeWidth={2} />
          <TextInput
            accessibilityLabel="Search locations"
            value={query}
            onChangeText={setQuery}
            placeholder="Search state, city or store"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.panes}>
        <View style={styles.leftPane} accessibilityRole="tablist">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <Pressable
                key={t.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  setTab(t.key);
                  setQuery('');
                }}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text size={type.callout} weight={active ? 700 : 600} color={active ? colors.primaryAccent : colors.textSecondary}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <ScrollView style={layout.flex1} keyboardShouldPersistTaps="handled">
          {rows.map((r) => (
            <Pressable
              key={r.name}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: r.checked }}
              accessibilityLabel={`${r.name}, ${r.sub}`}
              onPress={() => toggle(tab, r.name)}
              style={styles.row}
            >
              <CheckboxBox checked={r.checked} />
              <View style={layout.flex1}>
                <Text size={type.callout} weight={600} color={colors.textPrimary} numberOfLines={1}>
                  {r.name}
                </Text>
                <Text size={type.footnote} lineHeight={1.35} color={colors.textTertiary} style={{ marginTop: 1 }}>
                  {r.sub}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <SheetFooter paddingX={20}>
        <Button label="Apply" weight={600} onPress={close} />
      </SheetFooter>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  head: {
    paddingTop: 6,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  allCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    height: 44,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontFamily: fontFamily(400),
    fontSize: type.callout,
    color: colors.textPrimary,
    outlineStyle: 'none',
  } as object,
  panes: { flex: 1, minHeight: 0, flexDirection: 'row' },
  leftPane: {
    width: 104,
    borderRightWidth: 1,
    borderRightColor: colors.borderSubtle,
    backgroundColor: colors.surfaceBase,
  },
  tab: {
    height: 48,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  tabActive: { borderLeftColor: colors.primaryAccent, backgroundColor: colors.surfaceElevated },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
});
