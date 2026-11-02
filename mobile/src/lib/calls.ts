import { STORE } from '@/config/roles';
import { PURCHASE_OPTIONS, type Lead, type LeadStatus } from '@/data/leads';

export type CallOutcome = 'answered' | 'converted' | 'no_answer' | 'busy' | 'call_later' | 'wrong_number';

/** Colour of an outcome's chip in Customer history. */
export type OutcomeTone = 'blue' | 'green' | 'red' | 'amber';

/**
 * How the store manager's call went. `leadStatus` is the status the lead moves
 * to when the call is logged: Converted when the customer bought, Expired
 * for a wrong number, and "Called by store manager" otherwise.
 */
export const CALL_OUTCOMES: { id: CallOutcome; label: string; leadStatus: LeadStatus; tone: OutcomeTone }[] = [
  { id: 'answered', label: 'Answered', leadStatus: 'Called by store manager', tone: 'blue' },
  { id: 'converted', label: 'Converted', leadStatus: 'Converted', tone: 'green' },
  { id: 'no_answer', label: 'No answer', leadStatus: 'Called by store manager', tone: 'red' },
  { id: 'busy', label: 'Busy', leadStatus: 'Called by store manager', tone: 'amber' },
  { id: 'call_later', label: 'Asked to call later', leadStatus: 'Called by store manager', tone: 'amber' },
  { id: 'wrong_number', label: 'Wrong number', leadStatus: 'Expired', tone: 'red' },
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
  /** How the call went, when known (set by the backend or sample data; the call note modal no longer asks). */
  outcome?: CallOutcome;
  notes: string;
  when: string;
  /** Name of the person who logged it (kept for the record, not shown). */
  author: string;
  /** Which of the customer's contacts this call followed: 0 for the first, 1 for the first repeat, and so on. */
  cycle?: number;
};

/** "Today, 5:55 PM" → "5:55 PM"; anything else as it is. */
export function shortTime(when: string): string {
  return when.replace(/^Today,\s*/, '');
}

/** The contact a new call follows: the customer's latest one. */
export function currentCycle(lead: Lead): number {
  return lead.repeatContacts?.length ?? 0;
}

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
  /** Time shown on the right of the title, e.g. "5:39 PM" or "Just now". */
  time?: string;
  /** A line under the title (the next-step prompt). */
  meta?: string;
  /** "Intent qualified" product, on the AI bot's call. */
  intent?: string;
  recordingSeconds?: number;
  /** The AI bot's call recording is still being fetched. */
  recordingPending?: boolean;
  /** The logged call this step shows; notes are added or edited against it. */
  log?: CallLog;
};

const FIRST_STEP: Record<Lead['source'], Pick<JourneyStep, 'kind' | 'title'>> = {
  Call: { kind: 'missed', title: 'Missed call from the customer' },
  Form: { kind: 'form', title: 'Filled an enquiry form' },
  'Walk-in': { kind: 'walkin', title: 'Visited the store' },
};

/**
 * The lead's journey, newest first. Each time the customer gets in touch (the
 * first contact, then any repeat missed calls) the journey runs again: the
 * contact, the AI bot's call back (which also qualifies the purchase intent),
 * then the store manager's call backs. Until the store manager has logged a
 * call after the latest contact, the top step prompts them to call and add a
 * note.
 */
export function leadJourney(lead: Lead, logs: CallLog[], manager: string = STORE.manager): JourneyStep[] {
  const contacts = [lead.time, ...(lead.repeatContacts ?? [])];
  const latest = contacts.length - 1;
  // Built oldest first, then reversed.
  const steps: JourneyStep[] = [];
  contacts.forEach((time, cycle) => {
    const first = cycle === 0 ? FIRST_STEP[lead.firstContact ?? lead.source] : FIRST_STEP.Call;
    steps.push(
      { id: `contact-${cycle}`, kind: first.kind, title: first.title, time },
      {
        id: `ai-${cycle}`,
        kind: 'ai',
        title: 'Called back by AI bot',
        time: addMinutes(time, 3),
        intent: qualifiedIntent(lead),
        // The latest AI call's recording is still on its way; earlier ones are ready to play.
        ...(cycle === latest ? { recordingPending: true } : { recordingSeconds: 32 }),
      },
    );
    const cycleLogs = logs.filter((l) => Math.min(l.cycle ?? 0, latest) === cycle);
    for (const log of cycleLogs) {
      const byManager = log.by === 'store_manager';
      steps.push({
        id: log.id,
        kind: byManager ? 'manager' : 'ai',
        title: byManager ? `Called back by ${manager}` : 'Called back by AI bot',
        time: shortTime(log.when),
        log,
      });
    }
    if (cycle === latest && !cycleLogs.some((l) => l.by === 'store_manager')) {
      steps.push({
        id: 'pending',
        kind: 'pending',
        title: `Call back by ${manager}`,
        // Handed to the store manager when the AI bot's call ended.
        time: addMinutes(time, 3),
      });
    }
  });
  return steps.reverse();
}
