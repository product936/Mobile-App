import { LEADS } from '@/data/leads';
import { searchLeads } from '@/lib/leads';

const ids = (q: string) => searchLeads(LEADS, q).map((l) => l.id);

describe('lead search', () => {
  it('returns every lead for an empty search', () => {
    expect(searchLeads(LEADS, '   ')).toHaveLength(LEADS.length);
  });

  it('matches names, ignoring case', () => {
    expect(ids('priya')).toEqual(['l3']);
    expect(ids('ARJUN')).toEqual(['l8']);
  });

  it('matches numbers, ignoring spaces', () => {
    expect(ids('90544 64192')).toEqual(['l1']);
    expect(ids('9054464192')).toEqual(['l1']);
    expect(ids('64192')).toEqual(['l1']);
  });

  it("matches masked missed-call numbers only on the digits they show", () => {
    // l2 is a missed call shown as ••••• •5120.
    expect(ids('5120')).toEqual(['l2']);
    expect(ids('98551')).toEqual([]);
  });

  it("doesn't treat the repeat-call count as part of the number", () => {
    // "98330 04426 (1)" must not match "61".
    expect(ids('261')).not.toContain('l3');
  });

  it('finds nothing for an unknown name', () => {
    expect(ids('zzz')).toEqual([]);
  });
});
