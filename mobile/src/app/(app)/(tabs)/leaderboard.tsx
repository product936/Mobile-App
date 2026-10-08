import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ChevronRight, Search } from 'lucide-react-native';

import { PageHeader } from '@/components/chrome';
import { Chip, SegmentedTabs } from '@/components/controls';
import { Card, SectionLabel, layout } from '@/components/primitives';
import { Screen, ScrollBody, Spacer } from '@/components/Screen';
import { Text } from '@/components/Text';
import { buildLeaderboard, resolveLevelJump, type LbLevel, type LbMetric } from '@/lib/leaderboard';
import { useRoleConfig } from '@/state/store';
import { fontFamily } from '@/theme/fonts';
import { colors, radius, type } from '@/theme/tokens';

const METRICS: { label: string; value: LbMetric }[] = [
  { label: 'Calls', value: 'Calls' },
  { label: 'Forms', value: 'Forms' },
  { label: 'Reviews', value: 'Reviews' },
];

const LEVELS: { label: string; value: LbLevel }[] = [
  { label: 'State', value: 'state' },
  { label: 'Cities', value: 'city' },
  { label: 'Locations', value: 'location' },
];

export default function LeaderboardScreen() {
  const { leaderboardSubtitle } = useRoleConfig();
  const [level, setLevel] = useState<LbLevel>('state');
  const [stateName, setStateName] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [metric, setMetric] = useState<LbMetric>('Calls');
  const [query, setQuery] = useState('');

  const view = useMemo(
    () => buildLeaderboard({ level, stateName, cityName, metric, query }),
    [level, stateName, cityName, metric, query],
  );

  const drill = (name: string) => {
    if (level === 'state') {
      setStateName(name);
      setLevel('city');
    } else if (level === 'city') {
      setCityName(name);
      setLevel('location');
    }
  };

  const jumpTo = (next: LbLevel) => {
    const resolved = resolveLevelJump(next, stateName, cityName);
    setStateName(resolved.stateName);
    setCityName(resolved.cityName);
    setLevel(next);
  };

  return (
    <Screen>
      <ScrollBody>
        <PageHeader title="Leaderboard" subtitle={leaderboardSubtitle} />
        <Spacer h={16} />

        <View style={styles.crumbs} accessibilityRole="toolbar">
          <Crumb
            label="States"
            onPress={() => {
              setLevel('state');
              setStateName(null);
              setCityName(null);
            }}
          />
          {level !== 'state' && stateName ? (
            <>
              <ChevronRight size={13} color={colors.textTertiary} strokeWidth={2.2} />
              <Crumb
                label={stateName}
                onPress={() => {
                  setLevel('city');
                  setCityName(null);
                }}
              />
            </>
          ) : null}
          {level === 'location' && cityName ? (
            <>
              <ChevronRight size={13} color={colors.textTertiary} strokeWidth={2.2} />
              <Text size={type.subhead} weight={600} color={colors.textTertiary}>
                {cityName}
              </Text>
            </>
          ) : null}
        </View>

        <SegmentedTabs options={METRICS} value={metric} onChange={setMetric} style={{ marginBottom: 14 }} />

        <View style={styles.search}>
          <Search size={18} color={colors.textTertiary} strokeWidth={2} />
          <TextInput
            accessibilityLabel="Search leaderboard"
            value={query}
            onChangeText={setQuery}
            placeholder="Search state, city or location"
            placeholderTextColor={colors.textTertiary}
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        <View style={[layout.row, { gap: 8, marginBottom: 16 }]}>
          {LEVELS.map((l) => (
            <Chip key={l.value} label={l.label} selected={level === l.value} onPress={() => jumpTo(l.value)} />
          ))}
        </View>

        <View style={[layout.row, { gap: 10, marginBottom: 20 }]}>
          <Card style={styles.topCard}>
            <Text size={26} weight={800} lineHeight={1} color={colors.textPrimary}>
              {view.card1.value}
            </Text>
            <Text size={type.subhead} color={colors.textTertiary} style={{ marginTop: 6 }}>
              {view.card1.label}
            </Text>
          </Card>
          <Card style={styles.topCard}>
            <Text size={26} weight={800} lineHeight={1} color={view.card2.alarming ? colors.error : colors.textPrimary}>
              {view.card2.value}
            </Text>
            <Text size={type.subhead} color={colors.textTertiary} style={{ marginTop: 6 }}>
              {view.card2.label}
            </Text>
          </Card>
        </View>

        <SectionLabel style={{ marginBottom: 10 }}>{view.listLabel}</SectionLabel>

        {view.rows.map((row) => (
          <Pressable
            key={row.name}
            accessibilityRole={row.drillable ? 'button' : undefined}
            accessibilityLabel={`Rank ${row.rank}, ${row.name}, ${row.big} ${view.bigLabel.toLowerCase()}`}
            disabled={!row.drillable}
            onPress={() => drill(row.name)}
          >
            <Card style={styles.row}>
              <View style={styles.rank}>
                <Text size={13} weight={700} color={colors.textSecondary} lineHeight={1.1}>
                  {row.rank}
                </Text>
              </View>
              <View style={layout.flex1}>
                <Text size={type.headline} weight={700} color={colors.textPrimary} numberOfLines={1}>
                  {row.name}
                </Text>
                <Text size={type.footnote} color={colors.textTertiary} numberOfLines={1} style={{ marginTop: 2 }}>
                  {row.sub}
                </Text>
              </View>
              <View style={styles.bigCol}>
                <Text size={22} weight={700} lineHeight={1} color={row.alarming ? colors.error : colors.textTertiary} align="right">
                  {row.big}
                </Text>
                <Text size={9} weight={700} tracking={0.06} color={colors.textTertiary} align="right" style={{ marginTop: 2 }}>
                  {view.bigLabel}
                </Text>
              </View>
              <View style={styles.chevSlot}>
                {row.drillable ? <ChevronRight size={18} color={colors.textTertiary} strokeWidth={2.2} /> : null}
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollBody>
    </Screen>
  );
}

function Crumb({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8}>
      <Text size={type.subhead} weight={600} color={colors.primaryAccent}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  crumbs: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.full,
    marginBottom: 16,
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
  topCard: { flex: 1, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 10 },
  rank: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCol: { width: 62 },
  chevSlot: { width: 18, alignItems: 'center', justifyContent: 'center' },
});
