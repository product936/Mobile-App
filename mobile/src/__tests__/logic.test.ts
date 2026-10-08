import { applyOtpInput } from '@/components/OtpInput';
import { pickThumb, valueAt } from '@/components/RangeSlider';
import { ROLE_CONFIGS } from '@/config/roles';
import { REVIEWS } from '@/data/content';
import { LEADS } from '@/data/leads';
import {
  EMPTY_SELECTION,
  formatIN,
  isKarnatakaOnly,
  maskLoginNumber,
  maskPhone,
  selectedLocationCount,
  toggleSelection,
} from '@/lib/format';
import { buildLeaderboard, citiesOf, locationsOf, resolveLevelJump } from '@/lib/leaderboard';
import { dialableNumber, filterLeads, leadPresentation } from '@/lib/leads';
import { filterReviews } from '@/lib/reviews';
import { roleForNumber } from '@/services/auth';
import { DEFAULT_REVIEW_FILTERS } from '@/state/store';

describe('formatting', () => {
  it('groups numbers the Indian way', () => {
    expect(formatIN(999)).toBe('999');
    expect(formatIN(1085)).toBe('1,085');
    expect(formatIN(2620000)).toBe('26,20,000');
  });

  it('masks all but the last four digits and keeps the repeat count', () => {
    expect(maskPhone('98551 35120')).toBe('••••• •5120');
    expect(maskPhone('98330 04426 (1)')).toBe('••••• •4426 (1)');
    expect(maskPhone('Priya Menon')).toBe('Priya Menon');
  });

  it('masks the login number on the OTP screen', () => {
    expect(maskLoginNumber('9876543210')).toBe('••••••3210');
    expect(maskLoginNumber('98765')).toBe('••••••••••');
  });
});

describe('location filter', () => {
  it('starts empty and turns "All locations" off when an item is picked', () => {
    const fromAll = toggleSelection(EMPTY_SELECTION, true, 'state', 'Karnataka');
    expect(fromAll).toEqual({ selection: { state: ['Karnataka'], city: [], store: [] }, all: false });
    const removed = toggleSelection(fromAll.selection, false, 'state', 'Karnataka');
    expect(removed.selection.state).toEqual([]);
  });

  it('counts locations from states and cities, plus one per store', () => {
    expect(selectedLocationCount({ state: ['Karnataka'], city: [], store: [] })).toBe(412);
    expect(
      selectedLocationCount({ state: ['Karnataka'], city: ['Mumbai'], store: ['Tata Motors CV — Baner'] }),
    ).toBe(412 + 205 + 1);
  });

  it('shows the empty-state card only for exactly Karnataka', () => {
    expect(isKarnatakaOnly({ state: ['Karnataka'], city: [], store: [] }, false)).toBe(true);
    expect(isKarnatakaOnly({ state: ['Karnataka'], city: [], store: [] }, true)).toBe(false);
    expect(isKarnatakaOnly({ state: ['Karnataka', 'Goa'], city: [], store: [] }, false)).toBe(false);
    expect(isKarnatakaOnly({ state: ['Karnataka'], city: ['Bengaluru'], store: [] }, false)).toBe(false);
  });
});

describe('leads', () => {
  it('masks missed calls, shows form names, and shows recovered numbers in full', () => {
    const byId = (id: string) => LEADS.find((l) => l.id === id)!;
    expect(leadPresentation(byId('l2')).title).toBe('••••• •5120');
    expect(leadPresentation(byId('l3')).title).toBe('Priya Menon');
    expect(leadPresentation(byId('l1')).title).toBe('90544 64192');
  });

  it('filters by status and source together', () => {
    expect(filterLeads(LEADS, 'Missed', 'All sources').map((l) => l.id)).toEqual(['l2', 'l4']);
    expect(filterLeads(LEADS, 'Contacted', 'Form').map((l) => l.id)).toEqual(['l10']);
    expect(filterLeads(LEADS, 'All status', 'All sources')).toHaveLength(LEADS.length);
  });

  it('marks exactly three contacted leads as hot and drops "Chat" from statuses', () => {
    expect(LEADS.filter((l) => l.hot && l.status === 'Contacted')).toHaveLength(3);
    expect(LEADS.some((l) => (l.status as string) === 'Chat')).toBe(false);
  });

  it('strips the repeat count before dialling', () => {
    expect(dialableNumber('98330 04426 (1)')).toBe('98330 04426');
  });
});

describe('reviews', () => {
  it('filters by rating range and reply status', () => {
    const low = filterReviews(REVIEWS, { ...DEFAULT_REVIEW_FILTERS, ratingMax: 2 });
    expect(low.map((r) => r.name)).toEqual(['Nitish Choudhary', 'Rohit Salvi']);
    const unreplied = filterReviews(REVIEWS, { ...DEFAULT_REVIEW_FILTERS, status: 'Unreplied' });
    expect(unreplied).toHaveLength(3);
  });

  it('maps sentiment from the star rating', () => {
    expect(filterReviews(REVIEWS, { ...DEFAULT_REVIEW_FILTERS, sentiment: 'Positive' }).map((r) => r.name)).toEqual(['Meera Nair']);
  });
});

