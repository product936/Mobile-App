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
