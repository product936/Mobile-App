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

export type ReplyTone = 'warm' | 'professional' | 'short';

export const REPLY_TONES: { tone: ReplyTone; label: string }[] = [
  { tone: 'warm', label: 'Warm' },
  { tone: 'professional', label: 'Professional' },
  { tone: 'short', label: 'Short' },
];

export type ReplyOption = { tone: ReplyTone; label: string; text: string };

type Draft = (name: string) => string;

/**
 * Sample AI replies by sentiment and tone, two wordings each so
 * "Regenerate" gives a fresh set. Swap for the real model call in
 * services/reviews.ts.
 */
const DRAFTS: Record<ReturnType<typeof sentimentOf>, Record<ReplyTone, Draft[]>> = {
  Positive: {
    warm: [
      (n) => `Thank you so much, ${n}! We're thrilled the team made your purchase easy. Enjoy the new vehicle, and we can't wait to see you again.`,
      (n) => `${n}, this made our day! Thank you for the kind words. The whole team is grateful, and we're here whenever you need us.`,
    ],
    professional: [
      (n) => `Dear ${n}, thank you for your positive feedback. We're pleased you had a smooth experience and look forward to serving you again.`,
      (n) => `Thank you, ${n}. We appreciate you taking the time to share your experience, and we've passed your kind words on to the team.`,
    ],
    short: [(n) => `Thanks a lot, ${n}! See you at your first service.`, (n) => `Thank you, ${n}. Glad we could help!`],
  },
  Neutral: {
    warm: [
      (n) => `Hi ${n}, thanks for being honest with us. We're glad parts of your visit went well, and we'd love another chance to make the rest just as good.`,
      (n) => `Thank you, ${n}. We really value this feedback, and we're already working on it so your next visit feels better from start to finish.`,
    ],
    professional: [
      (n) => `Dear ${n}, thank you for your feedback. We've shared it with the team and are reviewing how we can improve. Our manager is happy to follow up.`,
      (n) => `Thank you for your review, ${n}. We take this seriously and are making changes. Please reach out if you'd like to discuss it further.`,
    ],
    short: [(n) => `Thanks, ${n}. Noted, and we're on it.`, (n) => `Thank you, ${n}. We'll do better next time.`],
  },
  Negative: {
    warm: [
      (n) => `Hi ${n}, we're truly sorry about your experience. This isn't how we want you to feel. Our store manager will call you today to make it right.`,
      (n) => `${n}, we're so sorry we let you down. Thank you for telling us. We'd really like to fix this, and our team will reach out shortly.`,
    ],
    professional: [
      (n) => `Dear ${n}, we apologise for the inconvenience. We've escalated your feedback to the store manager, who will contact you today to resolve it.`,
      (n) => `Thank you for bringing this to our attention, ${n}. We regret your experience and will be in touch shortly to understand and address it.`,
    ],
    short: [(n) => `Sorry, ${n}. We'll call you today to fix this.`, (n) => `We apologise, ${n}. Our team will reach out today.`],
  },
};

/** Three AI reply options for a review, one per tone; `round` picks a fresh wording. */
export function draftReplyOptions(review: Pick<Review, 'name' | 'rating'>, round = 0): ReplyOption[] {
  const byTone = DRAFTS[sentimentOf(review.rating)];
  const name = firstName(review.name);
  return REPLY_TONES.map(({ tone, label }) => {
    const wordings = byTone[tone];
    return { tone, label, text: wordings[round % wordings.length](name) };
  });
}
