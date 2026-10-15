import { Pressable, StyleSheet, View } from 'react-native';
import {
  BadgeCheck,
  Bot,
  FileText,
  Pause,
  PhoneCall,
  PhoneMissed,
  PhoneOutgoing,
  Play,
  Store,
  type LucideIcon,
} from 'lucide-react-native';

import { PressableScale } from '@/components/PressableScale';
import { layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { callOutcome, type JourneyStep } from '@/lib/calls';
import { usePlayback } from '@/lib/usePlayback';
import { colors, radius, type } from '@/theme/tokens';

const KIND: Record<JourneyStep['kind'], { Icon: LucideIcon; bg: string; fg: string }> = {
  missed: { Icon: PhoneMissed, bg: colors.red100, fg: colors.error },
  form: { Icon: FileText, bg: colors.indigo50, fg: colors.primaryDeep },
  walkin: { Icon: Store, bg: colors.amber100, fg: colors.amber700 },
  ai: { Icon: Bot, bg: colors.violet100, fg: colors.violet600 },
  manager: { Icon: PhoneCall, bg: colors.blue50, fg: colors.primaryAccent },
  pending: { Icon: PhoneOutgoing, bg: colors.surfaceElevated, fg: colors.textTertiary },
};

/**
 * The lead's journey, newest first. Logged calls show their outcome next to
 * the title and open their note with "View note" (or "Add note" when it has
 * none). The AI bot's own call back is read-only.
 */
export function CustomerHistory({ steps, onAddNote }: { steps: JourneyStep[]; onAddNote: (step: JourneyStep) => void }) {
  return (
    <View style={{ marginTop: 26 }}>
      <View style={styles.titleRow}>
        <Text size={type.subhead} weight={600} color={colors.textSecondary} accessibilityRole="header">
          Customer history
        </Text>
        <Text size={type.footnote} color={colors.textTertiary}>
          Newest first
        </Text>
      </View>
      {steps.map((step, i) => {
        const k = KIND[step.kind];
        const last = i === steps.length - 1;
        const pending = step.kind === 'pending';
        const note = step.log?.notes;
        const action = pending ? 'Add call note' : step.log ? (note ? 'View note' : 'Add note') : null;
        return (
          <View key={step.id} style={[layout.row, { alignItems: 'stretch', gap: 12 }]}>
            <View style={styles.rail}>
              <View style={[styles.icon, { backgroundColor: k.bg }, pending && styles.iconPending]}>
                <k.Icon size={15} color={k.fg} strokeWidth={2} />
              </View>
              {!last ? <View style={styles.line} /> : null}
            </View>
            <View style={[layout.flex1, !last && { paddingBottom: 20 }]}>
              <View style={styles.titleLine}>
                <Text size={type.callout} weight={600} color={pending ? colors.textSecondary : colors.textPrimary}>
                  {step.title}
                </Text>
                {step.log ? (
                  <View style={styles.outcome} accessibilityLabel={`Call outcome: ${callOutcome(step.log.outcome).label}`}>
                    <Text size={type.caption} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
                      {callOutcome(step.log.outcome).label}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 2 }}>
                {step.meta}
              </Text>

              {step.intent ? (
                <View style={styles.tags}>
                  {step.intent ? (
                    <View style={[styles.tag, styles.tagIntent]}>
                      <BadgeCheck size={13} color={colors.success} strokeWidth={2.2} />
                      <Text size={type.footnote} weight={600} color={colors.textSecondary} lineHeight={1.2}>
                        Intent qualified:{' '}
                        <Text size={type.footnote} weight={700} color={colors.textPrimary} lineHeight={1.2}>
                          {step.intent}
                        </Text>
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : null}

              {step.recordingSeconds ? <Recording duration={step.recordingSeconds} /> : null}

              {action ? (
                <PressableScale
                  pressedScale={0.96}
                  accessibilityLabel={`${action}: ${step.title}`}
                  onPress={() => onAddNote(step)}
                  style={styles.action}
                >
                  <Text size={type.footnote} weight={700} color={colors.primaryAccent} lineHeight={1.2}>
                    {action}
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
  titleRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 },
  rail: { width: 32, alignItems: 'center' },
  icon: { width: 32, height: 32, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  iconPending: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.borderDefault },
  titleLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: 8, rowGap: 4 },
  outcome: {
    height: 22,
    paddingHorizontal: 8,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    justifyContent: 'center',
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  tagIntent: { backgroundColor: colors.successBg, borderColor: colors.successBorder },
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
