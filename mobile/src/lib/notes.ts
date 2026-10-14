/**
 * Lead notes are versioned. Saving adds a version; deleting marks the latest
 * version as deleted (it stays visible in version history) and leaves the
 * lead without a current note until a new one is saved.
 */
export type NoteVersion = { text: string; by: string; when: string; deleted?: boolean };

export type LeadNotes = { versions: NoteVersion[]; active: boolean };

export function currentNote(notes: LeadNotes): NoteVersion | null {
  const last = notes.versions[notes.versions.length - 1];
  return notes.active && last ? last : null;
}

export function saveNoteVersion(notes: LeadNotes, text: string, by: string, when = 'Just now'): LeadNotes {
  const trimmed = text.trim();
  if (!trimmed) return notes;
  return { versions: [...notes.versions, { text: trimmed, by, when }], active: true };
}

export function deleteCurrentNote(notes: LeadNotes): LeadNotes {
  if (!currentNote(notes)) return notes;
  const versions = notes.versions.map((v, i, all) => (i === all.length - 1 ? { ...v, deleted: true } : v));
  return { versions, active: false };
}

export type HistoryRow = NoteVersion & { num: number; current: boolean; last: boolean };

/** Newest first, numbered from the oldest (Version 1). */
export function historyRows(notes: LeadNotes): HistoryRow[] {
  const total = notes.versions.length;
  return notes.versions
    .slice()
    .reverse()
    .map((v, i) => ({ ...v, num: total - i, current: i === 0 && notes.active, last: i === total - 1 }));
}
