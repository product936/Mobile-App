import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { SEED_LEAD_CALLS } from '@/data/content';
import { LEADS } from '@/data/leads';
import { addMinutes, callOutcome, currentCycle, leadJourney, shortTime, upsertCallLog, type CallLog } from '@/lib/calls';
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

describe('calls', () => {
  it('adds minutes across the hour and noon', () => {
    expect(addMinutes('5:39 PM', 3)).toBe('5:42 PM');
    expect(addMinutes('11:58 AM', 3)).toBe('12:01 PM');
    expect(addMinutes('12:59 PM', 3)).toBe('1:02 PM');
  });

  it('shortens today\'s times', () => {
    expect(shortTime('Today, 5:55 PM')).toBe('5:55 PM');
    expect(shortTime('Just now')).toBe('Just now');
  });

  it('adds a call log, then replaces it when the note is edited', () => {
    const once = upsertCallLog([], managerCall);
    const edited = upsertCallLog(once, { ...managerCall, notes: 'Booked for Saturday 10 AM' });
    expect(edited).toHaveLength(1);
    expect(edited[0].notes).toBe('Booked for Saturday 10 AM');
  });

  it('colours known outcomes: no answer and wrong number red, answered blue, converted green', () => {
    expect(callOutcome('no_answer').tone).toBe('red');
    expect(callOutcome('wrong_number').tone).toBe('red');
    expect(callOutcome('answered').tone).toBe('blue');
    expect(callOutcome('converted').tone).toBe('green');
  });
});

describe('lead journey', () => {
  it('is newest first, with times and no source labels', () => {
    const steps = leadJourney(missedLead, []);
    expect(steps.map((s) => s.kind)).toEqual(['pending', 'ai', 'missed']);
    expect(steps[0].title).toBe('Call back by store manager');
    expect(steps[0].time).toBeUndefined();
    expect(steps[1].title).toBe('Called back by AI bot');
    expect(steps[1].time).toBe('5:42 PM');
    expect(steps[1].intent).toBeTruthy();
    expect(steps[2].time).toBe('5:39 PM');
    expect(steps.every((s) => !s.meta || !/AI call|Call ·/.test(s.meta))).toBe(true);
  });

  it("shows the latest AI call's recording as on its way, and earlier ones as ready", () => {
    expect(leadJourney(missedLead, [])[1]).toMatchObject({ recordingPending: true });
    const priya = LEADS.find((l) => l.person === 'Priya Menon')!;
    const ai = leadJourney(priya, SEED_LEAD_CALLS[priya.id]).filter((s) => s.kind === 'ai');
    expect(ai[0]).toMatchObject({ time: '6:23 PM', recordingPending: true });
    expect(ai[1]).toMatchObject({ time: '5:42 PM', recordingSeconds: 32 });
  });

  it("replaces the prompt with the store manager's logged calls, newest on top", () => {
    const later: CallLog = { ...managerCall, id: 'c2', notes: 'Asked for a brochure' };
    const steps = leadJourney(missedLead, [managerCall, later]);
    expect(steps.map((s) => s.id)).toEqual(['c2', 'c1', 'ai-0', 'contact-0']);
    expect(steps[1].time).toBe('Just now');
  });

  it("starts Priya Menon's journey again after her conversion when she calls back at 6:20 PM", () => {
    const priya = LEADS.find((l) => l.person === 'Priya Menon')!;
    const steps = leadJourney(priya, SEED_LEAD_CALLS[priya.id]);
    expect(steps.map((s) => s.kind)).toEqual(['pending', 'ai', 'missed', 'manager', 'ai', 'missed']);
    expect(steps[2].time).toBe('6:20 PM');
    expect(steps[3]).toMatchObject({ time: '5:55 PM' });
    expect(steps[3].log?.outcome).toBe('converted');
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
  it('shows times on the right, View note for calls with a note, and no note action on the AI bot call', async () => {
    const onAddNote = jest.fn();
    await render(<CustomerHistory steps={leadJourney(missedLead, [managerCall])} onAddNote={onAddNote} />);
    expect(screen.getByText('Just now')).toBeTruthy();
    expect(screen.getByText('5:42 PM')).toBeTruthy();
    expect(screen.getByText('5:39 PM')).toBeTruthy();
    expect(screen.queryByText(/AI call|Call ·/)).toBeNull();
    expect(screen.queryByText('Wants a test drive on Saturday')).toBeNull();
    expect(screen.queryByText(/Tarun Sobhani/)).toBeNull();
    expect(screen.queryByLabelText(/: Called back by AI bot$/)).toBeNull();

    await fireEvent.press(screen.getByLabelText('View note: Called back by store manager'));
    expect(onAddNote.mock.calls[0][0].log.id).toBe('c1');
  });

  it('shows a quiet progress state while the AI call recording is on its way', async () => {
    await render(<CustomerHistory steps={leadJourney(missedLead, [])} onAddNote={jest.fn()} />);
    expect(screen.getByText('Getting the call recording')).toBeTruthy();
    expect(screen.getByText("It'll be ready to play within 5 minutes.")).toBeTruthy();
    expect(screen.queryByLabelText('Play recording')).toBeNull();
  });

  it('prompts the store manager to add a call note until a call is logged', async () => {
    const onAddNote = jest.fn();
    await render(<CustomerHistory steps={leadJourney(missedLead, [])} onAddNote={onAddNote} />);
    await fireEvent.press(screen.getByLabelText('Add call note: Call back by store manager'));
    expect(onAddNote.mock.calls[0][0].kind).toBe('pending');
  });
});

describe('Call note dialog', () => {
  it('asks only for notes, and needs a note before saving', async () => {
    const onSave = jest.fn();
    await render(<CallOutcomeDialog visible number="98551 35120" initial={{}} onDismiss={jest.fn()} onSave={onSave} />);
    expect(screen.getByText('What happened on the call?')).toBeTruthy();
    expect(screen.queryByText('Call outcome')).toBeNull();
    expect(screen.queryByText('Answered')).toBeNull();

    await fireEvent.press(screen.getByText('Save call note'));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Write a note to save it.')).toBeTruthy();

    await fireEvent.changeText(screen.getByLabelText('Call notes'), '  Interested in Tata Ace ');
    await fireEvent.press(screen.getByText('Save call note'));
    expect(onSave).toHaveBeenCalledWith({ notes: 'Interested in Tata Ace' });
  });

  it('prefills a saved note when viewing it', async () => {
    await render(<CallOutcomeDialog visible number="98551 35120" initial={{ notes: 'Try after 6' }} onDismiss={jest.fn()} onSave={jest.fn()} />);
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
