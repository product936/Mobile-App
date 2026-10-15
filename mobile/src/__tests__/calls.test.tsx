import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { SEED_LEAD_CALLS } from '@/data/content';
import { LEADS } from '@/data/leads';
import { addMinutes, CALL_OUTCOMES, callOutcome, currentCycle, leadJourney, upsertCallLog, type CallLog } from '@/lib/calls';
import { CallOutcomeDialog } from '@/sheets/lead-details/CallOutcomeDialog';
import { CustomerHistory } from '@/sheets/lead-details/CustomerHistory';

const missedLead = LEADS.find((l) => l.id === 'l2')!; // Call, 5:39 PM
const formLead = LEADS.find((l) => l.source === 'Form' && !l.firstContact)!;

const managerCall: CallLog = {
  id: 'c1',
  by: 'store_manager',
  outcome: 'answered',
  notes: 'Wants a test drive on Saturday',
  when: 'Just now',
  author: 'Tarun Sobhani',
};

describe('call outcome', () => {
  it('marks the lead as called by the store manager, converted, or expired for a wrong number', () => {
    for (const id of ['answered', 'no_answer', 'busy', 'call_later'] as const) {
      expect(callOutcome(id).leadStatus).toBe('Called by store manager');
    }
    expect(callOutcome('converted').leadStatus).toBe('Converted');
    expect(callOutcome('wrong_number').leadStatus).toBe('Expired');
    expect(CALL_OUTCOMES.map((o) => o.label)).toEqual(['Answered', 'Converted', 'No answer', 'Busy', 'Asked to call later', 'Wrong number']);
  });

  it('adds minutes across the hour and noon', () => {
    expect(addMinutes('5:39 PM', 3)).toBe('5:42 PM');
    expect(addMinutes('11:58 AM', 3)).toBe('12:01 PM');
    expect(addMinutes('12:59 PM', 3)).toBe('1:02 PM');
  });

  it('adds a call log, then replaces it when the note is edited', () => {
    const once = upsertCallLog([], managerCall);
    const edited = upsertCallLog(once, { ...managerCall, notes: 'Booked for Saturday 10 AM' });
    expect(edited).toHaveLength(1);
    expect(edited[0].notes).toBe('Booked for Saturday 10 AM');
  });
});

describe('outcome chip colours', () => {
  it('shows no answer and wrong number in red, answered in blue, converted in green', () => {
    expect(callOutcome('no_answer').tone).toBe('red');
    expect(callOutcome('wrong_number').tone).toBe('red');
    expect(callOutcome('answered').tone).toBe('blue');
    expect(callOutcome('converted').tone).toBe('green');
  });
});

describe('lead journey', () => {
  it('is newest first: store manager prompt, AI bot call back with qualified intent, then the missed call', () => {
    const steps = leadJourney(missedLead, []);
    expect(steps.map((s) => s.kind)).toEqual(['pending', 'ai', 'missed']);
    expect(steps[0].title).toBe('Call back by store manager');
    expect(steps[1].title).toBe('Called back by AI bot');
    expect(steps[1].meta).toBe('AI call · Today, 5:42 PM');
    expect(steps[1].intent).toBeTruthy();
    expect(steps[1].log).toBeUndefined();
    expect(steps[2].meta).toBe('Call · Today, 5:39 PM');
  });

  it("replaces the prompt with the store manager's logged calls, newest on top", () => {
    const later: CallLog = { ...managerCall, id: 'c2', outcome: 'busy', notes: '' };
    const steps = leadJourney(missedLead, [managerCall, later]);
    expect(steps.map((s) => s.id)).toEqual(['c2', 'c1', 'ai-0', 'contact-0']);
    // Who logged the call is not shown.
    expect(steps[1].meta).toBe('Call · Just now');
  });

  it("starts Priya Menon's journey again after her conversion when she calls back at 6:20 PM", () => {
    const priya = LEADS.find((l) => l.person === 'Priya Menon')!;
    expect(priya.status).toBe('Converted');
    const steps = leadJourney(priya, SEED_LEAD_CALLS[priya.id]);
    expect(steps.map((s) => s.kind)).toEqual(['pending', 'ai', 'missed', 'manager', 'ai', 'missed']);
    expect(steps[2].meta).toBe('Call · Today, 6:20 PM');
    expect(steps[1].meta).toBe('AI call · Today, 6:23 PM');
    expect(steps[3].log?.outcome).toBe('converted');
    expect(steps[3].meta).toBe('Call · Today, 5:55 PM');
  });

  it("puts a new call after the customer's latest contact", () => {
    const priya = LEADS.find((l) => l.person === 'Priya Menon')!;
    const newCall: CallLog = { ...managerCall, id: 'c9', cycle: currentCycle(priya) };
    const steps = leadJourney(priya, [...SEED_LEAD_CALLS[priya.id], newCall]);
    expect(steps.map((s) => s.id)).toEqual(['c9', 'ai-1', 'contact-1', 'seed-l3-1', 'ai-0', 'contact-0']);
  });

  it('starts from how the customer first reached the store', () => {
    const steps = leadJourney(formLead, []);
    expect(steps[steps.length - 1].title).toBe('Filled an enquiry form');
  });
});

