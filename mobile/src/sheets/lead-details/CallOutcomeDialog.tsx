import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PhoneCall, X } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { FieldLabel, NotesField } from '@/components/fields';
import { IconTile, layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { CALL_NOTES_MAX } from '@/lib/calls';
import { colors, radius, shadows, type } from '@/theme/tokens';

export type CallNote = { notes: string };

/**
 * A note against the store manager's call back: what happened on the call, in
 * their own words. Opens from "Call back" and from the call steps in Customer
 * history. Closing or tapping outside saves nothing.
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
  /** Prefills an existing note when viewing one. */
  initial: { notes?: string };
  onDismiss: () => void;
  onSave: (note: CallNote) => void;
}) {
  const [notes, setNotes] = useState('');
  const canSave = notes.trim().length > 0;

  useEffect(() => {
    if (!visible) return;
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
        <View>
          <FieldLabel>Call notes</FieldLabel>
          <NotesField
            accessibilityLabel="Call notes"
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
        disabled={!canSave}
        onPress={() => canSave && onSave({ notes: notes.trim() })}
        style={{ marginTop: 14 }}
      />
      {!canSave ? (
        <Text size={type.footnote} color={colors.textTertiary} align="center" style={{ marginTop: 8 }}>
          Write a note to save it.
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
});
