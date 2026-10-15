import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PhoneCall, X } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/controls';
import { Dialog } from '@/components/Dialog';
import { FieldLabel, NotesField } from '@/components/fields';
import { IconTile, layout } from '@/components/primitives';
import { Select } from '@/components/Select';
import { Text } from '@/components/Text';
import { CALL_NOTES_MAX, CALL_OUTCOMES, CALLERS, type Caller, type CallOutcome } from '@/lib/calls';
import { colors, radius, shadows, type } from '@/theme/tokens';

export type CallNote = { by: Caller; outcome: CallOutcome; notes: string };

const CALLER_OPTIONS = CALLERS.map((c) => ({ value: c.id, label: c.label }));

/**
 * A note against a call back: its status (called by the AI bot or by the
 * store manager), the outcome, and free-text notes on what happened. Opens from "Call back"
 * and from "Add note" in Customer history. Closing or tapping outside saves
 * nothing.
 */
export function CallOutcomeDialog({
  visible,
  number,
  initial,
  onDismiss,
  onSave,
}: {
  visible: boolean;
  /** Number shown to the user, e.g. "98551 35120". */
  number: string;
  /** Prefills the fields: who called, and an existing note when editing one. */
  initial: { by: Caller; outcome?: CallOutcome; notes?: string };
  onDismiss: () => void;
  onSave: (note: CallNote) => void;
}) {
  const [by, setBy] = useState<Caller>(initial.by);
  const [byOpen, setByOpen] = useState(false);
  const [outcome, setOutcome] = useState<CallOutcome | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!visible) return;
    setBy(initial.by);
    setByOpen(false);
    setOutcome(initial.outcome ?? null);
    setNotes(initial.notes ?? '');
  }, [visible]); // Prefill only when the dialog opens.

  return (
    <Dialog visible={visible} onDismiss={onDismiss} horizontalInset={16} role="none" style={styles.card}>
      <View style={styles.header}>
        <IconTile size={48} rounded={radius.full}>
          <PhoneCall size={22} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
        <View style={layout.flex1}>
          <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
            What happened on the call?
          </Text>
          <Text size={type.callout} color={colors.textTertiary} style={{ marginTop: 2 }}>
            Add a note against the call to {number.replace(/ /g, "\u00A0")} so the team knows where this lead stands.
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onDismiss} style={styles.close} hitSlop={6}>
          <X size={18} color={colors.textSecondary} strokeWidth={2.2} />
        </Pressable>
      </View>

      <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <FieldLabel>Call status</FieldLabel>
        <Select
          label="Call status"
          value={by}
          options={CALLER_OPTIONS}
          open={byOpen}
          onToggle={() => setByOpen((o) => !o)}
          onChange={(v) => {
            setBy(v);
            setByOpen(false);
          }}
        />

        <View style={{ marginTop: 18 }}>
          <FieldLabel>Call outcome</FieldLabel>
          <View style={styles.outcomes} accessibilityRole="radiogroup" accessibilityLabel="Call outcome">
            {CALL_OUTCOMES.map((o) => (
              <Chip key={o.id} label={o.label} selected={o.id === outcome} onPress={() => setOutcome(o.id)} />
            ))}
          </View>
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
      </ScrollView>

      <Button
        label="Save call note"
        disabled={!outcome}
        onPress={() => outcome && onSave({ by, outcome, notes: notes.trim() })}
        style={{ marginTop: 14 }}
      />
      {!outcome ? (
        <Text size={type.footnote} color={colors.textTertiary} align="center" style={{ marginTop: 8 }}>
          Pick a call outcome to save.
        </Text>
      ) : null}
    </Dialog>
  );
}

const styles = StyleSheet.create({
  card: { maxWidth: 420, maxHeight: '92%', borderRadius: 24, padding: 20, boxShadow: shadows.xl },
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
