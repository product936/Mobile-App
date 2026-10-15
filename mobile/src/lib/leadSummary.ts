import type { LeadStatus } from '@/data/leads';
import { callOutcome, type JourneyStep } from '@/lib/calls';

export type LeadSummary = {
  /** Where the lead stands: its current status. */
  stage: LeadStatus;
  /** Product the AI bot qualified the purchase intent for. */
  intent?: string;
  /** Interactions so far, e.g. "2 missed calls · 2 AI bot calls · 1 store manager call". */
  interactions: string;
  total: number;
  /** The most recent interaction, e.g. "Called back by store manager · Converted". */
  latest?: { title: string; when: string };
  nextStep: string;
};

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

/** "Call · Today, 5:55 PM" → "Today, 5:55 PM". */
function whenOf(step: JourneyStep) {
  return step.meta.split(' · ').slice(1).join(' · ') || step.meta;
}

/**
 * A short read of the lead from its journey (newest first): what has happened
 * so far, where it stands and what the customer wants, plus the next step.
 */
export function leadSummary(steps: JourneyStep[], stage: LeadStatus, reminder = false): LeadSummary {
  const done = steps.filter((s) => s.kind !== 'pending');
  const count = (kinds: JourneyStep['kind'][]) => done.filter((s) => kinds.includes(s.kind)).length;
  const missed = count(['missed']);
  const forms = count(['form']);
  const visits = count(['walkin']);
  const ai = count(['ai']);
  const manager = count(['manager']);

  const parts = [
    missed && plural(missed, 'missed call', 'missed calls'),
    forms && plural(forms, 'enquiry form', 'enquiry forms'),
    visits && plural(visits, 'store visit', 'store visits'),
    ai && plural(ai, 'AI bot call', 'AI bot calls'),
    manager && plural(manager, 'store manager call', 'store manager calls'),
  ].filter(Boolean);

  const latestStep = done[0];
  const latest = latestStep
    ? {
        title: latestStep.log ? `${latestStep.title} · ${callOutcome(latestStep.log.outcome).label}` : latestStep.title,
        when: whenOf(latestStep),
      }
    : undefined;

  return {
    stage,
    intent: steps.find((s) => s.intent)?.intent,
    interactions: parts.join(' · '),
    total: done.length,
    latest,
    nextStep: nextStepFor(steps, reminder),
  };
}

function nextStepFor(steps: JourneyStep[], reminder: boolean): string {
  if (steps[0]?.kind === 'pending') return 'Call the customer back, then add a note about the call.';
  const lastCall = steps.find((s) => s.kind === 'manager')?.log;
  switch (lastCall?.outcome) {
    case 'converted':
      return 'Request a review from the customer.';
    case 'answered':
      return 'Follow up on what you agreed on the call.';
    case 'call_later':
      return reminder ? 'Call back tomorrow. Your reminder is set.' : 'Call back later, as the customer asked.';
    case 'no_answer':
    case 'busy':
      return 'Try calling again.';
    case 'wrong_number':
      return 'No follow-up needed. The number is wrong.';
    default:
      return 'Call the customer back, then add a note about the call.';
  }
}
