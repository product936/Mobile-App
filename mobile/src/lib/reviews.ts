import type { Review } from '@/data/content';
import type { ReviewFilters } from '@/state/store';

/** Sentiment derived from the star rating: 4–5 positive, 3 neutral, 1–2 negative. */
export function sentimentOf(rating: number): 'Positive' | 'Neutral' | 'Negative' {
  if (rating >= 4) return 'Positive';
  if (rating === 3) return 'Neutral';
  return 'Negative';
}

export function filterReviews(reviews: Review[], f: ReviewFilters): Review[] {
  return reviews.filter((r) => {
    if (r.rating < f.ratingMin || r.rating > f.ratingMax) return false;
    if (f.status === 'Replied' && !r.reply) return false;
    if (f.status === 'Unreplied' && r.reply) return false;
    if (f.sentiment !== 'All' && sentimentOf(r.rating) !== f.sentiment) return false;
    if (f.ratingType === 'Rating with text' && !r.text) return false;
    if (f.ratingType === 'Rating without text' && r.text) return false;
    return true;
  });
}

export const REPLY_MAX = 1000;

const firstName = (name: string) => name.split(' ')[0];

/**
 * Sample AI reply drafts by sentiment, a few wordings each so "Regenerate"
 * gives something different. Swap for the real model call in
 * services/reviews.ts.
 */
const DRAFTS: Record<ReturnType<typeof sentimentOf>, ((name: string) => string)[]> = {
  Positive: [
    (n) => `Thank you so much, ${n}! We're glad the team made your purchase easy. We look forward to seeing you again.`,
    (n) => `Hi ${n}, thanks for the kind words. It means a lot to the team, and we're always here if you need anything.`,
    (n) => `${n}, we really appreciate you taking the time to share this. Enjoy your new vehicle, and see you at your first service.`,
  ],
  Neutral: [
    (n) => `Hi ${n}, thank you for the feedback. We're glad parts of your visit went well, and we're working on the rest. We'd love another chance to impress you.`,
    (n) => `Thanks, ${n}. We hear you, and we're sharing this with the team so your next visit feels better from start to finish.`,
    (n) => `Hi ${n}, we appreciate the honest review. If you share a little more about what we could do better, our manager will follow up personally.`,
  ],
  Negative: [
    (n) => `Hi ${n}, we're sorry about your experience. This isn't the standard we aim for. Our store manager will call you today to make it right.`,
    (n) => `${n}, thank you for telling us, and we apologise. We'd like to understand what went wrong; please expect a call from our team shortly.`,
    (n) => `Hi ${n}, we're sorry we let you down. We've shared your feedback with the team and would like to fix this for you personally.`,
  ],
};

/** An AI reply draft for a review; `variant` picks a different wording. */
export function draftReply(review: Pick<Review, 'name' | 'rating'>, variant = 0): string {
  const options = DRAFTS[sentimentOf(review.rating)];
  return options[variant % options.length](firstName(review.name));
}
