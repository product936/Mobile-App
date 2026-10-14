import { Pressable, StyleSheet, View } from 'react-native';
import { FileText, MessageSquare, Pause, Phone, Play, ShoppingBag, type LucideIcon } from 'lucide-react-native';

import { PressableScale } from '@/components/PressableScale';
import { layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { CUSTOMER_HISTORY, type CustomerEvent } from '@/data/content';
import { usePlayback } from '@/lib/usePlayback';
import { colors, radius, type } from '@/theme/tokens';

const KIND: Record<CustomerEvent['kind'], { Icon: LucideIcon; bg: string; fg: string; size: number }> = {
  purchase: { Icon: ShoppingBag, bg: colors.amber100, fg: colors.amber700, size: 16 },
  call: { Icon: Phone, bg: colors.blue50, fg: colors.primaryAccent, size: 15 },
  chat: { Icon: MessageSquare, bg: colors.successBg, fg: colors.success, size: 15 },
  form: { Icon: FileText, bg: '#EEF0FF', fg: colors.primaryDeep, size: 15 },
};

/** Timeline of the customer's past interactions with the store, newest first. */
export function CustomerHistory({ events = CUSTOMER_HISTORY }: { events?: CustomerEvent[] }) {
  return (
    <View style={{ marginTop: 26 }}>
      <Text size={type.subhead} weight={600} color={colors.textSecondary} style={{ marginBottom: 14 }} accessibilityRole="header">
        Customer history
      </Text>
      {events.map((e, i) => {
        const k = KIND[e.kind];
        const last = i === events.length - 1;
        return (
          <View key={e.id} style={[layout.row, { alignItems: 'stretch', gap: 12 }]}>
            <View style={styles.rail}>
              <View style={[styles.icon, { backgroundColor: k.bg }]}>
                <k.Icon size={k.size} color={k.fg} strokeWidth={2} />
              </View>
              {!last ? <View style={styles.line} /> : null}
            </View>
            <View style={[layout.flex1, !last && { paddingBottom: 20 }]}>
              <Text size={type.callout} color={colors.textPrimary}>
                {e.parts.map((p, j) => (
                  <Text key={j} size={type.callout} weight={p.bold ? 700 : 400} color={colors.textPrimary}>
                    {p.text}
                  </Text>
                ))}
              </Text>
              <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 2 }}>
                {e.meta}
              </Text>
              {e.recordingSeconds ? <Recording duration={e.recordingSeconds} /> : null}
              {e.action ? (
                <PressableScale pressedScale={0.96} accessibilityLabel={e.action} style={styles.action}>
                  <Text size={type.footnote} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
                    {e.action}
                  </Text>
                </PressableScale>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function Recording({ duration }: { duration: number }) {
  const { playing, toggle, progress, label } = usePlayback(duration);
  return (
    <View style={styles.player}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause recording' : 'Play recording'}
        onPress={toggle}
        style={styles.playBtn}
      >
        {playing ? (
          <Pause size={12} color={colors.white} fill={colors.white} strokeWidth={0} />
        ) : (
          <Play size={12} color={colors.white} fill={colors.white} strokeWidth={0} />
        )}
      </Pressable>
      <View style={styles.track} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: duration, now: Math.round(progress * duration) }}>
        <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
      <Text size={type.footnote} weight={600} color={colors.textSecondary}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { width: 32, alignItems: 'center' },
  icon: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, width: 2, backgroundColor: colors.borderDefault, marginVertical: 4 },
  action: {
    alignSelf: 'flex-start',
    marginTop: 10,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    justifyContent: 'center',
  },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    height: 40,
    paddingLeft: 6,
    paddingRight: 12,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  playBtn: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { flex: 1, height: 4, borderRadius: radius.full, backgroundColor: colors.borderDefault, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.full, backgroundColor: colors.primaryAccent },
});
