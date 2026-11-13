import type { Lead, LeadSourceFilter, LeadStatusFilter } from '@/data/leads';
import { maskPhone } from '@/lib/format';

/** Strips the repeat-call count: "98330 04426 (1)" → "98330 04426". */
export function dialableNumber(raw: string): string {
  return raw.replace(/\s*\(\d+\)$/, '');
}

/**
 * What a lead row shows. Missed-call numbers stay masked until the store calls
 * back; leads with a known name (form submissions, or a name the user added)
 * show the name instead.
 */
export function leadPresentation(lead: Lead) {
  const missed = lead.status === 'Missed';
  const number = missed ? maskPhone(lead.number) : lead.number;
  return {
    missed,
    converted: lead.status === 'Converted',
    title: lead.person || number,
    number,
  };
}

export function filterLeads<T extends Lead>(leads: T[], status: LeadStatusFilter, source: LeadSourceFilter): T[] {
  return leads.filter(
    (l) => (status === 'All status' || l.status === status) && (source === 'All sources' || l.source === source),
  );
}

/**
 * Leads whose name or number matches a search, ignoring case and spaces.
 * Numbers match only on the digits the row shows, so a masked missed-call
 * number can't be found by its hidden digits.
 */
export function searchLeads<T extends Lead>(leads: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return leads;
  const digits = q.replace(/\D/g, '');
  const textOnly = q.replace(/[\d\s+()-]/g, '');
  return leads.filter((l) => {
    if (textOnly && l.person?.toLowerCase().includes(q)) return true;
    if (digits && digits.length === q.replace(/[\s+()-]/g, '').length) {
      // Without the repeat-call count, e.g. "98330 04426 (1)".
      return dialableNumber(leadPresentation(l).number).replace(/\D/g, '').includes(digits);
    }
    return false;
  });
}
