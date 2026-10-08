import { create } from 'zustand';

import { ROLE_CONFIGS, type Role, type RoleConfig } from '@/config/roles';
import type { DateRange } from '@/data/content';
import { LEADS, type Lead, type LeadSourceFilter, type LeadStatusFilter } from '@/data/leads';
import { EMPTY_SELECTION, toggleSelection, type LocationSelection } from '@/lib/format';
import type { FilterLevel } from '@/data/locations';

export type SheetName = 'location' | 'date' | 'source' | 'status' | 'reviewFilter' | 'support' | 'upload' | null;

export type ReviewFilters = {
  ratingMin: number;
  ratingMax: number;
  sentiment: 'All' | 'Positive' | 'Neutral' | 'Negative';
  ratingType: 'Both' | 'Rating with text' | 'Rating without text';
  status: 'Both' | 'Replied' | 'Unreplied';
  showRemoved: boolean;
  editedOnly: boolean;
};

export const DEFAULT_REVIEW_FILTERS: ReviewFilters = {
  ratingMin: 1,
  ratingMax: 5,
  sentiment: 'All',
  ratingType: 'Both',
  status: 'Both',
  showRemoved: false,
  editedOnly: false,
};

type LeadEdits = { name?: string; status?: Lead['status']; reminder?: boolean; note?: string };

type AppState = {
  // Session
  phone: string;
  role: Role | null;
  setPhone: (phone: string) => void;
  signIn: (role: Role) => void;
  signOut: () => void;

  // Shared filters
  locationAll: boolean;
  locationSelection: LocationSelection;
  locationTab: FilterLevel;
  toggleAllLocations: () => void;
  toggleLocation: (level: FilterLevel, name: string) => void;
  setLocationTab: (tab: FilterLevel) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  leadStatus: LeadStatusFilter;
  leadSource: LeadSourceFilter;
  setLeadStatus: (status: LeadStatusFilter) => void;
  setLeadSource: (source: LeadSourceFilter) => void;
  reviewFilters: ReviewFilters;
  setReviewFilters: (patch: Partial<ReviewFilters>) => void;
  resetReviewFilters: () => void;

  // Overlays
  sheet: SheetName;
  openSheet: (sheet: Exclude<SheetName, null>) => void;
  closeSheet: () => void;
  addLead: { open: boolean; step: 'form' | 'review' };
  openAddLead: (step?: 'form' | 'review') => void;
  setAddLeadStep: (step: 'form' | 'review') => void;
  closeAddLead: () => void;
  leadDetailId: string | null;
  openLeadDetail: (id: string) => void;
  closeLeadDetail: () => void;
  confirmDeleteReplyId: string | null;
  setConfirmDeleteReply: (id: string | null) => void;

  // Data the user changes
  leadEdits: Record<string, LeadEdits>;
  saveLeadEdits: (id: string, edits: LeadEdits) => void;
  deletedReplies: string[];
  deleteReply: (id: string) => void;
  readNotifications: string[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (ids: string[]) => void;
};

const initialFilters = {
  locationAll: false,
  locationSelection: EMPTY_SELECTION,
  locationTab: 'state' as FilterLevel,
  dateRange: 'Last 30 days' as DateRange,
  leadStatus: 'All status' as LeadStatusFilter,
  leadSource: 'All sources' as LeadSourceFilter,
  reviewFilters: DEFAULT_REVIEW_FILTERS,
};

const initialOverlays = {
  sheet: null as SheetName,
  addLead: { open: false, step: 'form' as const },
  leadDetailId: null,
  confirmDeleteReplyId: null,
};

export const useAppStore = create<AppState>((set) => ({
  phone: '',
  role: null,
  setPhone: (phone) => set({ phone }),
  signIn: (role) => set({ role }),
  signOut: () =>
    set({
      role: null,
      phone: '',
      ...initialFilters,
      ...initialOverlays,
      leadEdits: {},
      deletedReplies: [],
      readNotifications: [],
    }),

  ...initialFilters,
  toggleAllLocations: () => set((s) => ({ locationAll: !s.locationAll })),
  toggleLocation: (level, name) =>
    set((s) => {
      const next = toggleSelection(s.locationSelection, s.locationAll, level, name);
      return { locationSelection: next.selection, locationAll: next.all };
    }),
  setLocationTab: (locationTab) => set({ locationTab }),
  setDateRange: (dateRange) => set({ dateRange }),
  setLeadStatus: (leadStatus) => set({ leadStatus }),
  setLeadSource: (leadSource) => set({ leadSource }),
  setReviewFilters: (patch) => set((s) => ({ reviewFilters: { ...s.reviewFilters, ...patch } })),
  resetReviewFilters: () => set({ reviewFilters: DEFAULT_REVIEW_FILTERS }),

  ...initialOverlays,
  openSheet: (sheet) => set({ sheet }),
  closeSheet: () => set({ sheet: null }),
  openAddLead: (step = 'form') => set({ addLead: { open: true, step } }),
  setAddLeadStep: (step) => set((s) => ({ addLead: { ...s.addLead, step } })),
  closeAddLead: () => set((s) => ({ addLead: { ...s.addLead, open: false } })),
  openLeadDetail: (leadDetailId) => set({ leadDetailId }),
  closeLeadDetail: () => set({ leadDetailId: null }),
  setConfirmDeleteReply: (confirmDeleteReplyId) => set({ confirmDeleteReplyId }),

  leadEdits: {},
  saveLeadEdits: (id, edits) => set((s) => ({ leadEdits: { ...s.leadEdits, [id]: { ...s.leadEdits[id], ...edits } } })),
  deletedReplies: [],
  deleteReply: (id) => set((s) => ({ deletedReplies: [...s.deletedReplies, id] })),
  readNotifications: [],
  markNotificationRead: (id) =>
    set((s) => (s.readNotifications.includes(id) ? s : { readNotifications: [...s.readNotifications, id] })),
  markAllNotificationsRead: (ids) => set({ readNotifications: ids }),
}));

/** Config for the signed-in role. Screens under the app group are only reachable once signed in. */
export function useRoleConfig(): RoleConfig {
  const role = useAppStore((s) => s.role);
  return ROLE_CONFIGS[role ?? 'store'];
}

/** Leads with the user's saved edits applied. */
export function useLeads(): (Lead & { reminder?: boolean; note?: string })[] {
  const edits = useAppStore((s) => s.leadEdits);
  return LEADS.map((lead) => {
    const e = edits[lead.id];
    if (!e) return lead;
    return { ...lead, status: e.status ?? lead.status, person: e.name ?? lead.person, reminder: e.reminder, note: e.note };
  });
}
