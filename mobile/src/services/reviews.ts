import type { Review } from '@/data/content';
import { draftReplyOptions, type ReplyOption } from '@/lib/reviews';

/**
 * Mock review replies. Swap these for real API calls (the AI drafting model
 * and Google's reply endpoint); the Reviews screen only depends on the
 * signatures.
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Drafts three AI reply options for a review. `round` asks for a fresh set. */
export async function generateReplyOptions(review: Review, round = 0): Promise<ReplyOption[]> {
  await wait(1100);
  return draftReplyOptions(review, round);
}

/** Posts (or updates) the store's reply to a review. */
export async function postReply(reviewId: string, text: string): Promise<void> {
  void reviewId;
  void text;
  await wait(600);
}
