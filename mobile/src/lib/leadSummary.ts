import type { Lead, LeadStatus } from '@/data/leads';
import type { JourneyStep } from '@/lib/calls';

/** "Today, 5:55 PM" → "at 5:55 PM"; "Just now" → "just now". */
function spoken(when: string): string {
  const m = when.match(/^Today, (.+)$/);
  if (m) return `at ${m[1]}`;
  return when.charAt(0).toLowerCase() + when.slice(1);
}

function times(n: number) {
  return n === 2 ? 'twice' : `${n} times`;
}

/** Longest summary we allow: about three lines on a phone. */
export const LEAD_SUMMARY_MAX = 140;

/**
 * A short, conversational read of the lead in up to three brief sentences:
 * how the customer got in touch and what they want, where things stand, and
 * what to do next.
 */
export function leadSummary(lead: Lead, steps: JourneyStep[], status: LeadStatus, reminder = false): string {
  const intent = steps.find((s) => s.intent)?.intent;
  const contacts = [lead.time, ...(lead.repeatContacts ?? [])];
  const about = intent ? `, interested in the ${intent}` : '';

  // How they got in touch, and what they want.
  const first =
    contacts.length > 1
      ? `Called ${times(contacts.length)}, last at ${contacts[contacts.length - 1]}${about}.`
      : `${{ Call: 'Missed call', Form: 'Enquiry form', 'Walk-in': 'Store visit' }[lead.firstContact ?? lead.source]} at ${lead.time}${about}.`;

  // Where things stand, from the store manager's latest call.
  const pending = steps[0]?.kind === 'pending';
  const lastCall = steps.find((s) => s.kind === 'manager')?.log;
  let stand: string;
  if (!lastCall) {
    stand = status === 'Converted' ? 'Marked as converted.' : 'The store hasn\'t called yet.';
  } else {
    const when = spoken(lastCall.when);
    stand = {
      converted: pending ? `Converted ${when}, then called again.` : `Converted on your call ${when}.`,
      answered: `You spoke to them ${when}.`,
      no_answer: `Your call ${when} went unanswered.`,
      busy: `Their line was busy ${when}.`,
      call_later: 'They asked you to call back later.',
      wrong_number: 'The number is wrong.',
    }[lastCall.outcome];
  }

  return `${first} ${stand} ${nextStep(pending, lastCall?.outcome, reminder)}`;
}

function nextStep(pending: boolean, outcome: string | undefined, reminder: boolean): string {
  if (pending || !outcome) return 'Call them next and add a note.';
  switch (outcome) {
    case 'converted':
      return 'Ask them for a review next.';
    case 'answered':
      return 'Follow up on what you agreed.';
    case 'call_later':
      return reminder ? 'Your reminder is set for tomorrow.' : 'Call back when it suits them.';
    case 'wrong_number':
      return 'No follow-up needed.';
    default:
      return 'Try calling again.';
  }
}