describe('leaderboard', () => {
  const base = { stateName: null, cityName: null, query: '' };

  it('lists all 29 states ranked by missed calls', () => {
    const view = buildLeaderboard({ ...base, level: 'state', metric: 'Calls' });
    expect(view.rows).toHaveLength(29);
    expect(view.rows[0].name).toBe('Karnataka');
    expect(view.rows.map((r) => r.rank)).toEqual(view.rows.map((_, i) => i + 1));
    expect(view.listLabel).toBe('States by missed calls');
  });

  it('flags percentages above 20% in red', () => {
    const view = buildLeaderboard({ ...base, level: 'state', metric: 'Calls' });
    for (const row of view.rows) expect(row.alarming).toBe(parseInt(row.big, 10) > 20);
    expect(view.card2.label).toBe('Missed');
  });

  it('keeps negative-review share within 5–20%', () => {
    const view = buildLeaderboard({ ...base, level: 'state', metric: 'Reviews' });
    for (const row of view.rows) {
      const pct = parseInt(row.big, 10);
      expect(pct).toBeGreaterThanOrEqual(5);
      expect(pct).toBeLessThanOrEqual(20);
    }
    expect(view.card1.label).toBe('Total reviews');
    expect(view.bigLabel).toBe('NEGATIVE');
  });

  it('shows the fixed Forms summary cards', () => {
    const view = buildLeaderboard({ ...base, level: 'state', metric: 'Forms' });
    expect(view.card1).toEqual({ label: 'Total leads', value: '157' });
    expect(view.card2.value).toBe('27%');
  });

  it('drills from states to cities to locations, synthesizing data where needed', () => {
    const cities = buildLeaderboard({ ...base, level: 'city', stateName: 'Goa', metric: 'Calls' });
    expect(cities.rows.map((r) => r.name)).toEqual(['Goa — Central', 'Goa — Outer']);
    const goa = citiesOf({ name: 'Goa', calls: 240, missed: 38 });
    expect(goa[0].calls + goa[1].calls).toBe(240);
    const stores = locationsOf(goa[0]);
    expect(stores[0].name).toBe('Tata Commercial Vehicle — Central Hub');
    const locations = buildLeaderboard({ ...base, level: 'location', stateName: 'Karnataka', cityName: 'Bengaluru', metric: 'Calls' });
    expect(locations.rows[0]).toMatchObject({ name: 'Tata Commercial Vehicle — Whitefield', sub: 'Whitefield Main Rd, Bengaluru 560066', drillable: false });
  });

  it('fills in state and city when jumping straight to a level', () => {
    expect(resolveLevelJump('location', null, null)).toEqual({ stateName: 'Karnataka', cityName: 'Bengaluru' });
    expect(resolveLevelJump('city', null, null)).toEqual({ stateName: 'Karnataka', cityName: null });
  });
});

describe('OTP entry', () => {
  const empty = ['', '', '', '', '', ''];

  it('advances after a typed digit', () => {
    expect(applyOtpInput(empty, 0, '4')).toEqual({ digits: ['4', '', '', '', '', ''], focus: 1 });
  });

  it('spreads a pasted code across the boxes', () => {
    expect(applyOtpInput(empty, 0, '123456').digits).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  it('replaces an existing digit when typing over it', () => {
    const filled = ['5', '', '', '', '', ''];
    expect(applyOtpInput(filled, 0, '57').digits[0]).toBe('7');
  });

  it('clears a box', () => {
    expect(applyOtpInput(['1', '2', '', '', '', ''], 1, '').digits).toEqual(['1', '', '', '', '', '']);
  });
});

describe('rating slider', () => {
  it('snaps positions to whole stars', () => {
    expect(valueAt(11, 322, 1, 5)).toBe(1);
    expect(valueAt(311, 322, 1, 5)).toBe(5);
    expect(valueAt(161, 322, 1, 5)).toBe(3);
  });

  it('never gets stuck when both thumbs overlap', () => {
    expect(pickThumb(1, 1, 1, 5)).toBe('high');
    expect(pickThumb(5, 5, 5, 5)).toBe('low');
    expect(pickThumb(2, 1, 5, 5)).toBe('low');
    expect(pickThumb(4, 1, 5, 5)).toBe('high');
  });
});

describe('roles', () => {
  it('gives only regional managers the leaderboard and region summary', () => {
    expect(ROLE_CONFIGS.store.tabs).not.toContain('leaderboard');
    expect(ROLE_CONFIGS.store.home.regionSummary).toBeNull();
    expect(ROLE_CONFIGS.regional.tabs).toContain('leaderboard');
    expect(ROLE_CONFIGS.regional.home.cta).toEqual({ label: 'Show me who is losing the most', action: 'openLeaderboard' });
  });

  it('maps demo accounts to roles', () => {
    expect(roleForNumber('9876500070')).toBe('regional');
    expect(roleForNumber('9876543210')).toBe('store');
  });
});
