import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ImageIcon, Plus } from 'lucide-react-native';

import { BackHeader } from '@/components/chrome';
import { SegmentedTabs } from '@/components/controls';
import { PressableScale } from '@/components/PressableScale';
import { Screen, ScrollBody } from '@/components/Screen';
import { Text } from '@/components/Text';
import { MEDIA_COUNTS, MEDIA_TABS, MEDIA_TILE_GRADIENTS, type MediaTab } from '@/data/content';
import { useAppStore } from '@/state/store';
import { colors, radius, type } from '@/theme/tokens';

const GAP = 10;

export default function MediaScreen() {
  const [tab, setTab] = useState<MediaTab>('Cover');
  const [gridWidth, setGridWidth] = useState(0);
  const cellSize = gridWidth ? (gridWidth - GAP * 2) / 3 : 0;
  const openSheet = useAppStore((s) => s.openSheet);
  const tiles = Array.from({ length: MEDIA_COUNTS[tab] }, (_, i) => MEDIA_TILE_GRADIENTS[i % MEDIA_TILE_GRADIENTS.length]);

  return (
    <Screen>
      <BackHeader title="Manage media" />
      <ScrollBody contentStyle={{ paddingTop: 16, paddingBottom: 28 }}>
        <SegmentedTabs
          options={MEDIA_TABS.map((t) => ({ label: t, value: t }))}
          value={tab}
          onChange={setTab}
          style={{ marginBottom: 16 }}
        />
        <Text size={type.footnote} color={colors.textTertiary} style={{ marginBottom: 12 }}>
          Tap a tile to replace, or add a new image.
        </Text>
        <View style={styles.grid} onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}>
          <PressableScale pressedScale={0.97} accessibilityLabel="Add image" onPress={() => openSheet('upload')} style={[styles.cell, { width: cellSize }, styles.add]}>
            <Plus size={22} color={colors.primaryAccent} strokeWidth={2} />
            <Text size={type.caption} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
              Add
            </Text>
          </PressableScale>
          {tiles.map((g, i) => (
            <PressableScale
              key={`${tab}-${i}`}
              pressedScale={0.97}
              accessibilityLabel={`${tab} image ${i + 1}, replace`}
              onPress={() => openSheet('upload')}
              style={[styles.cell, { width: cellSize }]}
            >
              <LinearGradient colors={g} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tile}>
                <ImageIcon size={26} color="#93A3B8" strokeWidth={1.6} />
              </LinearGradient>
            </PressableScale>
          ))}
        </View>
      </ScrollBody>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  cell: { aspectRatio: 1, borderRadius: radius.lg },
  add: {
    backgroundColor: colors.blue50,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tile: {
    flex: 1,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
