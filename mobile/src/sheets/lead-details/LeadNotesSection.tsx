import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { NotesField } from '@/components/fields';
import { layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { currentNote, deleteCurrentNote, saveNoteVersion, type LeadNotes } from '@/lib/notes';
import { colors, radius, shadows, type } from '@/theme/tokens';

/**
 * Notes for a lead. A saved note shows as a card with edit and delete. Notes
 * save immediately; each edit is kept as a new version in the data.
 */
export function LeadNotesSection({
  notes,
  onChange,
  author,
}: {
  notes: LeadNotes;
  onChange: (notes: LeadNotes) => void;
  author: string;
}) {
  const current = currentNote(notes);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // With no current note (none yet, or just deleted) the editor is always shown.
  const showEditor = editing || !current;
  const canSave = draft.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    onChange(saveNoteVersion(notes, draft, author));
    setEditing(false);
    setDraft('');
  };

  return (
    <View>
      <View style={styles.head}>
        <Text size={type.subhead} weight={700} color={colors.textSecondary}>
          Notes
        </Text>
        <View style={[layout.row, { gap: 2, marginRight: -6 }]}>
          {!showEditor ? (
            <>
              <IconButton
                label="Edit note"
                onPress={() => {
                  setDraft(current?.text ?? '');
                  setEditing(true);
                }}
              >
                <Pencil size={16} color={colors.primaryAccent} strokeWidth={2} />
              </IconButton>
              <IconButton label="Delete note" onPress={() => setConfirmDelete(true)}>
                <Trash2 size={16} color={colors.error} strokeWidth={2} />
              </IconButton>
            </>
          ) : null}
        </View>
      </View>

      {showEditor ? (
        <>
          <NotesField value={draft} onChangeText={setDraft} placeholder="Add a note about this lead…" accessibilityLabel="Note" />
          <View style={[layout.row, { gap: 10, marginTop: 10 }]}>
            {current ? (
              <Button
                label="Cancel"
                variant="outline"
                height={42}
                fontSize={type.subhead}
                style={{ flex: 38 }}
                onPress={() => {
                  setEditing(false);
                  setDraft('');
                }}
              />
            ) : null}
            <Button
              label="Save note"
              height={42}
              fontSize={type.subhead}
              disabled={!canSave}
              style={{ flex: 62, boxShadow: 'none' }}
              onPress={save}
            />
          </View>
        </>
      ) : (
        <View style={styles.saved}>
          <Text size={type.body} color={colors.textPrimary}>
            {current?.text}
          </Text>
        </View>
      )}

      <Dialog visible={confirmDelete} onDismiss={() => setConfirmDelete(false)} animation="fade" horizontalInset={28} style={styles.confirmCard}>
        <View style={styles.confirmIcon}>
          <Trash2 size={22} color={colors.error} strokeWidth={2} />
        </View>
        <Text size={type.headline} weight={700} color={colors.textPrimary} align="center">
          Delete this note?
        </Text>
        <Text size={type.subhead} color={colors.textSecondary} align="center" style={{ marginTop: 6, marginBottom: 18 }}>
          It will be removed from this lead.
        </Text>
        <View style={[layout.row, { gap: 10 }]}>
          <Button label="Keep note" variant="outline" height={44} fontSize={type.subhead} style={layout.flex1} onPress={() => setConfirmDelete(false)} />
          <Button
            label="Delete"
            variant="danger"
            height={44}
            fontSize={type.subhead}
            style={[layout.flex1, { boxShadow: 'none' }]}
            onPress={() => {
              onChange(deleteCurrentNote(notes));
              setConfirmDelete(false);
              setEditing(false);
              setDraft('');
            }}
          />
        </View>
      </Dialog>
    </View>
  );
}

function IconButton({
  label,
  onPress,
  active,
  children,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        active && { backgroundColor: colors.blue50 },
        pressed && { backgroundColor: colors.borderSubtle },
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 20, marginBottom: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  saved: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
  },
  confirmCard: {
    borderRadius: radius.xl,
    boxShadow: shadows.lg,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  confirmIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.red100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
});
