import type { Role } from '@/config/roles';

/** What a signed-in account can open. Everything is on unless the account says otherwise. */
export type Access = { reviews: boolean };
export const FULL_ACCESS: Access = { reviews: true };

/**
 * Mock OTP authentication. Swap these functions for real API calls; screens
 * only depend on the signatures.
 *
 * The signed-in account decides the role. For the demo, numbers listed in
 * DEMO_ACCOUNTS map to a role and every other number falls back to
 * EXPO_PUBLIC_DEMO_ROLE (default: store manager). 9999999999 is a store
 * manager without access to Reviews.
 */
const DEMO_ACCOUNTS: Record<string, { role: Role; access?: Partial<Access> }> = {
  '9876543210': { role: 'store' },
  '9876500070': { role: 'regional' },
  '9999999999': { role: 'store', access: { reviews: false } },
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function defaultRole(): Role {
  return process.env.EXPO_PUBLIC_DEMO_ROLE === 'regional' ? 'regional' : 'store';
}

export function roleForNumber(phone: string): Role {
  return DEMO_ACCOUNTS[phone]?.role ?? defaultRole();
}

export function accessForNumber(phone: string): Access {
  return { ...FULL_ACCESS, ...DEMO_ACCOUNTS[phone]?.access };
}

/** Sends a code by SMS to the number and one to the email registered against it. */
export async function requestCodes(phone: string): Promise<{ maskedEmail: string }> {
  await wait(800);
  void phone;
  return { maskedEmail: 'r••••••@company.com' };
}

/** Verifies both codes and returns the account's role and access. */
export async function verifyCodes(
  phone: string,
  mobileCode: string,
  emailCode: string,
): Promise<{ role: Role; access: Access }> {
  await wait(1600);
  if (mobileCode.length !== 6 || emailCode.length !== 6) throw new Error('Both 6-digit codes are required.');
  return { role: roleForNumber(phone), access: accessForNumber(phone) };
}
