import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image as ImageIcon, Plus } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { BackHeader } from '@/components/chrome';
import { Card, Pill, layout } from '@/components/primitives';
import { Screen, ScrollBody } from '@/components/Screen';
import { StickyFooterButton } from '@/components/StickyFooterButton';
import { Text } from '@/components/Text';
import { POSTS, type Post } from '@/data/content';
import { colors, radius, shadows, type } from '@/theme/tokens';

const KIND_COLORS: Record<Post['kind'], { bg: string; fg: string }> = {
  OFFER: { bg: colors.amberTile, fg: colors.amber700 },
  UPDATE: { bg: colors.blue50, fg: colors.primaryAccent },
  EVENT: { bg: colors.violet100, fg: colors.violet600 },
};

export default function PostsScreen() {
  return (
    <Screen>
      <BackHeader title="Posts & offers" />
      <ScrollBody contentStyle={{ paddingTop: 16, paddingBottom: 90, gap: 12 }}>
        {POSTS.map((p) => (
          <Card key={p.id} style={styles.card}>
            <LinearGradient colors={p.tile} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.thumb}>
              <ImageIcon size={22} color="#93A3B8" strokeWidth={1.6} />
            </LinearGradient>
            <View style={layout.flex1}>
              <View style={[layout.row, { gap: 6 }]}>
                <Pill label={p.kind} height={20} fontSize={10} background={KIND_COLORS[p.kind].bg} color={KIND_COLORS[p.kind].fg} />
                <Pill
                  label={p.live ? 'Live' : 'Ended'}
                  height={20}
                  fontSize={10}
                  background={p.live ? colors.successBg : colors.surfaceBase}
                  color={p.live ? colors.success : colors.textTertiary}
                />
              </View>
              <Text size={type.callout} weight={700} color={colors.textPrimary} style={{ marginTop: 6 }}>
                {p.title}
              </Text>
              <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 2 }}>
                {p.meta}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollBody>
      <StickyFooterButton>
        <Button label="Create post" style={{ boxShadow: shadows.stickyButton }} iconLeft={<Plus size={18} color={colors.white} strokeWidth={2.2} />} />
      </StickyFooterButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, padding: 14 },
  thumb: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
});
