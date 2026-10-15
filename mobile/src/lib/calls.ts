import type { LeadStatus } from '@/data/leads';

export type CallOutcome = 'connected' | 'no_answer' | 'busy' | 'call_later' | 'wrong_number';

/**
 * How a call back went. `leadStatus` is the status the lead moves to when the
 * call is logged; outcomes without one leave the status as it is.
 */
export const CALL_OUTCOMES: { id: CallOutcome; label: string; leadStatus?: LeadStatus }[] = [
  { id: 'connected', label: 'Connected', leadStatus: 'Contacted' },
  { id: 'no_answer', label: 'No answer' },
  { id: 'busy', label: 'Busy' },
  { id: 'call_later', label: 'Asked to call later', leadStatus: 'Set for reminder' },
  { id: 'wrong_number', label: 'Wrong number', leadStatus: 'Expired' },
];

export const CALL_NOTES_MAX = 500;

export function callOutcome(id: CallOutcome) {
  return CALL_OUTCOMES.find((o) => o.id === id)!;
}

/** The note saved to the lead for a logged call, e.g. "Call back: Connected. Wants a test drive." */
export function callNoteText(id: CallOutcome, notes: string): string {
  const trimmed = notes.trim();
  return `Call back: ${callOutcome(id).label}.${trimmed ? ` ${trimmed}` : ''}`;
}
