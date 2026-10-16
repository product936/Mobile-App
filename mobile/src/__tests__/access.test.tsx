import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { requestAccess } from '@/services/access';
import { accessForNumber, roleForNumber } from '@/services/auth';
import { ReviewsLocked } from '@/screens/ReviewsLocked';
import { useAppStore } from '@/state/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const METRICS = { frame: { x: 0, y: 0, width: 430, height: 932 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } };
const renderLocked = () =>
  render(
    <SafeAreaProvider initialMetrics={METRICS}>
      <ReviewsLocked />
    </SafeAreaProvider>,
  );

jest.mock('@/services/access', () => ({ requestAccess: jest.fn(() => Promise.resolve()) }));
jest.mock('expo-router', () => ({ router: { navigate: jest.fn(), push: jest.fn() } }));

describe('review access', () => {
  it('signs 9999999999 in as a store manager without access to Reviews', () => {
    expect(roleForNumber('9999999999')).toBe('store');
    expect(accessForNumber('9999999999')).toEqual({ reviews: false });
  });

  it('keeps full access for the existing demo numbers and anyone else', () => {
    expect(accessForNumber('9876543210')).toEqual({ reviews: true });
    expect(accessForNumber('9876500070')).toEqual({ reviews: true });
    expect(accessForNumber('9123456780')).toEqual({ reviews: true });
  });

  it('resets access on sign out', async () => {
    await act(async () => useAppStore.getState().signIn('store', { reviews: false }));
    expect(useAppStore.getState().access.reviews).toBe(false);
    await act(async () => useAppStore.getState().signOut());
    expect(useAppStore.getState().access.reviews).toBe(true);
    expect(useAppStore.getState().accessRequested).toEqual([]);
  });
});

describe('Reviews without access', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => useAppStore.getState().signOut());
    await act(async () => useAppStore.getState().signIn('store', { reviews: false }));
  });

  it('explains the missing access and asks the admin on Request access', async () => {
    await renderLocked();
    expect(screen.getByText("You don't have access to Reviews yet")).toBeTruthy();
    expect(screen.getByText('Read every Google review for your store')).toBeTruthy();

    await fireEvent.press(screen.getByText('Request access'));
    expect(requestAccess).toHaveBeenCalledWith('reviews');
    expect(await screen.findByText('Access requested')).toBeTruthy();
    expect(screen.getByText('Request sent')).toBeTruthy();
    expect(screen.queryByText('Request access')).toBeNull();
  });

  it('remembers the request on a later visit', async () => {
    await act(async () => useAppStore.getState().markAccessRequested('reviews'));
    await renderLocked();
    expect(screen.getByText('Access requested')).toBeTruthy();
  });

  it('offers to try again if the request fails', async () => {
    (requestAccess as jest.Mock).mockRejectedValueOnce(new Error('offline'));
    await renderLocked();
    await fireEvent.press(screen.getByText('Request access'));
    expect(await screen.findByText("We couldn't send your request. Check your connection and try again.")).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });
});
