import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { History, Pencil, Trash2, X } from 'lucide-react-native';

import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';
import { NotesField } from '@/components/fields';
import { layout } from '@/components/primitives';
import { Text } from '@/components/Text';
import { currentNote, deleteCurrentNote, historyRows, saveNoteVersion, type LeadNotes } from '@/lib/notes';
import { colors, radius, shadows, type } from '@/theme/tokens';

/**
 * Notes for a lead. A saved note shows as a card with edit and delete; editing
 * saves a new version. Earlier versions, including deleted ones, are listed in
 * "Version history". Notes save immediately.
 */
export function LeadNotesSection({
  notes,
  onChange,
  author,
  label = 'Notes',
}: {
  notes: LeadNotes;
  onChange: (notes: LeadNotes) => void;
  author: string;
  label?: string;
}) {
  const current = currentNote(notes);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
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
          {label}
        </Text>
        <View style={[layout.row, { gap: 2, marginRight: -6 }]}>
          {notes.versions.length > 0 ? (
            <IconButton label="Version history" onPress={() => setHistoryOpen(true)} active={historyOpen}>
              <History size={16} color={colors.textSecondary} strokeWidth={2} />
            </IconButton>
          ) : null}
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

      <Dialog
        visible={historyOpen}
        onDismiss={() => setHistoryOpen(false)}
        animation="fade"
        horizontalInset={20}
        role="none"
        style={styles.historyCard}
      >
        <View style={styles.historyHead}>
          <View style={layout.flex1}>
            <Text size={type.headline} weight={700} color={colors.textPrimary} accessibilityRole="header">
              Version history
            </Text>
            <Text size={type.footnote} color={colors.textTertiary} style={{ marginTop: 2 }}>
              {notes.versions.length} versions of this note
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => setHistoryOpen(false)} style={styles.close}>
            <X size={18} color={colors.textSecondary} strokeWidth={2.2} />
          </Pressable>
        </View>
        <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={styles.historyBody}>
          {historyRows(notes).map((v) => (
            <View key={v.num} style={[layout.row, { alignItems: 'stretch', gap: 12 }]}>
              <View style={styles.rail}>
                <View style={[styles.railDot, v.current && { backgroundColor: colors.primaryAccent }]} />
                {!v.last ? <View style={styles.railLine} /> : null}
              </View>
              <View style={[layout.flex1, { paddingBottom: 16 }]}>
                <View style={[layout.row, { gap: 6 }]}>
                  <Text size={type.footnote} weight={700} color={colors.textSecondary}>
                    Version {v.num}
                  </Text>
                  {v.current ? <Tag label="Current" bg={colors.blue50} fg={colors.primaryAccent} /> : null}
                  {v.deleted ? <Tag label="Deleted" bg={colors.red100} fg={colors.error} /> : null}
                </View>
                <Text
                  size={type.subhead}
                  color={v.deleted ? colors.textTertiary : colors.textSecondary}
                  style={[{ marginTop: 4 }, v.deleted && { textDecorationLine: 'line-through' }]}
                >
                  {v.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Dialog>

      <Dialog visible={confirmDelete} onDismiss={() => setConfirmDelete(false)} animation="fade" horizontalInset={28} style={styles.confirmCard}>
        <View style={styles.confirmIcon}>
          <Trash2 size={22} color={colors.error} strokeWidth={2} />
        </View>
        <Text size={type.headline} weight={700} color={colors.textPrimary} align="center">
          Delete this note?
        </Text>
        <Text size={type.subhead} color={colors.textSecondary} align="center" style={{ marginTop: 6, marginBottom: 18 }}>
          It will be removed from this lead. You can still see it in version history.
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

function Tag({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Text size={10} weight={700} color={fg} lineHeight={1.1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 },
  iconBtn: { width: 34, height: 34, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  saved: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceBase,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.input,
  },
  historyCard: { maxHeight: '70%', borderRadius: radius.xl, boxShadow: shadows.lg, overflow: 'hidden' },
  historyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 12,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyBody: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: 6 },
  rail: { width: 10, alignItems: 'center', paddingTop: 4 },
  railDot: { width: 10, height: 10, borderRadius: radius.full, backgroundColor: colors.borderDefault },
  railLine: { flex: 1, width: 2, backgroundColor: colors.borderDefault, marginTop: 4 },
  tag: { height: 18, paddingHorizontal: 7, borderRadius: radius.full, justifyContent: 'center' },
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
