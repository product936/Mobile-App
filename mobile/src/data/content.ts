/** Sample content for the reviews, notifications and profile sub-pages. */

export type Review = {
  id: string;
  initials: string;
  name: string;
  rating: number;
  time: string;
  text: string;
  reply?: string;
};

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    initials: 'NC',
    name: 'Nitish Choudhary',
    rating: 1,
    time: '7h ago',
    text: 'Not good customer service.',
    reply:
      'Hi Nitish, thank you for the honest feedback. We’re sorry about your experience and would like to make it right — our manager will reach out today.',
  },
  { id: 'r2', initials: 'GU', name: 'Gaurav Upadhyay', rating: 3, time: '18d ago', text: 'Delivery was on time but the follow-up could be faster.' },
  {
    id: 'r3',
    initials: 'MN',
    name: 'Meera Nair',
    rating: 5,
    time: '1d ago',
    text: 'Smooth purchase and genuinely helpful staff. Highly recommend this showroom.',
  },
  {
    id: 'r4',
    initials: 'GA',
    name: 'Gaurav A.',
    rating: 3,
    time: '18d ago',
    text: 'Service is ok, expected a little more at this price.',
    reply:
      'Thank you for the feedback, Gaurav. We’re always working to improve and would love to hear how we can serve you better next time.',
  },
  { id: 'r5', initials: 'RS', name: 'Rohit Salvi', rating: 1, time: '2d ago', text: 'Waited too long for a callback after my enquiry.' },
];

/** Per-reviewer avatar colours: tinted background with matching initials. */
export const AVATAR_COLORS: Record<string, { fg: string; bg: string }> = {
  NC: { fg: '#0E0071', bg: '#EEF2FF' },
  GU: { fg: '#0070FC', bg: '#EFF6FF' },
  MN: { fg: '#16A34A', bg: '#F0FDF4' },
  GA: { fg: '#1D4ED8', bg: '#EFF6FF' },
  RS: { fg: '#9333EA', bg: '#F3E8FF' },
};

export const REVIEW_AVG_RATING = '4.5';

export type NotificationType = 'review' | 'missed' | 'lead' | 'reminder' | 'info' | 'alert';

export type AppNotification = { id: string; type: NotificationType; title: string; desc: string; time: string };

/** `weeklyReportDesc` varies by role, so the list is built per role. */
export function buildNotifications(weeklyReportDesc: string): AppNotification[] {
  return [
    { id: 'n1', type: 'review', title: 'New 1★ review from Rohit Salvi', desc: 'Indiranagar · needs a reply', time: '2m' },
    { id: 'n2', type: 'missed', title: '12 missed calls in the last hour', desc: 'Whitefield is losing the most', time: '18m' },
    { id: 'n3', type: 'review', title: 'Meera Nair left a 5★ review', desc: 'Koramangala', time: '1h' },
    { id: 'n4', type: 'lead', title: 'Lead converted — 98330 04426', desc: 'Booked a test drive', time: '2h' },
    { id: 'n5', type: 'reminder', title: 'Follow up with 98214 05165', desc: 'Reminder you set for today', time: '3h' },
    { id: 'n6', type: 'info', title: 'Indiranagar listing viewed 320 times', desc: 'Up 18% vs yesterday', time: '5h' },
    { id: 'n7', type: 'lead', title: 'New walk-in lead at Whitefield', desc: 'Source: Walk-in', time: '6h' },
    { id: 'n8', type: 'review', title: 'Review link shared with 8 customers', desc: 'Sent via WhatsApp', time: '8h' },
    { id: 'n9', type: 'missed', title: 'Missed call from 90544 64192', desc: 'Tap to call back', time: 'Yesterday' },
    { id: 'n10', type: 'info', title: 'Weekly report is ready', desc: weeklyReportDesc, time: '1d' },
    { id: 'n11', type: 'info', title: 'Photo pending approval on Google', desc: 'Koramangala profile', time: '2d' },
    { id: 'n12', type: 'alert', title: 'Rating dropped to 4.5 at Koramangala', desc: 'Down from 4.7 last week', time: '3d' },
  ];
}

export const DATE_RANGES = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last 365 days', 'Previous month', 'All time'] as const;
export type DateRange = (typeof DATE_RANGES)[number];

export const OPENING_HOURS: [string, string][] = [
  ['Monday', '9:00 AM – 8:00 PM'],
  ['Tuesday', '9:00 AM – 8:00 PM'],
  ['Wednesday', '9:00 AM – 8:00 PM'],
  ['Thursday', '9:00 AM – 8:00 PM'],
  ['Friday', '9:00 AM – 8:00 PM'],
  ['Saturday', '9:00 AM – 6:00 PM'],
  ['Sunday', 'Closed'],
];

export const BUSINESS_PROFILE = {
  storeName: 'Tata Commercial Vehicle — Indiranagar',
  address: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
  primaryCategory: 'Truck dealer',
  additionalCategories: ['Commercial vehicle dealer', 'Vehicle service', 'Auto parts store'],
  description:
    'Authorised Tata Motors commercial vehicle showroom and service centre in Indiranagar. Sales, financing, insurance and genuine spares for trucks, pickups and buses.',
  phone: '+91 98765 43210',
  website: 'g.page/tata-cv-indiranagar',
};

export type Post = {
  id: string;
  kind: 'OFFER' | 'UPDATE' | 'EVENT';
  live: boolean;
  title: string;
  meta: string;
  tile: [string, string];
};

export const POSTS: Post[] = [
  { id: 'p1', kind: 'OFFER', live: true, title: 'Monsoon service camp — 15% off', meta: 'Published 18 Aug · 1,240 views', tile: ['#DBEAFE', '#EEF2FF'] },
  { id: 'p2', kind: 'UPDATE', live: true, title: 'New Tata Ace EV now in stock', meta: 'Published 12 Aug · 860 views', tile: ['#DCFCE7', '#EFF6FF'] },
  { id: 'p3', kind: 'EVENT', live: false, title: 'Independence Day service drive', meta: 'Ran 15 Aug · 2,110 views', tile: ['#F3E8FF', '#EFF6FF'] },
];

export type TeamMember = { initials: string; name: string; email: string; role: 'Owner' | 'Manager' | 'Staff'; fg: string; bg: string };

export const TEAMMATES: TeamMember[] = [
  { initials: 'PS', name: 'Priya Sharma', email: 'priya.sharma@tatacv.in', role: 'Manager', fg: '#16A34A', bg: '#F0FDF4' },
  { initials: 'RV', name: 'Rahul Verma', email: 'rahul.verma@tatacv.in', role: 'Staff', fg: '#1D4ED8', bg: '#EFF6FF' },
  { initials: 'AR', name: 'Anjali Rao', email: 'anjali.rao@tatacv.in', role: 'Staff', fg: '#7C3AED', bg: '#F3E8FF' },
];

export const MEDIA_TABS = ['Cover', 'Photos', 'Posts'] as const;
export type MediaTab = (typeof MEDIA_TABS)[number];
export const MEDIA_COUNTS: Record<MediaTab, number> = { Cover: 2, Photos: 6, Posts: 3 };
export const MEDIA_TILE_GRADIENTS: [string, string][] = [
  ['#DBEAFE', '#EEF2FF'],
  ['#E0E7FF', '#EFF6FF'],
  ['#DCFCE7', '#EFF6FF'],
  ['#FEF9E7', '#EEF2FF'],
  ['#F3E8FF', '#EFF6FF'],
  ['#DBEAFE', '#F0FDF4'],
];
