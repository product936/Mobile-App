/**
 * Role-driven configuration. The store manager and regional manager share
 * every screen; only identity, scaled numbers and a few role-specific pieces
 * (region summary, Leaderboard tab, home CTA) differ.
 */
export type Role = 'store' | 'regional';

export type RoleConfig = {
  role: Role;
  user: {
    name: string;
    firstName: string;
    initials: string;
    email: string;
    phone: string;
  };
  welcome: {
    scope: string;
    message: string;
    missed: string;
    recoverable: string;
    negativeReviews: string;
  };
  home: {
    missedHeadline: string;
    atStake: string;
    cta: { label: string; action: 'recoverMissed' | 'openLeaderboard' };
    /** "Across your region" strip; only regional managers oversee several locations. */
    regionSummary: null | { locations: string; missed: string; answered: string; recovery: string };
  };
  /** Bottom tabs, in order. */
  tabs: ('home' | 'leads' | 'reviews' | 'leaderboard')[];
  leaderboardSubtitle: string;
  weeklyReportDesc: string;
};

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  store: {
    role: 'store',
    user: {
      name: 'Tarun Sobhani',
      firstName: 'Tarun',
      initials: 'TS',
      email: 'tarun.sobhani@tatacv.in',
      phone: '+91 98765 43210',
    },
    welcome: {
      scope: 'Tata Commercial Vehicle · Indiranagar',
      message: "Welcome, Tarun — I'll make sure not a single call, review, or walk-in from Indiranagar slips through.",
      missed: '62',
      recoverable: '₹26.2L',
      negativeReviews: '3',
    },
    home: {
      missedHeadline: '62 missed calls',
      atStake: '₹26,20,000',
      cta: { label: 'Recover missed revenue', action: 'recoverMissed' },
      regionSummary: null,
    },
    tabs: ['home', 'leads', 'reviews'],
    leaderboardSubtitle:
      'Which locations in your area are slipping the most calls, and have high share of negative reviews',
    weeklyReportDesc: '62 missed · 26% recovery',
  },
  regional: {
    role: 'regional',
    user: {
      name: 'Vikram Rao',
      firstName: 'Vikram',
      initials: 'VR',
      email: 'vikram.rao@tatacv.in',
      phone: '+91 98765 43210',
    },
    welcome: {
      scope: 'South Region · 70 locations',
      message: "Welcome, Vikram — I'll make sure not a single call, review, or walk-in across your region slips through.",
      missed: '4,340',
      recoverable: '₹18.3 Cr',
      negativeReviews: '210',
    },
    home: {
      missedHeadline: '4,340 missed calls',
      atStake: '₹18.3 Cr',
      cta: { label: 'Show me who is losing the most', action: 'openLeaderboard' },
      regionSummary: { locations: '70', missed: '4,340', answered: '1,610', recovery: '26%' },
    },
    tabs: ['home', 'leads', 'reviews', 'leaderboard'],
    leaderboardSubtitle: 'Locations slipping the most calls and reviews',
    weeklyReportDesc: '4,340 missed · 26% recovery',
  },
};

/** Store context shared by both roles (the prototype's sample location). */
export const STORE = {
  brand: 'Tata Commercial Vehicle',
  storeCount: '7',
  locationName: 'Tata Commercial Vehicle — Indiranagar',
  locationShort: 'Tata Commercial Vehicle · Indiranagar, Bengaluru',
  address: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
  phone: '+91 98765 43210',
  website: 'g.page/tata-cv-indiranagar',
  locationPage: 'si.link/l/indiranagar',
  reviewLink: 'https://si.link/r/LGH63P',
  totalLocations: '1,085',
} as const;
