import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { FeedbackDialog } from '@/sheets/FeedbackDialog';
import { submitFeedback } from '@/services/feedback';
import { useAppStore } from '@/state/store';

jest.mock('@/services/feedback', () => ({
  submitFeedback: jest.fn(() => Promise.resolve()),
}));

async function openDialog(context: 'review_request' | 'status_update') {
  await render(<FeedbackDialog />);
  await act(async () => useAppStore.getState().openFeedback(context));
}

describe('Quick feedback dialog', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => useAppStore.getState().closeFeedback());
  });

  it('asks about the task that was just completed', async () => {
    await openDialog('status_update');
    expect(screen.getByText('Tap a face. How easy was updating this lead?')).toBeTruthy();
    expect(screen.getByText('Pick a face to rate this task')).toBeTruthy();
    // One title and one way to skip.
    expect(screen.getAllByText('Quick feedback?')).toHaveLength(1);
    expect(screen.queryByText('How was that?')).toBeNull();
    expect(screen.queryByText('Skip')).toBeNull();
    expect(screen.getByText('Skip for now')).toBeTruthy();
  });

  it('sends nothing until a face is picked, then sends the rating and comment', async () => {
    await openDialog('review_request');

    await fireEvent.press(screen.getByText('Send feedback'));
    expect(submitFeedback).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByLabelText('Tricky, 2 of 5'));
    expect(screen.getByText('Tricky')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Tell us more, optional'), '  Link preview was slow  ');
    expect(screen.getByText('25/500')).toBeTruthy();

    await fireEvent.press(screen.getByText('Send feedback'));
    expect(submitFeedback).toHaveBeenCalledWith({ context: 'review_request', rating: 2, comment: 'Link preview was slow' });
    expect(await screen.findByText('Thanks for your feedback')).toBeTruthy();
  });

  it('skipping closes without sending', async () => {
    await openDialog('review_request');
    await fireEvent.press(screen.getByText('Skip for now'));
    expect(useAppStore.getState().feedbackPrompt).toBeNull();
    expect(submitFeedback).not.toHaveBeenCalled();
  });
});
