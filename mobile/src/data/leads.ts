export type LeadStatus =
  | 'Missed'
  | 'Not contacted'
  | 'Set for reminder'
  | 'Contacted'
  | 'Converted'
  | 'Review sent'
  | 'Expired';

export type LeadSource = 'Call' | 'Form' | 'Walk-in';

export type Lead = {
  id: string;
  /** Raw caller number, optionally with a repeat-call count, e.g. "98330 04426 (1)". */
  number: string;
  status: LeadStatus;
  source: LeadSource;
  time: string;
  hot?: boolean;
  /** Name the customer entered themselves (lead-form submissions only). */
  person?: string;
};

export const LEAD_STATUS_FILTERS = [
  'All status',
  'Missed',
  'Not contacted',
  'Set for reminder',
  'Contacted',
  'Converted',
  'Review sent',
  'Expired',
] as const;
export type LeadStatusFilter = (typeof LEAD_STATUS_FILTERS)[number];

export const LEAD_SOURCE_FILTERS = ['All sources', 'Call', 'Form', 'Walk-in'] as const;
export type LeadSourceFilter = (typeof LEAD_SOURCE_FILTERS)[number];

/** Statuses a store user can move a lead to from the lead details sheet. */
export const EDITABLE_LEAD_STATUSES: LeadStatus[] = [
  'Missed',
  'Not contacted',
  'Set for reminder',
  'Contacted',
  'Converted',
  'Expired',
];

export const PURCHASE_OPTIONS = ['Tata Ace', 'Tata Intra V30', 'Tata 407', 'Service / spares'] as const;

export const LEADS: Lead[] = [
  { id: 'l1', number: '90544 64192', status: 'Contacted', source: 'Call', time: '5:40 PM', hot: true },
  { id: 'l2', number: '98551 35120', status: 'Missed', source: 'Call', time: '5:39 PM' },
  { id: 'l3', number: '98330 04426 (1)', status: 'Converted', source: 'Form', time: '5:39 PM', person: 'Priya Menon' },
  { id: 'l4', number: '98446 03109', status: 'Missed', source: 'Call', time: '5:38 PM' },
  { id: 'l5', number: '82812 07148 (1)', status: 'Not contacted', source: 'Walk-in', time: '5:38 PM' },
  { id: 'l6', number: '98214 05165 (1)', status: 'Set for reminder', source: 'Call', time: '5:37 PM' },
  { id: 'l7', number: '70601 69752', status: 'Contacted', source: 'Call', time: '5:37 PM', hot: true },
  { id: 'l8', number: '90123 45678', status: 'Review sent', source: 'Form', time: '5:36 PM', person: 'Arjun Rao' },
  { id: 'l9', number: '88997 76655', status: 'Expired', source: 'Call', time: '5:35 PM' },
  { id: 'l10', number: '77889 90011', status: 'Contacted', source: 'Form', time: '5:34 PM', hot: true, person: 'Sneha Patil' },
];
