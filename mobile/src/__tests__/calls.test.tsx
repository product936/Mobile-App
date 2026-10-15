import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { LEADS } from '@/data/leads';
import { addMinutes, callOutcome, leadJourney, upsertCallLog, type CallLog } from '@/lib/calls';
import { CallOutcomeDialog } from '@/sheets/lead-details/CallOutcomeDialog';
import { CustomerHistory } from '@/sheets/lead-details/CustomerHistory';

const missedLead = LEADS.find((l) => l.id === 'l2')!; // Call, 5:39 PM
const formLead = LEADS.find((l) => l.source === 'Form')!;

const managerCall: CallLog = {
  id: 'c1',
  by: 'store_manager',
  outcome: 'connected',
  notes: 'Wants a test drive on Saturday',
  when: 'Just now',
  author: 'Tarun Sobhani',
};

describe('call outcome', () => {
  it('moves the lead only for outcomes that say where it stands', () => {
    expect(callOutcome('connected').leadStatus).toBe('Contacted');
    expect(callOutcome('call_later').leadStatus).toBe('Set for reminder');
    expect(callOutcome('wrong_number').leadStatus).toBe('Expired');
    expect(callOutcome('no_answer').leadStatus).toBeUndefined();
    expect(callOutcome('busy').leadStatus).toBeUndefined();
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

describe('lead journey', () => {
  it('runs missed call, AI bot call back with qualified intent, then a prompt for the store manager', () => {
    const steps = leadJourney(missedLead, []);
    expect(steps.map((s) => s.kind)).toEqual(['missed', 'ai', 'pending']);
    expect(steps[0].meta).toBe('Call · Today, 5:39 PM');
    expect(steps[1].title).toBe('Called back by AI bot');
    expect(steps[1].meta).toBe('AI call · Today, 5:42 PM');
    expect(steps[1].intent).toBeTruthy();
    expect(steps[2].title).toBe('Call back by store manager');
  });

  it("replaces the prompt with the store manager's logged calls, and attaches AI bot notes to the AI call", () => {
    const aiNote: CallLog = { ...managerCall, id: 'c0', by: 'ai_bot', notes: 'Asked for Ace pricing' };
    const steps = leadJourney(missedLead, [aiNote, managerCall]);
    expect(steps.map((s) => s.kind)).toEqual(['missed', 'ai', 'manager']);
    expect(steps[1].log?.notes).toBe('Asked for Ace pricing');
    expect(steps[2].meta).toBe('Call · Just now · Tarun Sobhani');
  });

  it('starts from how the customer first reached the store', () => {
    expect(leadJourney(formLead, [])[0].title).toBe('Filled an enquiry form');
  });
});

describe('Customer history', () => {
  it('shows each step and opens the note dialog for the right call', async () => {
    const onAddNote = jest.fn();
    await render(<CustomerHistory steps={leadJourney(missedLead, [managerCall])} onAddNote={onAddNote} />);
    expect(screen.getByText('Missed call from the customer')).toBeTruthy();
    expect(screen.getByText('Called back by AI bot')).toBeTruthy();
    expect(screen.getByText('Called back by store manager')).toBeTruthy();
    expect(screen.getByText('Wants a test drive on Saturday')).toBeTruthy();

    await fireEvent.press(screen.getByLabelText('Add note: Called back by AI bot'));
    expect(onAddNote.mock.calls[0][0].kind).toBe('ai');
    await fireEvent.press(screen.getByLabelText('Edit note: Called back by store manager'));
    expect(onAddNote.mock.calls[1][0].log.id).toBe('c1');
  });
});

describe('Call note dialog', () => {
  it('needs a call outcome before saving, and saves the call status and notes', async () => {
    const onSave = jest.fn();
    await render(
      <CallOutcomeDialog visible number="98551 35120" initial={{ by: 'store_manager' }} onDismiss={jest.fn()} onSave={onSave} />,
    );
    expect(screen.getByText('What happened on the call?')).toBeTruthy();
    expect(screen.getByText('Called by store manager')).toBeTruthy();

    await fireEvent.press(screen.getByText('Save call note'));
    expect(onSave).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByLabelText('Call status, Called by store manager'));
    await fireEvent.press(screen.getByText('Called by AI bot'));
    await fireEvent.press(screen.getByText('Connected'));
    await fireEvent.changeText(screen.getByLabelText('Call notes, optional'), '  Interested in Tata Ace ');
    await fireEvent.press(screen.getByText('Save call note'));
    expect(onSave).toHaveBeenCalledWith({ by: 'ai_bot', outcome: 'connected', notes: 'Interested in Tata Ace' });
  });

  it('prefills an existing note for editing', async () => {
    await render(
      <CallOutcomeDialog
        visible
        number="98551 35120"
        initial={{ by: 'store_manager', outcome: 'busy', notes: 'Try after 6' }}
        onDismiss={jest.fn()}
        onSave={jest.fn()}
      />,
    );
    expect(screen.getByDisplayValue('Try after 6')).toBeTruthy();
    expect(screen.getByText('11/500')).toBeTruthy();
  });

  it('closing saves nothing', async () => {
    const onSave = jest.fn();
    const onDismiss = jest.fn();
    await render(<CallOutcomeDialog visible number="98551 35120" initial={{ by: 'store_manager' }} onDismiss={onDismiss} onSave={onSave} />);
    await act(async () => fireEvent.press(screen.getByLabelText('Close')));
    expect(onDismiss).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });
});
