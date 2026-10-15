import type { LeadStatus } from '@/data/leads';
import { LOCATION_FILTERS, type FilterLevel } from '@/data/locations';
import { colors } from '@/theme/tokens';

/** Indian digit grouping (1,23,456), without relying on Intl being present on-device. */
export function formatIN(n: number): string {
  const s = String(Math.trunc(Math.abs(n)));
  const sign = n < 0 ? '-' : '';
  if (s.length <= 3) return sign + s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${sign}${rest},${last3}`;
}

/**
 * Masks a caller number, keeping the last four digits: "98551 35120" → "••••• •5120".
 * A trailing repeat-count like " (1)" is preserved. Non-numeric input is returned as-is.
 */
export function maskPhone(raw: string): string {
  const m = raw.match(/^([\d\s]+?)(\s*\(\d+\))?$/);
  if (!m) return raw;
  const digits = m[1].replace(/\s+/g, '');
  if (digits.length < 4) return raw;
  const masked = '•'.repeat(digits.length - 4) + digits.slice(-4);
  const grouped = masked.length > 5 ? `${masked.slice(0, 5)} ${masked.slice(5)}` : masked;
  return grouped + (m[2] ?? '');
}

/** Masks a 10-digit login number for the OTP screen: "9876543210" → "••••••3210". */
export function maskLoginNumber(digits: string): string {
  return digits.length === 10 ? digits.replace(/\d(?=\d{4})/g, '•') : '••••••••••';
}

export function onlyDigits(value: string, max = 10): string {
  return value.replace(/\D/g, '').slice(0, max);
}

export function leadStatusColor(status: LeadStatus): string {
  switch (status) {
    case 'Missed':
      return colors.error;
    case 'Called by AI bot':
      return colors.violet600;
    case 'Called by store manager':
      return colors.primaryDeep;
    case 'Not contacted':
      return colors.warning;
    case 'Set for reminder':
    case 'Review sent':
      return colors.info;
    case 'Converted':
      return colors.success;
    case 'Expired':
      return colors.textTertiary;
    default:
      return colors.textSecondary;
  }
}

export type LocationSelection = Record<FilterLevel, string[]>;

export const EMPTY_SELECTION: LocationSelection = { state: [], city: [], store: [] };

/** Number of locations covered by a selection: state and city counts plus one per store. */
export function selectedLocationCount(sel: LocationSelection): number {
  const fromCounted = (level: 'state' | 'city') =>
    sel[level].reduce((acc, name) => acc + (LOCATION_FILTERS[level].find((o) => o.name === name)?.count ?? 0), 0);
  return fromCounted('state') + fromCounted('city') + sel.store.length;
}

export function selectionSize(sel: LocationSelection): number {
  return sel.state.length + sel.city.length + sel.store.length;
}

/** The home "Let's get started" card shows only when exactly Karnataka is selected. */
export function isKarnatakaOnly(sel: LocationSelection, all: boolean): boolean {
  return !all && sel.state.length === 1 && sel.state[0] === 'Karnataka' && sel.city.length === 0 && sel.store.length === 0;
}

/** Toggles one row; tapping any row while "All locations" is on starts a fresh selection. */
export function toggleSelection(
  sel: LocationSelection,
  all: boolean,
  level: FilterLevel,
  name: string,
): { selection: LocationSelection; all: boolean } {
  const base = all ? EMPTY_SELECTION : sel;
  const current = new Set(base[level]);
  if (current.has(name)) current.delete(name);
  else current.add(name);
  return { selection: { ...base, [level]: [...current] }, all: false };
}

/** Background and foreground for a lead status chip, e.g. the pill next to "Lead details". */
export function leadStatusTint(status: LeadStatus): { bg: string; fg: string } {
  switch (status) {
    case 'Missed':
      return { bg: colors.red100, fg: colors.error };
    case 'Called by AI bot':
      return { bg: colors.violet100, fg: colors.violet600 };
    case 'Called by store manager':
      return { bg: colors.indigo50, fg: colors.primaryDeep };
    case 'Not contacted':
      return { bg: colors.amber100, fg: colors.amber700 };
    case 'Set for reminder':
    case 'Contacted':
      return { bg: colors.blue50, fg: colors.primaryAccent };
    case 'Converted':
    case 'Review sent':
      return { bg: colors.successBg, fg: colors.success };
    default:
      return { bg: colors.surfaceBase, fg: colors.textTertiary };
  }
}