describe('Customer history', () => {
  it('shows the outcome next to the call, View note once a note exists, and no note action on the AI bot call', async () => {
    const onAddNote = jest.fn();
    const noNote: CallLog = { ...managerCall, id: 'c2', outcome: 'busy', notes: '' };
    await render(<CustomerHistory steps={leadJourney(missedLead, [managerCall, noNote])} onAddNote={onAddNote} />);
    expect(screen.getByText('Newest first')).toBeTruthy();
    expect(screen.getByLabelText('Call outcome: Answered')).toBeTruthy();
    expect(screen.getByLabelText('Call outcome: Busy')).toBeTruthy();
    expect(screen.queryByText(/Tarun Sobhani/)).toBeNull();
    // Notes open from "View note" rather than showing inline.
    expect(screen.queryByText('Wants a test drive on Saturday')).toBeNull();
    expect(screen.getAllByLabelText('View note: Called back by store manager')).toHaveLength(1);
    expect(screen.getAllByLabelText('Add note: Called back by store manager')).toHaveLength(1);
    expect(screen.queryByLabelText(/: Called back by AI bot$/)).toBeNull();

    await fireEvent.press(screen.getByLabelText('View note: Called back by store manager'));
    expect(onAddNote.mock.calls[0][0].log.id).toBe('c1');
  });

  it('prompts the store manager to add a call note until a call is logged', async () => {
    const onAddNote = jest.fn();
    await render(<CustomerHistory steps={leadJourney(missedLead, [])} onAddNote={onAddNote} />);
    await fireEvent.press(screen.getByLabelText('Add call note: Call back by store manager'));
    expect(onAddNote.mock.calls[0][0].kind).toBe('pending');
  });
});

describe('Call note dialog', () => {
  it('asks for the outcome and notes only, and needs an outcome before saving', async () => {
    const onSave = jest.fn();
    await render(<CallOutcomeDialog visible number="98551 35120" initial={{}} onDismiss={jest.fn()} onSave={onSave} />);
    expect(screen.getByText('What happened on the call?')).toBeTruthy();
    expect(screen.queryByText('Call status')).toBeNull();
    expect(screen.queryByText('Called by AI bot')).toBeNull();

    await fireEvent.press(screen.getByText('Save call note'));
    expect(onSave).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByText('Answered'));
    await fireEvent.changeText(screen.getByLabelText('Call notes, optional'), '  Interested in Tata Ace ');
    await fireEvent.press(screen.getByText('Save call note'));
    expect(onSave).toHaveBeenCalledWith({ outcome: 'answered', notes: 'Interested in Tata Ace' });
  });

  it('prefills a saved note when viewing it', async () => {
    await render(
      <CallOutcomeDialog visible number="98551 35120" initial={{ outcome: 'busy', notes: 'Try after 6' }} onDismiss={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.getByDisplayValue('Try after 6')).toBeTruthy();
    expect(screen.getByText('11/500')).toBeTruthy();
  });

  it('closing saves nothing', async () => {
    const onSave = jest.fn();
    const onDismiss = jest.fn();
    await render(<CallOutcomeDialog visible number="98551 35120" initial={{}} onDismiss={onDismiss} onSave={onSave} />);
    await act(async () => fireEvent.press(screen.getByLabelText('Close')));
    expect(onDismiss).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });
});

describe('Lead summary', () => {
  const { leadSummary } = require('@/lib/leadSummary');

  it('reads a fresh missed lead: one missed call, one AI bot call, waiting for a call back', () => {
    const s = leadSummary(leadJourney(missedLead, []), 'Missed');
    expect(s.stage).toBe('Missed');
    expect(s.total).toBe(2);
    expect(s.interactions).toBe('1 missed call · 1 AI bot call');
    expect(s.intent).toBeTruthy();
    expect(s.latest.title).toBe('Called back by AI bot');
    expect(s.latest.when).toBe('Today, 5:42 PM');
    expect(s.nextStep).toBe('Call the customer back, then add a note about the call.');
  });

  it("reads Priya Menon's repeat journey", () => {
    const priya = LEADS.find((l) => l.person === 'Priya Menon')!;
    const s = leadSummary(leadJourney(priya, SEED_LEAD_CALLS[priya.id]), 'Converted');
    expect(s.total).toBe(5);
    expect(s.interactions).toBe('2 missed calls · 2 AI bot calls · 1 store manager call');
    expect(s.intent).toBe('Tata Ace');
  });

  it('suggests the next step from the latest store manager call', () => {
    const after = (outcome: CallLog['outcome'], reminder = false) =>
      leadSummary(leadJourney(missedLead, [{ ...managerCall, outcome }]), 'Called by store manager', reminder).nextStep;
    expect(after('converted')).toBe('Request a review from the customer.');
    expect(after('no_answer')).toBe('Try calling again.');
    expect(after('call_later', true)).toBe('Call back tomorrow. Your reminder is set.');
    expect(leadSummary(leadJourney(missedLead, [managerCall]), 'Called by store manager').latest.title).toBe(
      'Called back by store manager · Answered',
    );
  });
});
