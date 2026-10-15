import { Pressable, StyleSheet, View } from 'react-native';
import { NotebookPen, X } from 'lucide-react-native';

import { Dialog } from '@/components/Dialog';
import { IconTile, layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { currentNote, type LeadNotes } from '@/lib/notes';
import { LeadNotesSection } from '@/sheets/lead-details/LeadNotesSection';
import { colors, radius, shadows, type } from '@/theme/tokens';

/** Round notes button for the Lead details header; a dot shows when the lead has a note. */
export function NotesButton({ notes, onPress }: { notes: LeadNotes; onPress: () => void }) {
  const hasNote = !!currentNote(notes);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hasNote ? 'Notes, 1 note' : 'Notes, none yet'}
      onPress={onPress}
      hitSlop={6}
      style={styles.button}
    >
      <NotebookPen size={16} color={colors.primaryAccent} strokeWidth={2} />
      {hasNote ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

/** The lead's notes in a modal: the current note with edit, delete and version history. */
export function LeadNotesDialog({
  visible,
  notes,
  onChange,
  author,
  onDismiss,
}: {
  visible: boolean;
  notes: LeadNotes;
  onChange: (notes: LeadNotes) => void;
  author: string;
  onDismiss: () => void;
}) {
  return (
    <Dialog visible={visible} onDismiss={onDismiss} horizontalInset={16} role="none" style={styles.card}>
      <View style={styles.header}>
        <IconTile size={44} rounded={radius.full}>
          <NotebookPen size={20} color={colors.primaryAccent} strokeWidth={2} />
        </IconTile>
        <View style={layout.flex1}>
          <Text size={type.title3} weight={700} color={colors.textPrimary} accessibilityRole="header">
            Notes
          </Text>
          <Text size={type.callout} color={colors.textTertiary} style={{ marginTop: 2 }}>
            Notes about this lead. Each edit saves a new version.
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close notes" onPress={onDismiss} style={styles.close} hitSlop={6}>
          <X size={18} color={colors.textSecondary} strokeWidth={2.2} />
        </Pressable>
      </View>
      <LeadNotesSection notes={notes} onChange={onChange} author={author} label="Current note" />
    </Dialog>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.blue50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primaryAccent,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  card: { maxWidth: 420, borderRadius: 24, padding: 20, boxShadow: shadows.xl },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 18 },
  close: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
