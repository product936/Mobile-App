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
