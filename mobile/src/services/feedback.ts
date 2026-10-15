/**
 * Mock services for review requests and in-app feedback. Swap these for real
 * API calls; screens depend only on the signatures.
 */
export type ReviewChannel = 'whatsapp' | 'sms';
export type FeedbackContext = 'review_request' | 'status_update';
export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Sends the store's review link to the customer on the chosen channel. */
export async function sendReviewRequest(channel: ReviewChannel, message: string): Promise<void> {
  await wait(700);
  void channel;
  void message;
}

/** Records how easy the user found a task (1 very hard to 5 very easy), with an optional comment. */
export async function submitFeedback(entry: { context: FeedbackContext; rating: FeedbackRating; comment: string }): Promise<void> {
  await wait(500);
  void entry;
}
