import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PhoneCall, X } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/controls';
import { Dialog } from '@/components/Dialog';
import { FieldLabel, NotesField } from '@/components/fields';
import { IconTile, layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { CALL_NOTES_MAX, CALL_OUTCOMES, type CallOutcome } from '@/lib/calls';
import { colors, radius, shadows, type } from '@/theme/tokens';

/**
 * Opens with "Call back" in Lead details: the call's status (required) and
 * optional notes about the call. Closing or tapping outside logs nothing.
 */
export function CallOutcomeDialog({
  visible,
  number,
  onDismiss,
  onSave,
}: {
  visible: boolean;
  /** Number shown to the user, e.g. "98551 35120". */
  number: string;
  onDismiss: () => void;
  onSave: (outcome: CallOutcome, notes: string) => void;
}) {
  const [outcome, setOutcome] = useState<CallOutcome | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!visible) return;
    setOutcome(null);
    setNotes('');
  }, [visible]);

  return (
    <Dialog visible={visible} onDismiss={onDismiss} horizontalInset={16} role="none" style={styles.card}>
      <View style={styles.header}>
        <IconTile size={48} rounded={radius.full}>
          <PhoneCall size={22} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
        <View style={layout.flex1}>
          <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
            How did the call go?
          </Text>
          <Text size={type.callout} color={colors.textTertiary} style={{ marginTop: 2 }}>
            Log your call to {number} so the team knows where this lead stands.
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onDismiss} style={styles.close} hitSlop={6}>
          <X size={18} color={colors.textSecondary} strokeWidth={2.2} />
        </Pressable>
      </View>

      <FieldLabel>Call status</FieldLabel>
      <View style={styles.outcomes} accessibilityRole="radiogroup" accessibilityLabel="Call status">
        {CALL_OUTCOMES.map((o) => (
          <Chip key={o.id} label={o.label} selected={o.id === outcome} onPress={() => setOutcome(o.id)} />
        ))}
      </View>

      <View style={{ marginTop: 18 }}>
        <FieldLabel optional>Call notes</FieldLabel>
        <NotesField
          accessibilityLabel="Call notes, optional"
          value={notes}
          onChangeText={(t) => setNotes(t.slice(0, CALL_NOTES_MAX))}
          maxLength={CALL_NOTES_MAX}
          placeholder="What did you discuss? Models of interest, budget, next steps."
          minHeight={96}
        />
        <Text size={type.footnote} color={colors.textTertiary} align="right" style={{ marginTop: 6 }}>
          {notes.length}/{CALL_NOTES_MAX}
        </Text>
      </View>

      <Button
        label="Save call"
        disabled={!outcome}
        onPress={() => outcome && onSave(outcome, notes)}
        style={{ marginTop: 14 }}
      />
      {!outcome ? (
        <Text size={type.footnote} color={colors.textTertiary} align="center" style={{ marginTop: 8 }}>
          Pick a call status to save.
        </Text>
      ) : null}
    </Dialog>
  );
}

const styles = StyleSheet.create({
  card: { maxWidth: 420, borderRadius: 24, padding: 20, boxShadow: shadows.xl },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  close: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outcomes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
