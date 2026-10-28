import type { Review } from '@/data/content';
import { draftReply } from '@/lib/reviews';

/**
 * Mock review replies. Swap these for real API calls (the AI drafting model
 * and Google's reply endpoint); the Reviews screen only depends on the
 * signatures.
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Drafts a reply with AI. `variant` asks for a different wording. */
export async function generateReplyDraft(review: Review, variant = 0): Promise<string> {
  await wait(900);
  return draftReply(review, variant);
}

/** Posts (or updates) the store's reply to a review. */
export async function postReply(reviewId: string, text: string): Promise<void> {
  void reviewId;
  void text;
  await wait(600);
}
