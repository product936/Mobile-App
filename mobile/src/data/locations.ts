/** Location filter options (state / city / store) and leaderboard call data. */

export type FilterLevel = 'state' | 'city' | 'store';

export type CountedOption = { name: string; count: number };
export type StoreOption = { name: string; address: string };

export const LOCATION_FILTERS: { state: CountedOption[]; city: CountedOption[]; store: StoreOption[] } = {
  state: [
    { name: 'Karnataka', count: 412 },
    { name: 'Maharashtra', count: 288 },
    { name: 'Delhi NCR', count: 196 },
    { name: 'Tamil Nadu', count: 121 },
    { name: 'Telangana', count: 68 },
  ],
  city: [
    { name: 'Bengaluru', count: 312 },
    { name: 'Mumbai', count: 205 },
    { name: 'New Delhi', count: 154 },
    { name: 'Chennai', count: 121 },
    { name: 'Pune', count: 96 },
    { name: 'Hyderabad', count: 68 },
  ],
  store: [
    { name: 'Tata Motors CV — Whitefield', address: 'Whitefield Main Rd, Bengaluru 560066' },
    { name: 'Tata Motors CV — Indiranagar', address: '100 Feet Rd, Indiranagar, Bengaluru 560038' },
    { name: 'Tata Motors CV — Koramangala', address: '80 Feet Rd, 4th Block, Koramangala, Bengaluru 560034' },
    { name: 'Tata Motors CV — Andheri West', address: 'Link Rd, Andheri West, Mumbai 400053' },
    { name: 'Tata Motors CV — Connaught Place', address: 'Block A, Connaught Place, New Delhi 110001' },
    { name: 'Tata Motors CV — Baner', address: 'Baner Rd, Baner, Pune 411045' },
  ],
};

export type LbLocation = { name: string; address: string; calls: number; missed: number };
export type LbCity = { name: string; locations: LbLocation[] };
/** States either carry hand-authored cities, or only totals (cities are then synthesized). */
export type LbState = { name: string; cities: LbCity[] } | { name: string; calls: number; missed: number };

const loc = (area: string, address: string, calls: number, missed: number): LbLocation => ({
  name: `Tata Commercial Vehicle — ${area}`,
  address,
  calls,
  missed,
});

export const LEADERBOARD_STATES: LbState[] = [
  {
    name: 'Karnataka',
    cities: [
      {
        name: 'Bengaluru',
        locations: [
          loc('Whitefield', 'Whitefield Main Rd, Bengaluru 560066', 900, 288),
          loc('Indiranagar', '100 Feet Rd, Indiranagar, Bengaluru 560038', 820, 210),
          loc('Koramangala', '80 Feet Rd, Koramangala, Bengaluru 560034', 640, 120),
        ],
      },
      {
        name: 'Mysuru',
        locations: [
          loc('VV Mohalla', 'VV Mohalla, Mysuru 570002', 300, 96),
          loc('Kuvempunagar', 'Kuvempunagar, Mysuru 570023', 260, 62),
        ],
      },
    ],
  },
  {
    name: 'Maharashtra',
    cities: [
      {
        name: 'Mumbai',
        locations: [
          loc('Andheri West', 'Link Rd, Andheri West, Mumbai 400053', 700, 182),
          loc('Bandra', 'Turner Rd, Bandra, Mumbai 400050', 520, 88),
        ],
      },
      {
        name: 'Pune',
        locations: [loc('Baner', 'Baner Rd, Pune 411045', 410, 131), loc('Kharadi', 'Kharadi, Pune 411014', 360, 58)],
      },
    ],
  },
  {
    name: 'Delhi',
    cities: [
      {
        name: 'New Delhi',
        locations: [
          loc('Connaught Place', 'Block A, Connaught Place, New Delhi 110001', 610, 220),
          loc('Saket', 'Saket, New Delhi 110017', 430, 78),
        ],
      },
      { name: 'Dwarka', locations: [loc('Sector 12', 'Sector 12, Dwarka, New Delhi 110078', 380, 95)] },
    ],
  },
  {
    name: 'Tamil Nadu',
    cities: [
      {
        name: 'Chennai',
        locations: [loc('T. Nagar', 'T. Nagar, Chennai 600017', 470, 152), loc('Velachery', 'Velachery, Chennai 600042', 300, 60)],
      },
    ],
  },
  { name: 'Uttar Pradesh', calls: 1520, missed: 410 },
  { name: 'Andhra Pradesh', calls: 980, missed: 176 },
  { name: 'Telangana', calls: 1120, missed: 314 },
  { name: 'Gujarat', calls: 1340, missed: 254 },
  { name: 'West Bengal', calls: 1180, missed: 342 },
  { name: 'Rajasthan', calls: 860, missed: 155 },
  { name: 'Kerala', calls: 720, missed: 173 },
  { name: 'Madhya Pradesh', calls: 940, missed: 179 },
  { name: 'Bihar', calls: 1010, missed: 293 },
  { name: 'Punjab', calls: 680, missed: 122 },
  { name: 'Haryana', calls: 790, missed: 197 },
  { name: 'Odisha', calls: 560, missed: 101 },
  { name: 'Assam', calls: 470, missed: 122 },
  { name: 'Jharkhand', calls: 430, missed: 77 },
  { name: 'Chhattisgarh', calls: 390, missed: 101 },
  { name: 'Uttarakhand', calls: 320, missed: 54 },
  { name: 'Himachal Pradesh', calls: 260, missed: 68 },
  { name: 'Goa', calls: 240, missed: 38 },
  { name: 'Tripura', calls: 180, missed: 47 },
  { name: 'Meghalaya', calls: 150, missed: 24 },
  { name: 'Manipur', calls: 130, missed: 34 },
  { name: 'Nagaland', calls: 110, missed: 17 },
  { name: 'Arunachal Pradesh', calls: 90, missed: 23 },
  { name: 'Mizoram', calls: 80, missed: 12 },
  { name: 'Sikkim', calls: 60, missed: 15 },
];
