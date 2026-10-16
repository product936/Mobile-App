/**
 * Mock access requests. Swap for a real API call; the Reviews screen only
 * depends on the signature.
 */
export type Feature = 'reviews';

/** Asks the account's admin to turn on a feature for this user. */
export async function requestAccess(feature: Feature): Promise<void> {
  void feature;
  await new Promise((resolve) => setTimeout(resolve, 700));
}
