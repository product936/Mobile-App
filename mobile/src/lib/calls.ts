import { PURCHASE_OPTIONS, type Lead, type LeadStatus } from '@/data/leads';

export type CallOutcome = 'connected' | 'no_answer' | 'busy' | 'call_later' | 'wrong_number';

/**
 * How a call went. `leadStatus` is the status the lead moves to when the call
 * is logged; outcomes without one leave the status as it is.
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

/** Who made a call back: the AI bot that calls first, or the store manager. */
export type Caller = 'ai_bot' | 'store_manager';

export const CALLERS: { id: Caller; label: string }[] = [
  { id: 'ai_bot', label: 'Called by AI bot' },
  { id: 'store_manager', label: 'Called by store manager' },
];

export function callerLabel(id: Caller): string {
  return CALLERS.find((c) => c.id === id)!.label;
}

/** A call back logged against a lead, with what happened on it. */
export type CallLog = {
  id: string;
  by: Caller;
  outcome: CallOutcome;
  notes: string;
  when: string;
  /** Name of the person who logged it. */
  author: string;
};

/** Adds or replaces a call log (matched by id). */
export function upsertCallLog(logs: CallLog[], log: CallLog): CallLog[] {
  const i = logs.findIndex((l) => l.id === log.id);
  if (i === -1) return [...logs, log];
  return logs.map((l, j) => (j === i ? log : l));
}

/** "5:39 PM" plus minutes, on the same day: ("5:39 PM", 3) → "5:42 PM". */
export function addMinutes(time: string, minutes: number): string {
  const m = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return time;
  const h24 = (Number(m[1]) % 12) + (m[3].toUpperCase() === 'PM' ? 12 : 0);
  const total = (h24 * 60 + Number(m[2]) + minutes) % (24 * 60);
  const h = Math.floor(total / 60);
  const mm = String(total % 60).padStart(2, '0');
  return `${h % 12 || 12}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
}

/** The product the AI bot qualified the customer's intent for (sample data until the bot is wired up). */
export function qualifiedIntent(lead: Lead): string {
  const n = Number(lead.id.replace(/\D/g, '')) || 0;
  return PURCHASE_OPTIONS[n % 3];
}

export type JourneyStep = {
  id: string;
  kind: 'missed' | 'form' | 'walkin' | 'ai' | 'manager' | 'pending';
  title: string;
  meta: string;
  /** "Intent qualified" product, on the AI bot's call. */
  intent?: string;
  recordingSeconds?: number;
  /** The logged call this step shows; notes are added or edited against it. */
  log?: CallLog;
};

const FIRST_STEP: Record<Lead['source'], Pick<JourneyStep, 'kind' | 'title'> & { channel: string }> = {
  Call: { kind: 'missed', title: 'Missed call from the customer', channel: 'Call' },
  Form: { kind: 'form', title: 'Filled an enquiry form', channel: 'Lead form' },
  'Walk-in': { kind: 'walkin', title: 'Visited the store', channel: 'Walk-in' },
};

/**
 * The lead's journey, oldest first: how the customer first reached the store,
 * the AI bot's call back (which also qualifies their purchase intent), then
 * the store manager's call backs. Until the store manager has logged a call,
 * the last step is a prompt to call and add a note.
 */
export function leadJourney(lead: Lead, logs: CallLog[]): JourneyStep[] {
  const first = FIRST_STEP[lead.source];
  const aiLog = logs.filter((l) => l.by === 'ai_bot').pop();
  const managerLogs = logs.filter((l) => l.by === 'store_manager');

  const steps: JourneyStep[] = [
    { id: 'first', kind: first.kind, title: first.title, meta: `${first.channel} · Today, ${lead.time}` },
    {
      id: 'ai',
      kind: 'ai',
      title: 'Called back by AI bot',
      meta: `AI call · Today, ${addMinutes(lead.time, 3)}`,
      intent: qualifiedIntent(lead),
      recordingSeconds: 32,
      log: aiLog,
    },
  ];
  for (const log of managerLogs) {
    steps.push({ id: log.id, kind: 'manager', title: 'Called back by store manager', meta: `Call · ${log.when} · ${log.author}`, log });
  }
  if (!managerLogs.length) {
    steps.push({
      id: 'pending',
      kind: 'pending',
      title: 'Call back by store manager',
      meta: 'Next step: call the customer, then add a note about the call.',
    });
  }
  return steps;
}
