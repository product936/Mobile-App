import type { Role } from '@/config/roles';

/**
 * Mock OTP authentication. Swap these functions for real API calls; screens
 * only depend on the signatures.
 *
 * The signed-in account decides the role. For the demo, numbers listed in
 * DEMO_ACCOUNTS map to a role and every other number falls back to
 * EXPO_PUBLIC_DEMO_ROLE (default: store manager).
 */
const DEMO_ACCOUNTS: Record<string, Role> = {
  '9876543210': 'store',
  '9876500070': 'regional',
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function defaultRole(): Role {
  return process.env.EXPO_PUBLIC_DEMO_ROLE === 'regional' ? 'regional' : 'store';
}

export function roleForNumber(phone: string): Role {
  return DEMO_ACCOUNTS[phone] ?? defaultRole();
}

/** Sends a code by SMS to the number and one to the email registered against it. */
export async function requestCodes(phone: string): Promise<{ maskedEmail: string }> {
  await wait(800);
  void phone;
  return { maskedEmail: 'r••••••@company.com' };
}

/** Verifies both codes and returns the account's role. */
export async function verifyCodes(phone: string, mobileCode: string, emailCode: string): Promise<{ role: Role }> {
  await wait(1600);
  if (mobileCode.length !== 6 || emailCode.length !== 6) throw new Error('Both 6-digit codes are required.');
  return { role: roleForNumber(phone) };
}
