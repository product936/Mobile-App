import { LEADERBOARD_STATES, type LbLocation, type LbState } from '@/data/locations';
import { formatIN } from '@/lib/format';

export type LbLevel = 'state' | 'city' | 'location';
export type LbMetric = 'Calls' | 'Forms' | 'Reviews';

type Totals = { calls: number; missed: number };
type CityNode = { name: string; locations?: LbLocation[]; calls: number; missed: number };

const sum = (items: Totals[]): Totals =>
  items.reduce((a, x) => ({ calls: a.calls + x.calls, missed: a.missed + x.missed }), { calls: 0, missed: 0 });

/** Cities of a state. States without hand-authored data get Central/Outer splits so drill-down always works. */
export function citiesOf(state: LbState): CityNode[] {
  if ('cities' in state) {
    return state.cities.map((c) => ({ name: c.name, locations: c.locations, ...sum(c.locations) }));
  }
  if (!state.calls) return [];
  const calls = Math.round(state.calls * 0.6);
  const missed = Math.round(state.missed * 0.6);
  return [
    { name: `${state.name} — Central`, calls, missed },
    { name: `${state.name} — Outer`, calls: state.calls - calls, missed: state.missed - missed },
  ];
}

/** Locations in a city, synthesizing two stores for generated cities. */
export function locationsOf(city: CityNode): LbLocation[] {
  if (city.locations) return city.locations;
  const [stateName, area = city.name] = city.name.split(' — ');
  const calls = Math.round(city.calls * 0.55);
  const missed = Math.round(city.missed * 0.55);
  return [
    { name: `Tata Commercial Vehicle — ${area} Hub`, address: `${area} Main Rd, ${stateName}`, calls, missed },
    {
      name: `Tata Commercial Vehicle — ${area} Bazaar`,
      address: `${area} Market, ${stateName}`,
      calls: city.calls - calls,
      missed: city.missed - missed,
    },
  ];
}

export function stateTotals(state: LbState): Totals {
  return 'cities' in state ? sum(citiesOf(state)) : { calls: state.calls, missed: state.missed };
}

export type LbRow = {
  name: string;
  rank: number;
  sub: string;
  big: string;
  /** Percentages above 20% are flagged red. */
  alarming: boolean;
  drillable: boolean;
};

export type LbView = {
  rows: LbRow[];
  listLabel: string;
  card1: { label: string; value: string };
  card2: { label: string; value: string; alarming: boolean };
  bigLabel: string;
};

type Entry = Totals & { name: string; sub: string; drillable: boolean };

/** Builds what the leaderboard renders for a level, scope, metric tab and search query. */
export function buildLeaderboard(params: {
  level: LbLevel;
  stateName: string | null;
  cityName: string | null;
  metric: LbMetric;
  query: string;
  data?: LbState[];
}): LbView {
  const { level, stateName, cityName, metric, query, data = LEADERBOARD_STATES } = params;
  const callsSub = (t: Totals) => `${formatIN(t.calls)} calls · ${formatIN(t.missed)} missed`;

  let entries: Entry[] = [];
  let listLabel = 'States by missed calls';
  if (level === 'state') {
    entries = data.map((s) => {
      const t = stateTotals(s);
      return { name: s.name, ...t, drillable: true, sub: callsSub(t) };
    });
  } else {
    const state = data.find((s) => s.name === stateName);
    const cities = state ? citiesOf(state) : [];
    if (level === 'city') {
      entries = cities.map((c) => ({ name: c.name, calls: c.calls, missed: c.missed, drillable: true, sub: callsSub(c) }));
      listLabel = `Cities in ${stateName}`;
    } else {
      const city = cities.find((c) => c.name === cityName);
      entries = (city ? locationsOf(city) : []).map((l) => ({ ...l, drillable: false, sub: l.address }));
      listLabel = `Locations in ${cityName}`;
    }
  }

  const q = query.trim().toLowerCase();
  if (q) entries = entries.filter((e) => e.name.toLowerCase().includes(q));
  entries.sort((a, b) => b.missed - a.missed);

  const total = sum(entries);
  const totalPct = total.calls ? Math.round((total.missed / total.calls) * 100) : 0;
  // Negative-review share is derived from the missed rate and kept within 5–20%.
  const negPctFrom = (pct: number) => Math.max(5, Math.min(20, Math.round(pct * 0.5)));

  const rows: LbRow[] = entries.map((e, i) => {
    const pct = e.calls ? Math.round((e.missed / e.calls) * 100) : 0;
    let big: number;
    let sub: string;
    if (metric === 'Reviews') {
      big = negPctFrom(pct);
      sub = `${formatIN(Math.round(e.calls * 0.2))} reviews`;
    } else if (metric === 'Forms') {
      const leads = Math.round(e.calls * 0.15);
      const notContacted = Math.round(leads * 0.3);
      big = leads ? Math.round((notContacted / leads) * 100) : 0;
      sub = `${formatIN(leads)} leads · ${notContacted} not contacted`;
    } else {
      big = pct;
      sub = e.sub;
    }
    return { name: e.name, rank: i + 1, sub, big: `${big}%`, alarming: big > 20, drillable: e.drillable };
  });

  let card1: LbView['card1'];
  let card2Value: number;
  let card2Label: string;
  let bigLabel: string;
  if (metric === 'Reviews') {
    card1 = { label: 'Total reviews', value: formatIN(entries.reduce((a, e) => a + Math.round(e.calls * 0.2), 0)) };
    card2Value = negPctFrom(totalPct);
    card2Label = 'Negative reviews';
    bigLabel = 'NEGATIVE';
  } else if (metric === 'Forms') {
    card1 = { label: 'Total leads', value: '157' };
    card2Value = 27;
    card2Label = 'Not contacted yet';
    bigLabel = 'PENDING';
  } else {
    card1 = { label: 'Total calls', value: formatIN(total.calls) };
    card2Value = totalPct;
    card2Label = 'Missed';
    bigLabel = 'MISSED';
  }

  return {
    rows,
    listLabel,
    card1,
    card2: { label: card2Label, value: `${card2Value}%`, alarming: card2Value > 20 },
    bigLabel,
  };
}

/** Resolves state/city when jumping straight to a level via the State/Cities/Locations tabs. */
export function resolveLevelJump(
  level: LbLevel,
  stateName: string | null,
  cityName: string | null,
  data: LbState[] = LEADERBOARD_STATES,
): { stateName: string | null; cityName: string | null } {
  if (level === 'state') return { stateName, cityName };
  const st = stateName ?? data[0].name;
  if (level === 'city') return { stateName: st, cityName };
  const state = data.find((s) => s.name === st);
  const cities = state ? citiesOf(state) : [];
  const ct = cityName && cities.some((c) => c.name === cityName) ? cityName : (cities[0]?.name ?? null);
  return { stateName: st, cityName: ct };
}
