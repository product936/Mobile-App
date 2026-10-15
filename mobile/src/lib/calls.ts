import { PURCHASE_OPTIONS, type Lead, type LeadStatus } from '@/data/leads';

export type CallOutcome = 'answered' | 'converted' | 'no_answer' | 'busy' | 'call_later' | 'wrong_number';

/**
 * How the store manager's call went. `leadStatus` is the status the lead moves
 * to when the call is logged: Converted when the customer bought, Expired
 * for a wrong number, and "Called by store manager" otherwise.
 */
export const CALL_OUTCOMES: { id: CallOutcome; label: string; leadStatus: LeadStatus }[] = [
  { id: 'answered', label: 'Answered', leadStatus: 'Called by store manager' },
  { id: 'converted', label: 'Converted', leadStatus: 'Converted' },
  { id: 'no_answer', label: 'No answer', leadStatus: 'Called by store manager' },
  { id: 'busy', label: 'Busy', leadStatus: 'Called by store manager' },
  { id: 'call_later', label: 'Asked to call later', leadStatus: 'Called by store manager' },
  { id: 'wrong_number', label: 'Wrong number', leadStatus: 'Expired' },
];

export const CALL_NOTES_MAX = 500;

export function callOutcome(id: CallOutcome) {
  return CALL_OUTCOMES.find((o) => o.id === id)!;
}

/**
 * Who made a call back. The AI bot calls first (shown in Customer history
 * from the bot's data); the store manager logs their own calls.
 */
export type Caller = 'ai_bot' | 'store_manager';

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
 * The lead's journey, newest first: the next step (a prompt for the store
 * manager to call, until they have logged one), logged call backs, the AI
 * bot's call back (which also qualifies the purchase intent), and how the
 * customer first reached the store.
 */
export function leadJourney(lead: Lead, logs: CallLog[]): JourneyStep[] {
  const first = FIRST_STEP[lead.firstContact ?? lead.source];
  // Built oldest first, then reversed.
  const steps: JourneyStep[] = [
    { id: 'first', kind: first.kind, title: first.title, meta: `${first.channel} · Today, ${lead.time}` },
    {
      id: 'ai',
      kind: 'ai',
      title: 'Called back by AI bot',
      meta: `AI call · Today, ${addMinutes(lead.time, 3)}`,
      intent: qualifiedIntent(lead),
      recordingSeconds: 32,
    },
  ];
  for (const log of logs) {
    const manager = log.by === 'store_manager';
    steps.push({
      id: log.id,
      kind: manager ? 'manager' : 'ai',
      title: manager ? 'Called back by store manager' : 'Called back by AI bot',
      meta: `Call · ${log.when} · ${log.author}`,
      log,
    });
  }
  if (!logs.some((l) => l.by === 'store_manager')) {
    steps.push({
      id: 'pending',
      kind: 'pending',
      title: 'Call back by store manager',
      meta: 'Next step: call the customer, then add a note about the call.',
    });
  }
  return steps.reverse();
}
