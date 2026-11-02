import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { REVIEWS } from '@/data/content';
import { draftReplyOptions } from '@/lib/reviews';
import { ReplyComposer } from '@/screens/reviews/ReplyComposer';
import { ReplyOptionsSheet } from '@/screens/reviews/ReplyOptionsSheet';
import { generateReplyOptions, postReply } from '@/services/reviews';
import { useAppStore } from '@/state/store';

jest.mock('expo-router', () => ({ router: { navigate: jest.fn(), push: jest.fn(), back: jest.fn() }, Link: () => null }));
jest.mock('@/services/reviews', () => {
  const { draftReplyOptions: draft } = jest.requireActual('@/lib/reviews');
  return {
    generateReplyOptions: jest.fn((review, round) => Promise.resolve(draft(review, round))),
    postReply: jest.fn(() => Promise.resolve()),
  };
});

const METRICS = { frame: { x: 0, y: 0, width: 430, height: 932 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
const withSafeArea = (ui: React.ReactElement) => <SafeAreaProvider initialMetrics={METRICS}>{ui}</SafeAreaProvider>;

const negative = REVIEWS.find((r) => r.id === 'r5')!; // Rohit Salvi, 1 star, unreplied
const positive = REVIEWS.find((r) => r.id === 'r3')!; // Meera Nair, 5 stars

describe('AI reply options', () => {
  it('are three tones that match the sentiment and use the first name', () => {
    const options = draftReplyOptions(negative);
    expect(options.map((o) => o.label)).toEqual(['Warm', 'Professional', 'Short']);
    expect(options.every((o) => o.text.includes('Rohit'))).toBe(true);
    expect(options[0].text).toMatch(/sorry/);
    expect(draftReplyOptions(positive)[0].text).toMatch(/Thank you/);
  });

  it('get fresh wordings on regenerate, then cycle', () => {
    const first = draftReplyOptions(negative, 0).map((o) => o.text);
    const second = draftReplyOptions(negative, 1).map((o) => o.text);
    first.forEach((t, i) => expect(t).not.toBe(second[i]));
    expect(draftReplyOptions(negative, 2).map((o) => o.text)).toEqual(first);
  });
});

describe('Reply options sheet', () => {
  beforeEach(() => jest.clearAllMocks());

  const open = async (onPosted = jest.fn(), editing = false) => {
    await render(withSafeArea(<ReplyOptionsSheet review={negative} editing={editing} onClose={jest.fn()} onPosted={onPosted} />));
    await screen.findByText('Pick a reply');
    return onPosted;
  };

  it('shows the review as its header and three options below', async () => {
    await open();
    expect(screen.getByText('Rohit Salvi')).toBeTruthy();
    expect(screen.getByText(negative.text)).toBeTruthy();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByLabelText('Regenerate replies')).toBeTruthy();
  });

  it('needs a pick before posting, then posts the picked option as edited', async () => {
    const onPosted = await open();
    await fireEvent.press(screen.getByText('Post reply'));
    expect(postReply).not.toHaveBeenCalled();

    const options = draftReplyOptions(negative);
    await fireEvent.press(screen.getByLabelText(`Professional reply: ${options[1].text}`));
    const box = screen.getByLabelText('Professional reply, editable');
    expect(box.props.value).toBe(options[1].text);

    const edited = `${options[1].text} Ask for Rahul.`;
    await fireEvent.changeText(box, edited);
    expect(screen.getByText('Edited')).toBeTruthy();
    await fireEvent.press(screen.getByText('Post reply'));
    expect(postReply).toHaveBeenCalledWith('r5', edited);
    expect(onPosted).toHaveBeenCalledWith(edited);
  });

  it('regenerates a fresh set and clears the pick', async () => {
    await open();
    const first = draftReplyOptions(negative, 0);
    await fireEvent.press(screen.getByLabelText(`Warm reply: ${first[0].text}`));
    await fireEvent.press(screen.getByLabelText('Regenerate replies'));
    await screen.findByText('Pick a reply');
    expect(generateReplyOptions).toHaveBeenLastCalledWith(negative, 1);
    const second = draftReplyOptions(negative, 1);
    expect(screen.getByLabelText(`Warm reply: ${second[0].text}`)).toBeTruthy();
    expect(screen.queryByLabelText('Warm reply, editable')).toBeNull();
  });

  it('says Update reply when replacing a reply', async () => {
    await open(jest.fn(), true);
    expect(screen.getByText('Update reply')).toBeTruthy();
  });

  it('offers to try again if drafting fails', async () => {
    (generateReplyOptions as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    await render(withSafeArea(<ReplyOptionsSheet review={negative} onClose={jest.fn()} onPosted={jest.fn()} />));
    expect(await screen.findByText("We couldn't write replies right now.")).toBeTruthy();
    await fireEvent.press(screen.getByText('Try again'));
    expect(await screen.findByText('Pick a reply')).toBeTruthy();
  });
});

describe('Reply composer', () => {
  beforeEach(() => jest.clearAllMocks());

  it('needs text to post, and hands over to the AI options', async () => {
    const onDraftWithAi = jest.fn();
    await render(<ReplyComposer review={negative} mode="write" onCancel={jest.fn()} onPosted={jest.fn()} onDraftWithAi={onDraftWithAi} />);
    await fireEvent.press(screen.getByText('Post reply'));
    expect(postReply).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByLabelText('Draft a reply with AI'));
    expect(onDraftWithAi).toHaveBeenCalled();
  });

  it('edits a posted reply in place', async () => {
    const onPosted = jest.fn();
    await render(
      <ReplyComposer review={negative} mode="edit" initialText="Old reply" onCancel={jest.fn()} onPosted={onPosted} onDraftWithAi={jest.fn()} />,
    );
    expect(screen.getByText('Edit your reply')).toBeTruthy();
    await fireEvent.changeText(screen.getByLabelText('Your reply'), 'New reply');
    await fireEvent.press(screen.getByText('Update reply'));
    expect(onPosted).toHaveBeenCalledWith('New reply');
  });

  it('offers to try again if posting fails', async () => {
    (postReply as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    await render(<ReplyComposer review={negative} mode="edit" initialText="A reply" onCancel={jest.fn()} onPosted={jest.fn()} onDraftWithAi={jest.fn()} />);
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

describe('Reviews list', () => {
  it('shows edit and delete only against replies', async () => {
    const ReviewsScreen = require('@/app/(app)/(tabs)/reviews').default;
    await act(async () => useAppStore.getState().signOut());
    await render(withSafeArea(<ReviewsScreen />));
    const replied = REVIEWS.filter((r) => r.reply).length;
    expect(screen.getAllByLabelText('Delete reply')).toHaveLength(replied);
    expect(screen.getAllByLabelText('Edit reply')).toHaveLength(replied);
    expect(screen.getAllByLabelText('Draft a reply with AI')).toHaveLength(REVIEWS.length - replied);
  });
});
