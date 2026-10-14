import { SEED_NOTE_VERSIONS } from '@/data/content';
import { leadStatusTint } from '@/lib/format';
import { currentNote, deleteCurrentNote, historyRows, saveNoteVersion, type LeadNotes } from '@/lib/notes';
import { colors } from '@/theme/tokens';

const seeded: LeadNotes = { versions: SEED_NOTE_VERSIONS, active: true };

describe('lead notes', () => {
  it('shows the latest version as the current note', () => {
    expect(currentNote(seeded)?.text).toMatch(/^Interested in Tata Ace Gold/);
  });

  it('saves an edit as a new version', () => {
    const next = saveNoteVersion(seeded, '  Booked a test drive for Saturday.  ', 'Tarun Sobhani');
    expect(next.versions).toHaveLength(3);
    expect(currentNote(next)).toEqual({ text: 'Booked a test drive for Saturday.', by: 'Tarun Sobhani', when: 'Just now' });
  });

  it('ignores an empty save', () => {
    expect(saveNoteVersion(seeded, '   ', 'Tarun Sobhani')).toBe(seeded);
  });

  it('deleting keeps the version in history, marked deleted, with no current note', () => {
    const next = deleteCurrentNote(seeded);
    expect(currentNote(next)).toBeNull();
    expect(next.versions).toHaveLength(2);
    expect(next.versions[1].deleted).toBe(true);
    expect(deleteCurrentNote(next)).toBe(next);
  });

  it('a note saved after a delete becomes current again', () => {
    const next = saveNoteVersion(deleteCurrentNote(seeded), 'Follow up next week.', 'Tarun Sobhani');
    expect(currentNote(next)?.text).toBe('Follow up next week.');
    expect(next.versions).toHaveLength(3);
  });

  it('lists history newest first, numbered from the oldest', () => {
    const rows = historyRows(deleteCurrentNote(seeded));
    expect(rows.map((r) => [r.num, r.current, !!r.deleted, r.last])).toEqual([
      [2, false, true, false],
      [1, false, false, true],
    ]);
    expect(historyRows(seeded)[0]).toMatchObject({ num: 2, current: true });
  });
});

describe('status pill colours', () => {
  it('matches the design tints', () => {
    expect(leadStatusTint('Missed')).toEqual({ bg: colors.red100, fg: colors.error });
    expect(leadStatusTint('Not contacted')).toEqual({ bg: colors.amber100, fg: colors.amber700 });
    expect(leadStatusTint('Converted')).toEqual({ bg: colors.successBg, fg: colors.success });
    expect(leadStatusTint('Expired')).toEqual({ bg: colors.surfaceBase, fg: colors.textTertiary });
  });
});
