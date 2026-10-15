import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { callNoteText, callOutcome } from '@/lib/calls';
import { CallOutcomeDialog } from '@/sheets/lead-details/CallOutcomeDialog';

describe('call outcome', () => {
  it('writes the outcome and trimmed notes as one lead note', () => {
    expect(callNoteText('connected', '  Wants a test drive on Saturday ')).toBe('Call back: Connected. Wants a test drive on Saturday');
    expect(callNoteText('no_answer', '   ')).toBe('Call back: No answer.');
  });

  it('moves the lead only for outcomes that say where it stands', () => {
    expect(callOutcome('connected').leadStatus).toBe('Contacted');
    expect(callOutcome('call_later').leadStatus).toBe('Set for reminder');
    expect(callOutcome('wrong_number').leadStatus).toBe('Expired');
    expect(callOutcome('no_answer').leadStatus).toBeUndefined();
    expect(callOutcome('busy').leadStatus).toBeUndefined();
  });
});

describe('Call outcome dialog', () => {
  it('needs a call status before saving, and passes the notes along', async () => {
    const onSave = jest.fn();
    await render(<CallOutcomeDialog visible number="98551 35120" onDismiss={jest.fn()} onSave={onSave} />);
    expect(screen.getByText('How did the call go?')).toBeTruthy();
    expect(screen.getByText('Pick a call status to save.')).toBeTruthy();

    await fireEvent.press(screen.getByText('Save call'));
    expect(onSave).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByText('Connected'));
    await fireEvent.changeText(screen.getByLabelText('Call notes, optional'), 'Interested in Tata Ace');
    expect(screen.getByText('22/500')).toBeTruthy();
    await fireEvent.press(screen.getByText('Save call'));
    expect(onSave).toHaveBeenCalledWith('connected', 'Interested in Tata Ace');
  });

  it('closing logs nothing', async () => {
    const onSave = jest.fn();
    const onDismiss = jest.fn();
    await render(<CallOutcomeDialog visible number="98551 35120" onDismiss={onDismiss} onSave={onSave} />);
    await act(async () => fireEvent.press(screen.getByLabelText('Close')));
    expect(onDismiss).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });
});
