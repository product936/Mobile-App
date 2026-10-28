import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { REVIEWS } from '@/data/content';
import { draftReply } from '@/lib/reviews';
import { ReplyComposer } from '@/screens/reviews/ReplyComposer';
import { generateReplyDraft, postReply } from '@/services/reviews';
import { useAppStore } from '@/state/store';

jest.mock('@/services/reviews', () => {
  const { draftReply: draft } = jest.requireActual('@/lib/reviews');
  return {
    generateReplyDraft: jest.fn((review, variant) => Promise.resolve(draft(review, variant))),
    postReply: jest.fn(() => Promise.resolve()),
  };
});

const negative = REVIEWS.find((r) => r.id === 'r5')!; // Rohit Salvi, 1 star, unreplied
const positive = REVIEWS.find((r) => r.id === 'r3')!; // Meera Nair, 5 stars

describe('AI reply drafts', () => {
  it('match the sentiment and address the reviewer by first name', () => {
    expect(draftReply(negative)).toMatch(/^Hi Rohit, we're sorry/);
    expect(draftReply(positive)).toMatch(/Meera/);
    expect(draftReply(positive)).toMatch(/Thank you/);
  });

  it('give a different wording for each regenerate, then cycle', () => {
    const a = draftReply(negative, 0);
    const b = draftReply(negative, 1);
    expect(a).not.toBe(b);
    expect(draftReply(negative, 3)).toBe(a);
  });
});

describe('Reply composer', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fills an editable AI draft, marks it once edited, and posts the edited text', async () => {
    const onPosted = jest.fn();
    await render(<ReplyComposer review={negative} mode="ai" onCancel={jest.fn()} onPosted={onPosted} />);

    const box = await screen.findByLabelText('AI-drafted reply, editable');
    expect(box.props.value).toBe(draftReply(negative, 0));
    expect(screen.getByText('AI draft · tap to edit')).toBeTruthy();

    const edited = `${draftReply(negative, 0)} Ask for Rahul at the store.`;
    await fireEvent.changeText(box, edited);
    expect(screen.getByText('AI draft · edited by you')).toBeTruthy();

    await fireEvent.press(screen.getByText('Post reply'));
    expect(postReply).toHaveBeenCalledWith('r5', edited);
    expect(onPosted).toHaveBeenCalledWith(edited);
  });

  it('regenerates a different draft', async () => {
    await render(<ReplyComposer review={negative} mode="ai" onCancel={jest.fn()} onPosted={jest.fn()} />);
    await screen.findByLabelText('AI-drafted reply, editable');
    await fireEvent.press(screen.getByLabelText('Regenerate the AI draft'));
    const box = await screen.findByLabelText('AI-drafted reply, editable');
    expect(generateReplyDraft).toHaveBeenLastCalledWith(negative, 1);
    expect(box.props.value).toBe(draftReply(negative, 1));
  });

  it('lets a written reply ask for an AI draft, and needs text to post', async () => {
    await render(<ReplyComposer review={negative} mode="write" onCancel={jest.fn()} onPosted={jest.fn()} />);
    await fireEvent.press(screen.getByText('Post reply'));
    expect(postReply).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByLabelText('Draft a reply with AI'));
    expect(await screen.findByText('AI draft · tap to edit')).toBeTruthy();
  });

  it('edits a posted reply in place', async () => {
    const onPosted = jest.fn();
    await render(<ReplyComposer review={negative} mode="edit" initialText="Old reply" onCancel={jest.fn()} onPosted={onPosted} />);
    expect(screen.getByText('Edit your reply')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Your reply'), 'New reply');
    await fireEvent.press(screen.getByText('Update reply'));
    expect(onPosted).toHaveBeenCalledWith('New reply');
  });

  it('offers to try again if posting fails', async () => {
    (postReply as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    await render(<ReplyComposer review={negative} mode="edit" initialText="A reply" onCancel={jest.fn()} onPosted={jest.fn()} />);
    await fireEvent.press(screen.getByText('Update reply'));
    expect(await screen.findByText("We couldn't post your reply. Check your connection and try again.")).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });
});

describe('posted replies', () => {
  it('override deleted ones, and deleting removes them', async () => {
    await act(async () => useAppStore.getState().deleteReply('r1'));
    await act(async () => useAppStore.getState().savePostedReply('r1', 'Fresh reply'));
    expect(useAppStore.getState().postedReplies.r1).toBe('Fresh reply');
    expect(useAppStore.getState().deletedReplies).not.toContain('r1');
    await act(async () => useAppStore.getState().deleteReply('r1'));
    expect(useAppStore.getState().postedReplies.r1).toBeUndefined();
  });
});
